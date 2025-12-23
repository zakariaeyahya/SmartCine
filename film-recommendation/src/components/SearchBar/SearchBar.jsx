import React, { useState, useRef, useEffect } from 'react';
import { useFilmContext } from '../../context/FilmContext';
import './SearchBar.css';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { setSearchTerm, films } = useFilmContext();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(input);
  };

  const handleClear = () => {
    setInput('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input, setSearchTerm]);

  return (
    <div className="search-section">
      <form className={`search-bar ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
        <div className="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Rechercher un film par titre, genre, acteur..."
          className="search-input"
        />

        {input && (
          <button type="button" className="clear-btn" onClick={handleClear}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        )}

        <button type="submit" className="search-btn">
          <span className="btn-text">Rechercher</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </form>

      <div className="search-hints">
        <span className="hint-item">
          <kbd>Ctrl</kbd> + <kbd>K</kbd> pour rechercher
        </span>
        <span className="hint-divider">|</span>
        <span className="hint-count">{films.length} films disponibles</span>
      </div>
    </div>
  );
};

export default SearchBar;
