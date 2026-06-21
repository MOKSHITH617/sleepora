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
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
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
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
