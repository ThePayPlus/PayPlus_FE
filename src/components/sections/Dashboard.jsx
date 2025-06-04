"use client"

import { useState, useEffect } from "react"
import { ApiService } from "../../services/apiService.js"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Droplet,
  File,
  Heart,
  Home,
  Send,
  Truck,
  Wifi,
  Zap,
  TrendingUp,
  Target,
  Calendar,
  Bell,
  Settings,
  Users,
  LogOut,
  Plus,
  Eye,
  EyeOff,
  Menu,
  Search,
  CreditCard,
  BarChart3,
  Clock,
  X,
} from "lucide-react"
import { Link } from "react-router-dom"
import { SavingsModel } from "../../models/SavingsModel.js"
import BillController from "../../controllers/BillController"

export const Dashboard = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
  // State untuk notifikasi
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getProfile()
        if (response.success) {
          setUserData(response.data)

          const { balance, total_income, total_expense } = response.data

          const billsResponse = await ApiService.getBills()

          let billsTotal = 0
          let upcomingBills = []

          // Tambahkan ini di bagian atas import
          
          // Kemudahkan kode ini di dalam useEffect fetchUserProfile
          
          if (billsResponse.success && billsResponse.data && billsResponse.data.bills) {
            upcomingBills = billsResponse.data.bills.map((bill) => ({
              name: bill.name,
              amount: bill.amount,
              dueDate: bill.dueDate,
              category: bill.category || "Other",
            }))

            billsTotal = upcomingBills.reduce((total, bill) => total + bill.amount, 0)
            
            // Tambahkan ini untuk mendapatkan notifikasi
            const billNotifications = BillController.checkBillsStatus(upcomingBills)
            setNotifications(billNotifications)
          }

          const savingsResponse = await ApiService.getSavings()
          let savingsTotal = 0
          let savingsGoals = []

          if (savingsResponse.success && savingsResponse.data) {
            savingsTotal = Number.parseInt(savingsResponse.data.summary.total_terkumpul) || 0

            savingsGoals = savingsResponse.data.records.map((record) => {
              const savingsModel = new SavingsModel(record)
              return {
                name: savingsModel.namaSavings,
                collected: Number.parseInt(savingsModel.terkumpul),
                target: Number.parseInt(savingsModel.target),
              }
            })
          }

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
    const iconClass = "w-4 h-4"
    switch (category) {
      case "Rent":
        return <Home className={iconClass} />
      case "Electricity":
        return <Zap className={iconClass} />
      case "Internet":
        return <Wifi className={iconClass} />
      case "Water":
        return <Droplet className={iconClass} />
      case "Vehicle":
        return <Truck className={iconClass} />
      case "Heart":
        return <Heart className={iconClass} />
      default:
        return <File className={iconClass} />
    }
  }

  const handleLogout = async () => {
    try {
      const response = await ApiService.logout()
      if (response.success) {
        window.location.href = "/"
      } else {
        setError(response.message || "Logout failed")
      }
    } catch (error) {
      setError("An unexpected error occurred during logout")
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Modern Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="md:hidden mr-2 p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <img
                src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true"
                alt="PayPlus Logo"
                className="h-8"
              />
            </div>

            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1 max-w-xs mx-8">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="bg-transparent border-none focus:outline-none text-sm w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      {notifications.length}
                    </div>
                  )}
                </button>

                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg overflow-hidden shadow-xl z-10 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                      <p className="font-medium text-gray-900">Notifikasi</p>
                      <button 
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        onClick={() => setNotifications([])}
                      >
                        Hapus Semua
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${notification.type === 'overdue' ? 'bg-red-50' : 'bg-yellow-50'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <div className={`mt-0.5 p-1.5 rounded-full ${notification.type === 'overdue' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-500'}`}>
                                {notification.type === 'overdue' ? 
                                  <Clock className="w-4 h-4" /> : 
                                  <Calendar className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className={`text-sm font-semibold ${notification.type === 'overdue' ? 'text-red-700' : 'text-yellow-700'}`}>
                                  {notification.type === 'overdue' ? 'Tagihan Terlambat' : 'Tagihan Jatuh Tempo Besok'}
                                </p>
                                <p className="text-sm mt-1 text-gray-700">{notification.message}</p>
                                <Link 
                                  to="/bills" 
                                  className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center font-medium"
                                  onClick={() => setShowNotifications(false)}
                                >
                                  Lihat Detail
                                  <ArrowUpRight className="w-3 h-3 ml-1" />
                                </Link>
                              </div>
                            </div>
                            <button
                              onClick={() => dismissNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                              aria-label="Dismiss notification"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {notifications.length === 0 && (
                      <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                        <Bell className="w-8 h-8 text-gray-300 mb-2" />
                        <p>Tidak ada notifikasi</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                  alt="Profile"
                  className="w-9 h-9 rounded-full cursor-pointer border border-gray-200"
                  onClick={() => setShowDropdown(!showDropdown)}
                />

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg overflow-hidden shadow-lg z-10 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{userData?.name || "User Name"}</p>
                      <p className="text-xs text-gray-500">{userData?.phone || "08123456789"}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-500" />
                        Settings
                      </Link>
                      <Link
                        to="/friends"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Users className="w-4 h-4 mr-3 text-gray-500" />
                        Friends
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-2">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="bg-transparent border-none focus:outline-none text-sm w-full"
              />
            </div>
            <nav className="flex justify-between">
              <Link to="/dashboard" className="text-blue-600 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/transactions" className="text-gray-600 px-3 py-2 text-sm font-medium">
                Transactions
              </Link>
              <Link to="/cards" className="text-gray-600 px-3 py-2 text-sm font-medium">
                Cards
              </Link>
              <Link to="/settings" className="text-gray-600 px-3 py-2 text-sm font-medium">
                Settings
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content with Sidebar Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation - Desktop Only */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-100 p-4">
          <nav className="space-y-1 sticky top-20">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium"
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/transactions" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <BarChart3 className="w-5 h-5 mr-3 text-gray-500" />
              Transactions
            </Link>
            <Link to="/cards" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
              Cards
            </Link>
            <Link to="/savings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Target className="w-5 h-5 mr-3 text-gray-500" />
              Savings
            </Link>
            <Link to="/bills" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 mr-3 text-gray-500" />
              Bills
            </Link>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link to="/settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Settings className="w-5 h-5 mr-3 text-gray-500" />
                Settings
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8">
          {loading || financialDataLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-700">
              <div className="flex items-center">
                <span>{error}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Welcome and Balance Section - Side by Side on Desktop */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div className="md:w-1/2">
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData?.name || "User"}</h1>
                  <p className="text-gray-600 mt-1">Heres your financial overview</p>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 flex-1 min-w-[180px]">
                      <div className="p-2 bg-green-100 rounded-md">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Income</p>
                        <p className="font-bold text-gray-900">Rp. {formatCurrency(financialData.income || 0)}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 flex-1 min-w-[180px]">
                      <div className="p-2 bg-red-100 rounded-md">
                        <ArrowDownLeft className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Expense</p>
                        <p className="font-bold text-gray-900">Rp. {formatCurrency(financialData.expense || 0)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Balance Card */}
                <div className="md:w-1/2 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-blue-600 p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-blue-100 font-medium">Available Balance</p>
                          <button
                            onClick={() => setBalanceVisible(!balanceVisible)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                          >
                            {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                        <h2 className="text-3xl font-bold mt-1">
                          {balanceVisible ? `Rp. ${formatCurrency(financialData.balance || 0)}` : "Rp. ••••••••"}
                        </h2>
                      </div>
                      <Link
                        to="/topup"
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Top Up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Link
                    to="/transfer"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 text-center"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Send className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-900">Transfer</p>
                  </Link>

                  <Link
                    to="/topup"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 text-center"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Plus className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="font-medium text-gray-900">Top Up</p>
                  </Link>

                  <Link
                    to="/bills/pay"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 text-center"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="font-medium text-gray-900">Pay Bills</p>
                  </Link>

                  <Link
                    to="/savings/add"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 text-center"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="font-medium text-gray-900">Save</p>
                  </Link>
                </div>
              </div>

              {/* Recent Transactions and Upcoming Bills - Side by Side */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                    <Link to="/transactions" className="text-blue-600 text-sm font-medium hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-md mr-3">
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Salary</p>
                            <p className="text-xs text-gray-500">Income</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+Rp. 5,000,000</p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                      </div>

                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-red-100 rounded-md mr-3">
                            <ArrowDownLeft className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Groceries</p>
                            <p className="text-xs text-gray-500">Expense</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">-Rp. 250,000</p>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                      </div>

                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-red-100 rounded-md mr-3">
                            <ArrowDownLeft className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Netflix</p>
                            <p className="text-xs text-gray-500">Subscription</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">-Rp. 159,000</p>
                          <p className="text-xs text-gray-500">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Upcoming Bills</h2>
                    <Link to="/bills" className="text-blue-600 text-sm font-medium hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                      {financialData.bills &&
                      financialData.bills.upcoming &&
                      financialData.bills.upcoming.length > 0 ? (
                        financialData.bills.upcoming.slice(0, 3).map((bill, index) => (
                          <div key={index} className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="p-2 bg-amber-100 rounded-md mr-3">{getCategoryIcon(bill.category)}</div>
                              <div>
                                <p className="font-medium text-gray-900">{bill.name}</p>
                                <p className="text-xs text-gray-500">Due {bill.dueDate}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">Rp. {formatCurrency(bill.amount)}</p>
                              <div className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full inline-block">
                                Pending
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>No upcoming bills</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Goals */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Savings Goals</h2>
                  <Link to="/savings" className="text-blue-600 text-sm font-medium hover:underline">
                    View All
                  </Link>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {financialData.savings && financialData.savings.goals && financialData.savings.goals.length > 0 ? (
                      financialData.savings.goals.slice(0, 2).map((goal, index) => {
                        const progress = Math.min((goal.collected / goal.target) * 100, 100)
                        return (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <h3 className="font-medium text-gray-900">{goal.name}</h3>
                                <p className="text-xs text-gray-500">
                                  Rp {formatCurrency(goal.collected)} / {formatCurrency(goal.target)}
                                </p>
                              </div>
                              <span className="text-sm font-medium text-gray-600">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="col-span-2 text-center py-6 text-gray-500">
                        <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No savings goals yet</p>
                        <Link
                          to="/savings/create"
                          className="mt-2 inline-flex items-center text-blue-600 hover:underline text-sm font-medium"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Create a goal
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Insights */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Financial Insights</h2>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-md">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Spending Analysis</h3>
                      </div>
                      <p className="text-sm text-gray-600">Your spending is 15% lower than last month.</p>
                      <Link
                        to="/insights/spending"
                        className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline"
                      >
                        View Details
                      </Link>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-md">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Savings Potential</h3>
                      </div>
                      <p className="text-sm text-gray-600">You could save Rp. 500,000 more this month.</p>
                      <Link
                        to="/insights/savings"
                        className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline"
                      >
                        View Details
                      </Link>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-md">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Upcoming Payments</h3>
                      </div>
                      <p className="text-sm text-gray-600">3 bills due in the next 7 days.</p>
                      <Link
                        to="/insights/payments"
                        className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      <Link
        to="/transfer"
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <Send className="w-6 h-6" />
      </Link>
    </div>
  )
}

// Tambahkan fungsi dismissNotification di bawah handleLogout
const dismissNotification = (id) => {
  setNotifications(notifications.filter(notification => notification.id !== id));
}
