import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import MainLayout from "../components/MainLayout";
import { MdSavings } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { BsFillBagCheckFill } from "react-icons/bs";

// --- IMPORT UNTUK CHART ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "" });
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    ratio: 0,
    savedAmount: 0,
  });

  const [prediction, setPrediction] = useState({
    analysis: "Sedang menganalisis data keuangan Anda...",
    nextMonthEstimation: "Menghitung proyeksi pengeluaran...",
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [profileRes, summaryRes, monthlyRes, predictionRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/transactions/summary"),
          api.get("/transactions/summary/monthly"),
          api.get("/financial-analysis/latest"),
        ]);

        // 1. User Data
        const infoUser = profileRes.data?.data?.user || profileRes.data?.data || profileRes.data;
        setUser({ name: infoUser?.name || "User" });
        
        // 2. Summary Data
        const income = summaryRes?.data?.data?.totalIncome || 0;
        const expense = summaryRes?.data?.data?.totalExpense || 0;
        const ratio = summaryRes?.data?.data?.savingRatio ? Math.round(summaryRes.data.data.savingRatio) : 0;
        const savedAmount = summaryRes?.data?.data?.savedAmount || 0;
        setSummary({ income, expense, ratio: ratio < 0 ? 0 : ratio, savedAmount });

        // 3. Prediction Data (Mapping sesuai struktur baru Anda)
        const predData = predictionRes.data?.data;
        setPrediction({
          analysis: predData?.prediction?.label
            ? `Kondisi keuangan kamu ${predData.prediction.label} (${(predData.prediction.confidence * 100).toFixed(1)}% confidence)`
            : "Tidak ada data analisis tersedia.",
          nextMonthEstimation:
            predData?.prediction?.rekomendasi ||
            "Belum ada rekomendasi untuk saat ini.",
        });

        // 4. Chart Data
        const monthlyArray = monthlyRes.data?.data || [];
        setChartData({
          labels: monthlyArray.map((item) => item.month),
          datasets: [
            {
              label: "Pemasukan",
              data: monthlyArray.map((item) => item.income),
              borderColor: "#28A745",
              backgroundColor: "rgba(40, 167, 69, 0.1)",
              borderWidth: 3,
              tension: 0,
              pointRadius: 4,
              pointBackgroundColor: "#28A745",
            },
            {
              label: "Pengeluaran",
              data: monthlyArray.map((item) => item.expense),
              borderColor: "#DC3545",
              backgroundColor: "rgba(220, 53, 69, 0.1)",
              borderWidth: 3,
              tension: 0,
              pointRadius: 4,
              pointBackgroundColor: "#DC3545",
            },
          ],
        });

      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { usePointStyle: true } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (val) => val.toLocaleString("id-ID") } },
      x: { grid: { display: false } },
    },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#001E3C" }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
      </div>
    );
  }

  return (
    <MainLayout user={user}>
      {/* 1. SUMMARY CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm p-3 bg-white" style={{ borderLeft: "10px solid #28A745", borderRadius: "10px" }}>
            <div className="card-body d-flex align-items-center">
              <FaMoneyBillWave className="me-4 text-success" size={40} />
              <div>
                <h6 className="fw-bold small mb-1 text-uppercase text-muted">Pendapatan</h6>
                <h3 className="fw-bold mb-0">Rp. {summary.income.toLocaleString("id-ID")}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm p-3 bg-white" style={{ borderLeft: "10px solid #DC3545", borderRadius: "10px" }}>
            <div className="card-body d-flex align-items-center">
              <BsFillBagCheckFill className="me-4 text-danger" size={40} />
              <div>
                <h6 className="fw-bold small mb-1 text-uppercase text-muted">Pengeluaran</h6>
                <h3 className="fw-bold mb-0">Rp. {summary.expense.toLocaleString("id-ID")}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm p-3 bg-white" style={{ borderLeft: "10px solid #AF52DE", borderRadius: "10px" }}>
            <div className="card-body d-flex align-items-center">
              <MdSavings className="me-4" size={45} style={{ color: "#AF52DE" }} />
              <div>
                <h6 className="fw-bold small mb-1 text-uppercase text-muted">Rasio Tabungan</h6>
                <h2 className="fw-bold mb-0">{summary.ratio} %</h2>
                <span className="text-muted small fw-semibold">Sisa: Rp {summary.savedAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PREDIKSI SECTION */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="p-4 mb-3 shadow-sm" style={{ backgroundColor: "#F8F9FA", borderRadius: "10px", borderLeft: "8px solid #DEE2E6" }}>
            <h5 className="fw-bold mb-1 text-muted">Prediksi Kondisi Keuangan:</h5>
            <p className="mb-0 text-muted small">{prediction.analysis}</p>
          </div>
        </div>
      </div>

      {/* 3. ESTIMASI PENGELUARAN */}
      <div className="p-4 mb-4 shadow-sm bg-white" style={{ borderRadius: "10px", borderLeft: "8px solid #6C757D" }}>
        <h5 className="fw-bold text-muted mb-1">Estimasi Bulan Depan:</h5>
        <p className="mb-0 text-muted small">{prediction.nextMonthEstimation}</p>
      </div>

      {/* 4. CHART SECTION */}
      <div className="card border-0 shadow-sm p-4 bg-white rounded-4">
        <h5 className="text-center fw-bold mb-4" style={{ color: "#003366" }}>Perbandingan Pemasukan vs Pengeluaran</h5>
        <div style={{ height: "350px" }}>
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;