""" import rdflib
from rdflib import Graph, URIRef, Literal, Namespace
from rdflib.namespace import RDF, RDFS, OWL, XSD
from SPARQLWrapper import SPARQLWrapper, JSON """

#ENDPOINT SPARQL DI ARCO 
#arco_endpoint = "https://dati.cultura.gov.it/sparql"
# set endpoint
#sparql_arco = SPARQLWrapper(arco_endpoint)

# namespaces
""" dc = Namespace("http://purl.org/dc/elements/1.1/")
arco = Namespace("https://w3id.org/arco/ontology/arco/")
arcd = Namespace("https://w3id.org/arco/ontology/context-description/") """
#ardd = Namespace("https://w3id.org/arco/ontology/denotative-description/") # per "hasCulturalPropertyType", e.g. "dipinto"
#arloc = Namespace("https://w3id.org/arco/ontology/location/") # hasCulturalInstituteOrSite
#foaf = Namespace("http://xmlns.com/foaf/0.1/") # per le immagini

# Initialize graph
#g = Graph()

# bind namespaces
""" g.bind("dc", dc)
g.bind("arco", arco)
g.bind("a-cd", arcd)
g.bind("a-dd", ardd)
g.bind("a-loc", arloc)
g.bind("foaf", foaf) """

import pandas as pd
import re

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
    
# Lista delle casistiche reali e complesse
data_esempi = [
    "post 1880 - ante 1990",
    "1880 - 1890",
    "1880/01/01 - 1890/12/31",
    "1880? - 1890",
    "1880 - 1890?",
    "1880 - 1880-1881",
    "1880-1881 - 1890",
    "1880 (?) - 1890 (?)",
    "1880 (?) - (?) 1890",
    "1880 - 1990 (?)",
    "1880? - (?) 1890",
    "ca. 1880 - ca. 1890",
    "1880 - ca. 1890",
    "ca. 1880 - 1890",
    "post 1880 - ca. 1990",
    "ante 1880 - ca. 1990",
    "1900/05/20 - 1905", # Caso misto data/anno
    "1920 - 1920/06/15"  # Caso misto anno/data
]

# Creazione del DataFrame
df = pd.DataFrame(data_esempi, columns=['date_range_originale'])

# Aggiungiamo un ID fittizio per simulare un dataset di Beni Culturali
df.insert(0, 'id_bene', [f"BENE_{i:03d}" for i in range(len(df))])

# Visualizziamo le prime righe
print("DataFrame di Prova creato:")
print(df.head())

# Assumendo che la tua funzione restituisca pd.Series({'start': ..., 'end': ...})
df[['start_orig', 'start_norm', 'end_orig', 'end_norm']] = df['date_range_originale'].apply(clean_dates)

# Visualizzazione del risultato finale
print("\nRisultato dopo il cleaning:")
print(df[['date_range_originale', 'start_orig', 'start_norm', 'end_orig', 'end_norm']])

# proprietà utili per entità wikidata
#wdt:P21 # sex or gender  # OK

#wdt:P451 # unmarried partner
#wdt:P40 # child
#wdt:P22 #father
#wdt:P26 #spouse
#wdt:P25 #mother
#wdt:P3373 #sibling

#wdt:P1889 #different from   # OK
#wdt:P460 #said to be the same as   # OK

#wdt:P4675 #appears in the form of
#wdt:P2925 #domain of saint or deity  # OK

#wdt:P3701 #incarnation of
#wdt:P4185 #iconographic symbol   # OK
#wdt:P551 #residence  

#wdt:P157 #killed by  # OK
#wdt:P1441 #present in work  
