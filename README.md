# SmartCine - Systeme Semantique de Recommandation de Films

Systeme de recommandation de films base sur le Web semantique utilisant RDF, OWL et SPARQL.

**Status : Projet Termine**

## Fonctionnalites

- Affichage des films avec leurs vraies affiches (API OMDB)
- Recommandations intelligentes par acteur, genre et realisateur
- Recherche multi-criteres (titre, genre, acteur, realisateur)
- Interface moderne et responsive

## Demonstration

- **Frontend React** : http://localhost:3000
- **Fuseki SPARQL** : http://localhost:3030

## Architecture

```
CSV (donnees brutes)
     |
Ontologie (Python + RDFLib)
     |
Knowledge Graph (OWL/TTL)
     |
Fuseki (SPARQL Server)
     |
Interface Web (React + OMDB API)
```

## Structure du projet

```
projet/
├── data/                    # Donnees sources
│   ├── movies_metadata.csv  # Metadonnees des films (TMDB)
│   └── credits.csv          # Acteurs et equipe technique
├── logs/                    # Fichiers de logs
├── film-recommendation/     # Application React
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── context/         # Context API
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # Services SPARQL + OMDB
│   └── package.json
├── clean_data.py            # Script de nettoyage des donnees
├── create_ontology.py       # Script de creation de l'ontologie
├── films_clean.csv          # Donnees nettoyees
├── films.ttl                # Ontologie (format Turtle)
├── films.owl                # Ontologie (format RDF/XML)
├── requirements.txt         # Dependances Python
└── README.md
```

## Prerequis

- Python 3.8+
- Node.js 18+
- Java 17+ (pour Fuseki)
- Apache Jena Fuseki
- Cle API OMDB (gratuite sur http://www.omdbapi.com/apikey.aspx)

## Installation

### 1. Dependances Python

```bash
pip install -r requirements.txt
```

### 2. Telecharger les donnees (optionnel)

```python
import kagglehub
path = kagglehub.dataset_download("rounakbanik/the-movies-dataset")
```

### 3. Nettoyer les donnees

```bash
python clean_data.py
```

### 4. Creer l'ontologie

```bash
python create_ontology.py
```

### 5. Lancer Fuseki

```powershell
cd C:\Users\HP\apache-jena-fuseki-5.6.0
.\fuseki-server.bat --update --file="D:\bureau\BD_AI1\ci3\semantique\projet\films.ttl" /films
```

Acceder a http://localhost:3030

### 6. Configurer la cle API OMDB

Modifier `film-recommendation/src/services/omdbService.js` :

```javascript
const OMDB_API_KEY = 'votre_cle_api';
```

### 7. Lancer le frontend React

```bash
cd film-recommendation
npm install
npm start
```

Acceder a http://localhost:3000

## Ontologie

### Classes

| Classe | Description |
|--------|-------------|
| `Film` | Un film cinematographique |
| `Acteur` | Une personne jouant dans un film |
| `Realisateur` | La personne qui realise un film |
| `Genre` | Le genre cinematographique |

### Proprietes objet

| Propriete | Domaine | Range | Description |
|-----------|---------|-------|-------------|
| `hasActor` | Film | Acteur | Lie un film a ses acteurs |
| `directedBy` | Film | Realisateur | Lie un film a son realisateur |
| `hasGenre` | Film | Genre | Lie un film a ses genres |

### Proprietes de donnees

| Propriete | Domaine | Type | Description |
|-----------|---------|------|-------------|
| `titre` | Film | string | Titre du film |
| `nom` | * | string | Nom (acteur, realisateur, genre) |
| `releaseYear` | Film | integer | Annee de sortie |
| `duration` | Film | integer | Duree en minutes |
| `posterPath` | Film | string | URL du poster |

## Requetes SPARQL

### Tous les films

```sparql
PREFIX ns: <http://example.org/film#>

SELECT ?titre ?annee ?poster WHERE {
  ?film a ns:Film .
  ?film ns:titre ?titre .
  OPTIONAL { ?film ns:releaseYear ?annee }
  OPTIONAL { ?film ns:posterPath ?poster }
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

### Recherche multi-criteres

```sparql
PREFIX ns: <http://example.org/film#>

SELECT DISTINCT ?titre WHERE {
  ?uri a ns:Film .
  ?uri ns:titre ?titre .
  OPTIONAL { ?uri ns:hasGenre ?genreUri . ?genreUri ns:nom ?genre . }
  OPTIONAL { ?uri ns:directedBy ?dirUri . ?dirUri ns:nom ?realisateur . }
  OPTIONAL { ?uri ns:hasActor ?actorUri . ?actorUri ns:nom ?acteur . }
  FILTER(
    CONTAINS(LCASE(?titre), LCASE("searchTerm")) ||
    CONTAINS(LCASE(?genre), LCASE("searchTerm")) ||
    CONTAINS(LCASE(?realisateur), LCASE("searchTerm")) ||
    CONTAINS(LCASE(?acteur), LCASE("searchTerm"))
  )
}
```

## Equipe

| Membre | Responsabilite |
|--------|----------------|
| Salah | Preparation des donnees |
| Imane/Aya | Modelisation de l'ontologie |
| Nora | Knowledge Graph & Fuseki |
| Zakaria | Interface Web React |

## Technologies

- **Python** : pandas, rdflib
- **Web semantique** : RDF, OWL, SPARQL
- **Triplestore** : Apache Jena Fuseki
- **Frontend** : React 18, Axios, Context API
- **API externe** : OMDB API (affiches de films)

## Logs

Les logs sont generes dans le dossier `logs/` :
- `clean_data.log` : Logs du nettoyage des donnees
- `create_ontology.log` : Logs de la creation de l'ontologie

## Licence

Projet academique - CI3 Semantique
