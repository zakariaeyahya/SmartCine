import React from 'react';
import './Loader.css';

const Loader = ({ message = 'Chargement...' }) => {
  return (
    <div className="loader-container">
      <div className="loader-animation">
        <div className="loader-ring">
          <div className="ring-segment"></div>
          <div className="ring-segment"></div>
          <div className="ring-segment"></div>
        </div>
        <div className="loader-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
        </div>
      </div>
      <p className="loader-message">{message}</p>
      <div className="loader-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Loader;
