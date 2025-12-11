import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
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
              <Link to="/">日历</Link>
            </li>
            <li className={location.pathname === '/stats' ? 'active' : ''}>
              <Link to="/stats">统计</Link>
            </li>
            <li className={location.pathname === '/categories' ? 'active' : ''}>
              <Link to="/categories">分类管理</Link>
            </li>
            <li className={location.pathname === '/tags' ? 'active' : ''}>
              <Link to="/tags">标签管理</Link>
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