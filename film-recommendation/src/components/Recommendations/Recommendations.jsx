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
      <section className="recommendations-section">
        <h2 className="section-title">Recommandations</h2>
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <p>Sélectionnez un film pour voir les recommandations</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recommendations-section">
      <h2 className="section-title">Recommandations</h2>

      <div className="selected-film-info">
        <div className="selected-header">
          <div>
            <p className="selected-label">Films similaires à</p>
            <h3 className="selected-title">{selectedFilm.titre?.value}</h3>
          </div>
          <button className="clear-btn" onClick={clearRecommendations}>
            ✕
          </button>
        </div>
      </div>

      {loading ? (
        <Loader message="Recherche de recommandations..." />
      ) : (
        <div className="recommendations-list">
          {recommendations.length > 0 ? (
            <>
              <p className="reco-count">{recommendations.length} film(s) trouvé(s)</p>
              {recommendations.map((film, index) => (
                <FilmCard
                  key={film.uri?.value || index}
                  film={film}
                  isRecommendation={true}
                />
              ))}
            </>
          ) : (
            <div className="no-recommendations">
              <div className="no-reco-icon">😕</div>
              <p>Aucune recommandation trouvée pour ce film</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Recommendations;
