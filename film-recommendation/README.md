# Film Recommendation Frontend

Interface web pour le systeme de recommandation de films base sur le Web Semantique.

## Description

Cette application React permet aux utilisateurs de :
- Parcourir une liste de films
- Selectionner un film pour obtenir des recommandations
- Afficher les films recommandes bases sur des criteres semantiques (meme acteur, genre, realisateur)

## Technologies

- **React 18** - Framework frontend
- **Axios** - Requetes HTTP vers l'endpoint SPARQL
- **Apache Jena Fuseki** - Backend SPARQL (endpoint)

## Structure du projet

```
src/
├── components/     # Composants React reutilisables
├── context/        # Context API pour la gestion d'etat
├── hooks/          # Hooks personnalises
├── services/       # Services pour les appels API/SPARQL
├── App.jsx         # Composant principal
├── App.css         # Styles de l'application
└── index.js        # Point d'entree
```

## Installation

```bash
# Cloner le repo
git clone https://github.com/771salameche/film-recommendation-frontend.git

# Installer les dependances
cd film-recommendation-frontend
npm install

# Lancer l'application
npm start
```

L'application sera accessible sur `http://localhost:3000`

## Configuration

Assurez-vous que le serveur Fuseki est lance sur `http://localhost:3030` avec le dataset `films`.

## Auteur

Zakaria - Frontend Development

## Projet

Projet academique - Systeme Semantique de Recommandation de Films (CI3)
