import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout';
import CalendarPage from './domains/timetrack/components/CalendarPage';
import StatsPage from './domains/timetrack/components/StatsPage';
import CategoryManagementPage from './domains/timetrack/components/CategoryManagementPage';
import TagManagementPage from './domains/timetrack/components/TagManagementPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/categories" element={<CategoryManagementPage />} />
          <Route path="/tags" element={<TagManagementPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;