import React, { useState, useEffect } from "react";
import api from "../utils/api";
import MainLayout from "../components/MainLayout";
import { BsTags, BsPlusLg, BsPencilSquare, BsTrash } from "react-icons/bs";
import { showAlert, showConfirm, showToast } from "../utils/swal";

const Kategori = () => {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState({ name: "" });
  const [loading, setLoading] = useState(true);

  // State Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "expense" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, catRes] = await Promise.all([
        api.get("/users/me"),
        api.get("/categories"),
      ]);
      const infoUser = profileRes.data?.data?.user || profileRes.data?.user || { name: "User" };
      setUser({ name: infoUser?.name || "User" });

      const listKategori = catRes.data?.data || catRes.data || [];
      setCategories(Array.isArray(listKategori) ? listKategori : []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setIsEditMode(true);
      setCurrentId(cat.id);
      setFormData({ name: cat.name, type: cat.type });
    } else {
      setIsEditMode(false);
      setCurrentId(null);
      setFormData({ name: "", type: "expense" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/categories/${currentId}`, formData);
        showToast("Kategori berhasil diperbarui");
      } else {
        await api.post("/categories", formData);
        showToast("Kategori berhasil ditambahkan");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      showAlert("Gagal!", "error", "Gagal menyimpan data: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm("Hapus Kategori?", "Apakah Anda yakin ingin menghapus kategori ini?");
    if (result.isConfirmed) {
      try {
        await api.delete(`/categories/${id}`);
        showToast("Kategori berhasil dihapus");
        fetchData();
      } catch (err) {
        showAlert("Gagal!", "error", "Gagal menghapus data.");
      }
    }
  };

  return (
    <MainLayout user={user}>
      <div className="card border-0 shadow-sm rounded-4 p-4 text-dark">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3 text-primary">
              <BsTags size={24} />
            </div>
            <div>
              <h4 className="fw-bold mb-0">Manajemen Kategori</h4>
              <p className="text-muted small mb-0">Kelola kategori transaksi Anda.</p>
            </div>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
            onClick={() => handleOpenModal()}
          >
            <BsPlusLg /> Tambah Baru
          </button>
        </div>

        {/* Tabel Data */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr style={{ fontSize: "0.9rem" }}>
                <th style={{ width: "80px" }} className="ps-4 py-3">NO.</th>
                <th className="py-3">NAMA KATEGORI</th>
                <th className="py-3">TIPE</th>
                <th className="py-3 text-end pe-4">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                    Memuat data...
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr key={cat.id || index}>
                    <td className="ps-4 text-muted">{index + 1}</td>
                    <td><span className="fw-semibold">{cat.name || "-"}</span></td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${
                        cat.type === "income" ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"
                      }`} style={{ fontSize: "0.75rem" }}>
                        {cat.type === "income" ? "PEMASUKAN" : "PENGELUARAN"}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm text-warning me-2" onClick={() => handleOpenModal(cat)}>
                        <BsPencilSquare size={18} />
                      </button>
                      <button className="btn btn-sm text-danger" onClick={() => handleDelete(cat.id)}>
                        <BsTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">Belum ada data kategori.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- POPUP MODAL (Berdasarkan image_9ec7b9.png) --- */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }} 
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4 p-2">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {isEditMode ? "Edit Kategori" : "Tambah Kategori"}
                </h5>
                <button 
                  type="button" 
                  className="btn-close shadow-none" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body pt-0">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Nama Kategori</label>
                    <input
                      type="text"
                      className="form-control shadow-sm border border-secondary border-opacity-10"
                      placeholder="Masukkan nama kategori..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Tipe Kategori</label>
                    <select
                      className="form-select shadow-sm border border-secondary border-opacity-10"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="expense">PENGELUARAN</option>
                      <option value="income">PEMASUKAN</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none text-dark fw-semibold"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-bold shadow-sm"
                    style={{ borderRadius: "8px" }}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Kategori;