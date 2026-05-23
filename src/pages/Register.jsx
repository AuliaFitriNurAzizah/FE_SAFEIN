import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import { showAlert } from "../utils/swal";

function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle mata
  const [error, setError] = useState(""); // Untuk menampung pesan error dari API
  const [loading, setLoading] = useState(false); // State untuk loading tombol

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // BAGIAN CONNECT KE API:
      // Ganti URL ini dengan endpoint registrasi backend kamu nanti
      const response = await axios.post(
        "https://back-end-safein-production.up.railway.app/authentications/register",
        {
          name: nama,
          email: email,
          password: password,
        },
      );

      console.log("Response Backend:", response.data);
      await showAlert("Berhasil!", "success", "Pendaftaran berhasil! Silakan login.");

      // Setelah berhasil, arahkan user ke halaman login
      navigate("/login");
    } catch (err) {
      // Menangkap error dari backend (misal: email sudah terdaftar)
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat mendaftar.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* SISI KIRI: Visual Branding */}
        <div className="col-lg-7 d-none d-lg-flex flex-column align-items-center justify-content-center bg-safein-navy text-white p-5">
          <div className="text-center" style={{ maxWidth: "500px" }}>
            <h1 className="fw-bold mb-4">Keputusan Cerdas</h1>
            <div className="bg-safein-slate rounded-4 p-4 shadow-lg border border-white border-opacity-10">
              <p className="mb-0">
                Mulailah perjalanan finansial yang lebih cerdas bersama SAFEIN.
                Tidak hanya mencatat pemasukan dan pengeluaran, SAFEIN membantu
                Anda memahami pola keuangan, memprediksi risiko finansial, dan
                memberikan insight adaptif berbasis Artificial Intelligence agar
                setiap keputusan finansial menjadi lebih terarah dan percaya
                diri.
              </p>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Form Registrasi */}
        <div className="col-lg-5 d-flex align-items-center justify-content-center bg-white p-4 p-md-5">
          <div style={{ maxWidth: "380px", width: "100%" }}>
            <div className="mb-5">
              <h2 className="fw-bold text-safein-navy mb-1">SAFEIN</h2>
              <p className="text-muted small">
                Adaptive Financial Intelligence System
              </p>
            </div>

            {/* Menampilkan pesan error jika ada */}
            {error && (
              <div className="alert alert-danger small py-2">{error}</div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-3 text-start">
                <label className="form-label small fw-bold text-safein-navy">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Masukkan nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label className="form-label small fw-bold text-safein-navy">
                  Alamat Email
                </label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 text-start">
                <label className="form-label small fw-bold text-safein-navy">
                  Password
                </label>
                {/* Input group untuk fitur Show/Hide Password */}
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"} // Tipe input dinamis
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
                    <i
                      className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-muted`}
                    ></i>
                  </span>
                </div>
              </div>

              <button
                className="btn btn-safein w-100 py-2 fw-bold shadow-sm mb-3"
                type="submit"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Daftar Sekarang"}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Sudah punya akun? </span>
              <Link
                to="/login"
                className="text-safein-navy small text-decoration-none fw-bold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
