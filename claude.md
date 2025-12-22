# Projet : Système Sémantique de Recommandation de Films

## Vue d'ensemble

Ce projet consiste à créer un système de recommandation de films basé sur le Web sémantique. Contrairement aux bases de données classiques qui stockent des données sans en comprendre le sens, le Web sémantique permet de représenter les données avec leur signification et leurs relations.

## Architecture du projet

```
CSV (données brutes)
     ↓
Ontologie (Protégé)
     ↓
Knowledge Graph (OWL/TTL)
     ↓
Fuseki (SPARQL)
     ↓
Requêtes de recommandation
     ↓
Interface Web
```

---

## Concepts Fondamentaux

### RDF (Resource Description Framework)
Format de base du Web sémantique. Les données sont représentées sous forme de **triplets** :
```
Sujet — Prédicat — Objet
```
Exemple : `Inception — hasActor — LeonardoDiCaprio`

### URI (Identifiants uniques)
Chaque élément est identifié par une URI unique :
```
http://example.org/film#Inception
```

### Namespace
Simplification des URI :
```python
ns = Namespace("http://example.org/film#")
# Utilisation : ns:Inception, ns:hasActor
```

### OWL (Ontologies)
Description formelle des concepts d'un domaine et de leurs relations :

| Élément | Rôle | Exemple |
|---------|------|---------|
| Classe | Concept | Film |
| Individu | Instance réelle | Inception |
| Propriété objet | Lien entre individus | hasActor |
| Propriété de données | Valeur littérale | releaseYear |

### SPARQL
Langage de requêtes pour le Web sémantique (équivalent de SQL) :
```sparql
SELECT ?film WHERE {
  ?film :hasGenre :ScienceFiction .
}
```

---

## Étapes du Projet

### Étape 1 : Préparation des données (Salah)

**Objectif** : Créer une base de données propre et cohérente

**Tâches** :
- Choisir un dataset (TMDB, Netflix, Kaggle)
- Identifier les informations utiles : Film, Acteurs, Réalisateur, Genre, Année, Durée
- Nettoyer les données : uniformiser les noms, séparer les listes, supprimer les valeurs manquantes

**Outils** : Excel, Google Sheets, Python (pandas)

**Output** : `films_clean.csv`

```csv
Film,Acteurs,Réalisateur,Genre,Année,Durée
Inception,"Leonardo DiCaprio; Joseph Gordon-Levitt",Christopher Nolan,Science-Fiction,2010,148
Titanic,"Leonardo DiCaprio; Kate Winslet",James Cameron,Romance,1997,195
```

---

### Étape 2 : Modélisation et peuplement de l'ontologie (Imane/Aya)

**Objectif** : Créer une ontologie complète avec structure + individus

**1. Modélisation (dans Protégé)**
- Classes : `Film`, `Acteur`, `Réalisateur`, `Genre`
- Propriétés : `hasActor`, `directedBy`, `hasGenre`, `releaseYear`, `duration`

**2. Peuplement (ajout des individus)**

Exemple :
```
Film_Inception
  hasActor → LeonardoDiCaprio
  directedBy → ChristopherNolan
  hasGenre → ScienceFiction
  releaseYear → 2010
  duration → 148
```

**Méthodes de peuplement** :
- **Option 1** : Manuel dans Protégé (petits datasets)
- **Option 2** : Script automatisé (Python + RDFLib)
- **Option 3** : SPARQL Update manuel
- **Option 4** : SPARQL Update automatique (recommandé)

```sparql
INSERT DATA {
  :Film_Inception a :Film ;
    :hasActor :LeonardoDiCaprio ;
    :directedBy :ChristopherNolan ;
    :hasGenre :ScienceFiction ;
    :releaseYear 2010 ;
    :duration 148 .
}
```

**Outils** : Protégé, Python + RDFLib, Java + RDF4J

**Output** : `films.owl` ou `films.ttl`

---

### Étape 3 : Déploiement du Knowledge Graph (Nora)

**Objectif** : Rendre le Knowledge Graph accessible et implémenter la recommandation

**1. Déploiement**
- Lancer Apache Jena Fuseki
- Créer un dataset (`films`)
- Importer l'ontologie
- URL : `http://localhost:3030/films`

**2. Logique de recommandation**

Critères de recommandation :
- Même acteur
- Même genre
- Même réalisateur

Exemple de requête :
```sparql
SELECT ?film WHERE {
  :Film_Inception :hasActor ?actor .
  ?film :hasActor ?actor .
  FILTER(?film != :Film_Inception)
}
```

**Outils** : Apache Jena Fuseki, SPARQL

**Output** : Endpoint SPARQL actif + requêtes fonctionnelles

---

### Étape 4 : Interface Web (Zakaria)

**Objectif** : Permettre à l'utilisateur d'utiliser le système

**Fonctionnalités** :
1. Afficher la liste des films
2. Permettre la sélection d'un film
3. Envoyer des requêtes SPARQL à Fuseki
4. Afficher les films recommandés

**Technologies** :

| Couche | Outils |
|--------|--------|
| Frontend | HTML, CSS, JavaScript |
| Backend (optionnel) | Flask / Spring |
| Données | Fuseki (SPARQL endpoint) |

**Output** : Application web fonctionnelle

---

### Étape 5 : Présentation et rapport final

**Livrables** :
- Diagramme de l'ontologie
- Description des choix de modélisation
- Exemples de requêtes SPARQL
- Démonstration de l'interface web
- Rapport + slides

---

## Outils du Projet

| Outil | Rôle |
|-------|------|
| **Protégé** | Éditeur d'ontologies OWL |
| **Apache Jena Fuseki** | Serveur SPARQL / Triplestore |
| **RDFLib** (Python) | Manipulation RDF programmatique |
| **SPARQL** | Langage de requêtes sémantiques |

---

## Équipe

| Membre | Responsabilité |
|--------|----------------|
| Salah | Étape 1 - Préparation des données |
| Imane/Aya | Étape 2 - Ontologie |
| Nora | Étape 3 - Knowledge Graph & recommandation |
| Zakaria | Étape 4 - Interface Web |

---

## Points Clés

- **SPARQL = moteur de recommandation** : pas de `if` codés en dur, la logique est dans les requêtes
- **Knowledge Graph** = Ontologie + Individus stockés dans un triplestore
- **Web sémantique** : données + sens + relations explicites
