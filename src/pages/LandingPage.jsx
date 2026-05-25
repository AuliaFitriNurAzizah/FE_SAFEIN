import React, { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-vh-100 hero-gradient position-relative">
      {/* Background Animated Blobs */}
      <div className="bg-blob" style={{ top: '-10%', left: '-5%' }}></div>
      <div className="bg-blob" style={{ bottom: '10%', right: '-5%', width: '600px', height: '600px' }}></div>
      
      {/* Floating Background Icons */}
      <i className="bi bi-coin floating-icon animate-float" style={{ top: '20%', left: '10%' }}></i>
      <i className="bi bi-bar-chart-fill floating-icon animate-float-slow" style={{ top: '15%', right: '15%' }}></i>
      <i className="bi bi-wallet2 floating-icon animate-float" style={{ bottom: '30%', left: '5%' }}></i>
      <i className="bi bi-pie-chart-fill floating-icon animate-float-slow" style={{ bottom: '20%', right: '10%' }}></i>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light glass-nav fixed-top">
        <div className="container py-2">
          <Link className="navbar-brand fw-bold text-safein-navy fs-3" to="/">
            <i className="bi bi-shield-lock-fill me-2 text-safein-blue"></i>SAFEIN
          </Link>
          <button 
            className="navbar-toggler border-0 shadow-none" 
            type="button" 
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isNavExpanded ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center py-3 py-lg-0">
              <li className="nav-item">
                <a 
                  href="#fitur" 
                  className="nav-link fw-semibold px-3 text-safein-navy"
                  onClick={() => setIsNavExpanded(false)}
                >
                  Fitur
                </a>
              </li>
              <li className="nav-item">
                <a 
                  href="#testimoni" 
                  className="nav-link fw-semibold px-3 text-safein-navy"
                  onClick={() => setIsNavExpanded(false)}
                >
                  Testimoni
                </a>
              </li>
              <li className="nav-item">
                <Link 
                  to="/login" 
                  className="nav-link fw-semibold px-3 text-safein-navy"
                  onClick={() => setIsNavExpanded(false)}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item ms-lg-2 mt-3 mt-lg-0">
                <Link 
                  to="/register" 
                  className="btn btn-safein px-4 rounded-pill fw-bold pulse-button w-100"
                  onClick={() => setIsNavExpanded(false)}
                >
                  Daftar Gratis
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container d-flex flex-column align-items-center justify-content-center text-center px-4" style={{ minHeight: "100vh", paddingTop: "100px" }}>
        <div className="animate-fade-in-up" style={{ maxWidth: "1000px" }}>
          <span className="badge rounded-pill bg-safein-white bg-opacity-10 text-safein-blue px-4 py-2 mb-4 fw-bold fs-6">
            Keamanan Finansial di Tangan Anda
          </span>
          <h1 className="display-2 fw-bold text-safein-navy mb-4">
            Kelola Keuangan dengan <br />
            <span className="text-gradient">Cerdas & Adaptif</span>
          </h1>
          <div className="mb-5">
            <p className="lead text-muted mx-auto mb-0" style={{ maxWidth: "700px" }}>
              SAFEIN membantu Anda memahami pola pengeluaran, memprediksi risiko finansial, dan memberikan insight cerdas berbasis AI.
            </p>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-5">
            <Link to="/register" className="btn btn-lg btn-safein px-5 py-3 rounded-pill shadow-lg fw-bold">
              Mulai Sekarang — Gratis
            </Link>
            <a href="#fitur" className="btn btn-lg btn-outline-secondary px-5 py-3 rounded-pill fw-bold bg-white">
              Pelajari Fitur
            </a>
          </div>
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="container mt-5 animate-fade-in-up animate-delay-2" style={{ maxWidth: "1050px" }}>
          <div className="dashboard-preview animate-float">
            <div className="dashboard-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
              <div className="ms-3 text-muted fw-medium text-truncate d-none d-sm-block" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>safein-adaptive-financial-intellige.vercel.app</div>
            </div>
            <div className="p-3 p-md-5 bg-light bg-opacity-50">
              <div className="row g-4">
                <div className="col-md-8">
                  <div className="bg-white rounded-4 p-4 shadow-sm mb-4" style={{ height: "200px" }}>
                    <div className="d-flex justify-content-between mb-4">
                      <div className="bg-light rounded-pill" style={{ width: "30%", height: "20px" }}></div>
                      <div className="bg-light rounded-pill" style={{ width: "15%", height: "20px" }}></div>
                    </div>
                    <div className="d-flex align-items-end gap-3 h-50 mt-4">
                      <div className="bg-safein-blue opacity-25 rounded-pill" style={{ width: "12%", height: "40%" }}></div>
                      <div className="bg-safein-blue opacity-50 rounded-pill" style={{ width: "12%", height: "70%" }}></div>
                      <div className="bg-safein-blue opacity-75 rounded-pill" style={{ width: "12%", height: "100%" }}></div>
                      <div className="bg-safein-blue rounded-pill" style={{ width: "12%", height: "85%" }}></div>
                      <div className="bg-safein-blue opacity-50 rounded-pill" style={{ width: "12%", height: "60%" }}></div>
                      <div className="bg-safein-blue opacity-25 rounded-pill" style={{ width: "12%", height: "30%" }}></div>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-6 col-md-4">
                      <div className="bg-safein-navy text-white rounded-4 p-3 shadow-sm">
                        <div className="small opacity-75 mb-1">Saldo</div>
                        <div className="fw-bold fs-5">Rp 25.4M</div>
                      </div>
                    </div>
                    <div className="col-6 col-md-4">
                      <div className="bg-white rounded-4 p-3 shadow-sm border-start border-4 border-danger">
                        <div className="small text-muted mb-1">Keluar</div>
                        <div className="fw-bold text-danger fs-5">Rp 4.2M</div>
                      </div>
                    </div>
                    <div className="col-md-4 d-none d-md-block">
                      <div className="bg-white rounded-4 p-3 shadow-sm border-start border-4 border-success">
                        <div className="small text-muted mb-1">Masuk</div>
                        <div className="fw-bold text-success fs-5">Rp 8.9M</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white rounded-4 p-4 shadow-sm h-100 d-flex flex-column justify-content-center text-center">
                    <div className="bg-light rounded-pill mx-auto mb-4" style={{ width: "70%", height: "15px" }}></div>
                    <div className="position-relative mx-auto my-3" style={{ width: "120px", height: "120px" }}>
                        <div className="position-absolute w-100 h-100 rounded-circle border border-5 border-light"></div>
                        <div className="position-absolute w-100 h-100 rounded-circle border border-5 border-primary border-top-0 border-end-0"></div>
                        <div className="position-absolute top-50 start-50 translate-middle fw-bold text-safein-navy fs-4">75%</div>
                    </div>
                    <div className="bg-safein-blue bg-opacity-10 text-safein-blue rounded-3 p-2 mt-4 small fw-bold">
                      Target Tercapai
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-white py-5 border-top border-bottom position-relative">
        <div className="container">
          <div className="row text-center g-4">
            {[
              { val: "50K+", label: "Pengguna Aktif" },
              { val: "Rp 10T+", label: "Dana Terkelola" },
              { val: "4.9/5", label: "Rating App" },
              { val: "99.9%", label: "Uptime Sistem" }
            ].map((stat, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="display-6 fw-bold text-safein-navy mb-1">{stat.val}</div>
                <div className="text-muted small fw-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="container py-5 mt-5">
        <div className="text-center mb-5 animate-fade-in-up">
          <h2 className="display-5 fw-bold text-safein-navy mb-3">Fitur Cerdas untuk Anda</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>Masa depan manajemen finansial yang didukung oleh kecerdasan buatan.</p>
        </div>
        
        <div className="row g-4">
          {[
            { icon: "bi-graph-up-arrow", title: "Analisis Real-time", desc: "Pantau arus kas Anda secara langsung dengan grafik interaktif yang mudah dipahami.", delay: "animate-delay-1" },
            { icon: "bi-robot", title: "Prediksi AI", desc: "Teknologi AI kami memprediksi tren pengeluaran Anda untuk menghindari risiko finansial.", delay: "animate-delay-2", highlight: true },
            { icon: "bi-shield-lock", title: "Enkripsi Berlapis", desc: "Data Anda dienkripsi dengan standar militer untuk memastikan privasi mutlak.", delay: "animate-delay-3" }
          ].map((feature, idx) => (
            <div className={`col-md-4 animate-fade-in-up ${feature.delay}`} key={idx}>
              <div className="card h-100 feature-card p-4 rounded-4 shadow-sm border-0">
                <div className="icon-box shadow-sm" style={feature.highlight ? { backgroundColor: 'var(--safein-blue)', color: 'white' } : {}}>
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h4 className={`fw-bold mb-3 ${feature.highlight ? 'text-safein-blue' : ''}`}>{feature.title}</h4>
                <p className="text-muted mb-0">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimoni Section */}
      <section id="testimoni" className="py-5 bg-white position-relative overflow-hidden">
        <div className="bg-blob" style={{ top: '20%', right: '-10%', opacity: 0.05 }}></div>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-safein-navy">Dipercaya oleh Ribuan User</h2>
            <p className="text-muted">Inilah alasan mengapa mereka memilih SAFEIN</p>
          </div>
          <div className="row g-4">
            {[
              { name: "Andi Wijaya", role: "Entrepreneur", text: "SAFEIN membantu saya memisahkan keuangan pribadi dan bisnis dengan sangat rapi. Insight AI-nya sangat akurat!" },
              { name: "Siti Aminah", role: "Ibu Rumah Tangga", text: "Sekarang mengatur uang belanja bulanan jadi jauh lebih terukur. Uang tidak lagi 'hilang' begitu saja." },
              { name: "Budi Santoso", role: "Software Engineer", text: "Dashboard-nya sangat user-friendly dan responsif. Pengalaman pengguna yang luar biasa untuk aplikasi finansial." }
            ].map((t, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="glass-card p-4 rounded-4 h-100 shadow-sm border-0 position-relative">
                  <i className="bi bi-quote position-absolute top-0 end-0 p-3 opacity-10 fs-1"></i>
                  <div className="mb-3 text-warning">
                    {[1,2,3,4,5].map(s => <i key={s} className="bi bi-star-fill me-1"></i>)}
                  </div>
                  <p className="fst-italic mb-4 text-muted small">"{t.text}"</p>
                  <div className="d-flex align-items-center">
                    <div className="bg-safein-light-blue text-safein-navy rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: "45px", height: "45px" }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 small">{t.name}</h6>
                      <small className="text-muted smaller">{t.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-5 my-5">
        <div className="bg-safein-navy rounded-5 p-5 text-white text-center shadow-lg position-relative overflow-hidden">
          <div className="position-relative z-1 py-3">
            <h2 className="display-5 fw-bold mb-4">Mulai Perjalanan Finansial Anda</h2>
            <p className="lead mb-5 opacity-75 mx-auto" style={{ maxWidth: "600px" }}>Dapatkan akses gratis selamanya untuk fitur dasar. Tidak perlu kartu kredit.</p>
            <Link to="/register" className="btn btn-lg btn-light text-safein-navy px-5 py-3 rounded-pill fw-bold shadow-lg pulse-button">
              Daftar Sekarang — Gratis
            </Link>
          </div>
          {/* Decorative elements */}
          <div className="position-absolute bg-white opacity-10 rounded-circle animate-float" style={{ width: '300px', height: '300px', top: '-150px', right: '-150px' }}></div>
          <div className="position-absolute bg-white opacity-10 rounded-circle animate-float-slow" style={{ width: '200px', height: '200px', bottom: '-100px', left: '-100px' }}></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-light py-5 border-top">
        <div className="container">
          <div className="row g-5 mb-5">
            <div className="col-lg-4">
              <h4 className="fw-bold text-safein-navy mb-4">SAFEIN</h4>
              <p className="text-muted small leading-relaxed">
                Platform manajemen keuangan adaptif yang menggabungkan kemudahan pencatatan dengan kekuatan AI untuk masa depan finansial yang lebih baik.
              </p>
              <div className="d-flex gap-3 mt-4">
                {['instagram', 'twitter-x', 'linkedin', 'facebook'].map(soc => (
                  <a key={soc} href="#" className="btn btn-outline-navy rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className={`bi bi-${soc}`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div className="col-6 col-lg-2 ms-lg-auto">
              <h6 className="fw-bold text-safein-navy mb-4">Layanan</h6>
              <ul className="list-unstyled text-muted small">
                {['Dashboard', 'Insight AI', 'Budgeting', 'Laporan'].map(item => (
                  <li className="mb-2" key={item}><a href="#" className="text-decoration-none text-reset hover-navy">{item}</a></li>
                ))}
              </ul>
            </div>
            <div className="col-6 col-lg-2">
              <h6 className="fw-bold text-safein-navy mb-4">Bantuan</h6>
              <ul className="list-unstyled text-muted small">
                {['Pusat Bantuan', 'Kontak', 'Panduan', 'FAQ'].map(item => (
                  <li className="mb-2" key={item}><a href="#" className="text-decoration-none text-reset hover-navy">{item}</a></li>
                ))}
              </ul>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold text-safein-navy mb-4">Newsletter</h6>
              <div className="input-group mb-3">
                <input type="text" className="form-control border-0 bg-white" placeholder="Email Anda" />
                <button className="btn btn-safein px-3" type="button"><i className="bi bi-send"></i></button>
              </div>
              <p className="smaller text-muted">Dapatkan tips finansial setiap minggu.</p>
            </div>
          </div>
          <hr className="my-5 opacity-10" />
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <p className="mb-0 small text-muted">&copy; 2026 SAFEIN - Adaptive Financial Intelligence System.</p>
            <div className="d-flex gap-4 small text-muted">
              <a href="#" className="text-decoration-none text-reset">Privasi</a>
              <a href="#" className="text-decoration-none text-reset">Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;