import React from 'react';
import { useFilms } from '../../hooks/useFilms';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useFilmContext } from '../../context/FilmContext';
import FilmCard from '../FilmCard/FilmCard';
import Loader from '../Loader/Loader';
import './FilmList.css';

const FilmList = () => {
  const { films } = useFilms();
  const { fetchRecommendations } = useRecommendations();
  const { loading, error, selectedFilm } = useFilmContext();

  if (loading && films.length === 0) {
    return (
      <section className="film-list-section">
        <h2 className="section-title">Catalogue des Films</h2>
        <Loader message="Chargement des films..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="film-list-section">
        <h2 className="section-title">Catalogue des Films</h2>
        <div className="error-message">
          <p className="error-text">{error}</p>
          <p className="error-hint">Vérifiez que Fuseki est démarré sur localhost:3030</p>
        </div>
      </section>
    );
  }

  return (
    <section className="film-list-section">
      <h2 className="section-title">
        Catalogue des Films
        <span className="film-count">({films.length} films)</span>
      </h2>

      {films.length === 0 ? (
        <p className="no-results">Aucun film trouvé</p>
      ) : (
        <div className="film-grid">
          {films.map((film, index) => (
            <FilmCard
              key={film.uri?.value || index}
              film={film}
              onSelect={fetchRecommendations}
              isSelected={selectedFilm?.uri?.value === film.uri?.value}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FilmList;
