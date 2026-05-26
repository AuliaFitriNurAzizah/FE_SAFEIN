import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import MainLayout from "../components/MainLayout";
import { 
  BsShieldCheck, 
  BsExclamationTriangle, 
  BsExclamationOctagon, 
  BsQuestionCircle, 
  BsLightbulbFill, 
  BsGraphUp 
} from "react-icons/bs";
import { FaChartBar } from "react-icons/fa";

// =========================
// IMPORT CHART
// =========================
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
  Filler,
);

const Prediksi = () => {
  const navigate = useNavigate();

  // =========================
  // USER
  // =========================
  const [user, setUser] = useState({
    name: "",
  });

  // =========================
  // SUMMARY
  // =========================
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
  });

  // =========================
  // PREDICTION
  // =========================
  const [prediction, setPrediction] = useState({
    analysis: "",
    nextMonthEstimation: "",
    label: "",
  });

  // =========================
  // CHART DATA
  // =========================
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // =========================
  // LOADING
  // =========================
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user profile, summary, monthly summary (for 12 months), and latest analysis
        const [profileRes, summaryRes, monthlyRes, predictionRes] =
          await Promise.all([
            api.get("/users/me"),
            api.get("/transactions/summary"),
            api.get(`/transactions/summary/monthly?range=365d&groupBy=month`),
            api.get("/financial-analysis/latest"),
          ]);

        // USER DATA
        const infoUser = profileRes.data?.data?.user || profileRes.data?.data || profileRes.data;
        setUser({ name: infoUser?.name || "User" });

        // SUMMARY DATA
        const summaryData = summaryRes?.data?.data || {};
        setSummary({
          income: summaryData.totalIncome || 0,
          expense: summaryData.totalExpense || 0,
        });

        // PREDICTION DATA
        const predData = predictionRes?.data?.data;
        if (predData?.prediction?.label) {
          setPrediction({
            analysis: `Kondisi keuangan kamu ${predData.prediction.label} (${(
              predData.prediction.confidence * 100
            ).toFixed(1)}% confidence)`,
            nextMonthEstimation: predData.prediction.rekomendasi || "Belum ada rekomendasi untuk saat ini.",
            label: predData.prediction.label,
          });
        }

        // CHART DATA (MONTHLY)
        const monthlyArray = monthlyRes?.data?.data || [];
        
        setChartData({
          labels: monthlyArray.map((item) => {
            const val = item.label || item.month || "";
            if (val.match(/^\d{4}-\d{2}$/)) {
              const [y, m] = val.split("-");
              const d = new Date(y, parseInt(m) - 1);
              return d.toLocaleDateString("id-ID", {
                month: "short",
                year: "2-digit",
              });
            }
            return val;
          }),
          datasets: [
            {
              label: "Pemasukan",
              data: monthlyArray.map((item) => item.income),
              borderColor: "#28A745",
              backgroundColor: "rgba(40, 167, 69, 0.1)",
              fill: true,
              tension: 0,
              pointRadius: 4,
              pointBackgroundColor: "#28A745",
              borderWidth: 3,
            },
            {
              label: "Pengeluaran",
              data: monthlyArray.map((item) => item.expense),
              borderColor: "#DC3545",
              backgroundColor: "rgba(220, 53, 69, 0.1)",
              fill: true,
              tension: 0,
              pointRadius: 4,
              pointBackgroundColor: "#DC3545",
              borderWidth: 3,
            },
          ],
        });
      } catch (err) {
        console.error("Gagal mengambil data prediksi:", err);
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

  // =========================
  // CHART OPTIONS
  // =========================
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { usePointStyle: true },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => `${context.dataset.label}: Rp ${context.raw.toLocaleString("id-ID")}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `Rp ${value.toLocaleString("id-ID")}`,
        },
      },
      x: { grid: { display: false } },
    },
  };

  const getPredictionStyle = () => {
    const label = prediction.label?.toLowerCase();
    if (label === "aman") {
      return { bg: "#F0FDF4", border: "#22C55E", text: "#166534", accent: "#22C55E", icon: <BsShieldCheck size={24} />, status: "Aman" };
    }
    if (label === "rawan") {
      return { bg: "#FFFBEB", border: "#F59E0B", text: "#92400E", accent: "#F59E0B", icon: <BsExclamationTriangle size={24} />, status: "Rawan" };
    }
    if (label === "bahaya") {
      return { bg: "#FEF2F2", border: "#EF4444", text: "#991B1B", accent: "#EF4444", icon: <BsExclamationOctagon size={24} />, status: "Bahaya" };
    }
    return { bg: "#F8F9FA", border: "#DEE2E6", text: "#495057", accent: "#6C757D", icon: <BsQuestionCircle size={24} />, status: "No Data" };
  };

  const predStyle = getPredictionStyle();

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
      <div className="container-fluid">
        <div className="d-flex align-items-center mb-3">
          <FaChartBar className="text-primary me-3" size={30} />
          <h2 className="fw-bold mb-0 text-dark">Analisis & Prediksi Keuangan</h2>
        </div>

        {/* INFO MESSAGE */}
        <div className="alert alert-info border-0 shadow-sm mb-4 d-flex align-items-center" style={{ borderRadius: "12px", backgroundColor: "#E7F1FF" }}>
          <BsLightbulbFill className="text-primary me-3" size={20} />
          <span className="fw-semibold text-dark">
            Silahkan isi data pemasukan dan pengeluaran anda minimal 3 bulan untuk mendapatkan hasil prediksi yang lebih akurat.
          </span>
        </div>

        {/* ANALYSIS CARDS */}
        <div className="row">
          {/* STATUS KEUANGAN CARD */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: "16px", background: "white" }}>
              <div style={{ height: "8px", backgroundColor: predStyle.border }}></div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="p-3 rounded-3 me-3 d-flex align-items-center justify-content-center" 
                         style={{ backgroundColor: predStyle.bg, color: predStyle.accent, border: `1px solid ${predStyle.border}` }}>
                      {predStyle.icon}
                    </div>
                    <h5 className="fw-bold mb-0 text-dark">Status Keuangan</h5>
                  </div>
                  <span className="badge px-3 py-2" style={{ backgroundColor: predStyle.border, color: "white", borderRadius: "8px" }}>
                    {predStyle.status}
                  </span>
                </div>
                <div className="p-3 rounded-3" style={{ backgroundColor: `${predStyle.bg}88`, borderLeft: `4px solid ${predStyle.border}` }}>
                  <p className="mb-0 fw-semibold text-dark" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                    {prediction.analysis || "Belum ada analisis data yang tersedia untuk saat ini."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* REKOMENDASI DAN TIPS CARD */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: "16px", background: "white" }}>
              <div style={{ height: "8px", backgroundColor: "#0D6EFD" }}></div>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="p-3 rounded-3 me-3 d-flex align-items-center justify-content-center" 
                       style={{ backgroundColor: "#E7F1FF", color: "#0D6EFD", border: "1px solid #0D6EFD" }}>
                    <BsLightbulbFill size={24} />
                  </div>
                  <h5 className="fw-bold mb-0 text-dark">Rekomendasi dan Tips</h5>
                </div>
                <div className="p-3 rounded-3" style={{ backgroundColor: "#F0F7FF", borderLeft: "4px solid #0D6EFD" }}>
                  <p className="mb-0 fw-semibold text-dark" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                    {prediction.nextMonthEstimation || "Terus pantau pengeluaran Anda untuk mendapatkan rekomendasi yang lebih akurat."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-4">
          <h5 className="fw-bold mb-4" style={{ color: "#003366" }}>
            Grafik Pemasukan vs Pengeluaran Per Bulan
          </h5>
          <div style={{ height: "400px" }}>
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Prediksi;
