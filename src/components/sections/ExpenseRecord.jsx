"use client"

import { useState, useEffect } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Link } from "react-router-dom"
import { ApiService } from "../../services/apiService.js"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

export default function Expense() {
  const [expenseData, setExpenseData] = useState({
    totalExpense: 0,
    totalTransactions: 0,
    normalExpense: 0,
    giftExpense: 0,
    expenseRecords: [],
  })

  const [activeFilter, setActiveFilter] = useState("all")
  const [filteredRecords, setFilteredRecords] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const calculateTotalExpense = (records) => {
    return records.reduce((acc, record) => acc + Number(record.amount), 0);
  };

  useEffect(() => {
    const fetchExpenseRecords = async () => {
      const response = await ApiService.getExpenseRecords()
      if (response.success) {
        const totalExpense = calculateTotalExpense(response.records);
        setExpenseData({
          totalExpense,
          totalTransactions: response.records.length,
          normalExpense: response.records.filter(record => record.type === "normal").reduce((acc, record) => acc + Number(record.amount), 0),
          giftExpense: response.records.filter(record => record.type === "gift").reduce((acc, record) => acc + Number(record.amount), 0),
          expenseRecords: response.records,
        });
      } else {
        console.error(response.message);
      }
    };

    fetchExpenseRecords();
  }, []);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredRecords(expenseData.expenseRecords)
    } else {
      setFilteredRecords(expenseData.expenseRecords.filter((record) => record.type === activeFilter))
    }
  }, [activeFilter, expenseData.expenseRecords])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const chartData = {
    labels: ["Normal Expense", "Gift Expense"],
    datasets: [
      {
        data: [expenseData.normalExpense, expenseData.giftExpense],
        backgroundColor: ["#3B82F6", "#8B5CF6"],
        hoverOffset: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 10,
        },
      },
    },
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard">
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </Link>
            </div>
            <nav className="hidden sm:flex space-x-4">
              <Link to="/transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Transfer
              </Link>
              <Link to="/savings" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Savings
              </Link>
              <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Bills
              </Link>
              <Link to="/income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Incomes
              </Link>
            </nav>
            <div className="sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="sm:hidden py-2 pb-4">
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/transfer"
                className="block px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Transfer
              </Link>
              <Link
                to="/savings"
                className="block px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Savings
              </Link>
              <Link
                to="/bills"
                className="block px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Bills
              </Link>
              <Link
                to="/income"
                className="block px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Incomes
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Expense Overview</h1>

        {/* Expense Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          {/* Total Expense Card */}
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="1 1 22 22">
                <path
                  fillRule="evenodd"
                  d="M7 6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M2 11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
                  clipRule="evenodd"
                />
                <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">Total Expense</p>
              <p id="totalExpense" className="text-lg font-semibold text-gray-700">
                Rp. {formatCurrency(expenseData.totalExpense)}
              </p>
            </div>
          </div>
          {/* Total Transactions */}
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">Total Transactions</p>
              <p id="totalTransactions" className="text-lg font-semibold text-gray-700">
                {expenseData.totalTransactions}
              </p>
            </div>
          </div>

          {/* Normal Expense */}
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">Normal Expense</p>
              <p id="normalExpense" className="text-lg font-semibold text-gray-700">
                Rp. {formatCurrency(expenseData.normalExpense)}
              </p>
            </div>
          </div>

          {/* Gift Expense */}
          <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                ></path>
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600">Gift Expense</p>
              <p id="giftExpense" className="text-lg font-semibold text-gray-700">
                Rp. {formatCurrency(expenseData.giftExpense)}
              </p>
            </div>
          </div>
        </div>

        {/* Expense Distribution Chart */}
        <div className="mb-8 bg-white rounded-lg shadow-xs p-4 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Expense Distribution</h2>
          <div style={{ width: "300px", height: "150px" }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="flex justify-between items-center mb-6 flex-wrap">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Transactions</h2>
          <div className="space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`filter-btn px-4 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white ${
                activeFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("normal")}
              className={`filter-btn px-4 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white ${
                activeFilter === "normal" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setActiveFilter("gift")}
              className={`filter-btn px-4 py-2 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white ${
                activeFilter === "gift" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Gift
            </button>
          </div>
        </div>

        {/* Expense Cards */}
        <div id="expenseCards" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((expense, index) => (
              <div
                key={expense.id}
                className="bg-white shadow rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg expense-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-800">Rp. {formatCurrency(expense.amount)}</span>
                    <span className="text-sm font-medium text-gray-500">{expense.date}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sender:</span>
                      <span className="font-medium text-gray-800">{expense.senderName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span
                        className={`font-medium ${
                          expense.type === "gift"
                            ? "text-purple-600"
                            : "text-blue-600"
                        }`}
                      >
                        {expense.type.charAt(0).toUpperCase() + expense.type.slice(1)}
                      </span>
                    </div>
                    {expense.type === "gift" && expense.message && (
                      <div className="mt-4">
                        <span className="text-sm text-gray-600">Message:</span>
                        <p className="mt-1 text-sm text-gray-800">{expense.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-600">No expense records found.</p>
          )}
        </div>
      </main>

      <style>{`
        .expense-card {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.3s ease forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-btn {
          transition: background-color 0.3s, color 0.3s;
        }
      `}</style>
    </div>
  )
}
