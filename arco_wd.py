import rdflib
from rdflib import Graph, URIRef, Literal, Namespace
from rdflib.namespace import RDF, RDFS, OWL, XSD
from SPARQLWrapper import SPARQLWrapper, JSON
import pandas as pd

#ENDPOINT SPARQL DI ARCO 
arco_endpoint = "https://dati.cultura.gov.it/sparql"
#ENDPOINT SPARQL WIKIDATA
wd_endpoint = "https://query.wikidata.org/bigdata/namespace/wdq/sparql" # sui tutorial c'è questo

# inizializzazione lista dei risultati: raccoglie i df di ogni query, che vengono concatenati nel df finale (wikidata_results)
#all_results_list = []

# inizializzazione dataframe per risultati complessivi wikidata
#wikidata_results = pd.DataFrame()

# estrazione di divinità, personaggi, creature ed episodi tratti dalla mitologia greca e romana divisi per query (sia "istanze di" che "sottoclasse di" a livelli gerarchici diversi)

# set endpoint
#sparql_wd = SPARQLWrapper(wd_endpoint)

lista_query = ["""SELECT ?entità ?entLabel (GROUP_CONCAT(DISTINCT ?aka; separator=", ") AS ?aliases) ?descrizione
WHERE {
  # restrizione classe ammessa a "divinità greche"
  VALUES ?classToSearch { 
    wd:Q22989102  # Greek deity
  }
  
  # Estrazione di entità che siano istanze o sottoclassi della classe divinità greca
  ?entità wdt:P31/wdt:P279* ?classToSearch .
  
  # etichetta in italiano
  ?entità rdfs:label ?entLabel .       
  FILTER(LANG(?entLabel) = "it") 
  
  # aka per chi lo ha (esempio di Càriti che su Arco non è presente, c'è la label "Grazie")
  OPTIONAL {
  ?entità skos:altLabel ?aka .
  FILTER(LANG(?aka) = "it")
  }
  
  # Estrazione di descrizione, dove presente, per distinguere i risultati
  OPTIONAL {
    ?entità schema:description ?descrizione .
    FILTER(LANG(?descrizione) = "it")
  }
}
GROUP BY ?entità ?entLabel ?descrizione
ORDER BY ?entLabel
 """,
                """SELECT ?entità ?entLabel (GROUP_CONCAT(DISTINCT ?aka; separator=", ") AS ?aliases) ?descrizione
WHERE {
  # divinità romane
  VALUES ?classToSearch { 
    wd:Q11688446  # Roman deity
    #ninfe
  }
  
  # Estrazione istanze di o sottoclassi di divinità romana
  ?entità wdt:P31/wdt:P279* ?classToSearch .
  
  # etichetta in italiano
  ?entità rdfs:label ?entLabel .       
  FILTER(LANG(?entLabel) = "it") 
  
  # aka per chi lo ha (esempio di Càriti che su Arco non è presente, c'è la label "Grazie")
  OPTIONAL {
  ?entità skos:altLabel ?aka .
  FILTER(LANG(?aka) = "it")
  }
  
  # descrizione
  OPTIONAL {
    ?entità schema:description ?descrizione .
    FILTER(LANG(?descrizione) = "it")
  }
}
GROUP BY ?entità ?entLabel ?descrizione
ORDER BY ?entLabel
""",
                  """SELECT ?entità ?entLabel (GROUP_CONCAT(DISTINCT ?aka; separator=", ") AS ?aliases) ?descrizione
WHERE {
  # personaggi mitologia greca
  VALUES ?classiAmmesse { 
    wd:Q22988604  # Greek mythological character

    #ninfe
  }
  
  # Estrazione istanze di o sottoclassi di personaggi mitologia greca
  ?entità wdt:P31/wdt:P279* ?classiAmmesse .
  
  # etichetta in italiano
  ?entità rdfs:label ?entLabel .       
  FILTER(LANG(?entLabel) = "it") 
  
  # aka per chi lo ha (esempio di Càriti che su Arco non è presente, c'è la label "Grazie")
  OPTIONAL {
  ?entità skos:altLabel ?aka .
  FILTER(LANG(?aka) = "it")
  }
  
  # descrizione
  OPTIONAL {
    ?entità schema:description ?descrizione .
    FILTER(LANG(?descrizione) = "it")
  }
}
GROUP BY ?entità ?entLabel ?descrizione
ORDER BY ?entLabel
""",
                  """SELECT ?entità ?entLabel (GROUP_CONCAT(DISTINCT ?aka; separator=", ") AS ?aliases) ?descrizione
WHERE {
  # pers mit romani
  VALUES ?classiAmmesse { 
    wd:Q124940323 # Roman mythological character

    #ninfe
  }
  
  # estrazione istanze di o sottoclassi di personaggi mitologici romani
  ?entità wdt:P31/wdt:P279* ?classiAmmesse .
  
  # etichetta in italiano
  ?entità rdfs:label ?entLabel .       
  FILTER(LANG(?entLabel) = "it") 
  
  # aka per chi lo ha (esempio di Càriti che su Arco non è presente, c'è la label "Grazie")
  OPTIONAL {
  ?entità skos:altLabel ?aka .
  FILTER(LANG(?aka) = "it")
  }
  
  # descrizione
  OPTIONAL {
    ?entità schema:description ?descrizione .
    FILTER(LANG(?descrizione) = "it")
  }
}
GROUP BY ?entità ?entLabel ?descrizione
ORDER BY ?entLabel
""",
                  """SELECT ?entità ?entLabel (GROUP_CONCAT(DISTINCT ?aka; separator=", ") AS ?aliases) ?descrizione
WHERE {
  # gruppi di divinità (per estrarre Càriti e simili)
  VALUES ?classiAmmesse { 
    wd:Q111252729   # Group of deities
  }
  
  # Estrazione di istanze di o sottoclassi di gruppi di divinità
  ?entità wdt:P31/wdt:P279* ?classiAmmesse .
  
  # etichetta in italiano
  ?entità rdfs:label ?entLabel .       
  FILTER(LANG(?entLabel) = "it") 
  
  # aka per chi lo ha (esempio di Càriti che su Arco non è presente, c'è la label "Grazie")
  OPTIONAL {
  ?entità skos:altLabel ?aka .
  FILTER(LANG(?aka) = "it")
  }
  
  # descrizione
  OPTIONAL {
    ?entità schema:description ?descrizione .
    FILTER(LANG(?descrizione) = "it")
  }
}
GROUP BY ?entità ?entLabel ?descrizione
ORDER BY ?entLabel""",
                  """SELECT ?entità ?entLabel (GROUP_CONCAT(DISTINCT ?aka; separator=", ") AS ?aliases) ?descrizione
WHERE {
  # spirito della natura (per ninfe e simili)
  VALUES ?classiAmmesse { 
    wd:Q11879837   # Spirit of nature
  }
  
  # Estrazione di istanze di o sottoclassi di spirito della natura
  ?entità wdt:P31/wdt:P279* ?classiAmmesse .
  
  # etichetta in italiano
  ?entità rdfs:label ?entLabel .       
  FILTER(LANG(?entLabel) = "it") 
  
  # aka per chi lo ha (esempio di Càriti che su Arco non è presente, c'è la label "Grazie")
  OPTIONAL {
  ?entità skos:altLabel ?aka .
  FILTER(LANG(?aka) = "it")
  }
  
  # descrizione
  OPTIONAL {
    ?entità schema:description ?descrizione .
    FILTER(LANG(?descrizione) = "it")
  }
}
GROUP BY ?entità ?entLabel ?descrizione
ORDER BY ?entLabel
""",
                  """SELECT ?entità ?entLabel (GROUP_CONCAT(DISTINCT ?aka; separator=", ") AS ?aliases) ?descrizione
WHERE {
  # mythical war or episode in greek mythology
  VALUES ?classiAmmesse { wd:Q24336068 wd:Q63143903 }
  VALUES ?mitiAmmessi {wd:Q34726 wd:Q122173}
  
  # istanze o sottoclassi
  ?entità wdt:P31/wdt:P279* ?classiAmmesse ;
          wdt:P361 ?mitiAmmessi .
  
  # etichetta in italiano
  ?entità rdfs:label ?entLabel .       
  FILTER(LANG(?entLabel) = "it") 
  
  # aka
  OPTIONAL {
    ?entità skos:altLabel ?aka .
    FILTER(LANG(?aka) = "it")
  }
  
  # 5. Descrizione
  OPTIONAL {
    ?entità schema:description ?descrizione .
    FILTER(LANG(?descrizione) = "it")
  }
}

GROUP BY ?entità ?entLabel ?descrizione
ORDER BY ?entLabel
""",
                  """SELECT ?entità ?entLabel (GROUP_CONCAT(DISTINCT ?aka; separator=", ") AS ?aliases) ?descrizione
WHERE {
  # mythical entity, class of mythical entities, group of mythical creatures
  VALUES ?classiAmmesse { wd:Q24334685 wd:Q33294038 wd:Q24337101 }
  # restriction to entities either part of greek or roman mythology
  VALUES ?mitiAmmessi {wd:Q34726 wd:Q122173}
  
  # istanze o sottoclassi
  ?entità wdt:P31/wdt:P279* ?classiAmmesse ;
          wdt:P361 ?mitiAmmessi .
  
  # etichetta in italiano
  ?entità rdfs:label ?entLabel .       
  FILTER(LANG(?entLabel) = "it") 
  
  # aka
  OPTIONAL {
    ?entità skos:altLabel ?aka .
    FILTER(LANG(?aka) = "it")
  }
  
  # descrizione
  OPTIONAL {
    ?entità schema:description ?descrizione .
    FILTER(LANG(?descrizione) = "it")
  }
}
GROUP BY ?entità ?entLabel ?descrizione
ORDER BY ?entLabel
""",
"""SELECT ?entità ?entLabel (GROUP_CONCAT(DISTINCT ?aka; separator=", ") AS ?aliases) ?descrizione
WHERE {
  # ibrido umano-animale (per fauno e simili)
  VALUES ?classiAmmesse { wd:Q20902363}
  #VALUES ?mitiAmmessi {wd:Q34726 wd:Q122173}
  
  # istanze o sottoclassi
  ?entità wdt:P31/wdt:P279* ?classiAmmesse .
          #wdt:P361 ?mitiAmmessi .
  
  # etichetta in italiano
  ?entità rdfs:label ?entLabel .       
  FILTER(LANG(?entLabel) = "it") 
  
  # aka
  OPTIONAL {
    ?entità skos:altLabel ?aka .
    FILTER(LANG(?aka) = "it")
  }
  
  # descrizione
  OPTIONAL {
    ?entità schema:description ?descrizione .
    FILTER(LANG(?descrizione) = "it")
  }
}
GROUP BY ?entità ?entLabel ?descrizione
ORDER BY ?entLabel"""]

""" all_results_list = [] # Qui accumuleremo tutti i DataFrame delle 8 query

for i, q in enumerate(lista_query):
    sparql_wd.setQuery(q)
    sparql_wd.setReturnFormat(JSON)
    
    try:
        results = sparql_wd.query().convert()
        query_data = [] # Lista temporanea per i risultati di QUESTA singola query
        
        for result in results["results"]["bindings"]:
            # Estrazione dati
            pers = result["entità"]["value"]
            name = result["entLabel"]["value"]
            # gestione optional 
            aka = result["aliases"]["value"] if "value" else None
            description = result["descrizione"]["value"] if "descrizione" in result else None

            query_data.append((pers, name, aka, description))

        # se ci sono risultati, trasforma dati in dataframe
        if query_data:
            df_temp = pd.DataFrame(query_data, columns=["entity", "name", "aka", "description"])
            all_results_list.append(df_temp)
            print(f"Query {i+1} completata: trovate {len(df_temp)} righe.")
        
    except Exception as e:
        print(f"Errore nella query {i+1}: {e}") """

# concatena tutti i DataFrame trovati in uno solo
""" if all_results_list:
    wikidata_results = pd.concat(all_results_list, ignore_index=True)
    print(f"Totale finale: {len(wikidata_results)} righe.") # in totale, prima di pulire righe identiche e intrusi, dovrebbero essere 7098 righe (corretto)
    # remove duplicates
    wikidata_results = wikidata_results.drop_duplicates()
    print(f"Totale finale: {len(wikidata_results)} righe.") # 5507 righe dopo rimozione duplicati
    # conta entità che non hanno description
    empty_desc_count = wikidata_results['description'].isna().sum()
    print(f"Number of empty description fields: {empty_desc_count}") # campi senza descrizione: 1661
else:
    print("Nessun dato trovato.") """


# store dataframe in a csv file to inspect it and clean it
#wikidata_csv = wikidata_results.to_csv("wd_dataset.csv", index=False, sep=",", encoding="utf-8")
# rimuovere entità uguali se ci sono; togliere intrusi; decidere cosa fare con entità che non hanno description

# poi: mettere insieme i valori nella colonna label e aliases e usarli per filtrare i beni storici artistici su soggetto e title

# aprire dataframe wikidata e usare quello per filtrare ArCo
wikidata_dataset = pd.read_csv("wd_dataset.csv", encoding="utf-8")
print(wikidata_dataset.head)