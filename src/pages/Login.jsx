import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../utils/swal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://back-end-safein-production.up.railway.app/authentications/login",
        { email, password }
      );

      const token = response.data?.data?.accessToken || response.data?.token;

      if (token) {
        localStorage.setItem("authToken", token);
        showToast("Selamat Datang Kembali!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal. Periksa kembali email & password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0 overflow-hidden shadow-sm">
      <div className="row g-0 h-100">
        {/* Form Section */}
        <div className="col-12 col-md-6 col-lg-5 col-xl-4 d-flex flex-column align-items-center justify-content-center bg-white p-4 p-lg-5 animate-fade-in-up">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <div className="text-center text-md-start mb-4">
              <h2 className="fw-bold text-safein-navy mb-0 fs-2">SAFEIN</h2>
              <p className="text-muted small">Adaptive Financial Intelligence System</p>
            </div>

            <div className="mb-3">
              <h5 className="fw-bold text-dark mb-1">Selamat Datang!</h5>
              <p className="text-muted smaller mb-0">Silakan masuk ke akun Anda.</p>
            </div>

            {error && (
              <div className="alert alert-danger border-0 small py-2 px-3 rounded-3 mb-3 animate-fade-in-up">
                <i className="bi bi-exclamation-circle-fill me-2"></i> {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
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
                    placeholder="Masukkan password"
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    ...
                  </>
                ) : "Masuk Sekarang"}
              </button>
            </form>

            <div className="text-center p-3 rounded-3 bg-light mb-3">
              <span className="text-muted smaller">Belum punya akun? </span>
              <Link to="/register" className="text-safein-blue smaller text-decoration-none fw-bold">
                Daftar Gratis
              </Link>
            </div>

            <div className="text-center">
              <Link to="/" className="text-muted smaller text-decoration-none hover-navy transition-all">
                <i className="bi bi-arrow-left me-1"></i> Beranda
              </Link>
            </div>
          </div>
        </div>

        {/* Branding Section */}
        <div className="col-md-6 col-lg-7 col-xl-8 d-none d-md-flex flex-column align-items-center justify-content-center branding-panel text-white p-5">
          {/* Decorative Elements */}
          <div className="branding-bg-shape animate-float" style={{ width: '40vw', height: '40vw', maxWidth: '500px', maxHeight: '500px', top: '-10%', right: '-10%' }}></div>
          <div className="branding-bg-shape animate-float-slow" style={{ width: '25vw', height: '25vw', maxWidth: '300px', maxHeight: '300px', bottom: '5%', left: '-5%' }}></div>
          
          <div className="branding-content text-center animate-fade-in-up my-auto" style={{ maxWidth: "600px", position: "relative", zIndex: 3 }}>
            <div className="glass-pill mb-4 animate-float">
              Solusi Cerdas Pengelolaan Finansial
            </div>
            <h1 className="display-4 fw-bold mb-4 leading-tight">Analisis Keuangan Cerdas Berbasis AI</h1>
            <p className="lead mb-5 opacity-75">
              SAFEIN membantu kamu memahami pola keuangan, memprediksi risiko finansial, dan memberikan insight cerdas setiap hari.
            </p>
            
            <div className="row g-3 text-start">
              <div className="col-6">
                <div className="glass-card p-3 rounded-4 h-100">
                  <i className="bi bi-shield-check-fill text-safein-accent fs-3 mb-2 d-block"></i>
                  <h6 className="fw-bold mb-1">Keamanan Data</h6>
                  <p className="smaller opacity-75 mb-0">Enkripsi standar militer untuk data Anda.</p>
                </div>
              </div>
              <div className="col-6">
                <div className="glass-card p-3 rounded-4 h-100">
                  <i className="bi bi-graph-up-arrow text-safein-accent fs-3 mb-2 d-block"></i>
                  <h6 className="fw-bold mb-1">Insight Akurat</h6>
                  <p className="smaller opacity-75 mb-0">Rekomendasi adaptif berbasis AI.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;