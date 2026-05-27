import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import MainLayout from "../components/MainLayout";

import { MdSavings } from "react-icons/md";
import {
  BsFillBagCheckFill,
  BsShieldCheck,
  BsExclamationTriangle,
  BsExclamationOctagon,
  BsQuestionCircle,
  BsLightbulbFill,
  BsGraphUp,
} from "react-icons/bs";

import { FaChartBar, FaMoneyBillWave } from "react-icons/fa";

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
  Filler
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
    actualIncome: 0,
    actualExpense: 0,
    ratio: 0,
    savedAmount: 0,
    currentMonthName: "",
  });

  // =========================
  // PREDICTION
  // =========================
  const [prediction, setPrediction] = useState({
    analysis: "",
    nextMonthEstimation: "",
    label: "",
    predIncome: 0,
    predExpense: 0,
    forecastRecommendation: "",
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

        // =========================
        // FETCH API
        // =========================
        const [
          profileRes,
          summaryRes,
          incomeTransRes,
          expenseTransRes,
          predictionRes,
          forecastRes,
        ] = await Promise.all([
          api.get("/users/me"),
          api.get("/transactions/summary"),
          api.get("/transactions?type=income"),
          api.get("/transactions?type=expense"),
          api.get("/financial-analysis/latest"),
          api.get("/expense-prediction/forecast"),
        ]);

        // =========================
        // USER DATA
        // =========================
        const infoUser =
          profileRes.data?.data?.user ||
          profileRes.data?.data ||
          profileRes.data;

        setUser({
          name: infoUser?.name || "User",
        });

        // =========================
        // MONTHLY DATA
        // =========================
        const incomeTransactions = incomeTransRes.data?.data || incomeTransRes.data || [];
        const expenseTransactions = expenseTransRes.data?.data || expenseTransRes.data || [];
        const summaryData = summaryRes?.data?.data || {};

        const monthlyMap = {};

        incomeTransactions.forEach((t) => {
          const date = new Date(t.date || t.created_at || t.createdAt);
          if (isNaN(date)) return;
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
          monthlyMap[key].income += Number(t.amount) || 0;
        });

        expenseTransactions.forEach((t) => {
          const date = new Date(t.date || t.created_at || t.createdAt);
          if (isNaN(date)) return;
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
          monthlyMap[key].expense += Number(t.amount) || 0;
        });

        const sortedKeys = Object.keys(monthlyMap).sort();
        const monthlyArray = sortedKeys.map((key) => ({
          month: key,
          income: monthlyMap[key].income,
          expense: monthlyMap[key].expense,
        }));

        let actualIncome = 0;
        let actualExpense = 0;
        let currentMonthName = "Bulan Ini";

        if (monthlyArray.length > 0) {
          const last = monthlyArray[monthlyArray.length - 1];
          actualIncome = last.income || 0;
          actualExpense = last.expense || 0;

          const val = last.month || "";
          if (val.match(/^\d{4}-\d{2}$/)) {
            const [y, m] = val.split("-");
            const d = new Date(y, parseInt(m) - 1);
            currentMonthName = d.toLocaleDateString("id-ID", { month: "long" });
          } else {
            currentMonthName = val || "Bulan Ini";
          }
        }

        const totalIncome = summaryData.totalIncome || 0;
        const totalExpense = summaryData.totalExpense || 0;
        const savedAmount = totalIncome - totalExpense;
        const ratio = totalIncome > 0 ? Math.round((savedAmount / totalIncome) * 100) : 0;

        setSummary({
          income: totalIncome,
          expense: totalExpense,
          actualIncome,
          actualExpense,
          ratio: ratio < 0 ? 0 : ratio,
          savedAmount,
          currentMonthName,
        });

        // =========================
        // FORECAST DATA
        // =========================

        // Debug: lihat struktur response di DevTools Console
        console.log("FORECAST RAW RESPONSE:", JSON.stringify(forecastRes?.data, null, 2));

        // Coba kedua kemungkinan struktur: .data.data atau .data langsung
        const forecastData =
          forecastRes?.data?.data ||
          forecastRes?.data ||
          {};

        const predIncome = Number(forecastData?.pred_income) || 0;
        const predExpense = Number(forecastData?.pred_expense) || 0;

        // Ambil rekomendasi AI dengan fallback ke semua kemungkinan nama field
        const forecastRecommendation = (
          forecastData?.recommendation ||
          forecastData?.rekomendasi ||
          forecastData?.insight ||
          forecastData?.message ||
          forecastData?.ai_recommendation ||
          forecastData?.ai_insight ||
          forecastRes?.data?.recommendation ||
          forecastRes?.data?.rekomendasi ||
          forecastRes?.data?.message ||
          ""
        )?.toString()?.trim() || "Belum ada rekomendasi AI";

        // =========================
        // PREDICTION DATA
        // =========================
        const predData = predictionRes?.data?.data || {};

        setPrediction({
          analysis: predData?.prediction?.label
            ? `Kondisi keuangan kamu ${predData.prediction.label} (${(
                predData.prediction.confidence * 100
              ).toFixed(1)}% confidence)`
            : "Belum ada analisis keuangan",

          nextMonthEstimation:
            predData?.prediction?.rekomendasi ||
            "Belum ada rekomendasi untuk saat ini.",

          label: predData?.prediction?.label || "",

          predIncome,
          predExpense,

          forecastRecommendation,
        });

        // =========================
        // CHART DATA
        // =========================
        setChartData({
          labels: monthlyArray.map((item) => {
            const val = item.month || "";
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
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: Rp ${context.raw.toLocaleString("id-ID")}`,
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
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // =========================
  // STYLE STATUS
  // =========================
  const getPredictionStyle = () => {
    const label = prediction.label?.toLowerCase();

    if (label === "aman") {
      return {
        bg: "#F0FDF4",
        border: "#22C55E",
        text: "#166534",
        accent: "#22C55E",
        icon: <BsShieldCheck size={24} />,
        status: "Aman",
      };
    }
    if (label === "rawan") {
      return {
        bg: "#FFFBEB",
        border: "#F59E0B",
        text: "#92400E",
        accent: "#F59E0B",
        icon: <BsExclamationTriangle size={24} />,
        status: "Rawan",
      };
    }
    if (label === "bahaya") {
      return {
        bg: "#FEF2F2",
        border: "#EF4444",
        text: "#991B1B",
        accent: "#EF4444",
        icon: <BsExclamationOctagon size={24} />,
        status: "Bahaya",
      };
    }
    return {
      bg: "#F8F9FA",
      border: "#DEE2E6",
      text: "#495057",
      accent: "#6C757D",
      icon: <BsQuestionCircle size={24} />,
      status: "No Data",
    };
  };

  const predStyle = getPredictionStyle();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#001E3C" }}
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
      </div>
    );
  }

  return (
    <MainLayout user={user}>
      <div className="container-fluid">
        {/* HEADER */}
        <div className="d-flex align-items-center mb-4">
          <FaChartBar className="text-primary me-3" size={30} />
          <h2 className="fw-bold mb-0 text-dark">Analisis & Prediksi Keuangan</h2>
        </div>

        {/* INFO */}
        <div
          className="alert alert-info border-0 shadow-sm mb-4 d-flex align-items-center"
          style={{ borderRadius: "12px", backgroundColor: "#E7F1FF" }}
        >
          <BsLightbulbFill className="text-primary me-3" size={20} />
          <span className="fw-semibold text-dark">
            Silahkan isi data pemasukan dan pengeluaran anda minimal 3 bulan untuk mendapatkan hasil prediksi yang lebih akurat.
          </span>
        </div>

        {/* SUMMARY SECTION */}
        <div className="row g-3 g-md-4 mb-4">
          <div className="col-sm-6 col-md-4">
            <div
              className="card h-100 border-0 shadow-sm p-2 p-md-3 bg-white"
              style={{ borderLeft: "10px solid #28A745", borderRadius: "10px" }}
            >
              <div className="card-body d-flex align-items-center">
                <FaMoneyBillWave className="me-3 me-md-4 text-success" size={35} />
                <div>
                  <h6 className="fw-bold small mb-1 text-uppercase text-muted">Total Pendapatan</h6>
                  <h3 className="fw-bold mb-0 text-dark">Rp {summary.income.toLocaleString("id-ID")}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <div
              className="card h-100 border-0 shadow-sm p-2 p-md-3 bg-white"
              style={{ borderLeft: "10px solid #DC3545", borderRadius: "10px" }}
            >
              <div className="card-body d-flex align-items-center">
                <BsFillBagCheckFill className="me-3 me-md-4 text-danger" size={35} />
                <div>
                  <h6 className="fw-bold small mb-1 text-uppercase text-muted">Total Pengeluaran</h6>
                  <h3 className="fw-bold mb-0 text-dark">Rp {summary.expense.toLocaleString("id-ID")}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4">
            <div
              className="card h-100 border-0 shadow-sm p-2 p-md-3 bg-white"
              style={{ borderLeft: "10px solid #AF52DE", borderRadius: "10px" }}
            >
              <div className="card-body d-flex align-items-center">
                <MdSavings className="me-3 me-md-4" size={40} style={{ color: "#AF52DE" }} />
                <div>
                  <h6 className="fw-bold small mb-1 text-uppercase text-muted">Rasio Tabungan</h6>
                  <h2 className="fw-bold mb-0">{summary.ratio} %</h2>
                  <span className="text-muted small fw-semibold">
                    Sisa: Rp {summary.savedAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PREDICTION CARDS */}
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col mb-4">
            <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: "16px", background: "white" }}>
              <div style={{ height: "8px", backgroundColor: predStyle.border }}></div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="p-3 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: predStyle.bg, color: predStyle.accent, border: `1px solid ${predStyle.border}` }}>
                      {predStyle.icon}
                    </div>
                    <h5 className="fw-bold mb-0 text-dark">Prediksi Pemasukan</h5>
                  </div>
                  <span className="badge px-3 py-2" style={{ backgroundColor: predStyle.border, color: "white", borderRadius: "8px" }}>{predStyle.status}</span>
                </div>
                <div className="p-3 rounded-3" style={{ backgroundColor: `${predStyle.bg}88`, borderLeft: `4px solid ${predStyle.border}` }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted small fw-bold text-uppercase">Prediksi Bulan Depan</span>
                    <span className="fw-bold text-success" style={{ fontSize: "1.2rem" }}>Rp {prediction.predIncome.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col mb-4">
            <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: "16px", background: "white" }}>
              <div style={{ height: "8px", backgroundColor: "#0D6EFD" }}></div>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="p-3 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#E7F1FF", color: "#0D6EFD", border: "1px solid #0D6EFD" }}>
                    <BsLightbulbFill size={24} />
                  </div>
                  <h5 className="fw-bold mb-0 text-dark">Prediksi Pengeluaran</h5>
                </div>
                <div className="p-3 rounded-3" style={{ backgroundColor: "#F0F7FF", borderLeft: "4px solid #0D6EFD" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted small fw-bold text-uppercase">Prediksi Bulan Depan</span>
                    <span className="fw-bold text-danger" style={{ fontSize: "1.2rem" }}>Rp {prediction.predExpense.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FORECAST */}
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-4">
          <div className="d-flex align-items-center mb-4">
            <div className="p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#E7F1FF", color: "#0D6EFD", border: "1px solid #0D6EFD" }}>
              <BsGraphUp size={22} />
            </div>
            <h5 className="fw-bold mb-0 text-dark">Analisis Forecast</h5>
          </div>
          <div className="px-2">
            <div className="mb-0">
              <h6 className="fw-bold text-primary text-uppercase small mb-2 d-flex align-items-center">
                <span className="badge bg-primary me-2" style={{ width: "4px", height: "16px", padding: 0 }}> </span>
                Insight AI
              </h6>
              <div className="p-3 rounded-3" style={{ backgroundColor: "#F0F7FF", borderLeft: "4px solid #0D6EFD" }}>
                <p className="mb-0 text-dark fw-semibold" style={{ fontSize: "1.05rem", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                  {String(prediction.forecastRecommendation)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-4">
          <h5 className="fw-bold mb-4" style={{ color: "#003366" }}>Grafik Pemasukan vs Pengeluaran Per Bulan</h5>
          <div style={{ height: "400px" }}>
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Prediksi;