import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './index.css'; 

// Import Halaman
import LandingPage from './pages/LandingPage'; // 1. Tambahkan Import
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pemasukan from './pages/Pemasukan'; 
import Kategori from './pages/Kategori'; 
import Pengeluaran from './pages/Pengeluaran'; 

function App() {
  return ( 
    <Router>
      <Routes>
        {/* 2. Ganti dari Redirect ke LandingPage */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/pendapatan" element={<Pemasukan />} />
        <Route path="/pengeluaran" element={<Pengeluaran />} />
        <Route path="/kategori" element={<Kategori />} /> 
        <Route path="/pemasukan" element={<Pemasukan />} />   {/* WAJIB ADA */}
        <Route path="/pengeluaran" element={<Pengeluaran />} /> {/* WAJIB ADA */}
      </Routes>
    </Router>
  );
}

export default App;