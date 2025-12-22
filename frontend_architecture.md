# Architecture Frontend - Système de Recommandation de Films

## Structure des Dossiers

```
frontend/
├── index.html
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── sparql.js
│   └── ui.js
└── assets/
    └── images/
```

---

## 1. Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                      INTERFACE WEB                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Header    │  │  Recherche  │  │   Zone Résultats    │ │
│  │   (Logo)    │  │   (Input)   │  │   (Films/Recos)     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Liste des Films                         │   │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐           │   │
│  │  │ Film1 │ │ Film2 │ │ Film3 │ │ Film4 │  ...      │   │
│  │  └───────┘ └───────┘ └───────┘ └───────┘           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Recommandations                            │   │
│  │  "Films similaires à [Film sélectionné]"            │   │
│  │  ┌───────┐ ┌───────┐ ┌───────┐                      │   │
│  │  │ Reco1 │ │ Reco2 │ │ Reco3 │                      │   │
│  │  └───────┘ └───────┘ └───────┘                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  HTTP Request   │
                   │  (fetch/axios)  │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  Apache Fuseki  │
                   │  SPARQL Endpoint│
                   │ localhost:3030  │
                   └─────────────────┘
```

---

## 2. Composants de l'Interface

### 2.1 Header
```html
<header>
    <h1>Recommandation de Films</h1>
    <p>Système basé sur le Web Sémantique</p>
</header>
```

### 2.2 Zone de Recherche
```html
<section class="search-section">
    <input type="text" id="searchInput" placeholder="Rechercher un film...">
    <button id="searchBtn">Rechercher</button>
</section>
```

### 2.3 Liste des Films
```html
<section class="films-section">
    <h2>Tous les Films</h2>
    <div id="filmsList" class="films-grid">
        <!-- Films chargés dynamiquement -->
    </div>
</section>
```

### 2.4 Zone de Recommandations
```html
<section class="recommendations-section">
    <h2>Films Recommandés</h2>
    <p id="recoTitle">Sélectionnez un film pour voir les recommandations</p>
    <div id="recommendationsList" class="films-grid">
        <!-- Recommandations chargées dynamiquement -->
    </div>
</section>
```

---

## 3. Flux de Données

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Utilisateur │     │   Frontend   │     │    Fuseki    │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │  1. Charge page    │                    │
       │───────────────────>│                    │
       │                    │  2. GET films      │
       │                    │───────────────────>│
       │                    │  3. Résultats      │
       │                    │<───────────────────│
       │  4. Affiche films  │                    │
       │<───────────────────│                    │
       │                    │                    │
       │  5. Clique film    │                    │
       │───────────────────>│                    │
       │                    │  6. GET recos      │
       │                    │───────────────────>│
       │                    │  7. Résultats      │
       │                    │<───────────────────│
       │  8. Affiche recos  │                    │
       │<───────────────────│                    │
       │                    │                    │
```

---

## 4. Modules JavaScript

### 4.1 sparql.js - Communication avec Fuseki

```javascript
// Configuration
const FUSEKI_ENDPOINT = 'http://localhost:3030/films/sparql';

// Fonction pour exécuter une requête SPARQL
async function executeSparql(query) {
    const response = await fetch(FUSEKI_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/json'
        },
        body: query
    });
    return await response.json();
}

// Récupérer tous les films
async function getAllFilms() {
    const query = `
        PREFIX ns: <http://example.org/film#>
        SELECT ?film ?titre ?annee ?genre WHERE {
            ?film a ns:Film .
            ?film ns:titre ?titre .
            ?film ns:releaseYear ?annee .
            ?film ns:hasGenre ?genreUri .
            ?genreUri ns:nom ?genre .
        }
        ORDER BY ?titre
    `;
    return await executeSparql(query);
}

// Récupérer les recommandations (même acteur)
async function getRecommendationsByActor(filmUri) {
    const query = `
        PREFIX ns: <http://example.org/film#>
        SELECT DISTINCT ?film ?titre WHERE {
            <${filmUri}> ns:hasActor ?actor .
            ?film ns:hasActor ?actor .
            ?film ns:titre ?titre .
            FILTER(?film != <${filmUri}>)
        }
    `;
    return await executeSparql(query);
}

// Récupérer les recommandations (même genre)
async function getRecommendationsByGenre(filmUri) {
    const query = `
        PREFIX ns: <http://example.org/film#>
        SELECT DISTINCT ?film ?titre WHERE {
            <${filmUri}> ns:hasGenre ?genre .
            ?film ns:hasGenre ?genre .
            ?film ns:titre ?titre .
            FILTER(?film != <${filmUri}>)
        }
    `;
    return await executeSparql(query);
}

// Récupérer les recommandations (même réalisateur)
async function getRecommendationsByDirector(filmUri) {
    const query = `
        PREFIX ns: <http://example.org/film#>
        SELECT DISTINCT ?film ?titre WHERE {
            <${filmUri}> ns:directedBy ?director .
            ?film ns:directedBy ?director .
            ?film ns:titre ?titre .
            FILTER(?film != <${filmUri}>)
        }
    `;
    return await executeSparql(query);
}
```

### 4.2 ui.js - Gestion de l'Interface

```javascript
// Afficher les films dans la grille
function displayFilms(films) {
    const container = document.getElementById('filmsList');
    container.innerHTML = '';

    films.results.bindings.forEach(film => {
        const card = createFilmCard(film);
        container.appendChild(card);
    });
}

// Créer une carte de film
function createFilmCard(film) {
    const card = document.createElement('div');
    card.className = 'film-card';
    card.innerHTML = `
        <h3>${film.titre.value}</h3>
        <p>Année: ${film.annee.value}</p>
        <p>Genre: ${film.genre.value}</p>
        <button onclick="selectFilm('${film.film.value}', '${film.titre.value}')">
            Voir recommandations
        </button>
    `;
    return card;
}

// Afficher les recommandations
function displayRecommendations(recommendations, filmTitle) {
    const container = document.getElementById('recommendationsList');
    const title = document.getElementById('recoTitle');

    title.textContent = `Films similaires à "${filmTitle}"`;
    container.innerHTML = '';

    if (recommendations.results.bindings.length === 0) {
        container.innerHTML = '<p>Aucune recommandation trouvée</p>';
        return;
    }

    recommendations.results.bindings.forEach(reco => {
        const card = document.createElement('div');
        card.className = 'film-card recommendation';
        card.innerHTML = `<h3>${reco.titre.value}</h3>`;
        container.appendChild(card);
    });
}

// Afficher un loader
function showLoader(containerId) {
    document.getElementById(containerId).innerHTML =
        '<div class="loader">Chargement...</div>';
}
```

### 4.3 app.js - Application Principale

```javascript
// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllFilms();
    setupEventListeners();
});

// Charger tous les films
async function loadAllFilms() {
    showLoader('filmsList');
    try {
        const films = await getAllFilms();
        displayFilms(films);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('filmsList').innerHTML =
            '<p class="error">Erreur de connexion à Fuseki</p>';
    }
}

// Sélectionner un film et afficher les recommandations
async function selectFilm(filmUri, filmTitle) {
    showLoader('recommendationsList');

    try {
        // Récupérer les recommandations par acteur
        const recosByActor = await getRecommendationsByActor(filmUri);

        // Optionnel: combiner avec genre et réalisateur
        const recosByGenre = await getRecommendationsByGenre(filmUri);

        // Fusionner et afficher
        const combined = mergeRecommendations(recosByActor, recosByGenre);
        displayRecommendations(combined, filmTitle);

    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fusionner les recommandations (éviter les doublons)
function mergeRecommendations(reco1, reco2) {
    const seen = new Set();
    const merged = { results: { bindings: [] } };

    [...reco1.results.bindings, ...reco2.results.bindings].forEach(r => {
        if (!seen.has(r.film.value)) {
            seen.add(r.film.value);
            merged.results.bindings.push(r);
        }
    });

    return merged;
}

// Configuration des événements
function setupEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', searchFilms);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchFilms();
    });
}

// Recherche de films
async function searchFilms() {
    const searchTerm = document.getElementById('searchInput').value;
    // Implémenter la recherche SPARQL avec FILTER
}
```

---

## 5. Styles CSS

### 5.1 style.css - Styles Principaux

```css
/* Variables */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    --background: #ecf0f1;
    --card-bg: #ffffff;
    --text-color: #2c3e50;
}

/* Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--background);
    color: var(--text-color);
    line-height: 1.6;
}

/* Header */
header {
    background: var(--primary-color);
    color: white;
    padding: 2rem;
    text-align: center;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

/* Sections */
section {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

section h2 {
    margin-bottom: 1rem;
    color: var(--primary-color);
    border-bottom: 2px solid var(--secondary-color);
    padding-bottom: 0.5rem;
}

/* Grille de films */
.films-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

/* Carte de film */
.film-card {
    background: var(--card-bg);
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.film-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.film-card h3 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.film-card p {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
}

.film-card button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.film-card button:hover {
    background: var(--accent-color);
}

/* Recommandations */
.recommendation {
    border-left: 4px solid var(--accent-color);
}

/* Recherche */
.search-section {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
}

.search-section input {
    padding: 0.75rem 1rem;
    width: 300px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.search-section button {
    padding: 0.75rem 1.5rem;
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

/* Loader */
.loader {
    text-align: center;
    padding: 2rem;
    color: #666;
}

/* Erreur */
.error {
    color: var(--accent-color);
    text-align: center;
    padding: 1rem;
}
```

### 5.2 responsive.css - Responsive Design

```css
/* Tablette */
@media (max-width: 768px) {
    header h1 {
        font-size: 1.8rem;
    }

    .films-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .search-section {
        flex-direction: column;
        align-items: center;
    }

    .search-section input {
        width: 100%;
        max-width: 400px;
    }
}

/* Mobile */
@media (max-width: 480px) {
    .films-grid {
        grid-template-columns: 1fr;
    }

    section {
        padding: 0 0.5rem;
    }
}
```

---

## 6. Page HTML Complète

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recommandation de Films - Web Sémantique</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
    <header>
        <h1>Recommandation de Films</h1>
        <p>Propulsé par le Web Sémantique</p>
    </header>

    <main>
        <section class="search-section">
            <input type="text" id="searchInput" placeholder="Rechercher un film...">
            <button id="searchBtn">Rechercher</button>
        </section>

        <section class="films-section">
            <h2>Catalogue des Films</h2>
            <div id="filmsList" class="films-grid">
                <!-- Chargé dynamiquement -->
            </div>
        </section>

        <section class="recommendations-section">
            <h2>Recommandations</h2>
            <p id="recoTitle">Sélectionnez un film pour voir les recommandations</p>
            <div id="recommendationsList" class="films-grid">
                <!-- Chargé dynamiquement -->
            </div>
        </section>
    </main>

    <footer>
        <p>Projet Web Sémantique - Système de Recommandation</p>
    </footer>

    <script src="js/sparql.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

---

## 7. Résumé de l'Architecture

| Composant | Fichier | Rôle |
|-----------|---------|------|
| **HTML** | `index.html` | Structure de la page |
| **CSS** | `style.css` | Styles visuels |
| **CSS** | `responsive.css` | Adaptation mobile |
| **JS** | `sparql.js` | Requêtes SPARQL vers Fuseki |
| **JS** | `ui.js` | Manipulation du DOM |
| **JS** | `app.js` | Logique principale |

---

## 8. Points Importants

1. **CORS** : Fuseki doit autoriser les requêtes cross-origin
2. **Endpoint** : Vérifier que l'URL Fuseki est correcte (`localhost:3030/films/sparql`)
3. **Préfixes** : Les URI dans les requêtes SPARQL doivent correspondre à l'ontologie
4. **Gestion d'erreurs** : Toujours prévoir les cas où Fuseki n'est pas accessible
