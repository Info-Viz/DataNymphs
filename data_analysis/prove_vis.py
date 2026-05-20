import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import networkx as nx
import seaborn

arco_enriched = pd.read_csv("data_analysis/arco_myth_enriched.csv", encoding="utf-8")
wd_relations = pd.read_csv("data_analysis/mythological_network.csv", encoding="utf-8")

arco_enriched_filtered = arco_enriched[["item", "label", "subject", "final_terms", "creatorLabel", "typeLabel", "start", "end"]]
print(arco_enriched_filtered.head())

# for each item in the arco dataset, process the uri(s) of the matching wikidata entities to get the properties from the second dataframe and expand the df

# then plot relations in a network

