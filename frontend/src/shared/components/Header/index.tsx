import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Time Tracker</h1>
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Calendar
          </Link>
          <Link 
            to="/stats" 
            className={`nav-link ${location.pathname === '/stats' ? 'active' : ''}`}
          >
            Stats
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
