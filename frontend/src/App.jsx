import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Mattresses from './pages/Mattresses';
import MattressDetail from './pages/MattressDetail';
import Sofas from './pages/Sofas';
import SofaDetail from './pages/SofaDetail';
import Manufacturing from './pages/Manufacturing';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Warranty from './pages/Warranty';
import Stores from './pages/Stores';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

import SleeporaLogo from './components/SleeporaLogo';
import { useState, useEffect } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeStage, setFadeStage] = useState('fade-in'); // 'fade-in' | 'visible' | 'fade-out'

  useEffect(() => {
    // Fade-in timing
    const timerVisible = setTimeout(() => {
      setFadeStage('visible');
    }, 100); // Trigger fade-in immediately on mount

    // Fade-out timing (1200ms visible time)
    const timerFadeOut = setTimeout(() => {
      setFadeStage('fade-out');
    }, 1300);

    // Complete loading after fade-out transition (500ms transition duration)
    const timerDone = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => {
      clearTimeout(timerVisible);
      clearTimeout(timerFadeOut);
      clearTimeout(timerDone);
    };
  }, []);

  return (
    <AuthProvider>
      {loading && (
        <div 
          className={`fixed inset-0 z-[99999] bg-[#FFFDFC] flex flex-col items-center justify-center select-none transition-opacity duration-500 ease-in-out ${
            fadeStage === 'fade-in' ? 'opacity-0' :
            fadeStage === 'visible' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <SleeporaLogo variant="dark" vertical={true} className="mb-2" />
            <span className="text-[10px] font-sans font-bold tracking-[4px] text-[#8B6844] uppercase animate-pulse mt-4">
              Loading...
            </span>
          </div>
        </div>
      )}
      <Router>
        <ScrollToTop />
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mattresses" element={<Mattresses />} />
            <Route path="/products/mattresses" element={<Mattresses />} />
            <Route path="/mattresses/:slug" element={<MattressDetail />} />
            <Route path="/sofas" element={<Sofas />} />
            <Route path="/products/sofas" element={<Sofas />} />
            <Route path="/sofas/:slug" element={<SofaDetail />} />
            <Route path="/factory" element={<Manufacturing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
