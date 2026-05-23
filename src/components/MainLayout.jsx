import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api'; 
import { MdDashboard, MdLogout, MdMenu, MdClose } from 'react-icons/md';
import { FaChartLine } from 'react-icons/fa';
import { BsGraphUpArrow, BsFillBagCheckFill, BsTags } from 'react-icons/bs';

const MainLayout = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div 
          className="d-md-none position-fixed w-100 h-100" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040, top: 0, left: 0 }}
          onClick={toggleSidebar}
        ></div>
      )}

      {/* SIDEBAR */}
      <div className={`sidebar d-flex flex-column flex-shrink-0 p-3 shadow-sm text-white transition-all`} 
           style={{ 
             width: '280px', 
             backgroundColor: '#001E3C', 
             height: '100vh', 
             position: 'fixed', 
             zIndex: 1050,
             left: isSidebarOpen ? '0' : '-280px',
             transition: 'left 0.3s ease-in-out',
           }}>
        
        <div className="d-flex justify-content-between align-items-center border-bottom border-secondary mb-4 py-3">
          <h2 className="fw-bold m-0 text-center flex-grow-1">SAFEIN</h2>
          <button className="btn text-white d-md-none p-0" onClick={toggleSidebar}>
            <MdClose size={24} />
          </button>
        </div>
        
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-2 px-2">
            <Link to="/dashboard" className={getNavLinkClass('/dashboard')} 
               style={location.pathname === '/dashboard' ? { backgroundColor: '#3399FF', borderRadius: '8px' } : {}}
               onClick={() => setIsSidebarOpen(false)}>
              <MdDashboard className="me-3" size={20} />
              <span className="fw-semibold">Dashboard</span>
            </Link>
          </li>
          
          <li className="nav-item mb-1 px-2">
            <Link to="/pendapatan" className={getNavLinkClass('/pendapatan')} onClick={() => setIsSidebarOpen(false)}>
              <BsGraphUpArrow className="me-3 text-success" size={20} /> Pendapatan
            </Link>
          </li>
          <li className="nav-item mb-3 px-2">
            <Link to="/pengeluaran" className={getNavLinkClass('/pengeluaran')} onClick={() => setIsSidebarOpen(false)}>
              <BsFillBagCheckFill className="me-3 text-danger" size={20} /> Pengeluaran
            </Link>
          </li>
          
          <p className="text-uppercase small fw-bold text-secondary px-3 mb-2" style={{ fontSize: '0.8rem' }}>Data Master</p>
          
          <li className="nav-item mb-3 px-2">
            <Link to="/kategori" className={getNavLinkClass('/kategori')}
               style={location.pathname === '/kategori' ? { backgroundColor: '#3399FF', borderRadius: '8px' } : {}}
               onClick={() => setIsSidebarOpen(false)}>
              <BsTags className="me-3 text-warning" size={20} /> Kategori
            </Link>
          </li>


          <p className="text-uppercase small fw-bold text-secondary px-3 mb-2" style={{ fontSize: '0.8rem' }}>Analisis</p>
          <li className="nav-item mb-2 px-2">
            <Link to="/prediksi" className={getNavLinkClass('/prediksi')} onClick={() => setIsSidebarOpen(false)}>
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
      <div className="flex-fill" style={{ 
        marginLeft: '0px',
        padding: '20px',
        width: '100%',
        transition: 'all 0.3s ease-in-out'
      }}>
        {/* Adjusted left margin for desktop */}
        <div style={{ marginLeft: '0px' }} className="ms-md-0 ps-md-0">
          <div className="d-md-flex" style={{ marginLeft: '0px' }}>
            <div className="d-none d-md-block" style={{ width: '280px', flexShrink: 0 }}></div>
            
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center shadow-sm mb-4 px-3 px-md-4 py-2" 
                   style={{ backgroundColor: '#001E3C', borderRadius: '10px', color: 'white' }}>
                
                <div className="d-flex align-items-center">
                  <button className="btn text-white d-md-none me-2 p-0" onClick={toggleSidebar}>
                    <MdMenu size={28} />
                  </button>
                  <span className="small d-none d-sm-inline">
                    Selamat Datang, <span className="fw-semibold text-light">{user?.name}</span> !
                  </span>
                  <span className="small d-sm-none">
                    Halo, <span className="fw-semibold text-light">{user?.name?.split(' ')[0]}</span>
                  </span>
                </div>

                <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center fw-bold border border-2 border-white shadow-sm" 
                     style={{ width: '35px', height: '35px', fontSize: '0.8rem' }}>
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "??"}
                </div>
              </div>
              
              <div className="container-fluid p-0">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sidebar {
            left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;