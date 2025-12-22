import { useEffect, useCallback } from 'react';
import { getAllFilms, searchFilms } from '../services/sparqlService';
import { useFilmContext } from '../context/FilmContext';

export const useFilms = () => {
  const {
    films,
    setFilms,
    setLoading,
    setError,
    searchTerm
  } = useFilmContext();

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = searchTerm
        ? await searchFilms(searchTerm)
        : await getAllFilms();
      setFilms(data);
    } catch (err) {
      console.error('Erreur chargement films:', err);
      setError('Erreur lors du chargement des films. Vérifiez que Fuseki est démarré.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, setFilms, setLoading, setError]);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  return { films, refetch: fetchFilms };
};
