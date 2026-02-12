import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import JITPage from './pages/JITPage';
import DashboardLayout from './components/layout/DashboardLayout';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route path="events" element={<EventsPage />} />
          <Route path="jit" element={<JITPage />} />
          {/* Default redirect for /app */}
          <Route index element={<EventsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;