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
        <div className="section-header">
          <h2 className="section-title">Catalogue des Films</h2>
        </div>
        <Loader message="Chargement des films depuis Fuseki..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="film-list-section">
        <div className="section-header">
          <h2 className="section-title">Catalogue des Films</h2>
        </div>
        <div className="error-container">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="error-title">Connexion impossible</h3>
          <p className="error-text">{error}</p>
          <div className="error-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Vérifiez que Apache Jena Fuseki est démarré sur <code>localhost:3030</code></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="film-list-section">
      <div className="section-header">
        <div className="title-group">
          <h2 className="section-title">Catalogue des Films</h2>
          <span className="film-count">
            <span className="count-number">{films.length}</span>
            <span className="count-label">films</span>
          </span>
        </div>
        <div className="section-meta">
          <span className="meta-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            RDF Knowledge Graph
          </span>
        </div>
      </div>

      {films.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
          </div>
          <h3>Aucun film trouvé</h3>
          <p>Essayez une autre recherche ou vérifiez la connexion Fuseki</p>
        </div>
      ) : (
        <div className="film-grid">
          {films.map((film, index) => (
            <div
              key={film.uri?.value || index}
              className="film-grid-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <FilmCard
                film={film}
                onSelect={fetchRecommendations}
                isSelected={selectedFilm?.uri?.value === film.uri?.value}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FilmList;
