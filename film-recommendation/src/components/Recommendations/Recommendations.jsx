import React from 'react';
import { useFilmContext } from '../../context/FilmContext';
import { useRecommendations } from '../../hooks/useRecommendations';
import FilmCard from '../FilmCard/FilmCard';
import Loader from '../Loader/Loader';
import './Recommendations.css';

const Recommendations = () => {
  const { recommendations, selectedFilm, loading } = useFilmContext();
  const { clearRecommendations } = useRecommendations();

  if (!selectedFilm) {
    return (
      <aside className="recommendations-panel">
        <div className="panel-header">
          <h2 className="panel-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Recommandations
          </h2>
        </div>

        <div className="empty-panel">
          <div className="empty-illustration">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <h3 className="empty-title">Découvrez des films similaires</h3>
          <p className="empty-text">
            Sélectionnez un film du catalogue pour obtenir des recommandations basées sur :
          </p>
          <ul className="criteria-list">
            <li>
              <span className="criteria-icon actor"></span>
              Mêmes acteurs
            </li>
            <li>
              <span className="criteria-icon genre"></span>
              Même genre
            </li>
            <li>
              <span className="criteria-icon director"></span>
              Même réalisateur
            </li>
          </ul>
        </div>
      </aside>
    );
  }

  return (
    <aside className="recommendations-panel active">
      <div className="panel-header">
        <h2 className="panel-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Recommandations
        </h2>
      </div>

      <div className="selected-film-card">
        <div className="selected-badge-top">Film sélectionné</div>
        <div className="selected-content">
          <h3 className="selected-title">{selectedFilm.titre?.value}</h3>
          <div className="selected-meta">
            {selectedFilm.annee?.value && (
              <span className="selected-year">{selectedFilm.annee.value}</span>
            )}
            {selectedFilm.genre?.value && (
              <span className="selected-genre">{selectedFilm.genre.value}</span>
            )}
          </div>
        </div>
        <button className="close-btn" onClick={clearRecommendations} aria-label="Fermer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader message="Recherche SPARQL en cours..." />
        </div>
      ) : (
        <div className="recommendations-content">
          {recommendations.length > 0 ? (
            <>
              <div className="results-header">
                <span className="results-count">
                  <strong>{recommendations.length}</strong> film{recommendations.length > 1 ? 's' : ''} similaire{recommendations.length > 1 ? 's' : ''}
                </span>
                <span className="powered-by">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                  SPARQL
                </span>
              </div>
              <div className="recommendations-list">
                {recommendations.map((film, index) => (
                  <div
                    key={film.uri?.value || index}
                    className="recommendation-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <FilmCard
                      film={film}
                      isRecommendation={true}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
              <h4>Aucune recommandation</h4>
              <p>Ce film n'a pas de correspondances dans notre base de données sémantique</p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Recommendations;
