import React, { createContext, useState, useContext } from 'react';

const FilmContext = createContext();

export const FilmProvider = ({ children }) => {
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const value = {
    films,
    setFilms,
    selectedFilm,
    setSelectedFilm,
    recommendations,
    setRecommendations,
    loading,
    setLoading,
    error,
    setError,
    searchTerm,
    setSearchTerm
  };

  return (
    <FilmContext.Provider value={value}>
      {children}
    </FilmContext.Provider>
  );
};

export const useFilmContext = () => {
  const context = useContext(FilmContext);
  if (!context) {
    throw new Error('useFilmContext must be used within FilmProvider');
  }
  return context;
};
