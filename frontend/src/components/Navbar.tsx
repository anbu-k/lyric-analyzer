import React from 'react';
import '../css/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🎧 LyricIQ</div>
      <div className="navbar-links">
        <a href="#">Home</a>
        {/* <a href="https://github.com/anbu-k" target="_blank" rel="noopener noreferrer">
          GitHub
        </a> */}
      </div>
    </nav>
  );
};

export default Navbar;
