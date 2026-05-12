from SPARQLWrapper import SPARQLWrapper, JSON 
import pandas as pd
import re

#ENDPOINT SPARQL DI ARCO 
arco_endpoint = "https://dati.cultura.gov.it/sparql"
# set endpoint
sparql_arco = SPARQLWrapper(arco_endpoint)

# codice per serializzare dataframe in triple (aggiungere più campi al dataframe con query sparql a partire dal dataframe filtrato sul soggetto)
df_matched_items = df_matches_sorted[["item"]]
# transform item df in a list of unique values
arco_items_list = list(set(df_matched_items))

# extend_matched_items
def extend_matched_items(items_list):
    # define a batch size
    batch_size = 200
    all_dfs = []

    for i in range(0, len(items_list), batch_size):
        # slice the list
        batch = items_list[i:i + batch_size]

        # wrap arco URIs in <>
        formatted_items = " ".join([f"<{uri}>" for uri in batch])

        query_myth_items = """
        PREFIX arco: <https://w3id.org/arco/ontology/arco/>
        PREFIX a-cd: <https://w3id.org/arco/ontology/context-description/>
        PREFIX a-dd: <https://w3id.org/arco/ontology/denotative-description/>
        PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>

        SELECT ?identifier ?dateRange ?lat ?long
            (GROUP_CONCAT(DISTINCT ?creator; separator=", ") AS ?creators) 
            (GROUP_CONCAT(DISTINCT ?type; separator=", ") AS ?types) 
            (GROUP_CONCAT(DISTINCT ?materialOrTechnique; separator=", ") AS ?materialsOrTechniques) 
            (GROUP_CONCAT(DISTINCT ?instituteOrSite; separator=", ") AS ?institutesOrSites) 
            (GROUP_CONCAT(DISTINCT ?place; separator=", ") AS ?coverage)
            (SAMPLE(?image) AS ?sampleImage) #  solo una tra quelle disponibili
        
        WHERE {
            VALUES ?item {"""+formatted_items+"""} .
            ?item arco:uniqueIdentifier ?identifier .

            OPTIONAL {?item dc:creator ?creator . }
            OPTIONAL {?item a-dd:hasCulturalPropertyType ?type . } # per estrarre tipologia opera (es: dipinto)
            OPTIONAL {?item a-dd:hasMaterialOrTechnique ?materialOrTechnique . }
            OPTIONAL {?item a-loc:hasCulturalInstituteOrSite ?instituteOrSite . }
            # OPTIONAL {?item a-cd:hasCreationLocation ?creationLocation . } # rimosso perché il range è un'entitò culturale
            OPTIONAL {?item dc:coverage ?coverage} # luogo (in cui si trova l'istituzione culturale che conserva il bene)
            OPTIONAL {?item foaf:depiction ?image . }
            
            # OPTIONAL separato per le date: ci possono essere più date associate a un'entità culturale con dc:date, quindi estraggo le date (inizio e fine) dell'evento di creazione associato al bene culturale e le concateno in una colonna
            OPTIONAL {
                ?item a-cd:hasDating ?dating .
                ?dating a-cd:hasDatingEvent ?event .
                ?event a-cd:specificTime ?time .
                ?time arco:startTime ?startDate ;
                      arco:endTime ?endDate .
                FILTER(REGEX(STR(?event), "creation", "i")) # per estrarre solo date di creazione
        
            # Creiamo la variabile concatenata qui dentro
            BIND(CONCAT(STR(?startDate), " - ", STR(?endDate)) AS ?dateRange) # concatenazione start + end
            }        

            # OPTIONAL per coordinate geografiche
            OPTIONAL {
                ?item clvapit:hasGeometry ?geometry .
                ?geometry arco-location:hasCoordinates ?coordinates .
                ?coordinates arco-location:lat ?lat ;
                            arco-location:long ?long .
            }        
        }

        GROUP BY ?identifier ?dateRange ?lat ?long
        """
        sparql_arco.setQuery(query_myth_items)
        sparql_arco.setReturnFormat(JSON)
        try:
            query_results = sparql_arco.query().convert()
            query_data = []
            
            # Iteriamo sui risultati della query corrente
            for result in query_results["results"]["bindings"]:
                query_data.append({
                    "identifier": result["identifier"]["value"],
                    "creator": result.get("creators", {}).get("value"),
                    "type": result.get("types", {}).get("value"),
                    "materialOrTechnique": result.get("materialsOrTechniques", {}).get("value"),
                    "instituteOrSite": result.get("institutesOrSites", {}).get("value"),
                    "creationLocation": result.get("creationLocations", {}).get("value")
                })
            
            if query_data:
                # Creiamo un DF per questo batch e lo aggiungiamo alla lista
                all_dfs.append(pd.DataFrame(query_data))
                
        except Exception as e:
            print(f"Errore nel batch {i}: {e}")
    
    # Uniamo tutto alla fine in un unico DataFrame
    if all_dfs:
        return pd.concat(all_dfs, ignore_index=True)
    return pd.DataFrame()


# function call: get the dataframe with all the additional information for each arco item that has mythological subject
additional_info_df = extend_matched_items(arco_items_list)
# drop duplicates identifiers
additional_info_df = additional_info_df.drop_duplicates(subset=['identifier'])

# extend the original dataframe with the additional information using the identifier for merging
# create identifier column in original dataframe
df_matches_sorted["identifier"] = df_matches_sorted["item"].apply(lambda x: str(x).split('/')[-1])

# merge dataframes on identifier column
df_finale = pd.merge(df_matches_sorted, additional_info_df, on='identifier', how='left')

# pulizia date
def clean_dates(string_date):
    date_to_lower = string_date.lower().strip()
    pattern = r'^(.*?)\s+-\s+(.*?)$'
    match = re.search(pattern, date_to_lower)
    
    if not match:
        return pd.Series({
            'start_orig': None, 'end_orig': None, 
            'start_norm': None, 'end_norm': None
        })
    
    def process(block):
        block = block.strip()
        
        # Colonna originale (split del range)
        orig = " ".join(block.split())
        
        # Colonna normalizzata (gestione dei vari formati)
        norm = None
        
        # formato date (yyyy/mm/dd)
        # trasformazione in in yyyy-mm-dd
        date_format = re.search(r'(\d{4})[/-](\d{2})[/-](\d{2})', block)
        
        # intervallo anno-anno (es. 1881-1882)
        interval = re.search(r'(\d{4})-(\d{4})', block)

        # anno
        year_match = re.search(r'\d{4}', block)

        if date_format:
            # Estraiamo i gruppi e uniamo con il trattino standard
            norm = f"{date_format.group(1)}-{date_format.group(2)}-{date_format.group(3)}"
        
        elif interval:
            # per il momento usato margine estremo dell'intervallo ma decidere come fare
            norm = f"{interval.group(2)}"

        elif year_match:
            year_val = int(year_match.group(0))
            # Gestione post e ante (per il momento aggiunto un anno per 'post' e tolto un anno per 'ante' ma decidere)
            if 'post' in block:
                norm = year_val + 1
            elif 'ante' in block:
                norm = year_val - 1
            else:
                norm = year_val
        
        return orig, norm

    # Applichiamo la logica ai due blocchi individuati dalla regex del range
    start_orig, start_norm = process(match.group(1))
    end_orig, end_norm = process(match.group(2))
    
    return pd.Series({
        'start_orig': start_orig, 
        'start_norm': start_norm, 
        'end_orig': end_orig,
        'end_norm': end_norm
    })

# espandi dataset con colonne date splittate e normalizzate
df_finale[['start_orig', 'start_norm', 'end_orig', 'end_norm']] = df_finale['dateRange'].apply(clean_dates)

# Visualizzazione del risultato finale
print("\nRisultato dopo il cleaning:")
print(df_finale[['dateRange', 'start_orig', 'start_norm', 'end_orig', 'end_norm']])

# poi trasformazione in rdf e integrazione wikidata
# integrazione con dataset wikidata a partire dalle matched words ed estensione con property su wikidata