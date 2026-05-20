import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import networkx as nx
import seaborn

arco_final = pd.read_csv("data_analysis/arco_wd_final.csv", encoding="utf-8")

# 1. Pulizia preliminare: assicurati che gli anni siano numeri interi (senza decimali)
# Gestisce anche eventuali valori nulli (NaN) riempiendoli o droppandoli prima se necessario
arco_final = arco_final.dropna(subset=["start_norm", "end_norm"])

arco_final["start_norm"] = arco_final["start_norm"].astype(int)
arco_final["end_norm"] = arco_final["end_norm"].astype(int)

# 2. Creiamo una lista di tutti gli anni compresi tra 'start' e 'end' (inclusi)
arco_final["year"] = arco_final.apply(
    lambda row: list(range(row["start_norm"], row["end_norm"] + 1)), axis=1
)

# 3. "Esplodiamo" la lista: ogni anno nella lista diventa una riga autonoma
df_exploded = arco_final.explode("year")

# 4. Ora raggruppiamo per Soggetto e Anno per ottenere il conteggio effettivo
subjects_by_year = (
    df_exploded.groupby(["final_terms", "year"])
    .size()
    .reset_index(name="collection_count")
)

# 5. Rinominiamo la colonna dei soggetti per pulizia
subjects_by_year = subjects_by_year.rename(columns={"final_terms": "subject"})

print(subjects_by_year.head(50))
print(len(set(subjects_by_year["subject"])))

