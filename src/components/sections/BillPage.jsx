"use client"

import { useState, useEffect } from "react"
import { ApiService } from '../../services/apiService.js';
import { 
  Home, 
  Zap, 
  Wifi, 
  Droplet, 
  Truck, 
  Heart, 
  File,
  AlertTriangle,
  X,
  Pencil,
  Plus,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from "lucide-react"
import { Link } from "react-router-dom"

export const BillPage = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showAddBillForm, setShowAddBillForm] = useState(false)
  const [editingBill, setEditingBill] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'Rent'
  })
  const [totalBillAmount, setTotalBillAmount] = useState(0)
  const [billsByCategory, setBillsByCategory] = useState({})
  const [expandedCategories, setExpandedCategories] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    fetchBills()
  }, [])

  useEffect(() => {
    if (bills.length > 0) {
      // Hitung total tagihan
      const total = bills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0)
      setTotalBillAmount(total)
      
      // Kelompokkan tagihan berdasarkan kategori
      const byCategory = bills.reduce((acc, bill) => {
        const category = bill.category || 'Other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(bill)
        return acc
      }, {})
      
      setBillsByCategory(byCategory)
    }
  }, [bills])

  const fetchBills = async () => {
    try {
      setLoading(true)
      const response = await ApiService.getBills()
      if (response.success && response.data && response.data.bills) {
        const sortedBills = response.data.bills.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate)
        })
        setBills(sortedBills)
        checkBillsStatus(sortedBills)
      } else {
        setError(response.message || "Gagal memuat data tagihan")
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga")
      console.error("Error fetching bills:", err)
    } finally {
      setLoading(false)
    }
  }

  const checkBillsStatus = (billsList) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const newNotifications = []
    
    billsList.forEach(bill => {
      const dueDate = new Date(bill.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      
      // Cek tagihan yang sudah jatuh tempo (overdue)
      if (dueDate < today) {
        newNotifications.push({
          id: `overdue-${bill.name}-${bill.dueDate}`,
          type: 'overdue',
          message: `Bill ${bill.name} of Rp ${formatCurrency(bill.amount)} is overdue since ${formatDate(bill.dueDate)}`,
          bill
        })
      } 
      // Cek tagihan yang akan jatuh tempo besok (H-1)
      else if (dueDate.getTime() === tomorrow.getTime()) {
        newNotifications.push({
          id: `due-tomorrow-${bill.name}-${bill.dueDate}`,
          type: 'due-tomorrow',
          message: `Bill ${bill.name} of Rp ${formatCurrency(bill.amount)} is due tomorrow`,
          bill
        })
      }
    })
    
    setNotifications(newNotifications)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const isOverdue = (dueDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const billDueDate = new Date(dueDate)
    billDueDate.setHours(0, 0, 0, 0)
    return billDueDate < today
  }

  const isDueTomorrow = (dueDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const billDueDate = new Date(dueDate)
    billDueDate.setHours(0, 0, 0, 0)
    
    return billDueDate.getTime() === tomorrow.getTime()
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Rent":
        return <Home className="w-5 h-5" />
      case "Electricity":
        return <Zap className="w-5 h-5" />
      case "Internet":
        return <Wifi className="w-5 h-5" />
      case "Water":
        return <Droplet className="w-5 h-5" />
      case "Vehicle":
        return <Truck className="w-5 h-5" />
      case "Heart":
        return <Heart className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Rent":
        return "bg-indigo-200 text-indigo-800"
      case "Electricity":
        return "bg-indigo-200 text-indigo-800"
      case "Internet":
        return "bg-indigo-200 text-indigo-800"
      case "Water":
        return "bg-indigo-200 text-indigo-800"
      case "Vehicle":
        return "bg-indigo-200 text-indigo-800"
      case "Heart":
        return "bg-indigo-200 text-indigo-800"
      default:
        return "bg-indigo-200 text-indigo-800"
    }
  }
  
  const toggleCategoryExpand = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const dismissNotification = (notificationId) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editingBill) {
      setEditingBill({
        ...editingBill,
        [name]: value
      })
    } else {
      setNewBill({
        ...newBill,
        [name]: value
      })
    }
  }

  // Fungsi untuk menambahkan tagihan baru
  const handleAddBill = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Validasi input
      if (!newBill.name || !newBill.amount || !newBill.dueDate || !newBill.category) {
        setError("All fields must be filled in")
        return
      }
      
      const response = await ApiService.addBill(
        newBill.name,
        parseFloat(newBill.amount),
        newBill.dueDate,
        newBill.category
      )
      
      if (response.success) {
        setSuccessMessage("Bill added successfully")
        
        // Reset form
        setNewBill({
          name: '',
          amount: '',
          dueDate: '',
          category: 'Rent'
        })
        
        setShowAddBillForm(false)
        fetchBills() // Refresh daftar tagihan
        
        // Hilangkan pesan sukses setelah 3 detik
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      } else {
        setError(response.message || "Failed to add bill")
      }
    } catch (err) {
      setError("An error occurred while adding a bill")
      console.error("Error adding bill:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditBill = (bill) => {
    setEditingBill(bill)
    setShowAddBillForm(true)
  }

  // Fungsi untuk memperbarui tagihan
  const handleUpdateBill = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Validasi input
      if (!editingBill.name || !editingBill.amount || !editingBill.dueDate || !editingBill.category) {
        setError("All fields must be filled in")
        return
      }
      
      const response = await ApiService.updateBill(
        editingBill.id,
        editingBill.name,
        parseFloat(editingBill.amount),
        editingBill.dueDate,
        editingBill.category
      )
      
      if (response.success) {
        setSuccessMessage("Bill updated successfully")
        setEditingBill(null)
        setShowAddBillForm(false)
        fetchBills() // Refresh daftar tagihan
        
        // Hilangkan pesan sukses setelah 3 detik
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      } else {
        setError(response.message || "Failed to update bill")
      }
    } catch (err) {
      setError("An error occurred while updating the bill")
      console.error("Error updating bill:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fungsi untuk menghapus tagihan
  const handleDeleteBill = async (billId) => {
    if (!window.confirm("Are you sure you want to mark this bill as paid?")) {
      return
    }
    
    try {
      setLoading(true)
      
      const response = await ApiService.deleteBill(billId)
      
      if (response.success) {
        setSuccessMessage("The bill has been paid")
        
        if (editingBill && editingBill.id === billId) {
          setEditingBill(null)
          setShowAddBillForm(false)
        }
        
        fetchBills() // Refresh daftar tagihan
        
        // Hilangkan pesan sukses setelah 3 detik
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      } else {
        setError(response.message || "Failed to mark bill as paid")
      }
    } catch (err) {
      setError("An error occurred while marking the bill as paid.")
      console.error("Error marking bill as paid:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingBill(null)
    setShowAddBillForm(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
              <Link to="/income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Income
              </Link>
              <Link to="/expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Expenses
              </Link>
            </nav>
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          {showMobileMenu && (
            <div className="md:hidden py-2 pb-4 animate-fadeIn">
              <Link
                to="/income"
                className="block px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Income
              </Link>
              <Link
                to="/bills"
                className="block px-4 py-2 text-indigo-600 font-medium"
              >
                Tagihan
              </Link>
              <Link
                to="/Savings"
                className="block px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Savings
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bill Management</h1>
          </div>
          <button
            onClick={() => {
              setEditingBill(null)
              setNewBill({
                name: '',
                amount: '',
                dueDate: '',
                category: 'Rent'
              })
              setShowAddBillForm(true)
            }}
            className="mt-4 md:mt-0 flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Bill
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccessMessage("")}>
              <X className="h-5 w-5" />
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <X className="h-5 w-5" />
            </span>
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8 space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start p-4 rounded-lg shadow-md border-l-4 transition-all duration-300 hover:shadow-lg ${
                  notification.type === 'overdue' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className={`p-2 rounded-full ${notification.type === 'overdue' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      notification.type === 'overdue' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                  </div>
                </div>
                <div className="flex-grow">
                  <p className={`text-sm font-semibold mb-1 ${notification.type === 'overdue' ? 'text-red-700' : 'text-yellow-700'}`}>
                    {notification.type === 'overdue' ? 'Bill Overdue' : 'Bill Due Soon'}
                  </p>
                  <p className="text-sm">{notification.message}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notification.id);
                  }}
                  className={`flex-shrink-0 ml-3 p-1.5 rounded-full hover:bg-opacity-80 ${
                    notification.type === 'overdue' ? 'text-red-400 hover:bg-red-100' : 'text-yellow-400 hover:bg-yellow-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Bills Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Bills</p>
                <p className="text-2xl font-bold text-gray-800">Rp {formatCurrency(totalBillAmount)}</p>
              </div>
            </div>
          </div>
          
          {/* Upcoming Bills Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Upcoming Bills</p>
                <p className="text-2xl font-bold text-gray-800">{bills.filter(bill => !isOverdue(bill.dueDate)).length}</p>
              </div>
            </div>
          </div>
          
          {/* Overdue Bills Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Overdue Bills</p>
                <p className="text-2xl font-bold text-gray-800">{bills.filter(bill => isOverdue(bill.dueDate)).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Bill Form */}
        {showAddBillForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-fadeIn">
              <h2 className="text-xl font-bold mb-4">{editingBill ? 'Edit Bill' : 'Add New Bill'}</h2>
              
              <form onSubmit={editingBill ? handleUpdateBill : handleAddBill}>
                <div className="space-y-4">
                  {/* Nama Tagihan */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Bill Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editingBill ? editingBill.name : newBill.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contoh: Sewa Kost, Listrik, dll"
                      required
                    />
                  </div>
                  
                  {/* Jumlah Tagihan */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (Rp)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={editingBill ? editingBill.amount : newBill.amount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contoh: 500000"
                      required
                    />
                  </div>
                  
                  {/* Tanggal Jatuh Tempo */}
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={editingBill ? editingBill.dueDate : newBill.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  {/* Kategori */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={editingBill ? editingBill.category : newBill.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="Rent">Rent</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Internet">Internet</option>
                      <option value="Water">Water</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Heart">Health</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={editingBill ? handleCancelEdit : () => setShowAddBillForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  
                  {editingBill && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBill(editingBill.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                    disabled={loading}
                  >
                    {loading ? "Menyimpan..." : (editingBill ? "Update" : "Save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bills List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : bills.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <File className="h-12 w-12 text-indigo-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Belum ada tagihan</h3>
            <p className="text-gray-500 mb-6">Anda belum memiliki tagihan yang perlu dibayar.</p>
            <button
              onClick={() => {
                setEditingBill(null)
                setShowAddBillForm(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Tambah Tagihan Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Grouped by Category */}
            {Object.entries(billsByCategory).map(([category, categoryBills]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div 
                  className={`px-6 py-4 flex items-center ${getCategoryColor(category)} cursor-pointer`}
                  onClick={() => toggleCategoryExpand(category)}
                >
                  <div className="mr-3">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-lg font-semibold">
                    {category === 'Rent' ? 'Rent' : 
                     category === 'Electricity' ? 'Electricity' :
                     category === 'Internet' ? 'Internet' :
                     category === 'Water' ? 'Water' :
                     category === 'Vehicle' ? 'Vehicle' :
                     category === 'Heart' ? 'Health' : 'Lainnya'}
                  </h3>
                  <div className="ml-auto flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {categoryBills.length} Bills
                    </span>
                    {expandedCategories[category] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
                
                {expandedCategories[category] && (
                  <div className="divide-y divide-gray-100">
                    {categoryBills.map(bill => (
                      <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-center justify-between">
                          <div className="flex-grow">
                            <h4 className="text-lg font-medium text-gray-900">{bill.name}</h4>
                            <div className="flex items-center mt-1">
                              <span className={`text-sm ${
                                isOverdue(bill.dueDate) ? 'text-red-600 font-medium' : 
                                isDueTomorrow(bill.dueDate) ? 'text-yellow-600 font-medium' : 
                                'text-gray-500'
                              }`}>
                                Due on {formatDate(bill.dueDate)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xl font-bold text-gray-900">Rp {formatCurrency(bill.amount)}</span>
                            <div className="flex mt-2 space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditBill(bill);
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBill(bill.id);
                                }}
                                className="p-1.5 text-green-500 hover:bg-green-50 rounded-full bg-green-100"
                                title="Tandai sebagai sudah dibayar"
                                >
                                <CheckCircle className="w-5 h-5" />
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}