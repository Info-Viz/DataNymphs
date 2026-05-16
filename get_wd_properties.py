import pandas as pd
import json
import os
from SPARQLWrapper import SPARQLWrapper, JSON

wd_endpoint = "https://query.wikidata.org/bigdata/namespace/wdq/sparql" # sui tutorial c'è questo
# set endpoint
sparql_wd = SPARQLWrapper(wd_endpoint)

wd_dataset = pd.read_csv("wd_dataset.csv", encoding="utf-8")
#print(wd_dataset.head)
wd_entities = wd_dataset["category"]

entities = set()

for idx, row in wd_entities.items():
    print("Processing item", idx)
    category = row
    entities.add(row)

print("The set of categories", entities) # {'roman_deity', 'greek_mythological_character', 'group_of_deities', 'spirits_of_nature', 'mythical_war', 'greek_deity', 'ibrido', 'roman_mythological_character', 'mythical_entity'}

# ! spirits of nature in realtà è nature deity !

# ibrido è mythical human-animal hybrid

# roman mythological character è mythological Roman character

print("The set counts", len(entities), "categories")

#categories_uris = ["<https://www.wikidata.org/entity/Q11688446>", "<https://www.wikidata.org/entity/Q22988604>", "<https://www.wikidata.org/entity/Q111252729>", "<https://www.wikidata.org/entity/Q13405593>", "https://www.wikidata.org/entity/Q24336068", "<https://www.wikidata.org/entity/Q22989102>", "<https://www.wikidata.org/entity/Q20902363>", "<https://www.wikidata.org/entity/Q124940323>", "<https://www.wikidata.org/entity/Q24334685>"]

def extract_properties(query_prop):
    all_properties = []

    sparql_wd.setQuery(query_prop)
    sparql_wd.setReturnFormat(JSON)

    try:
        results = sparql_wd.query().convert()

        for r in results["results"]["bindings"]:
            # Controlliamo i dati reali restituiti da Wikidata
            property_uri = r["property"]["value"] if "property" in r else "N/A"

            # Il servizio aggiunge SEMPRE "Label" al nome della variabile principale
            if (
                "propertyLabel" in r
                and r["propertyLabel"]["value"] != property_uri
            ):
                label = r["propertyLabel"]["value"]
            else:
                # Se il label service fallisce, estraiamo l'ID finale (es. P31) come fallback
                label = property_uri.split("/")[-1]

            all_properties.append({"property": property_uri, "label": label})

    except Exception as e:
        print(f"Errore: {e}")
        return []

    return all_properties


query_roman_deity = """
        SELECT DISTINCT ?property ?propertyLabel
        WHERE {
            # Prendiamo la relazione (wdt:...) e l'oggetto
            wd:Q11688446 ?propertyUri ?object .
            
            # Isoliamo solo le proprietà dirette
            FILTER(STRSTARTS(STR(?propertyUri), "http://www.wikidata.org/prop/direct/"))
            
            # Trasformiamo l'URI della relazione nell'URI dell'entità Proprietà (wd:P...)
            # Usiamo ?property come nome standard, così il SERVICE sa esattamente cosa cercare
            BIND(URI(REPLACE(STR(?propertyUri), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?property)
            
            # Il Label Service intercetta ?property e genera automaticamente ?propertyLabel
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            # Filtro per escludere gli identificativi (ID), basato sul codice originale
            #FILTER(!CONTAINS(STR(?propertyLabel), "ID"))
        }
        ORDER BY ?propertyLabel
    """

#query_greek_myth_char
query_greek_myth_char = """
        SELECT DISTINCT ?property ?propertyLabel
        WHERE {
            # Prendiamo la relazione (wdt:...) e l'oggetto
            wd:Q22988604 ?propertyUri ?object .
            
            # Isoliamo solo le proprietà dirette
            FILTER(STRSTARTS(STR(?propertyUri), "http://www.wikidata.org/prop/direct/"))
            
            # Trasformiamo l'URI della relazione nell'URI dell'entità Proprietà (wd:P...)
            # Usiamo ?property come nome standard, così il SERVICE sa esattamente cosa cercare
            BIND(URI(REPLACE(STR(?propertyUri), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?property)
            
            # Il Label Service intercetta ?property e genera automaticamente ?propertyLabel
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            # Filtro per escludere gli identificativi (ID), basato sul codice originale
            FILTER(!CONTAINS(STR(?property), "ID"))
        }
        ORDER BY ?propertyLabel
    """

# query group of deities
query_group_of_deities = """
        SELECT DISTINCT ?property ?propertyLabel
        WHERE {
            # Prendiamo la relazione (wdt:...) e l'oggetto
            wd:Q111252729 ?propertyUri ?object .
            
            # Isoliamo solo le proprietà dirette
            FILTER(STRSTARTS(STR(?propertyUri), "http://www.wikidata.org/prop/direct/"))
            
            # Trasformiamo l'URI della relazione nell'URI dell'entità Proprietà (wd:P...)
            # Usiamo ?property come nome standard, così il SERVICE sa esattamente cosa cercare
            BIND(URI(REPLACE(STR(?propertyUri), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?property)
            
            # Il Label Service intercetta ?property e genera automaticamente ?propertyLabel
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            # Filtro per escludere gli identificativi (ID), basato sul codice originale
            FILTER(!CONTAINS(STR(?property), "ID"))
        }
        ORDER BY ?propertyLabel
    """

# query nature deity
query_nature_deity = """
        SELECT DISTINCT ?property ?propertyLabel
        WHERE {
            # Prendiamo la relazione (wdt:...) e l'oggetto
            wd:Q13405593 ?propertyUri ?object .
            
            # Isoliamo solo le proprietà dirette
            FILTER(STRSTARTS(STR(?propertyUri), "http://www.wikidata.org/prop/direct/"))
            
            # Trasformiamo l'URI della relazione nell'URI dell'entità Proprietà (wd:P...)
            # Usiamo ?property come nome standard, così il SERVICE sa esattamente cosa cercare
            BIND(URI(REPLACE(STR(?propertyUri), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?property)
            
            # Il Label Service intercetta ?property e genera automaticamente ?propertyLabel
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            # Filtro per escludere gli identificativi (ID), basato sul codice originale
            FILTER(!CONTAINS(STR(?property), "ID"))
        }
        ORDER BY ?propertyLabel
    """

# query mythical war
query_mythical_war = """
        SELECT DISTINCT ?property ?propertyLabel
        WHERE {
            # Prendiamo la relazione (wdt:...) e l'oggetto
            wd:Q24336068 ?propertyUri ?object .
            
            # Isoliamo solo le proprietà dirette
            FILTER(STRSTARTS(STR(?propertyUri), "http://www.wikidata.org/prop/direct/"))
            
            # Trasformiamo l'URI della relazione nell'URI dell'entità Proprietà (wd:P...)
            # Usiamo ?property come nome standard, così il SERVICE sa esattamente cosa cercare
            BIND(URI(REPLACE(STR(?propertyUri), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?property)
            
            # Il Label Service intercetta ?property e genera automaticamente ?propertyLabel
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            # Filtro per escludere gli identificativi (ID), basato sul codice originale
            FILTER(!CONTAINS(STR(?property), "ID"))
        }
        ORDER BY ?propertyLabel
    """

# query greek deity
query_greek_deity = """
        SELECT DISTINCT ?property ?propertyLabel
        WHERE {
            # Prendiamo la relazione (wdt:...) e l'oggetto
            wd:Q22989102 ?propertyUri ?object .
            
            # Isoliamo solo le proprietà dirette
            FILTER(STRSTARTS(STR(?propertyUri), "http://www.wikidata.org/prop/direct/"))
            
            # Trasformiamo l'URI della relazione nell'URI dell'entità Proprietà (wd:P...)
            # Usiamo ?property come nome standard, così il SERVICE sa esattamente cosa cercare
            BIND(URI(REPLACE(STR(?propertyUri), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?property)
            
            # Il Label Service intercetta ?property e genera automaticamente ?propertyLabel
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            # Filtro per escludere gli identificativi (ID), basato sul codice originale
            FILTER(!CONTAINS(STR(?property), "ID"))
        }
        ORDER BY ?propertyLabel
    """

# mythical human-animal hybrid
query_mythical_hybrid = """
        SELECT DISTINCT ?property ?propertyLabel
        WHERE {
            # Prendiamo la relazione (wdt:...) e l'oggetto
            wd:Q20902363 ?propertyUri ?object .
            
            # Isoliamo solo le proprietà dirette
            FILTER(STRSTARTS(STR(?propertyUri), "http://www.wikidata.org/prop/direct/"))
            
            # Trasformiamo l'URI della relazione nell'URI dell'entità Proprietà (wd:P...)
            # Usiamo ?property come nome standard, così il SERVICE sa esattamente cosa cercare
            BIND(URI(REPLACE(STR(?propertyUri), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?property)
            
            # Il Label Service intercetta ?property e genera automaticamente ?propertyLabel
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            # Filtro per escludere gli identificativi (ID), basato sul codice originale
            FILTER(!CONTAINS(STR(?property), "ID"))
        }
        ORDER BY ?propertyLabel
    """

# query roman mythological character
query_roman_myth_char = """
        SELECT DISTINCT ?property ?propertyLabel
        WHERE {
            # Prendiamo la relazione (wdt:...) e l'oggetto
            wd:Q124940323 ?propertyUri ?object .
            
            # Isoliamo solo le proprietà dirette
            FILTER(STRSTARTS(STR(?propertyUri), "http://www.wikidata.org/prop/direct/"))
            
            # Trasformiamo l'URI della relazione nell'URI dell'entità Proprietà (wd:P...)
            # Usiamo ?property come nome standard, così il SERVICE sa esattamente cosa cercare
            BIND(URI(REPLACE(STR(?propertyUri), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?property)
            
            # Il Label Service intercetta ?property e genera automaticamente ?propertyLabel
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            # Filtro per escludere gli identificativi (ID), basato sul codice originale
            FILTER(!CONTAINS(STR(?property), "ID"))
        }
        ORDER BY ?propertyLabel
    """

# query mythical entity
query_mythical_entity = """
        SELECT DISTINCT ?property ?propertyLabel
        WHERE {
            # Prendiamo la relazione (wdt:...) e l'oggetto
            wd:Q24334685 ?propertyUri ?object .
            
            # Isoliamo solo le proprietà dirette
            FILTER(STRSTARTS(STR(?propertyUri), "http://www.wikidata.org/prop/direct/"))
            
            # Trasformiamo l'URI della relazione nell'URI dell'entità Proprietà (wd:P...)
            # Usiamo ?property come nome standard, così il SERVICE sa esattamente cosa cercare
            BIND(URI(REPLACE(STR(?propertyUri), "http://www.wikidata.org/prop/direct/", "http://www.wikidata.org/entity/")) AS ?property)
            
            # Il Label Service intercetta ?property e genera automaticamente ?propertyLabel
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            # Filtro per escludere gli identificativi (ID), basato sul codice originale
            FILTER(!CONTAINS(STR(?property), "ID"))
        }
        ORDER BY ?propertyLabel
    """

 

def save_unique_properties(new_properties, file_name="wd_properties.json"):
    if os.path.exists(file_name):
        try:
            with open(file_name, "r", encoding="utf-8") as file:
                already_saved_prop = json.load(file)
        except json.JSONDecodeError:
            already_saved_prop = []
    else:
        already_saved_prop = []
    
    # extract property-label tuples
    existing_properties = {d["property"] for d in already_saved_prop if "property" in d}

    properties_to_add = []
    for d in new_properties:
        # Verifichiamo che il dizionario contenga le chiavi corrette
        if "property" in d:
            current_prop = d["property"]
    
            if current_prop not in existing_properties:
                properties_to_add.append(d)
                # La aggiungiamo al set per evitare duplicati anche dentro la stessa nuova lista
                existing_properties.add(current_prop)
    
    if properties_to_add:
        final_list = already_saved_prop + properties_to_add
        with open(file_name, "w", encoding="utf-8") as file:
            json.dump(final_list, file, indent=4, ensure_ascii=False)
        print(f"Salvati {len(properties_to_add)} nuovi elementi.")
    else:
        print("Tutti gli elementi erano già presenti. Nessuna modifica al file.")


# call 1: roman deity
""" roman_deity_prop = extract_properties(query_roman_deity)
print("Roman deity properties:", roman_deity_prop)
with open("wd_properties.json", "w", encoding="utf-8") as file:
    json.dump(roman_deity_prop, file, indent=4, ensure_ascii=False) """

# call 2: greek mythological character
""" greek_myth_char = extract_properties(query_greek_myth_char)
print("Greek mythological character properties:", greek_myth_char) 
save_unique_properties(greek_myth_char) """


# call 3: group_of_deities
""" group_of_deities = extract_properties(query_group_of_deities)
print("Group of deity properties:", group_of_deities) 
save_unique_properties(group_of_deities) """

# call 4: nature deity
""" nature_deity = extract_properties(query_nature_deity)
print("Nature deity properties:", nature_deity) 
save_unique_properties(nature_deity) """

# call 5: nature deity
""" mythical_war = extract_properties(query_mythical_war)
print("Nature deity properties:", mythical_war) 
save_unique_properties(mythical_war) """

# call 6: greek deity
""" greek_deity = extract_properties(query_greek_deity)
print("Greek deity properties:", greek_deity) 
save_unique_properties(greek_deity) """

# call 7: mythical human-animal hybrid
""" mythical_hybrid = extract_properties(query_mythical_hybrid)
print("Mythical hybrid properties:", mythical_hybrid) 
save_unique_properties(mythical_hybrid) """

# call 8: roman mythological character
""" roman_myth_char = extract_properties(query_roman_myth_char)
print("Roman mythological character properties:", roman_myth_char) 
save_unique_properties(roman_myth_char) """

# call 9: mythical entity
mythical_entity = extract_properties(query_mythical_entity)
print("Mythical entities properties:", mythical_entity) 
save_unique_properties(mythical_entity)
