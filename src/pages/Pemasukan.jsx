import React, { useState, useEffect } from "react";
import api from "../utils/api";
import MainLayout from "../components/MainLayout";
import {
  BsGraphUpArrow,
  BsTrash,
  BsPencilSquare,
  BsPlusLg,
  BsSearch,
  BsDownload,
} from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import { showAlert, showConfirm, showToast } from "../utils/swal";

const Pemasukan = () => {
  const [user, setUser] = useState({ name: "" });
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category_id: "",
    description: "",
    type: "income",
  });

  const fetchData = async () => {
    try {
      setFetchLoading(true);
      const [profileRes, catRes, transIncomeRes] = await Promise.all([
        api.get("/users/me"),
        api.get("/categories?type=income"),
        api.get("/transactions?type=income"),
      ]);

      const dataMentah = profileRes.data;
      const infoUser = dataMentah?.data?.user || dataMentah?.data || dataMentah?.user || dataMentah;
      setUser({ name: infoUser?.name || infoUser?.username || "User" });

      setCategories(catRes.data?.data || catRes.data || []);
      
      const incomeData = transIncomeRes.data?.data || transIncomeRes.data || [];
      setTransactions(incomeData);

      const total = incomeData.reduce((acc, item) => acc + Number(item.amount), 0);
      setTotalIncome(total);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) return showAlert("Peringatan", "warning", "Pilih kategori terlebih dahulu");

    try {
      setLoading(true);
      const payload = { ...formData, amount: Number(formData.amount) };

      if (currentId) {
        await api.put(`/transactions/${currentId}`, payload);
        showToast("Pemasukan berhasil diperbarui");
      } else {
        await api.post("/transactions", payload);
        showToast("Pemasukan berhasil ditambahkan");
      }

      closeModal();
      fetchData(); 
    } catch (err) {
      showAlert("Gagal!", "error", "Gagal menyimpan: " + (err.response?.data?.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm("Hapus Pemasukan?", "Apakah Anda yakin ingin menghapus transaksi ini?");
    if (result.isConfirmed) {
      try {
        await api.delete(`/transactions/${id}`);
        showToast("Transaksi berhasil dihapus");
        fetchData();
      } catch (err) {
        showAlert("Gagal!", "error", "Gagal menghapus data");
      }
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await api.get("/transactions/export/csv?type=income", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const tanggalHariIni = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `Laporan_Pemasukan_${tanggalHariIni}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast("File CSV berhasil diunduh");
    } catch (err) {
      showAlert("Gagal!", "error", "Gagal mengekspor data ke file CSV");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setCurrentId(item.id);
      setFormData({
        amount: item.amount,
        date: item.date.split("T")[0],
        category_id: item.category_id,
        description: item.description || "",
        type: "income",
      });
    } else {
      setCurrentId(null);
      setFormData({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category_id: "",
        description: "",
        type: "income",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentId(null);
  };

  const filteredTransactions = transactions.filter((t) => {
    const categoryName = t.Category?.name || t.category_name || "Income";
    const description = t.description || "";
    return (
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <MainLayout user={user}>
      {/* SUMMARY CARD */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderLeft: "10px solid #28A745", borderRadius: "10px" }}>
            <div className="card-body d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-3 me-4 text-success">
                <FaMoneyBillWave size={35} />
              </div>
              <div>
                <h6 className="fw-bold small mb-1 text-uppercase text-muted">Total Pendapatan</h6>
                <h2 className="fw-bold mb-0 text-dark">Rp. {totalIncome.toLocaleString("id-ID")}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 text-dark">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
            <BsGraphUpArrow className="text-success" size={24} />
          </div>
          <div>
            <h4 className="fw-bold mb-0">Manajemen Pemasukan</h4>
            <p className="text-muted small mb-0">Kelola semua transaksi pemasukan Anda di sini.</p>
          </div>
        </div>
        
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div className="d-flex gap-2 w-100 w-sm-auto">
            <button className="btn btn-primary d-flex align-items-center gap-2 px-4 fw-bold shadow-sm" onClick={() => openModal()}>
              <BsPlusLg /> Tambah Baru
            </button>
            <button className="btn btn-outline-success d-flex align-items-center gap-2 px-4 fw-bold shadow-sm" onClick={handleExport} disabled={loading || transactions.length === 0}>
              <BsDownload /> Export 
            </button>
          </div>

          <div className="input-group shadow-sm" style={{ maxWidth: "300px" }}>
            <span className="input-group-text bg-white border-end-0 text-muted"><BsSearch /></span>
            <input
              type="text"
              className="form-control border-start-0 ps-1"
              placeholder="Cari deskripsi / kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-3 py-3" style={{ width: "60px" }}>NO</th>
                <th className="py-3">TANGGAL</th>
                <th className="py-3">KATEGORI</th>
                <th className="py-3">DESKRIPSI</th>
                <th className="py-3">JUMLAH</th>
                <th className="py-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {fetchLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-success me-2"></div> Memuat data...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    {searchQuery ? "Data tidak ditemukan." : "Belum ada transaksi pemasukan."}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t, index) => (
                  <tr key={t.id}>
                    <td className="ps-3 text-muted">{index + 1}</td>
                    <td>{new Date(t.date).toLocaleDateString("id-ID")}</td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">
                        {t.Category?.name || t.category_name || "Income"}
                      </span>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: "150px" }}>{t.description || "-"}</td>
                    <td className="fw-bold text-success">Rp {Number(t.amount).toLocaleString("id-ID")}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-light text-warning me-2" onClick={() => openModal(t)}>
                        <BsPencilSquare size={18} />
                      </button>
                      <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(t.id)}>
                        <BsTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SECTION */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" onClick={closeModal}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="fw-bold mb-0">{currentId ? "Edit Pemasukan" : "Tambah Pemasukan"}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Jumlah (Amount)</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">Rp</span>
                        <input
                          type="number"
                          name="amount"
                          className="form-control bg-light border-start-0"
                          value={formData.amount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tanggal</label>
                      <input
                        type="date"
                        name="date"
                        className="form-control bg-light"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Kategori</label>
                      <select
                        name="category_id"
                        className="form-select bg-light"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Pilih Kategori...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-0">
                      <label className="form-label fw-semibold">Deskripsi</label>
                      <textarea
                        name="description"
                        className="form-control bg-light"
                        rows="2"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Contoh: Gaji freelance"
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0">
                    <button type="button" className="btn btn-link text-muted fw-bold text-decoration-none" onClick={closeModal}>Batal</button>
                    <button type="submit" className="btn btn-primary fw-bold px-4 rounded-3" disabled={loading}>
                      {loading ? "Menyimpan..." : currentId ? "Update" : "Simpan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Pemasukan;