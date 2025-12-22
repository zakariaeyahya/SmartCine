import { useCallback } from 'react';
import {
  getRecommendationsByActor,
  getRecommendationsByGenre,
  getRecommendationsByDirector
} from '../services/sparqlService';
import { useFilmContext } from '../context/FilmContext';

export const useRecommendations = () => {
  const {
    recommendations,
    setRecommendations,
    setSelectedFilm,
    setLoading
  } = useFilmContext();

  const fetchRecommendations = useCallback(async (film) => {
    setLoading(true);
    setSelectedFilm(film);

    try {
      // Récupérer les recommandations de toutes les sources en parallèle
      const [byActor, byGenre, byDirector] = await Promise.all([
        getRecommendationsByActor(film.uri.value).catch(() => []),
        getRecommendationsByGenre(film.uri.value).catch(() => []),
        getRecommendationsByDirector(film.uri.value).catch(() => [])
      ]);

      // Fusionner et dédupliquer les résultats
      const merged = mergeRecommendations(byActor, byGenre, byDirector);
      setRecommendations(merged);
    } catch (err) {
      console.error('Erreur recommandations:', err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [setRecommendations, setSelectedFilm, setLoading]);

  const clearRecommendations = useCallback(() => {
    setSelectedFilm(null);
    setRecommendations([]);
  }, [setSelectedFilm, setRecommendations]);

  return {
    recommendations,
    fetchRecommendations,
    clearRecommendations
  };
};

// Fusionner les recommandations sans doublons
const mergeRecommendations = (...arrays) => {
  const seen = new Set();
  const merged = [];

  arrays.flat().forEach(item => {
    if (item && item.uri && !seen.has(item.uri.value)) {
      seen.add(item.uri.value);
      merged.push(item);
    }
  });

  return merged;
};
