import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-vh-100 hero-gradient">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light glass-nav fixed-top">
        <div className="container py-2">
          <Link className="navbar-brand fw-bold text-safein-navy fs-3" to="/">
            <i className="bi bi-shield-lock-fill me-2"></i>SAFEIN
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link to="/login" className="nav-link fw-semibold px-3 text-safein-navy">Login</Link>
              </li>
              <li className="nav-item ms-lg-2">
                <Link to="/register" className="btn btn-safein px-4 rounded-pill fw-bold">Daftar Gratis</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container d-flex align-items-center justify-content-center text-center px-4" style={{ minHeight: "90vh", paddingTop: "100px" }}>
        <div style={{ maxWidth: "900px" }}>
          <span className="badge rounded-pill bg-safein-blue bg-opacity-10 text-safein-blue px-3 py-2 mb-4 fw-bold">
            ✨ AI-Powered Financial Assistant
          </span>
          <h1 className="display-3 fw-bold text-safein-navy mb-4">
            Kelola Keuangan dengan <span className="text-safein-blue">Cerdas & Adaptif</span>
          </h1>
          <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: "700px" }}>
            SAFEIN membantu Anda memahami pola pengeluaran, memprediksi risiko finansial, dan memberikan insight cerdas berbasis AI untuk masa depan yang lebih mapan.
          </p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link to="/register" className="btn btn-lg btn-safein px-5 py-3 rounded-pill shadow fw-bold">
              Mulai Sekarang — Gratis
            </Link>
            <a href="#fitur" className="btn btn-lg btn-outline-secondary px-5 py-3 rounded-pill fw-bold">
              Pelajari Fitur
            </a>
          </div>
        </div>
      </header>

      {/* Fitur Section */}
      <section id="fitur" className="container py-5 mt-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-safein-navy">Mengapa Memilih SAFEIN?</h2>
          <p className="text-muted">Solusi modern untuk manajemen keuangan pribadi Anda</p>
        </div>
        
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 feature-card p-4 rounded-4 shadow-sm">
              <div className="icon-box">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <h4 className="fw-bold mb-3">Analisis Akurat</h4>
              <p className="text-muted mb-0">Visualisasi data keuangan yang real-time dan mudah dipahami untuk memantau arus kas Anda setiap hari.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 feature-card p-4 rounded-4 shadow-sm border-primary" style={{ border: '1px solid rgba(63, 114, 175, 0.2) !important' }}>
              <div className="icon-box" style={{ backgroundColor: 'rgba(63, 114, 175, 0.1)', color: '#3f72af' }}>
                <i className="bi bi-robot"></i>
              </div>
              <h4 className="fw-bold mb-3 text-safein-blue">Insight AI</h4>
              <p className="text-muted mb-0">Dapatkan rekomendasi cerdas berbasis Artificial Intelligence untuk mengoptimalkan anggaran bulanan secara otomatis.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 feature-card p-4 rounded-4 shadow-sm">
              <div className="icon-box">
                <i className="bi bi-shield-check"></i>
              </div>
              <h4 className="fw-bold mb-3">Keamanan Data</h4>
              <p className="text-muted mb-0">Keamanan data Anda adalah prioritas kami. Semua data dienkripsi dengan standar keamanan perbankan terkini.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-5 my-5">
        <div className="bg-safein-navy rounded-5 p-5 text-white text-center shadow-lg position-relative overflow-hidden">
          <div className="position-relative z-1">
            <h2 className="display-6 fw-bold mb-4">Siap untuk mengontrol keuangan Anda?</h2>
            <p className="lead mb-5 opacity-75">Bergabunglah dengan ribuan pengguna yang telah meraih kebebasan finansial bersama SAFEIN.</p>
            <Link to="/register" className="btn btn-lg btn-light text-safein-navy px-5 py-3 rounded-pill fw-bold shadow">
              Daftar Sekarang
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="position-absolute bg-white opacity-10 rounded-circle" style={{ width: '300px', height: '300px', top: '-150px', right: '-150px' }}></div>
          <div className="position-absolute bg-white opacity-10 rounded-circle" style={{ width: '200px', height: '200px', bottom: '-100px', left: '-100px' }}></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-top py-5">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <h4 className="fw-bold text-safein-navy mb-3">SAFEIN</h4>
              <p className="text-muted small">
                Adaptive Financial Intelligence System. Membantu Anda mengelola keuangan dengan lebih cerdas menggunakan teknologi AI terkini.
              </p>
              <div className="d-flex gap-3 mt-4">
                <a href="#" className="text-safein-navy fs-5"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-safein-navy fs-5"><i className="bi bi-twitter-x"></i></a>
                <a href="#" className="text-safein-navy fs-5"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
            <div className="col-6 col-lg-2 ms-lg-auto">
              <h6 className="fw-bold mb-3">Produk</h6>
              <ul className="list-unstyled text-muted small">
                <li className="mb-2"><a href="#" className="text-decoration-none text-reset">Fitur Utama</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-reset">Insight AI</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-reset">Keamanan</a></li>
              </ul>
            </div>
            <div className="col-6 col-lg-2">
              <h6 className="fw-bold mb-3">Perusahaan</h6>
              <ul className="list-unstyled text-muted small">
                <li className="mb-2"><a href="#" className="text-decoration-none text-reset">Tentang Kami</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-reset">Kontak</a></li>
                <li className="mb-2"><a href="#" className="text-decoration-none text-reset">Karir</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4 opacity-25" />
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <p className="mb-0 small text-muted">&copy; 2026 SAFEIN. All rights reserved.</p>
            <div className="d-flex gap-4 small text-muted">
              <a href="#" className="text-decoration-none text-reset">Kebijakan Privasi</a>
              <a href="#" className="text-decoration-none text-reset">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;