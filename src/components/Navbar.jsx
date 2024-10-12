// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Create a CSS file for styling the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Sentiment Analysis</h1>
      <ul>
        <li>
          <Link to="/gauge">Sentimental Overview</Link>
        </li>
        <li>
          <Link to="/predict">Predict Sentiment</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
