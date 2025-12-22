import axios from 'axios';

// Configuration - Modifier selon votre installation Fuseki
const FUSEKI_ENDPOINT = 'http://localhost:3030/films/sparql';

// Client axios pour SPARQL
const sparqlClient = axios.create({
  baseURL: FUSEKI_ENDPOINT,
  headers: {
    'Content-Type': 'application/sparql-query',
    'Accept': 'application/json'
  }
});

// Exécuter une requête SPARQL
export const executeSparql = async (query) => {
  try {
    const response = await sparqlClient.post('', query);
    return response.data.results.bindings;
  } catch (error) {
    console.error('Erreur SPARQL:', error);
    throw error;
  }
};

// Récupérer tous les films
export const getAllFilms = async () => {
  const query = `
    PREFIX ns: <http://example.org/film#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?uri ?titre ?annee ?duree ?genre ?realisateur WHERE {
      ?uri rdf:type ns:Film .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      OPTIONAL { ?uri ns:duration ?duree }
      OPTIONAL {
        ?uri ns:hasGenre ?genreUri .
        ?genreUri ns:nom ?genre .
      }
      OPTIONAL {
        ?uri ns:directedBy ?dirUri .
        ?dirUri ns:nom ?realisateur .
      }
    }
    ORDER BY ?titre
  `;
  return await executeSparql(query);
};

// Récupérer les détails d'un film
export const getFilmDetails = async (filmUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT ?titre ?annee ?duree ?genre ?realisateur ?acteur WHERE {
      <${filmUri}> ns:titre ?titre .
      OPTIONAL { <${filmUri}> ns:releaseYear ?annee }
      OPTIONAL { <${filmUri}> ns:duration ?duree }
      OPTIONAL {
        <${filmUri}> ns:hasGenre ?genreUri .
        ?genreUri ns:nom ?genre .
      }
      OPTIONAL {
        <${filmUri}> ns:directedBy ?dirUri .
        ?dirUri ns:nom ?realisateur .
      }
      OPTIONAL {
        <${filmUri}> ns:hasActor ?actorUri .
        ?actorUri ns:nom ?acteur .
      }
    }
  `;
  return await executeSparql(query);
};

// Recommandations par même acteur
export const getRecommendationsByActor = async (filmUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT DISTINCT ?uri ?titre ?annee ?genre WHERE {
      <${filmUri}> ns:hasActor ?actor .
      ?uri ns:hasActor ?actor .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      OPTIONAL {
        ?uri ns:hasGenre ?genreUri .
        ?genreUri ns:nom ?genre .
      }
      FILTER(?uri != <${filmUri}>)
    }
  `;
  return await executeSparql(query);
};

// Recommandations par même genre
export const getRecommendationsByGenre = async (filmUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT DISTINCT ?uri ?titre ?annee WHERE {
      <${filmUri}> ns:hasGenre ?genre .
      ?uri ns:hasGenre ?genre .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      FILTER(?uri != <${filmUri}>)
    }
  `;
  return await executeSparql(query);
};

// Recommandations par même réalisateur
export const getRecommendationsByDirector = async (filmUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT DISTINCT ?uri ?titre ?annee WHERE {
      <${filmUri}> ns:directedBy ?director .
      ?uri ns:directedBy ?director .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      FILTER(?uri != <${filmUri}>)
    }
  `;
  return await executeSparql(query);
};

// Rechercher des films par titre
export const searchFilms = async (searchTerm) => {
  const query = `
    PREFIX ns: <http://example.org/film#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?uri ?titre ?annee ?genre ?realisateur WHERE {
      ?uri rdf:type ns:Film .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      OPTIONAL {
        ?uri ns:hasGenre ?genreUri .
        ?genreUri ns:nom ?genre .
      }
      OPTIONAL {
        ?uri ns:directedBy ?dirUri .
        ?dirUri ns:nom ?realisateur .
      }
      FILTER(CONTAINS(LCASE(?titre), LCASE("${searchTerm}")))
    }
    ORDER BY ?titre
  `;
  return await executeSparql(query);
};

// Récupérer tous les genres
export const getAllGenres = async () => {
  const query = `
    PREFIX ns: <http://example.org/film#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT DISTINCT ?uri ?nom WHERE {
      ?uri rdf:type ns:Genre .
      ?uri ns:nom ?nom .
    }
    ORDER BY ?nom
  `;
  return await executeSparql(query);
};

// Récupérer les films par genre
export const getFilmsByGenre = async (genreUri) => {
  const query = `
    PREFIX ns: <http://example.org/film#>

    SELECT ?uri ?titre ?annee ?realisateur WHERE {
      ?uri ns:hasGenre <${genreUri}> .
      ?uri ns:titre ?titre .
      OPTIONAL { ?uri ns:releaseYear ?annee }
      OPTIONAL {
        ?uri ns:directedBy ?dirUri .
        ?dirUri ns:nom ?realisateur .
      }
    }
    ORDER BY ?titre
  `;
  return await executeSparql(query);
};
