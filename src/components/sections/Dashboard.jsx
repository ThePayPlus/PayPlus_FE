"use client"

import { useState, useEffect } from "react"
import { ApiService } from "../../services"
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  Droplet,
  File,
  Heart,
  Home,
  Send,
  Truck,
  Wifi,
  Zap,
} from "lucide-react"
import { Link } from "react-router-dom"

export const Dashboard = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

  // Financial data state
  const [financialData, setFinancialData] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    savings: {
      total: 0,
      goals: [],
    },
    bills: {
      total: 0,
      upcoming: [],
    },
  })
  const [financialDataLoading, setFinancialDataLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getProfile()
        if (response.success) {
          setUserData(response.data)
          
          // Menggunakan data dari profil untuk balance, income, dan expense
          const { balance, total_income, total_expense } = response.data
          
          // Fetch bills data untuk fitur lainnya
          const billsResponse = await ApiService.getBills()
          
          let billsTotal = 0
          let upcomingBills = []
          
          if (billsResponse.success && billsResponse.data && billsResponse.data.bills) {
            upcomingBills = billsResponse.data.bills.map(bill => ({
              name: bill.name,
              amount: bill.amount,
              dueDate: bill.dueDate,
              category: bill.category || 'Other'
            }))
            
            billsTotal = upcomingBills.reduce((total, bill) => total + bill.amount, 0)
          }
          
          // Process savings data (this would typically come from an API, but we'll use mock data for now)
          // In a real app, you would fetch this from a savings API endpoint
          const savingsTotal = balance * 0.2 // Assuming 20% of balance is savings for demo purposes
          const savingsGoals = [
            { name: "New Car", collected: savingsTotal * 0.5, target: savingsTotal * 1.5 },
            { name: "Vacation", collected: savingsTotal * 0.3, target: savingsTotal * 0.8 },
            { name: "Emergency Fund", collected: savingsTotal * 0.2, target: savingsTotal * 1.2 },
          ]
          
          setFinancialData({
            balance: balance || 0,
            income: total_income || 0,
            expense: total_expense || 0,
            savings: {
              total: savingsTotal,
              goals: savingsGoals,
            },
            bills: {
              total: billsTotal,
              upcoming: upcomingBills,
            },
          })
        } else {
          setError(response.message || "Failed to load user profile")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error("Profile fetch error:", err)
      } finally {
        setLoading(false)
        setFinancialDataLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Rent":
        return <Home className="w-4 h-4" />
      case "Electricity":
        return <Zap className="w-4 h-4" />
      case "Internet":
        return <Wifi className="w-4 h-4" />
      case "Water":
        return <Droplet className="w-4 h-4" />
      case "Vehicle":
        return <Truck className="w-4 h-4" />
      case "Heart":
        return <Heart className="w-4 h-4" />
      default:
        return <File className="w-4 h-4" />
    }
  }

  const handleLogout = async () => {
    try {
      const response = await ApiService.logout();
      if (response.success) {
        window.location.href = '/';
      } else {
        setError(response.message || 'Logout failed');
      }
    } catch (error) {
      setError('An unexpected error occurred during logout');
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
             
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-indigo-500 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{userData?.name || "User Name"}</p>
                      <p className="text-xs text-gray-500">Account #: {userData?.phone || "08123456789"}</p>
                    </div>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Account Settings
                    </Link>
                    <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading || financialDataLoading ? (
          <p className="text-gray-600">Loading data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome back, {userData?.name || "User"}!</h1>

            {/* User Info & Balance Card */}
            <div
              className="rounded-xl p-6 mb-8 text-white"
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm opacity-90">Saldo Tersedia</p>
                  <h2 className="text-3xl font-bold mt-1">Rp. {formatCurrency(financialData.balance || 0)}</h2>
                </div>
                <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                  Top Up
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm">Pemasukan: Rp. {formatCurrency(financialData.income || 0)}</span>
                </div>
                <div className="flex items-center">
                  <ArrowDownLeft className="w-4 h-4 mr-1" />
                  <span className="text-sm">Pengeluaran: Rp. {formatCurrency(financialData.expense || 0)}</span>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 mb-8 md:grid-cols-3">
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs hover:shadow-md transition-shadow duration-300">
                <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Total Pemasukan</p>
                  <p className="text-lg font-semibold text-gray-700">
                    Rp. {formatCurrency(financialData.income || 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs hover:shadow-md transition-shadow duration-300">
                <div className="p-3 mr-4 text-red-500 bg-red-100 rounded-full">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Total Pengeluaran</p>
                  <p className="text-lg font-semibold text-gray-700">
                    Rp. {formatCurrency(financialData.expense || 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs hover:shadow-md transition-shadow duration-300">
                <div className="p-3 mr-4 text-yellow-500 bg-yellow-100 rounded-full">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Tagihan Tertunda</p>
                  <p className="text-lg font-semibold text-gray-700">Rp. {formatCurrency(financialData.bills?.total || 0)}</p>
                </div>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <Link
                to="/income"
                className="block p-6 bg-white rounded-lg shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">Income Records</h2>
                  <ChevronRight className="text-gray-500" />
                </div>
                <p className="text-gray-600">View detailed income history and analytics</p>
              </Link>
              <a
                href="/expense"
                className="block p-6 bg-white rounded-lg shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">Expense Records</h2>
                  <ChevronRight className="text-gray-500" />
                </div>
                <p className="text-gray-600">Track your spending patterns and categories</p>
              </a>
            </div>

            {/* Bills and Savings */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {/* Upcoming Bills */}
              <Link to="/bills" className="block">
                <div className="bg-white rounded-lg shadow-xs p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Upcoming Bills</h2>
                    <ChevronRight className="text-gray-500" />
                  </div>
                  <div className="space-y-4">
                    {financialData.bills && financialData.bills.upcoming && financialData.bills.upcoming.length > 0 ? (
                      financialData.bills.upcoming.map((bill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="mr-3 text-gray-500">{getCategoryIcon(bill.category)}</span>
                            <span className="text-gray-700">{bill.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-700 font-semibold">Rp {formatCurrency(bill.amount)}</p>
                            <p className="text-sm text-gray-500">Due on {bill.dueDate}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">No upcoming bills.</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>

              {/* Savings Goals */}
              <Link to="/savings" className="block">
                <div className="bg-white rounded-lg shadow-xs p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Savings Goals</h2>
                    <ChevronRight className="text-gray-500" />
                  </div>
                  <div className="space-y-4">
                    {financialData.savings && financialData.savings.goals && financialData.savings.goals.length > 0 ? (
                      financialData.savings.goals.map((goal, index) => {
                        const progress = Math.min((goal.collected / goal.target) * 100, 100)
                        return (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-700">{goal.name}</span>
                              <span className="text-gray-600">
                                Rp {formatCurrency(goal.collected)} / {formatCurrency(goal.target)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">You have no savings.</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>

            {/* Quick Transfer */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-xs p-6 hover:shadow-md transition-shadow duration-300">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Transfer</h2>
                <p className="text-gray-600 mb-4">Need to move money? Initiate a quick transfer now.</p>
                <a
                  href="/transfer"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Start New Transfer
                </a>
              </div>
            </div>

            {/* Floating Chatbot Button */}
            <button
              onClick={() => window.location.href = '/chatbot'}
              className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Chatbot
            </button>
          </>
        )}
      </main>
    </div>
  )
}
