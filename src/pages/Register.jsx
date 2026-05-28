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
    <div className="container-fluid vh-100 p-0 overflow-hidden shadow-sm">
      <div className="row g-0 h-100">
        {/* Branding Section */}
        <div className="col-md-6 col-lg-7 col-xl-8 d-none d-md-flex flex-column align-items-center justify-content-center branding-panel text-white p-5">
          {/* Decorative Elements */}
          <div className="branding-bg-shape animate-float" style={{ width: '40vw', height: '40vw', maxWidth: '450px', maxHeight: '450px', top: '10%', left: '-5%' }}></div>
          <div className="branding-bg-shape animate-float-slow" style={{ width: '30vw', height: '30vw', maxWidth: '350px', maxHeight: '350px', bottom: '-5%', right: '5%' }}></div>
          
          <div className="branding-content text-center animate-fade-in-up my-auto" style={{ maxWidth: "600px", position: "relative", zIndex: 3 }}>
            <div className="glass-pill mb-3 animate-float">
               Start your journey today
            </div>
            <h1 className="display-4 fw-bold mb-3 leading-tight">Keputusan Finansial yang Lebih Baik</h1>
            <p className="lead mb-4 opacity-75">
              Mulailah perjalanan finansial yang lebih cerdas bersama SAFEIN. Pahami pola keuanganmu dengan bantuan AI yang adaptif.
            </p>
            
            <div className="row g-3 text-start">
              <div className="col-6">
                <div className="glass-card p-3 rounded-3 h-100">
                  <i className="bi bi-robot text-safein-accent fs-4 mb-2 d-block"></i>
                  <h6 className="fw-bold mb-1 smaller">AI Personal</h6>
                  <p className="smaller opacity-75 mb-0">Asisten keuangan pribadi Anda.</p>
                </div>
              </div>
              <div className="col-6">
                <div className="glass-card p-3 rounded-3 h-100">
                  <i className="bi bi-pie-chart-fill text-safein-accent fs-4 mb-2 d-block"></i>
                  <h6 className="fw-bold mb-1 smaller">Visualisasi</h6>
                  <p className="smaller opacity-75 mb-0">Laporan yang mudah dipahami.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="col-12 col-md-6 col-lg-5 col-xl-4 d-flex flex-column align-items-center justify-content-center bg-white p-4 p-lg-5 animate-fade-in-up">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <div className="text-center text-md-start mb-4">
              <h2 className="fw-bold text-safein-navy mb-0 fs-2">SAFEIN</h2>
              <p className="text-muted small">Adaptive Financial Intelligence System</p>
            </div>

            <div className="mb-3">
              <h5 className="fw-bold text-dark mb-1">Buat Akun Baru</h5>
              <p className="text-muted smaller mb-0">Daftar sekarang untuk mengelola keuangan.</p>
            </div>

            {error && (
              <div className="alert alert-danger border-0 small py-2 px-3 rounded-3 mb-3 animate-fade-in-up">
                <i className="bi bi-exclamation-circle-fill me-2"></i> {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-2">
                <label className="form-label smaller fw-bold text-safein-navy mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  className="form-control auth-input rounded-3 py-2"
                  placeholder="Masukkan nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label smaller fw-bold text-safein-navy mb-1">Alamat Email</label>
                <input
                  type="email"
                  className="form-control auth-input rounded-3 py-2"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label smaller fw-bold text-safein-navy mb-1">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control auth-input rounded-start-3 border-end-0 py-2"
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text bg-white border-start-0 rounded-end-3 px-3 py-2"
                    style={{ cursor: "pointer", color: "#cbd5e0" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                  </span>
                </div>
              </div>

              <button
                className="btn btn-safein w-100 py-2 rounded-3 fw-bold shadow-sm mb-3 pulse-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    ...
                  </>
                ) : "Daftar Sekarang"}
              </button>
            </form>

            <div className="text-center p-3 rounded-3 bg-light mb-3">
              <span className="text-muted smaller">Sudah punya akun? </span>
              <Link to="/login" className="text-safein-blue smaller text-decoration-none fw-bold">
                Masuk Disini
              </Link>
            </div>

            <div className="text-center">
              <Link to="/" className="text-muted smaller text-decoration-none hover-navy transition-all">
                <i className="bi bi-arrow-left me-1"></i> Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
