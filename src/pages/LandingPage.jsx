import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-safein-navy" to="/">SAFEIN</Link>
          <div className="d-flex">
            <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
            <Link to="/register" className="btn btn-primary bg-safein-navy border-0">Daftar</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container d-flex align-items-center justify-content-center text-center" style={{ minHeight: "100vh", paddingTop: "80px" }}>
        <div style={{ maxWidth: "700px" }}>
          <h1 className="display-4 fw-bold text-safein-navy mb-4">
            Kelola Keuangan dengan Kecerdasan Buatan
          </h1>
          <p className="lead text-muted mb-5">
            SAFEIN hadir untuk membantu Anda memahami pola pengeluaran, memprediksi risiko, dan mengambil keputusan finansial yang lebih cerdas dan terarah.
          </p>
          <Link to="/register" className="btn btn-lg btn-safein px-5 py-3 shadow-sm">
            Mulai Sekarang
          </Link>
        </div>
      </header>

      {/* Fitur Section */}
      <section className="container py-5">
        <div className="row g-4 text-center">
          <h2 className="fw-bold text-safein-navy mb-5">Mengapa Memilih SAFEIN?</h2>
          
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4">
              <i className="bi bi-graph-up-arrow fs-1 text-safein-navy mb-3"></i>
              <h5 className="fw-bold">Analisis Akurat</h5>
              <p className="text-muted small">Visualisasi data keuangan yang mudah dipahami untuk memantau pemasukan dan pengeluaran.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4">
              <i className="bi bi-robot fs-1 text-safein-navy mb-3"></i>
              <h5 className="fw-bold">Insight AI</h5>
              <p className="text-muted small">Dapatkan rekomendasi cerdas berbasis AI untuk mengoptimalkan anggaran bulanan Anda.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4">
              <i className="bi bi-shield-check fs-1 text-safein-navy mb-3"></i>
              <h5 className="fw-bold">Keamanan Terjamin</h5>
              <p className="text-muted small">Data finansial Anda dikelola dengan sistem keamanan tingkat tinggi untuk ketenangan pikiran.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-safein-navy text-white text-center py-4 mt-5">
        <p className="mb-0 small">&copy; 2026 SAFEIN - Adaptive Financial Intelligence System.</p>
      </footer>
    </div>
  );
}

export default LandingPage;