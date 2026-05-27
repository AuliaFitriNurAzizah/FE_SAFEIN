import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import MainLayout from "../components/MainLayout";
import { Link } from "react-router-dom";

import { MdSavings } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { 
  BsFillBagCheckFill, 
  BsShieldCheck, 
  BsExclamationTriangle, 
  BsExclamationOctagon, 
  BsQuestionCircle, 
  BsLightbulbFill, 
  BsGraphUp 
} from "react-icons/bs";
import { showAlert } from "../utils/swal";

// =========================
// DATE PICKER
// =========================
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const Dashboard = () => {
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
    ratio: 0,
    savedAmount: 0,
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
  // FILTER MODE
  // =========================
  const [filterMode, setFilterMode] = useState("preset");

  // =========================
  // PRESET FILTER
  // =========================
  const [timeRange, setTimeRange] = useState({
    range: "90d",
    groupBy: "month",
  });

  // =========================
  // CUSTOM DATE RANGE
  // =========================
  const [dateRange, setDateRange] = useState([null, null]);

  const [startDate, endDate] = dateRange;

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const formattedStart = startDate?.toISOString().split("T")[0];

        const formattedEnd = endDate?.toISOString().split("T")[0];

        const queryParams =
          filterMode === "custom"
            ? `startDate=${formattedStart}&endDate=${formattedEnd}&groupBy=day`
            : `range=${timeRange.range}&groupBy=${timeRange.groupBy}`;

        const summaryParams =
          filterMode === "custom"
            ? `startDate=${formattedStart}&endDate=${formattedEnd}`
            : `range=${timeRange.range}`;

        const [profileRes, summaryRes, monthlyRes, predictionRes] =
          await Promise.all([
            api.get("/users/me"),

            api.get(`/transactions/summary?${summaryParams}`),

            api.get(`/transactions/summary/monthly?${queryParams}`),

            api.get("/financial-analysis/latest"),
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
        // SUMMARY DATA
        // =========================
        const summaryData = summaryRes?.data?.data || {};

        const income = summaryData.totalIncome || 0;
        const expense = summaryData.totalExpense || 0;
        const savedAmount =
          summaryData.savedAmount !== undefined
            ? summaryData.savedAmount
            : income - expense;

        let ratio = 0;
        if (summaryData.savingRatio !== undefined) {
          ratio = Math.round(summaryData.savingRatio);
        } else if (income > 0) {
          ratio = Math.round((savedAmount / income) * 100);
        }

        setSummary({
          income,
          expense,
          ratio: ratio < 0 ? 0 : ratio,
          savedAmount,
        });

        // =========================
        // NEW USER ALERT
        // =========================
        if (income === 0 && expense === 0) {
          showAlert(
            "Halo!",
            "info",
            "Selamat datang! Silakan isi data Pemasukan dan Pengeluaran Anda terlebih dahulu agar sistem dapat menganalisis kondisi keuangan Anda."
          ).then(() => {
            navigate("/pemasukan");
          });
        }

        // =========================
        // PREDICTION DATA
        // =========================
        const predData = predictionRes?.data?.data;

        if (predData?.prediction?.label) {
          setPrediction({
            analysis: `Kondisi keuangan kamu ${predData.prediction.label} (${(
              predData.prediction.confidence * 100
            ).toFixed(1)}% confidence)`,
            nextMonthEstimation: predData.prediction.rekomendasi || "Belum ada rekomendasi untuk saat ini.",
            label: predData.prediction.label,
          });
        } else {
          // Tetap kosong jika tidak ada data analisis (user baru)
          setPrediction({
            analysis: "",
            nextMonthEstimation: "",
            label: "",
          });
        }

        // =========================
        // CHART DATA
        // =========================
        const monthlyArray = monthlyRes?.data?.data || [];

        setChartData({
          labels: monthlyArray.map((item) => {
            const val = item.label || item.month || item.date || "";
            // Format YYYY-MM-DD to DD MMM
            if (val.match(/^\d{4}-\d{2}-\d{2}$/)) {
              const d = new Date(val);
              return d.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
              });
            }
            // Format YYYY-MM to MMM YY
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

              backgroundColor: "rgba(40, 167, 69, 0.15)",

              fill: true,

              borderWidth: 3,

              tension: 0,

              pointRadius: 4,

              pointBackgroundColor: "#28A745",
            },

            {
              label: "Pengeluaran",

              data: monthlyArray.map((item) => item.expense),

              borderColor: "#DC3545",

              backgroundColor: "rgba(220, 53, 69, 0.15)",

              fill: true,

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

    // =========================
    // VALIDASI CUSTOM DATE
    // =========================
    if (filterMode === "custom" && (!startDate || !endDate)) {
      return;
    }

    fetchData();
  }, [navigate, timeRange, filterMode, startDate, endDate]);

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
          label: function (context) {
            return `${context.dataset.label}: Rp ${context.raw.toLocaleString(
              "id-ID",
            )}`;
          },
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
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundColor: "#001E3C",
        }}
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
      </div>
    );
  }

  // =========================
  // PREDIKSI STYLING
  // =========================
  const getPredictionStyle = () => {
    const label = prediction.label?.toLowerCase();
    const isDataAvailable = summary.income > 0 || summary.expense > 0;

    if (!isDataAvailable) {
      return {
        bg: "#F8F9FA",
        border: "#DEE2E6",
        text: "#495057",
        accent: "#6C757D",
        icon: <BsQuestionCircle size={20} />,
        status: "No Data"
      };
    }

    if (label === "aman") {
      return {
        bg: "#F0FDF4",
        border: "#22C55E",
        text: "#166534",
        accent: "#22C55E",
        icon: <BsShieldCheck size={20} />,
        status: "Aman"
      };
    }
    if (label === "rawan") {
      return {
        bg: "#FFFBEB",
        border: "#F59E0B",
        text: "#92400E",
        accent: "#F59E0B",
        icon: <BsExclamationTriangle size={20} />,
        status: "Rawan"
      };
    }
    if (label === "bahaya") {
      return {
        bg: "#FEF2F2",
        border: "#EF4444",
        text: "#991B1B",
        accent: "#EF4444",
        icon: <BsExclamationOctagon size={20} />,
        status: "Bahaya"
      };
    }
    return {
      bg: "#F8F9FA",
      border: "#DEE2E6",
      text: "#495057",
      accent: "#6C757D",
      icon: <BsQuestionCircle size={20} />,
      status: "Unknown"
    };
  };

  const predStyle = getPredictionStyle();

  return (
    <MainLayout user={user}>
      {/* SUMMARY */}
<div className="row g-3 g-md-4 mb-4">
  {/* PENDAPATAN */}
  <div className="col-sm-6 col-md-4">
    <Link to="/pemasukan" className="text-decoration-none">
      <div
        className="card h-100 border-0 shadow-sm p-2 p-md-3 bg-white"
        style={{
          borderLeft: "10px solid #28A745",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        <div className="card-body d-flex align-items-center">
          <FaMoneyBillWave className="me-3 me-md-4 text-success" size={35} />
          <div>
            <h6 className="fw-bold small mb-1 text-uppercase text-muted">Pendapatan</h6>
            <h3 className="fw-bold mb-0 text-dark">
              Rp {summary.income.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  </div>

  {/* PENGELUARAN */}
  <div className="col-sm-6 col-md-4">
    <Link to="/pengeluaran" className="text-decoration-none">
      <div
        className="card h-100 border-0 shadow-sm p-2 p-md-3 bg-white"
        style={{
          borderLeft: "10px solid #DC3545",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        <div className="card-body d-flex align-items-center">
          <BsFillBagCheckFill className="me-3 me-md-4 text-danger" size={35} />
          <div>
            <h6 className="fw-bold small mb-1 text-uppercase text-muted">Pengeluaran</h6>
            <h3 className="fw-bold mb-0 text-dark">
              Rp {summary.expense.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  </div>

  {/* TABUNGAN */}
  <div className="col-sm-12 col-md-4">
    <div
      className="card h-100 border-0 shadow-sm p-2 p-md-3 bg-white"
      style={{
        borderLeft: "10px solid #AF52DE",
        borderRadius: "10px",
      }}
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
      

      {/* PREDIKSI & ESTIMASI */}
      <div className="row row-cols-1 row-cols-lg-2 g-4 mb-4">
        {/* PREDIKSI */}
        <div className="col">
          <div
            className="card border-0 shadow-sm overflow-hidden position-relative h-100"
            style={{ borderRadius: "16px", background: "white" }}
          >
            <div 
              className="position-absolute top-0 start-0 bottom-0" 
              style={{ width: "12px", backgroundColor: predStyle.border }}
            ></div>
            <div className="card-body p-4 ms-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" 
                    style={{ backgroundColor: predStyle.bg, color: predStyle.accent, border: `1px solid ${predStyle.border}` }}
                  >
                    <BsGraphUp size={22} />
                  </div>
                  <h5 className="fw-bold mb-0 text-dark">
                    Prediksi Kondisi Keuangan
                  </h5>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Link to="/prediksi" className="btn btn-sm btn-outline-primary fw-bold px-3" style={{ borderRadius: '8px', fontSize: '0.75rem' }}>
                    Lihat Detail
                  </Link>
                  <span 
                    className="badge px-3 py-2" 
                    style={{ 
                      backgroundColor: predStyle.border, 
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      borderRadius: "8px",
                      textTransform: "uppercase"
                    }}
                  >
                    {predStyle.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 p-3 rounded-3" style={{ backgroundColor: `${predStyle.bg}88`, borderLeft: `4px solid ${predStyle.border}` }}>
                <p className="mb-0 fw-semibold text-dark" style={{ fontSize: "1.05rem", lineHeight: "1.6" }}>
                  {(summary.income > 0 || summary.expense > 0) 
                    ? (prediction.analysis || "Belum ada analisis.") 
                    : "Belum ada data untuk dianalisis."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ESTIMASI */}
        <div className="col">
          <div
            className="card border-0 shadow-sm overflow-hidden position-relative h-100"
            style={{ borderRadius: "16px", background: "white" }}
          >
            <div 
              className="position-absolute top-0 start-0 bottom-0" 
              style={{ width: "12px", backgroundColor: "#0D6EFD" }}
            ></div>
            <div className="card-body p-4 ms-3">
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" 
                  style={{ backgroundColor: "#E7F1FF", color: "#0D6EFD", border: "1px solid #0D6EFD" }}
                >
                  <BsLightbulbFill size={22} />
                </div>
                <h5 className="fw-bold mb-0 text-dark">
                  Estimasi & Tips Keuangan
                </h5>
              </div>
              
              <div className="mt-2 p-3 rounded-3" style={{ backgroundColor: "#F0F7FF", borderLeft: "4px solid #0D6EFD" }}>
                <p className="mb-0 fw-semibold text-dark" style={{ fontSize: "1.05rem", lineHeight: "1.6" }}>
                  {(summary.income > 0 || summary.expense > 0) 
                    ? (prediction.nextMonthEstimation || "Belum ada estimasi.") 
                    : "Belum ada data untuk estimasi."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="card border-0 shadow-sm p-4 bg-white rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h5
            className="fw-bold mb-0"
            style={{
              color: "#003366",
            }}
          >
            Perbandingan Pemasukan vs Pengeluaran
          </h5>

          {/* FILTER */}
          <div className="d-flex flex-wrap gap-2 align-items-center">
            {/* MODE */}
            <select
              className="form-select"
              style={{ width: "180px" }}
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
            >
              <option value="preset">Filter Cepat</option>

              <option value="custom">Custom Tanggal</option>
            </select>

            {/* PRESET */}
            {filterMode === "preset" && (
              <select
                className="form-select"
                style={{ width: "220px" }}
                value={`${timeRange.range}-${timeRange.groupBy}`}
                onChange={(e) => {
                  const value = e.target.value;

                  switch (value) {
                    case "30d-day":
                      setTimeRange({
                        range: "30d",
                        groupBy: "day",
                      });
                      break;

                    case "60d-day":
                      setTimeRange({
                        range: "60d",
                        groupBy: "day",
                      });
                      break;

                    case "90d-day":
                      setTimeRange({
                        range: "90d",
                        groupBy: "day",
                      });
                      break;

                    case "90d-month":
                      setTimeRange({
                        range: "90d",
                        groupBy: "month",
                      });
                      break;

                    default:
                      break;
                  }
                }}
              >
                <option value="30d-day">30 Hari Terakhir</option>

                <option value="60d-day">60 Hari Terakhir</option>

                <option value="90d-day">90 Hari Terakhir</option>

                <option value="90d-month">Per Bulan</option>
              </select>
            )}

            {/* CUSTOM DATE */}
            {filterMode === "custom" && (
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                placeholderText="Pilih rentang tanggal"
                className="form-control"
                dateFormat="dd/MM/yyyy"
              />
            )}
          </div>
        </div>

        {/* CHART */}
        <div style={{ height: "350px" }}>
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
