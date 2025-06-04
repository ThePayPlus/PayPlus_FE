"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import TopUpController from "../../controllers/TopUpController"
import {
  Menu,
  X,
  Wallet,
  ChevronDown,
  CreditCard,
  ArrowRight,
  Check,
  AlertCircle,
  Clock,
  ChevronLeft,
} from "lucide-react"
import BRI from "../../assets/BRI.png"
import BCA from "../../assets/BCA.png"
import BNI from "../../assets/BNI.png"
import Mandiri from "../../assets/mandiri.png"
import Jatim from "../../assets/jatim.png"
import Bali from "../../assets/bali.png"
import BJB from "../../assets/bjb.png"
import Kalteng from "../../assets/kalteng.png"
import Sumsel from "../../assets/sumsel.png"

const bankOptions = [
  { name: "BRI", image: BRI },
  { name: "BCA", image: BCA },
  { name: "BNI", image: BNI },
  { name: "Mandiri", image: Mandiri },
  { name: "Bank Jatim", image: Jatim },
  { name: "Bank Bali", image: Bali },
  { name: "Bank BJB", image: BJB },
  { name: "Bank Kalteng", image: Kalteng },
  { name: "Bank Sumsel", image: Sumsel },
]

export const TopUpPage = () => {
  const navigate = useNavigate()
  const [controller] = useState(new TopUpController())
  const [selectedBank, setSelectedBank] = useState(bankOptions[0].name)
  const [topup, setTopup] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [redirectCountdown, setRedirectCountdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false)
  const [quickAmounts] = useState([50000, 100000, 200000, 500000, 1000000])

  useEffect(() => {
    let timer
    if (redirectCountdown !== null) {
      if (redirectCountdown <= 0) {
        navigate("/Dashboard")
      } else {
        timer = setTimeout(() => {
          const newCountdown = controller.updateRedirectCountdown()
          setRedirectCountdown(newCountdown)
        }, 1000)
      }
    }
    return () => clearTimeout(timer)
  }, [redirectCountdown, navigate, controller])

  const handleBankChange = (bankName) => {
    controller.setSelectedBank(bankName)
    setSelectedBank(bankName)
    setBankDropdownOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    controller.setTopupAmount(topup)

    const response = await controller.submitTopUp()

    if (response.success) {
      setResult(response.result)
      setRedirectCountdown(response.redirectCountdown)
    } else {
      setError(response.error)
    }

    setLoading(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleQuickAmountClick = (amount) => {
    setTopup(amount.toString())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard">
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </Link>
            </div>
            {/* Navigation */}
            <nav className="hidden sm:flex space-x-4">
              <Link to="/topUp" className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                Top-Up
              </Link>
              <Link to="/transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Transfer
              </Link>
              <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Bills
              </Link>
              <Link to="/expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Expenses
              </Link>
              <Link to="/income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Income
              </Link>
              <Link to="/savings" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Savings
              </Link>
              <Link to="/friends" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                Friends
              </Link>
            </nav>
            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
            </button>
          </div>
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="sm:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link to="/topUp" className="text-indigo-600 font-medium border-b-2 border-indigo-600 hover:text-indigo-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Top-Up
                </Link>
                <Link to="/transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Transfer
                </Link>
                <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Bills
                </Link>
                <Link to="/Expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Expenses
                </Link>
                <Link to="/Income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Income
                </Link>
                <Link to="/savings" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Savings
                </Link>
                <Link to="/Friends" className="text-gray-600 hover:text-gray-800 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Friends
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Top Up Your Account</h1>
            <p className="text-slate-600">Add funds to your PayPlus wallet</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
            {!result ? (
              <>
                {/* Bank Selection */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-slate-900 mb-4">Select Bank</label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 transition-all duration-200"
                      onClick={() => setBankDropdownOpen(!bankDropdownOpen)}
                    >
                      <div className="flex items-center">
                        <img
                          src={bankOptions.find((bank) => bank.name === selectedBank).image || "/placeholder.svg"}
                          alt={selectedBank}
                          className="h-8 w-auto mr-3"
                        />
                        <span className="font-medium text-slate-900">{selectedBank}</span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                          bankDropdownOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>

                    {bankDropdownOpen && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {bankOptions.map((bank, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full flex items-center p-3 hover:bg-blue-50 transition-colors duration-200"
                            onClick={() => handleBankChange(bank.name)}
                          >
                            <img src={bank.image || "/placeholder.svg"} alt={bank.name} className="h-8 w-auto mr-3" />
                            <span className="font-medium text-slate-900">{bank.name}</span>
                            {selectedBank === bank.name && <Check className="w-5 h-5 text-blue-600 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount Input */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label htmlFor="amount" className="block text-lg font-semibold text-slate-900 mb-4">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-semibold text-xl">Rp</span>
                      </div>
                      <input
                        type="text"
                        id="amount"
                        value={topup}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "")
                          setTopup(value)
                        }}
                        className="pl-16 pr-6 py-4 w-full bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-2xl font-semibold transition-all duration-200"
                        placeholder="0"
                        required
                      />
                    </div>
                    {topup && <p className="mt-3 text-slate-600 text-lg">Rp {formatCurrency(topup)}</p>}
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Quick Amounts</label>
                    <div className="grid grid-cols-3 gap-3">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleQuickAmountClick(amount)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                            topup === amount.toString()
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 hover:border-blue-300 text-slate-700 hover:bg-blue-50"
                          }`}
                        >
                          Rp {formatCurrency(amount)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !topup}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Top Up
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Top Up Successful!</h2>
                <p className="text-green-600 font-medium mb-6">{result.message}</p>

                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                  <div className="flex justify-between mb-3">
                    <span className="text-slate-600">Amount</span>
                    <span className="font-semibold text-slate-900">Rp {formatCurrency(result.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">New Balance</span>
                    <span className="font-semibold text-slate-900">Rp {formatCurrency(result.newBalance)}</span>
                  </div>
                </div>

                {redirectCountdown !== null && (
                  <div className="flex items-center justify-center text-blue-600 mb-6">
                    <Clock className="w-5 h-5 mr-2" />
                    <p>
                      Redirecting to Dashboard in {redirectCountdown} second{redirectCountdown !== 1 ? "s" : ""}...
                    </p>
                  </div>
                )}

                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center w-full py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}