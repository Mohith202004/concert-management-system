// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Ensure this path is correct

import MainPage from './components/MainPage';
import ContentPage from './components/ContentPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Route for MainPage */}
          <Route path="/" element={<MainPage />} />
          {/* Route for ContentPage */}
          <Route path="/content" element={<ContentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
