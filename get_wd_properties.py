import pandas as pd
from SPARQLWrapper import SPARQLWrapper, JSON

wd_endpoint = "https://query.wikidata.org/bigdata/namespace/wdq/sparql" # sui tutorial c'è questo
# set endpoint
sparql_wd = SPARQLWrapper(wd_endpoint)

wd_dataset = pd.read_csv("wd_dataset.csv", encoding="utf-8")
#print(wd_dataset.head)
wd_entities = wd_dataset["entity"]

def process_entities(entity):
    return "<" + entity + ">"

wd_entities = wd_entities.apply(process_entities)

entities_list = list(wd_entities)
entities_str = " ".join(entities_list)
print(entities_str)

# estrazione proprietà wikidata
def extract_properties(entities, batch_number):
    all_properties = []

    for i in range(0, len(entities_str), batch_number):
        # sublist to process
        batch = entities_str[i:i + batch_number]


        query_properties = """
            SELECT DISTINCT ?p ?label
            WHERE {
                {"""+batch+"""} ?p ?object . 
  
                # Filtriamo solo le proprietà dirette (wdt:)
                FILTER(STRSTARTS(STR(?p), "http://www.wikidata.org/prop/direct/"))
  
                # Trasformiamo l'URI tecnico (wdt:P...) nell'URI dell'entità (wd:P...)
                BIND(URI(REPLACE(STR(?p), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?pEntity)
  
                OPTIONAL { 
                ?pEntity rdfs:label ?label .
                FILTER(LANG(?label) = "en")
                }
            }
            ORDER BY ?label
        """

        sparql_wd.setQuery(query_properties)
        sparql_wd.setReturnFormat(JSON)

        try:
            results = sparql_wd.query().convert()

            # Creates a list of dictionaries with just the values
            all_properties.append({k: v["value"] for k, v in r.items()} for r in results["results"]["bindings"])


        except Exception as e:
            print(f"Errore batch {i}: {e}")

    if all_properties:
        return all_properties


""" properties_needed = []

for result in results["results"]["bindings"]:
    property = result["p"]["value"]
    label = result["label"]["value"]

    properties_needed.append((property, label))

if properties_needed:
    properties_df = pd.DataFrame(properties_needed, columns=["properties", "labels"]) """

