import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/app/components/Layout.tsx';
import './App.css';
import {Calendar, CategoryManagement, Stats, TagManagement} from "@/app/components/pages";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/tags" element={<TagManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;