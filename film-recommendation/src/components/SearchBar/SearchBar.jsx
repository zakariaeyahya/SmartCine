import React, { useState } from 'react';
import { useFilmContext } from '../../context/FilmContext';
import './SearchBar.css';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const { setSearchTerm } = useFilmContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(input);
  };

  const handleClear = () => {
    setInput('');
    setSearchTerm('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Rechercher un film..."
        className="search-input"
      />
      <button type="submit" className="search-btn">
        Rechercher
      </button>
      {input && (
        <button type="button" className="clear-btn" onClick={handleClear}>
          Effacer
        </button>
      )}
    </form>
  );
};

export default SearchBar;
