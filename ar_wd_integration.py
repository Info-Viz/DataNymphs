import rdflib
from rdflib import Graph, URIRef, Literal, Namespace
from rdflib.namespace import RDF, RDFS, OWL, XSD
from SPARQLWrapper import SPARQLWrapper, JSON
import pandas as pd
import re

#ENDPOINT SPARQL DI ARCO 
arco_endpoint = "https://dati.cultura.gov.it/sparql"
# set endpoint
sparql_arco = SPARQLWrapper(arco_endpoint)

# namespaces
dc = Namespace("http://purl.org/dc/elements/1.1/")
arco = Namespace("https://w3id.org/arco/ontology/arco/")
arcd = Namespace("https://w3id.org/arco/ontology/context-description/")
ardd = Namespace("https://w3id.org/arco/ontology/denotative-description/") # per "hasCulturalPropertyType", e.g. "dipinto"
arloc = Namespace("https://w3id.org/arco/ontology/location/") # hasCulturalInstituteOrSite
foaf = Namespace("http://xmlns.com/foaf/0.1/") # per le immagini

# Initialize graph
g = Graph()

# bind namespaces
g.bind("dc", dc)
g.bind("arco", arco)
g.bind("a-cd", arcd)
g.bind("a-dd", ardd)
g.bind("a-loc", arloc)
g.bind("foaf", foaf)

# codice per serializzare dataframe in triple (aggiungere più campi al dataframe con query sparql a partire dal dataframe filtrato sul soggetto)
df_matched_items = df_matches[["item"]]
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
df_matches["identifier"] = df_matches["item"].apply(lambda x: str(x).split('/')[-1])

# merge dataframes on identifier column
df_finale = pd.merge(df_matches, additional_info_df, on='identifier', how='left')


# iniziare a pensare a come processare date sulla base dei risultati ottenuti
def clean_dates(string_date):
    date_to_lower = string_date.lower()
    # estrai intervallo/data di inizio e di fine. La regex non cerca le stringhe anche a destra del trattino perché altrimenti si perderebbero "data - ante/post 1990". Se non ci sono a.C. nella prima parte dovrebbe andare bene, verificare quando i dati sono pronti
    parts = re.search(r'(\d+)\s-\s', str(date_to_lower))
    pass

    # returns a pandas series with the names of the new columns
    return pd.Series({'start': start, 'end': end})


# Creare due colonne aggiuntive start e end con le date pulite e aggiungerle al dataframe finale
df_finale[['start_date', 'end_date']] = df_finale['dateRange'].apply(clean_dates, result_type='expand')


# poi trasformazione in rdf e integrazione wikidata
# integrazione con dataset wikidata a partire dalle matched words ed estensione con property su wikidata