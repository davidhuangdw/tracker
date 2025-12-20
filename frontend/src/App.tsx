import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from '@/app/components/Layout.tsx';
import {ConfirmDialogProvider} from '@/lib/contexts/ConfirmDialogContext.tsx';
import {ToastProvider} from "@/lib/contexts/ToastContext.tsx";
import {Calendar, ConfigPage, StatsPage} from "@/app/components/pages";
import './App.css';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <ConfirmDialogProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Calendar/>}/>
              <Route path="/stats" element={<StatsPage/>}/>
              <Route path="/config" element={<ConfigPage />}/>
            </Routes>
          </Layout>
        </Router>
      </ConfirmDialogProvider>
    </ToastProvider>
  );
};

export default App;