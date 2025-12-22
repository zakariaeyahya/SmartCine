import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          <span className="icon">🎬</span>
          Film Recommender
        </h1>
        <p className="header-subtitle">
          Powered by Semantic Web Technology
        </p>
      </div>
    </header>
  );
};

export default Header;
