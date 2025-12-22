import React from 'react';
import './FilmCard.css';

const FilmCard = ({ film, onSelect, isSelected, isRecommendation }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(film);
    }
  };

  return (
    <div
      className={`film-card ${isSelected ? 'selected' : ''} ${isRecommendation ? 'recommendation' : ''}`}
      onClick={handleClick}
    >
      <div className="film-card-content">
        <h3 className="film-title">{film.titre?.value || 'Sans titre'}</h3>

        <div className="film-info">
          {film.annee?.value && (
            <span className="film-year">{film.annee.value}</span>
          )}
          {film.genre?.value && (
            <span className="film-genre">{film.genre.value}</span>
          )}
        </div>

        {film.realisateur?.value && (
          <p className="film-director">
            Réalisé par {film.realisateur.value}
          </p>
        )}

        {film.duree?.value && (
          <p className="film-duration">
            Durée: {film.duree.value} min
          </p>
        )}

        {!isRecommendation && (
          <button className="film-btn" onClick={handleClick}>
            Voir recommandations
          </button>
        )}
      </div>
    </div>
  );
};

export default FilmCard;
