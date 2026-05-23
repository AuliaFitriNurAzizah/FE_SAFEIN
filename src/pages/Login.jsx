import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Tambahkan useNavigate
import axios from "axios"; // Import Axios
import { showToast } from "../utils/swal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle mata
  const [error, setError] = useState(""); // Untuk menampilkan pesan error API
  const [loading, setLoading] = useState(false); // Untuk loading state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ganti URL ini dengan endpoint API backend kamu nanti
      // const response = await axios.post('http://localhost:5000/api/login', {
      //   email: email,
      //   password: password
      // });
      const response = await axios.post(
        "https://back-end-safein-production.up.railway.app/authentications/login",
        {
          email: email,
          password: password,
        },
      );

      // Jika berhasil, biasanya backend mengirimkan token JWT
      // Ganti bagian ini di Login.jsx kamu
      const token = response.data?.data?.accessToken || response.data?.token;

      if (token) {
        // Gunakan 'authToken' supaya sama dengan yang dicari Dashboard/API Utils
        localStorage.setItem("authToken", token);

        // Debug untuk memastikan token benar-benar tersimpan sebagai string
        console.log("Token disimpan:", localStorage.getItem("authToken"));

        showToast("Login Berhasil!");
        navigate("/dashboard");
      }
    } catch (err) {
      // Ambil pesan error dari backend jika ada
      setError(
        err.response?.data?.message ||
          "Login gagal. Cek kembali email/password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        <div className="col-lg-5 d-flex align-items-center justify-content-center bg-white p-4 p-md-5">
          <div style={{ maxWidth: "380px", width: "100%" }}>
            <h2 className="fw-bold text-safein-navy mb-1 mt-5">SAFEIN</h2>
            <p className="text-muted small mb-4">
              Adaptive Financial Intelligence System
            </p>

            {/* Tampilkan pesan error jika login gagal */}
            {error && (
              <div className="alert alert-danger small py-2">{error}</div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3 text-start">
                <label className="form-label small fw-bold text-safein-navy">
                  Alamat Email
                </label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  placeholder="Masukkan email anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 text-start">
                <label className="form-label small fw-bold text-safein-navy">
                  Password
                </label>
                {/* Input group untuk menyatukan kolom password dengan icon mata */}
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"} // Berubah tipe berdasarkan state
                    className="form-control rounded-start-3 border-end-0"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text bg-white border-start-0 rounded-end-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {/* Icon mata dari Bootstrap Icons */}
                    <i
                      className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-muted`}
                    ></i>
                  </span>
                </div>
              </div>

              <button
                className="btn btn-safein w-100 py-2 fw-bold shadow-sm mb-3"
                disabled={loading}
              >
                {loading ? "Mohon Tunggu..." : "Masuk Sekarang"}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Belum punya akun? </span>
              <Link
                to="/register"
                className="text-safein-navy small text-decoration-none fw-bold"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>

        {/* Panel Kanan tetap sama */}
        <div className="col-lg-7 d-none d-lg-flex flex-column align-items-center justify-content-center bg-safein-navy text-white p-5">
          <div className="text-center" style={{ maxWidth: "500px" }}>
            <h1 className="fw-bold mb-4">Analisis Keuangan Cerdas</h1>
            <div className="bg-safein-slate rounded-4 p-4 shadow-lg border border-white border-opacity-10">
              <p className="mb-0">
                SAFEIN membantu kamu memahami pola keuangan, memprediksi risiko
                finansial, dan memberikan insight cerdas berbasis Artificial
                Intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
