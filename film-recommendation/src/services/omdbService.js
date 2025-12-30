// Service OMDB pour récupérer les posters de films
// Clé API gratuite - créer la vôtre sur http://www.omdbapi.com/apikey.aspx
const OMDB_API_KEY = '3d9bd071';

// Cache pour éviter les requêtes répétées
const posterCache = new Map();

export const getMoviePoster = async (title, year) => {
  const cacheKey = `${title}-${year}`;

  // Vérifier le cache
  if (posterCache.has(cacheKey)) {
    return posterCache.get(cacheKey);
  }

  try {
    const encodedTitle = encodeURIComponent(title);
    const url = year
      ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodedTitle}&y=${year}`
      : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodedTitle}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
      posterCache.set(cacheKey, data.Poster);
      return data.Poster;
    }

    posterCache.set(cacheKey, null);
    return null;
  } catch (error) {
    console.error('Erreur OMDB:', error);
    return null;
  }
};

export const OMDB_API_KEY_CONFIGURED = OMDB_API_KEY !== 'YOUR_API_KEY_HERE';
