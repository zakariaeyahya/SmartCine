import React from 'react';
import { FilmProvider } from './context/FilmContext';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import FilmList from './components/FilmList/FilmList';
import Recommendations from './components/Recommendations/Recommendations';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <FilmProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <SearchBar />
          <div className="content-grid">
            <FilmList />
            <Recommendations />
          </div>
        </main>
        <Footer />
      </div>
    </FilmProvider>
  );
}

export default App;
