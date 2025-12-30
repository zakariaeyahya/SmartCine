import React, { useState, useEffect } from 'react';
import { getMoviePoster, OMDB_API_KEY_CONFIGURED } from '../../services/omdbService';
import './FilmCard.css';

const FilmCard = ({ film, onSelect, isSelected, isRecommendation }) => {
  const [posterUrl, setPosterUrl] = useState(null);
  const [posterLoading, setPosterLoading] = useState(true);

  // Générer une couleur basée sur le titre du film
  const getColorFromTitle = (title) => {
    const colors = ['#e50914', '#f5c518', '#00d4aa', '#ff6b35', '#6b5b95', '#45b7d1', '#96ceb4', '#a855f7', '#ff4d6d', '#7209b7'];
    const hash = (title || 'Film').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Récupérer le poster via OMDB
  useEffect(() => {
    const fetchPoster = async () => {
      if (!OMDB_API_KEY_CONFIGURED) {
        setPosterLoading(false);
        return;
      }

      const title = film.titre?.value;
      const year = film.annee?.value;

      if (title) {
        const poster = await getMoviePoster(title, year);
        setPosterUrl(poster);
      }
      setPosterLoading(false);
    };

    fetchPoster();
  }, [film.titre?.value, film.annee?.value]);

  const handleClick = () => {
    if (onSelect) {
      onSelect(film);
    }
  };

  const getGenreColor = (genre) => {
    const colors = {
      'Action': '#e50914',
      'Adventure': '#f5c518',
      'Animation': '#00d4aa',
      'Comedy': '#ff6b35',
      'Crime': '#6b5b95',
      'Documentary': '#45b7d1',
      'Drama': '#96ceb4',
      'Family': '#ff85a2',
      'Fantasy': '#a855f7',
      'History': '#d4a574',
      'Horror': '#1a1a2e',
      'Music': '#ff006e',
      'Mystery': '#3a0ca3',
      'Romance': '#ff4d6d',
      'Science Fiction': '#00f5d4',
      'Thriller': '#7209b7',
      'War': '#495057',
      'Western': '#c9a227'
    };
    return colors[genre] || '#e50914';
  };

  const year = film.annee?.value;
  const randomRating = year ? (5 + (parseInt(year) % 5) * 0.8 + Math.random() * 0.5).toFixed(1) : null;

  return (
    <div
      className={`film-card ${isSelected ? 'selected' : ''} ${isRecommendation ? 'recommendation' : ''}`}
      onClick={handleClick}
    >
      <div className="card-poster" style={{ background: posterUrl ? '#1a1a2e' : `linear-gradient(135deg, ${getColorFromTitle(film.titre?.value)} 0%, #1a1a2e 100%)` }}>
        <div className="poster-gradient"></div>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={film.titre?.value || 'Film'}
            className="poster-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="poster-content">
            <span className="poster-initial">
              {(film.titre?.value || 'F')[0].toUpperCase()}
            </span>
          </div>
        )}
        {randomRating && (
          <div className="card-rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>{randomRating}</span>
          </div>
        )}
        {isSelected && (
          <div className="selected-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{film.titre?.value || 'Sans titre'}</h3>

        <div className="card-meta">
          {year && (
            <span className="meta-year">{year}</span>
          )}
          {film.duree?.value && (
            <span className="meta-duration">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {film.duree.value} min
            </span>
          )}
        </div>

        {film.genre?.value && (
          <div className="card-genres">
            <span
              className="genre-tag"
              style={{ '--genre-color': getGenreColor(film.genre.value) }}
            >
              {film.genre.value}
            </span>
          </div>
        )}

        {film.realisateur?.value && (
          <p className="card-director">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m22 8-6 4 6 4V8Z"></path>
              <rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect>
            </svg>
            {film.realisateur.value}
          </p>
        )}

        {!isRecommendation && (
          <button className="card-btn" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
            <span>Recommandations</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilmCard;
