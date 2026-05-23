import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';
import { 
  BsCashStack, 
  BsPlusLg, 
  BsPencilSquare, 
  BsTrash, 
  BsFillBagCheckFill, 
  BsSearch, 
  BsDownload 
} from 'react-icons/bs';
import { showAlert, showConfirm, showToast } from '../utils/swal';

const Pengeluaran = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    category_id: '',
    payment: '', 
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, expenseRes, catRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/transactions?type=expense'),
        api.get('/categories')
      ]);

      const dataUser = userRes.data?.data?.user || userRes.data?.user || { name: "User" };
      setUser({ name: dataUser.name });

      const expenseData = expenseRes.data?.data || expenseRes.data || [];
      setExpenses(expenseData);

      const allCats = catRes.data?.data || catRes.data || [];
      setCategories(allCats.filter(c => c.type === 'expense'));

      const total = expenseData.reduce((acc, item) => acc + Number(item.amount), 0);
      setTotalExpense(total);

    } catch (err) {
      console.error("Gagal mengambil data:", err);
      showAlert("Gagal!", "error", "Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions/export/csv?type=expense', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const dateString = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `Laporan_Pengeluaran_${dateString}.csv`);

      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast("File CSV berhasil diunduh");
    } catch (err) {
      console.error("Gagal export:", err);
      showAlert("Gagal!", "error", "Gagal mengunduh file CSV.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (exp = null) => {
    if (exp) {
      setIsEditMode(true);
      setCurrentId(exp.id);
      setFormData({
        amount: exp.amount,
        category_id: exp.category_id,
        payment: exp.payment || '', 
        description: exp.description || '',
        date: exp.date.split('T')[0]
      });
    } else {
      setIsEditMode(false);
      setCurrentId(null);
      setFormData({ 
        amount: '', 
        category_id: '', 
        payment: '', 
        description: '', 
        date: new Date().toISOString().split('T')[0] 
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      ...formData, 
      amount: Number(formData.amount),
      type: 'expense' 
    };

    try {
      if (isEditMode) {
        await api.put(`/transactions/${currentId}`, payload);
        showToast("Pengeluaran berhasil diperbarui");
      } else {
        await api.post('/transactions', payload);
        showToast("Pengeluaran berhasil ditambahkan");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      showAlert("Gagal!", "error", "Gagal memproses transaksi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm("Hapus Pengeluaran?", "Apakah Anda yakin ingin menghapus catatan pengeluaran ini?");
    if (result.isConfirmed) {
      try {
        await api.delete(`/transactions/${id}`);
        showToast("Transaksi berhasil dihapus");
        fetchData();
      } catch (err) {
        showAlert("Gagal!", "error", "Gagal menghapus.");
      }
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    const categoryName = exp.Category?.name || exp.category?.name || 'Umum';
    const description = exp.description || '';
    const paymentMethod = exp.payment || '';
    const query = searchQuery.toLowerCase();

    return (
      description.toLowerCase().includes(query) ||
      categoryName.toLowerCase().includes(query) ||
      paymentMethod.toLowerCase().includes(query)
    );
  });

  return (
    <MainLayout user={user}>
      {/* SUMMARY CARD */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm p-3 bg-white"
            style={{ borderLeft: "10px solid #DC3545", borderRadius: "10px" }}
          >
            <div className="card-body d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-3 me-4 text-danger">
                <BsFillBagCheckFill size={35} />
              </div>
              <div>
                <h6 className="fw-bold small mb-1 text-uppercase text-muted">
                  Total Pengeluaran
                </h6>
                <h2 className="fw-bold mb-0 text-dark">
                  Rp {totalExpense.toLocaleString("id-ID")}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 text-dark">
        {/* HEADER */}
        <div className="d-flex align-items-center mb-3">
          <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3 text-primary">
            <BsCashStack size={24} />
          </div>
          <div>
            <h4 className="fw-bold mb-0">Manajemen Pengeluaran</h4>
            <p className="text-muted small mb-0">Catat dan pantau setiap uang keluar Anda.</p>
          </div>
        </div>
        
        {/* ACTION BAR */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
              onClick={() => handleOpenModal()}
            >
              <BsPlusLg /> Tambah Baru
            </button>
            <button 
              className="btn btn-outline-success d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
              onClick={handleExport}
              disabled={expenses.length === 0}
            >
              <BsDownload /> Export
            </button>
          </div>

          <div className="input-group shadow-sm" style={{ maxWidth: "320px" }}>
            <span className="input-group-text bg-white border-end-0 text-muted">
              <BsSearch />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-1 shadow-none"
              placeholder="Cari keterangan, kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr style={{ fontSize: "0.9rem" }}>
                <th className="ps-4 py-3" style={{ width: "50px" }}>NO</th>
                <th className="py-3">TANGGAL</th>
                <th className="py-3">KATEGORI</th>
                <th className="py-3">PAYMENT</th> 
                <th className="py-3">KETERANGAN</th>
                <th className="py-3 text-end">JUMLAH</th>
                <th className="py-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">Memuat data...</td>
                </tr>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp, index) => (
                  <tr key={exp.id}>
                    {/* KOLOM NOMOR */}
                    <td className="ps-4 text-secondary small">{index + 1}</td>
                    <td>{new Date(exp.date).toLocaleDateString('id-ID')}</td>
                    <td>
                      <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10 px-3 py-2">
                        {exp.Category?.name || exp.category?.name || 'Umum'}
                      </span>
                    </td>
                    <td className="text-capitalize small fw-semibold text-secondary">
                      {exp.payment || '-'}
                    </td>
                    <td className="text-muted small text-truncate" style={{ maxWidth: "150px" }}>
                      {exp.description || '-'}
                    </td>
                    <td className="fw-bold text-danger text-end">
                      Rp {Number(exp.amount).toLocaleString('id-ID')}
                    </td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm text-warning me-1 shadow-none"
                        onClick={() => handleOpenModal(exp)}
                      >
                        <BsPencilSquare size={18} />
                      </button>
                      <button 
                        className="btn btn-sm text-danger shadow-none"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <BsTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    {searchQuery ? "Data tidak ditemukan." : "Belum ada catatan pengeluaran."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (Tetap Sama) */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
          <div className="modal fade show d-block" style={{ zIndex: 1060 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow rounded-4 p-2">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    {isEditMode ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
                  </h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body py-3">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Jumlah (Amount)</label>
                      <div className="input-group shadow-sm border border-secondary border-opacity-10 rounded">
                        <span className="input-group-text bg-white border-0">Rp</span>
                        <input
                          type="number"
                          className="form-control border-0 px-2 shadow-none"
                          placeholder="0"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label small fw-semibold text-muted">Tanggal</label>
                        <input 
                          type="date" 
                          className="form-control shadow-sm border border-secondary border-opacity-10 shadow-none" 
                          value={formData.date} 
                          onChange={(e) => setFormData({...formData, date: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label small fw-semibold text-muted">Kategori</label>
                        <select 
                          className="form-select shadow-sm border border-secondary border-opacity-10 shadow-none" 
                          value={formData.category_id} 
                          onChange={(e) => setFormData({...formData, category_id: e.target.value})} 
                          required
                        >
                          <option value="">Pilih...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Metode Pembayaran</label>
                      <select
                        className="form-select shadow-sm border border-secondary border-opacity-10 shadow-none"
                        value={formData.payment}
                        onChange={(e) => setFormData({...formData, payment: e.target.value})}
                        required
                      >
                        <option value="">Pilih Metode...</option>
                        <option value="cash">cash</option>
                        <option value="transfer">transfer</option>
                        <option value="qris">qris</option>
                      </select>
                    </div>
                    <div className="mb-0">
                      <label className="form-label small fw-semibold text-muted">Deskripsi</label>
                      <textarea 
                        className="form-control shadow-sm border border-secondary border-opacity-10 shadow-none" 
                        placeholder="Contoh: Beli bensin" 
                        rows="3"
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-0 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-link text-decoration-none text-dark fw-semibold" onClick={() => setShowModal(false)}>Batal</button>
                    <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm" style={{ borderRadius: "8px" }}>Simpan</button>
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

export default Pengeluaran;