import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <Header />
      <div className="layout-content">
        <nav className="sidebar">
          <ul className="nav-menu">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">Calendar</Link>
            </li>
            <li className={location.pathname === '/stats' ? 'active' : ''}>
              <Link to="/stats">Statistics</Link>
            </li>
            <li className={location.pathname === '/categories' ? 'active' : ''}>
              <Link to="/categories">Category Config</Link>
            </li>
            <li className={location.pathname === '/tags' ? 'active' : ''}>
              <Link to="/tags">Tag Config</Link>
            </li>
          </ul>
        </nav>
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;