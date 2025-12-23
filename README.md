# SmartCine - Système Sémantique de Recommandation de Films

Système de recommandation de films basé sur le Web sémantique utilisant RDF, OWL et SPARQL.

**Status : ✅ Projet Terminé**

## Démonstration

- **Frontend React** : http://localhost:3000
- **Fuseki SPARQL** : http://localhost:3030

## Architecture

```
CSV (données brutes)
     ↓
Ontologie (Python + RDFLib)
     ↓
Knowledge Graph (OWL/TTL)
     ↓
Fuseki (SPARQL Server)
     ↓
Interface Web (React)
```

## Structure du projet

```
projet/
├── data/                    # Données sources
│   ├── movies_metadata.csv  # Métadonnées des films (TMDB)
│   └── credits.csv          # Acteurs et équipe technique
├── logs/                    # Fichiers de logs
├── film-recommendation/     # Application React
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── context/         # Context API
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # Service SPARQL
│   └── package.json
├── clean_data.py            # Script de nettoyage des données
├── create_ontology.py       # Script de création de l'ontologie
├── films_clean.csv          # Données nettoyées
├── films.ttl                # Ontologie (format Turtle)
├── films.owl                # Ontologie (format RDF/XML)
├── requirements.txt         # Dépendances Python
└── README.md
```

## Prérequis

- Python 3.8+
- Node.js 18+
- Java 17+ (pour Fuseki)
- Apache Jena Fuseki

## Installation

### 1. Dépendances Python

```bash
pip install -r requirements.txt
```

### 2. Télécharger les données (optionnel)

```python
import kagglehub
path = kagglehub.dataset_download("rounakbanik/the-movies-dataset")
```

### 3. Nettoyer les données

```bash
python clean_data.py
```

### 4. Créer l'ontologie

```bash
python create_ontology.py
```

### 5. Lancer Fuseki

Fuseki est installé dans `C:\Users\HP\apache-jena-fuseki-5.6.0`

```powershell
cd C:\Users\HP\apache-jena-fuseki-5.6.0
.\fuseki-server.bat --update --file="D:\bureau\BD_AI1\ci3\semantique\projet\films.ttl" /films
```

Accéder à http://localhost:3030

### 6. Lancer le frontend React

```bash
cd film-recommendation
npm install
npm start
```

Accéder à http://localhost:3000

## Ontologie

### Classes

| Classe | Description |
|--------|-------------|
| `Film` | Un film cinématographique |
| `Acteur` | Une personne jouant dans un film |
| `Realisateur` | La personne qui réalise un film |
| `Genre` | Le genre cinématographique |

### Propriétés objet

| Propriété | Domaine | Range | Description |
|-----------|---------|-------|-------------|
| `hasActor` | Film | Acteur | Lie un film à ses acteurs |
| `directedBy` | Film | Realisateur | Lie un film à son réalisateur |
| `hasGenre` | Film | Genre | Lie un film à ses genres |

### Propriétés de données

| Propriété | Domaine | Type | Description |
|-----------|---------|------|-------------|
| `titre` | Film | string | Titre du film |
| `nom` | * | string | Nom (acteur, réalisateur, genre) |
| `releaseYear` | Film | integer | Année de sortie |
| `duration` | Film | integer | Durée en minutes |

## Requêtes SPARQL

### Tous les films

```sparql
PREFIX ns: <http://example.org/film#>

SELECT ?titre ?annee WHERE {
  ?film a ns:Film .
  ?film ns:titre ?titre .
  OPTIONAL { ?film ns:releaseYear ?annee }
}
ORDER BY ?titre
```

### Recommandations par acteur

```sparql
PREFIX ns: <http://example.org/film#>

SELECT DISTINCT ?titre WHERE {
  <http://example.org/film#Film_Inception> ns:hasActor ?actor .
  ?film ns:hasActor ?actor .
  ?film ns:titre ?titre .
  FILTER(?film != <http://example.org/film#Film_Inception>)
}
```

### Recommandations par genre

```sparql
PREFIX ns: <http://example.org/film#>

SELECT DISTINCT ?titre WHERE {
  <http://example.org/film#Film_Inception> ns:hasGenre ?genre .
  ?film ns:hasGenre ?genre .
  ?film ns:titre ?titre .
  FILTER(?film != <http://example.org/film#Film_Inception>)
}
```

### Recommandations par réalisateur

```sparql
PREFIX ns: <http://example.org/film#>

SELECT DISTINCT ?titre WHERE {
  <http://example.org/film#Film_Inception> ns:directedBy ?director .
  ?film ns:directedBy ?director .
  ?film ns:titre ?titre .
  FILTER(?film != <http://example.org/film#Film_Inception>)
}
```

## Équipe

| Membre | Responsabilité |
|--------|----------------|
| Salah | Préparation des données |
| Imane/Aya | Modélisation de l'ontologie |
| Nora | Knowledge Graph & Fuseki |
| Zakaria | Interface Web React |

## Technologies

- **Python** : pandas, rdflib
- **Web sémantique** : RDF, OWL, SPARQL
- **Triplestore** : Apache Jena Fuseki
- **Frontend** : React 18, Axios, Context API

## Logs

Les logs sont générés dans le dossier `logs/` :
- `clean_data.log` : Logs du nettoyage des données
- `create_ontology.log` : Logs de la création de l'ontologie

## Licence

Projet académique - CI3 Sémantique
