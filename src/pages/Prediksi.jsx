import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import MainLayout from "../components/MainLayout";

import {
  BsShieldCheck,
  BsExclamationTriangle,
  BsExclamationOctagon,
  BsQuestionCircle,
  BsLightbulbFill,
  BsGraphUp,
  BsClipboardData,
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
  const [hasEnoughData, setHasEnoughData] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          incomeTransRes,
          expenseTransRes,
          predictionRes,
          forecastRes,
        ] = await Promise.all([
          api.get("/users/me"),
          api.get("/transactions?type=income"),
          api.get("/transactions?type=expense"),
          api.get("/financial-analysis/latest").catch(() => ({ data: {} })),
          api.get("/expense-prediction/forecast").catch(() => ({ data: {} })),
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
        const incomeTransactions =
          incomeTransRes.data?.data || incomeTransRes.data || [];
        const expenseTransactions =
          expenseTransRes.data?.data || expenseTransRes.data || [];

        const monthlyMap = {};

        incomeTransactions.forEach((t) => {
          const date = new Date(t.date || t.created_at || t.createdAt);
          if (isNaN(date)) return;
          const key = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
          monthlyMap[key].income += Number(t.amount) || 0;
        });

        expenseTransactions.forEach((t) => {
          const date = new Date(t.date || t.created_at || t.createdAt);
          if (isNaN(date)) return;
          const key = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
          monthlyMap[key].expense += Number(t.amount) || 0;
        });

        const sortedKeys = Object.keys(monthlyMap).sort();
        const monthlyArray = sortedKeys.map((key) => ({
          month: key,
          income: monthlyMap[key].income,
          expense: monthlyMap[key].expense,
        }));

        const enough = sortedKeys.length >= 3;
        setHasEnoughData(enough);

        // =========================
        // FORECAST DATA
        // =========================
        console.log(
          "FORECAST RAW RESPONSE:",
          JSON.stringify(forecastRes?.data, null, 2)
        );

        const forecastData =
          forecastRes?.data?.data || forecastRes?.data || {};

        // =========================
        // PERSONALIZED FALLBACK
        // =========================
        // Hitung rata-rata histori user sebagai prediksi cadangan jika AI tidak mengembalikan nilai
        const avgIncome = monthlyArray.length > 0
          ? monthlyArray.reduce((sum, item) => sum + item.income, 0) / monthlyArray.length
          : 0;
        const avgExpense = monthlyArray.length > 0
          ? monthlyArray.reduce((sum, item) => sum + item.expense, 0) / monthlyArray.length
          : 0;

        // Gunakan nilai AI jika ada (> 0), jika tidak gunakan rata-rata histori (disesuaikan per user)
        const predIncome = Number(forecastData?.pred_income) > 0 
          ? Number(forecastData?.pred_income) 
          : Math.round(avgIncome);
          
        const predExpense = Number(forecastData?.pred_expense) > 0 
          ? Number(forecastData?.pred_expense) 
          : Math.round(avgExpense);

        let forecastRecommendation = (
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
        )
          ?.toString()
          ?.trim();

        // Jika rekomendasi AI kosong, buat rekomendasi personal berdasarkan data user
        if (!forecastRecommendation || forecastRecommendation === "Belum ada rekomendasi AI") {
          const ratio = avgIncome > 0 ? (avgExpense / avgIncome) * 100 : 0;
          if (ratio > 90) {
            forecastRecommendation = `Halo ${infoUser?.name || "User"}, pengeluaran Anda hampir mencapai 100% dari pemasukan. Kami sarankan untuk mengurangi pengeluaran non-prioritas bulan depan.`;
          } else if (ratio > 70) {
            forecastRecommendation = `Halo ${infoUser?.name || "User"}, pengeluaran Anda cukup tinggi (sekitar ${Math.round(ratio)}%). Cobalah untuk lebih hemat agar tabungan Anda bisa meningkat.`;
          } else if (avgIncome > 0) {
            forecastRecommendation = `Halo ${infoUser?.name || "User"}, kondisi keuangan Anda terlihat sehat. Pertahankan rasio pengeluaran saat ini untuk tabungan masa depan.`;
          } else {
            forecastRecommendation = "Silahkan terus catat transaksi Anda untuk mendapatkan analisis yang lebih mendalam.";
          }
        }

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

        // Helper: format label bulan dari key "YYYY-MM"
        const formatMonthLabel = (val) => {
          if (val && val.match(/^\d{4}-\d{2}$/)) {
            const [y, m] = val.split("-");
            const d = new Date(parseInt(y), parseInt(m) - 1);
            return d.toLocaleDateString("id-ID", {
              month: "short",
              year: "2-digit",
            });
          }
          return val || "";
        };

        // Label bulan depan (prediksi)
        let nextMonthLabel = "Prediksi";
        if (sortedKeys.length > 0) {
          const lastKey = sortedKeys[sortedKeys.length - 1];
          const [y, m] = lastKey.split("-");
          // new Date(year, month) → month adalah 0-index, jadi parseInt(m) sudah = bulan depan
          const nextDate = new Date(parseInt(y), parseInt(m));
          nextMonthLabel =
            nextDate.toLocaleDateString("id-ID", {
              month: "short",
              year: "2-digit",
            }) + " ★";
        }

        // Gabungkan label aktual + label bulan prediksi
        const chartLabels = [
          ...monthlyArray.map((item) => formatMonthLabel(item.month)),
          nextMonthLabel,
        ];

        // Gabungkan data aktual + prediksi
        const incomeFullData = [
          ...monthlyArray.map((item) => item.income),
          predIncome,
        ];
        const expenseFullData = [
          ...monthlyArray.map((item) => item.expense),
          predExpense,
        ];

        setChartData({
          labels: chartLabels,
          datasets: [
            // ── Garis Pemasukan ──
            {
              label: "Pemasukan",
              data: incomeFullData,
              borderColor: "#28A745",
              backgroundColor: "rgba(40, 167, 69, 0.1)",
              fill: true,
              tension: 0,
              borderWidth: 3,
              pointRadius: (ctx) => {
                // Titik terakhir (prediksi) lebih besar
                return ctx.dataIndex === incomeFullData.length - 1 ? 8 : 4;
              },
              pointBackgroundColor: (ctx) => {
                return ctx.dataIndex === incomeFullData.length - 1 ? "#fff" : "#28A745";
              },
              pointBorderColor: "#28A745",
              pointBorderWidth: 2,
              pointStyle: (ctx) => {
                return ctx.dataIndex === incomeFullData.length - 1 ? "star" : "circle";
              },
              segment: {
                borderDash: (ctx) => (ctx.p1DataIndex === incomeFullData.length - 1 ? [7, 4] : undefined),
              },
            },
            // ── Garis Pengeluaran ──
            {
              label: "Pengeluaran",
              data: expenseFullData,
              borderColor: "#DC3545",
              backgroundColor: "rgba(220, 53, 69, 0.1)",
              fill: true,
              tension: 0,
              borderWidth: 3,
              pointRadius: (ctx) => {
                return ctx.dataIndex === expenseFullData.length - 1 ? 8 : 4;
              },
              pointBackgroundColor: (ctx) => {
                return ctx.dataIndex === expenseFullData.length - 1 ? "#fff" : "#DC3545";
              },
              pointBorderColor: "#DC3545",
              pointBorderWidth: 2,
              pointStyle: (ctx) => {
                return ctx.dataIndex === expenseFullData.length - 1 ? "star" : "circle";
              },
              segment: {
                borderDash: (ctx) => (ctx.p1DataIndex === expenseFullData.length - 1 ? [7, 4] : undefined),
              },
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
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            const raw = context.raw;
            if (raw === null || raw === undefined) return null;
            return `${context.dataset.label}: Rp ${raw.toLocaleString("id-ID")}`;
          },
          title: (items) => {
            if (!items.length) return "";
            const label = items[0].label || "";
            return label.includes("★") ? `${label} (Prediksi)` : label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `Rp ${value.toLocaleString("id-ID")}`,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          // Beri warna berbeda untuk label prediksi
          color: (ctx) => {
            const label = ctx.chart.data.labels?.[ctx.index] || "";
            return label.includes("★") ? "#6C757D" : "#666";
          },
          font: (ctx) => {
            const label = ctx.chart.data.labels?.[ctx.index] || "";
            return {
              weight: label.includes("★") ? "bold" : "normal",
              size: isMobile ? 10 : 12,
            };
          },
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
          <h2 className="fw-bold mb-0 text-dark">
            Analisis & Prediksi Keuangan
          </h2>
        </div>

        {!hasEnoughData ? (
          <div className="row justify-content-center mt-5">
            <div className="col-md-8 text-center">
              <div
                className="card border-0 shadow-sm p-5 bg-white"
                style={{ borderRadius: "20px" }}
              >
                <div className="mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center p-4 rounded-circle mb-3"
                    style={{ backgroundColor: "#FFFBEB", color: "#F59E0B" }}
                  >
                    <BsClipboardData size={60} />
                  </div>
                  <h3 className="fw-bold text-dark mt-3">Data Belum Mencukupi</h3>
                  <p className="text-muted fw-semibold mx-auto" style={{ maxWidth: "500px", fontSize: "1.1rem" }}>
                    Kami membutuhkan data transaksi minimal <strong>3 bulan terakhir</strong> untuk memberikan analisis dan prediksi keuangan yang akurat untuk Anda.
                  </p>
                </div>
                
                <div className="alert alert-warning border-0 mb-4 d-inline-block mx-auto" style={{ backgroundColor: "#FFFBEB", borderRadius: "10px" }}>
                  <BsExclamationTriangle className="me-2" />
                  <span className="small fw-bold text-dark">
                    Silahkan isi data pemasukan dan pengeluaran Anda terlebih dahulu.
                  </span>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <Link
                    to="/pemasukan"
                    className="btn btn-primary px-4 py-2 fw-bold shadow-sm"
                    style={{ borderRadius: "10px" }}
                  >
                    Input Pemasukan
                  </Link>
                  <Link
                    to="/pengeluaran"
                    className="btn btn-outline-danger px-4 py-2 fw-bold shadow-sm"
                    style={{ borderRadius: "10px" }}
                  >
                    Input Pengeluaran
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* INFO */}
            <div
              className="alert alert-info border-0 shadow-sm mb-4 d-flex align-items-start"
              style={{ borderRadius: "12px", backgroundColor: "#E7F1FF" }}
            >
              <BsLightbulbFill
                className="text-primary me-3 flex-shrink-0 mt-1"
                size={20}
              />
              <span className="fw-semibold text-dark">
                Silahkan isi data pemasukan dan pengeluaran anda minimal 3 bulan
                untuk mendapatkan hasil prediksi yang lebih akurat.
              </span>
            </div>

            {/* PREDICTION CARDS */}
            <div className="row row-cols-1 row-cols-md-2 g-4">
              <div className="col mb-4">
                <div
                  className="card border-0 shadow-sm h-100 overflow-hidden"
                  style={{ borderRadius: "16px", background: "white" }}
                >
                  <div
                    style={{
                      height: "8px",
                      backgroundColor: predStyle.border,
                    }}
                  ></div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="d-flex align-items-center">
                        <div
                          className="p-3 rounded-3 me-3 d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: predStyle.bg,
                            color: predStyle.accent,
                            border: `1px solid ${predStyle.border}`,
                          }}
                        >
                          {predStyle.icon}
                        </div>
                        <h5 className="fw-bold mb-0 text-dark">
                          Prediksi Pemasukan
                        </h5>
                      </div>
                      <span
                        className="badge px-3 py-2"
                        style={{
                          backgroundColor: predStyle.border,
                          color: "white",
                          borderRadius: "8px",
                        }}
                      >
                        {predStyle.status}
                      </span>
                    </div>
                    <div
                      className="p-3 rounded-3"
                      style={{
                        backgroundColor: `${predStyle.bg}88`,
                        borderLeft: `4px solid ${predStyle.border}`,
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted small fw-bold text-uppercase">
                          Prediksi Bulan Depan
                        </span>
                        <span
                          className="fw-bold text-success"
                          style={{ fontSize: "1.2rem" }}
                        >
                          Rp {prediction.predIncome.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mb-4">
                <div
                  className="card border-0 shadow-sm h-100 overflow-hidden"
                  style={{ borderRadius: "16px", background: "white" }}
                >
                  <div
                    style={{ height: "8px", backgroundColor: "#DC3545" }}
                  ></div>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="p-3 rounded-3 me-3 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "#FEF2F2",
                          color: "#DC3545",
                          border: "1px solid #DC3545",
                        }}
                      >
                        <BsExclamationTriangle size={24} />
                      </div>
                      <h5 className="fw-bold mb-0 text-dark">
                        Prediksi Pengeluaran
                      </h5>
                    </div>
                    <div
                      className="p-3 rounded-3"
                      style={{
                        backgroundColor: "#FFF5F5",
                        borderLeft: "4px solid #DC3545",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted small fw-bold text-uppercase">
                          Prediksi Bulan Depan
                        </span>
                        <span
                          className="fw-bold text-danger"
                          style={{ fontSize: "1.2rem" }}
                        >
                          Rp {prediction.predExpense.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FORECAST */}
            <div className={`card border-0 shadow-sm ${isMobile ? 'p-3' : 'p-4'} mb-4 bg-white rounded-4`}>
              <div className="d-flex align-items-center mb-4">
                <div
                  className="p-2 rounded-3 me-3 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#E7F1FF",
                    color: "#0D6EFD",
                    border: "1px solid #0D6EFD",
                  }}
                >
                  <BsGraphUp size={22} />
                </div>
                <h5 className="fw-bold mb-0 text-dark">Analisis Forecast</h5>
              </div>
              <div className="px-2">
                <div className="mb-0">
                  <h6 className="fw-bold text-primary text-uppercase small mb-2 d-flex align-items-center">
                    <span
                      className="badge bg-primary me-2"
                      style={{ width: "4px", height: "16px", padding: 0 }}
                    >
                      {" "}
                    </span>
                    Insight AI
                  </h6>
                  <div
                    className="p-3 rounded-3"
                    style={{
                      backgroundColor: "#F0F7FF",
                      borderLeft: "4px solid #0D6EFD",
                    }}
                  >
                    <p
                      className="mb-0 text-dark fw-semibold"
                      style={{
                        fontSize: isMobile ? "0.95rem" : "1.05rem",
                        lineHeight: "1.7",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {String(prediction.forecastRecommendation)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className={`card border-0 shadow-sm ${isMobile ? 'p-3' : 'p-4'} mb-4 bg-white rounded-4`}>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
                <h5 className="fw-bold mb-3 mb-md-0" style={{ color: "#003366" }}>
                  Grafik Pemasukan vs Pengeluaran Per Bulan
                </h5>
                {/* Keterangan garis prediksi */}
                <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
                  <span
                    className="small text-muted d-flex align-items-center gap-1"
                  >
                    <svg width="24" height="10">
                      <line
                        x1="0" y1="5" x2="24" y2="5"
                        stroke="#28A745"
                        strokeWidth="2"
                        strokeDasharray="5,3"
                      />
                    </svg>
                    <span style={{ fontSize: isMobile ? '10px' : 'inherit' }}>= Prediksi Pemasukan (Hijau)</span>
                  </span>
                  <span
                    className="small text-muted d-flex align-items-center gap-1"
                  >
                    <svg width="24" height="10">
                      <line
                        x1="0" y1="5" x2="24" y2="5"
                        stroke="#DC3545"
                        strokeWidth="2"
                        strokeDasharray="5,3"
                      />
                    </svg>
                    <span style={{ fontSize: isMobile ? '10px' : 'inherit' }}>= Prediksi Pengeluaran (Merah)</span>
                  </span>
                  <span className="small text-muted" style={{ fontSize: isMobile ? '10px' : 'inherit' }}>★ = Titik prediksi</span>
                </div>
              </div>
              <div style={{ height: isMobile ? "300px" : "450px" }}>
                <Line options={chartOptions} data={chartData} />
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Prediksi;