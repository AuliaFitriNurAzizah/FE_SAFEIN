import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showAlert } from "../utils/swal";

function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        "https://back-end-safein-production.up.railway.app/authentications/register",
        {
          name: nama,
          email: email,
          password: password,
        }
      );

      await showAlert("Berhasil!", "success", "Pendaftaran berhasil! Silakan login untuk melanjutkan.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0 overflow-hidden">
      <div className="row g-0 h-100">
        {/* Branding Section */}
        <div className="col-lg-7 d-none d-lg-flex flex-column align-items-center justify-content-center branding-panel text-white p-5 overflow-hidden">
          {/* Decorative Elements */}
          <div className="branding-bg-shape animate-float" style={{ width: '450px', height: '450px', top: '10%', left: '-5%' }}></div>
          <div className="branding-bg-shape animate-float-slow" style={{ width: '350px', height: '350px', bottom: '-5%', right: '5%' }}></div>
          
          <div className="branding-content text-center animate-fade-in-up" style={{ maxWidth: "520px" }}>
            <div className="glass-pill mb-4 animate-float">
              🚀 Start your journey today
            </div>
            <h1 className="display-4 fw-bold mb-4 leading-tight">Keputusan Finansial yang Lebih Baik</h1>
            <p className="lead mb-5 opacity-75">
              Mulailah perjalanan finansial yang lebih cerdas bersama SAFEIN. Pahami pola keuanganmu dengan bantuan Artificial Intelligence yang adaptif.
            </p>
            
            <div className="row g-3 text-start">
              <div className="col-6">
                <div className="glass-card p-3 rounded-4 h-100">
                  <i className="bi bi-robot text-safein-accent fs-3 mb-2 d-block"></i>
                  <h6 className="fw-bold mb-1">AI Personal</h6>
                  <p className="smaller opacity-75 mb-0">Asisten keuangan pribadi dalam saku Anda.</p>
                </div>
              </div>
              <div className="col-6">
                <div className="glass-card p-3 rounded-4 h-100">
                  <i className="bi bi-pie-chart-fill text-safein-accent fs-3 mb-2 d-block"></i>
                  <h6 className="fw-bold mb-1">Visualisasi Cerdas</h6>
                  <p className="smaller opacity-75 mb-0">Laporan mendalam yang mudah dipahami.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="col-lg-5 d-flex align-items-center justify-content-center bg-white p-4 p-md-5 animate-fade-in-up">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <div className="text-center text-lg-start mb-5">
              <h2 className="fw-bold text-safein-navy mb-1 fs-1">SAFEIN</h2>
              <p className="text-muted">Adaptive Financial Intelligence System</p>
            </div>

            <div className="mb-4">
              <h4 className="fw-bold text-dark mb-2">Buat Akun Baru</h4>
              <p className="text-muted small">Daftar sekarang untuk mengelola keuangan lebih cerdas.</p>
            </div>

            {error && (
              <div className="alert alert-danger border-0 small py-3 rounded-4 mb-4 animate-fade-in-up">
                <i className="bi bi-exclamation-circle-fill me-2"></i> {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-safein-navy">Nama Lengkap</label>
                <input
                  type="text"
                  className="form-control auth-input rounded-4"
                  placeholder="Masukkan nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-safein-navy">Alamat Email</label>
                <input
                  type="email"
                  className="form-control auth-input rounded-4"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-safein-navy">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control auth-input rounded-start-4 border-end-0"
                    placeholder="Masukkan password minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text bg-white border-start-0 rounded-end-4 px-3"
                    style={{ cursor: "pointer", color: "#cbd5e0" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                  </span>
                </div>
              </div>

              <button
                className="btn btn-safein w-100 py-3 rounded-4 fw-bold shadow-sm mb-4 pulse-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Mendaftarkan...
                  </>
                ) : "Daftar Sekarang"}
              </button>
              
              <div className="text-center">
                <Link to="/" className="text-muted small text-decoration-none hover-navy transition-all">
                  <i className="bi bi-arrow-left me-1"></i> Kembali ke Beranda
                </Link>
              </div>
            </form>

            <div className="text-center mt-5 p-4 rounded-4 bg-light">
              <span className="text-muted small">Sudah punya akun? </span>
              <Link to="/login" className="text-safein-blue small text-decoration-none fw-bold">
                Masuk Disini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;