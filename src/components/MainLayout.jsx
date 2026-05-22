import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api'; 
import { MdDashboard, MdLogout } from 'react-icons/md';
import { FaChartLine } from 'react-icons/fa';
// 1. Tambahkan BsTags di sini
import { BsGraphUpArrow, BsFillBagCheckFill, BsTags } from 'react-icons/bs';

const MainLayout = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (window.confirm("Yakin ingin logout?")) {
      try {
        await api.delete('/authentications');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } catch (err) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getNavLinkClass = (path) => {
    const baseClass = "nav-link d-flex align-items-center ";
    return location.pathname === path 
      ? baseClass + "active shadow-sm" 
      : baseClass + "text-white bg-transparent";
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#F0F2F5', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <div className="sidebar d-flex flex-column flex-shrink-0 p-3 shadow-sm text-white" 
           style={{ width: '280px', backgroundColor: '#001E3C', height: '100vh', position: 'fixed', zIndex: 1000 }}>
        
        <h2 className="fw-bold py-4 text-center border-bottom border-secondary mb-4">SAFEIN</h2>
        
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-4 px-2">
            <Link to="/dashboard" className={getNavLinkClass('/dashboard')} 
               style={location.pathname === '/dashboard' ? { backgroundColor: '#3399FF', borderRadius: '8px' } : {}}>
              <MdDashboard className="me-3" size={20} />
              <span className="fw-semibold">Dashboard</span>
            </Link>
          </li>
          
          <li className="nav-item mb-1 px-2">
            <Link to="/pendapatan" className={getNavLinkClass('/pendapatan')}>
              <BsGraphUpArrow className="me-3 text-success" size={20} /> Pendapatan
            </Link>
          </li>
          <li className="nav-item mb-4 px-2">
            <Link to="/pengeluaran" className={getNavLinkClass('/pengeluaran')}>
              <BsFillBagCheckFill className="me-3 text-danger" size={20} /> Pengeluaran
            </Link>
          </li>
          
          <p className="text-uppercase small fw-bold text-secondary px-3 mb-2" style={{ fontSize: '0.9rem' }}>Data Master</p>
          
          {/* 2. Tambahkan Menu Kategori di sini */}
          <li className="nav-item mb-1 px-2">
            <Link to="/kategori" className={getNavLinkClass('/kategori')}
               style={location.pathname === '/kategori' ? { backgroundColor: '#3399FF', borderRadius: '8px' } : {}}>
              <BsTags className="me-3 text-warning" size={20} /> Kategori
            </Link>
          </li>


          <p className="text-uppercase small fw-bold text-secondary px-3 mb-2" style={{ fontSize: '0.9rem' }}>Analisis</p>
          <li className="nav-item mb-2 px-2">
            <Link to="/prediksi" className={getNavLinkClass('/prediksi')}>
              <FaChartLine className="me-3 text-primary" size={20} /> Prediksi
            </Link>
          </li>
        </ul>

        <div className="border-top border-secondary pt-3 px-2">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100 fw-bold small text-uppercase">
            <MdLogout className="me-2" /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-fill" style={{ marginLeft: '280px', padding: '30px' }}>
        <div className="d-flex justify-content-between align-items-center shadow-sm mb-4 px-4 py-2" 
             style={{ backgroundColor: '#001E3C', borderRadius: '10px', color: 'white' }}>
          <span>
            Selamat Datang di website SAFEIN <span className="fw-semibold text-light">{user?.name}</span> !
          </span>
          <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center fw-bold border border-2 border-white shadow-sm" 
               style={{ width: '40px', height: '40px', fontSize: '0.85rem' }}>
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "??"}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;