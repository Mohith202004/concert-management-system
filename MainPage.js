// src/components/MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css'; // Import custom CSS for MainPage

const MainPage = () => {
  return (
    <div className="main-page">
      <header className="header">
        <h1>Concert Management System</h1>
        <p>Manage your concerts, venues, artists, and more.</p>
      </header>
      <div className="content">
        <div className="card">
          <h2>Welcome to the Concert Management System</h2>
          <p>Everything You Need to Manage Concerts in One Place.</p>
          {/* Single button linking to the content page */}
          <Link to="/content" className="btn">Manage Concerts</Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
