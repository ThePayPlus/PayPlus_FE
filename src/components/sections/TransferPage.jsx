import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services';
import { Search, User, Phone, DollarSign, Send, ArrowLeft, CheckCircle, AlertCircle, Gift } from 'lucide-react';

export const TransferPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Search, 2: Amount, 3: Confirmation, 4: Result
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [userData, setUserData] = useState(null);
  const [transferType, setTransferType] = useState('normal'); // 'normal' or 'gift'

  // Fetch user profile and friends list on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await ApiService.getProfile();
        if (profileResponse.success) {
          setUserData(profileResponse.data);
        }

        const friendsResponse = await ApiService.getFriends();
        if (friendsResponse.success && friendsResponse.data) {
          setFriends(friendsResponse.data.friends || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await ApiService.searchUser(searchQuery);
      if (response.success && response.data) {
        setSearchResults([response.data]);
      } else {
        setSearchResults([]);
        setError('Pengguna tidak ditemukan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mencari pengguna');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setStep(2);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const goToConfirmation = () => {
    if (!amount || parseInt(amount) <= 0) {
      setError('Silakan masukkan jumlah yang valid');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleTransfer = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.transferMoney(
        selectedUser.phone,
        parseInt(amount),
        transferType, // Use the selected transfer type
        message
      );

      if (response.success) {
        setSuccess(true);
        setStep(4);
      } else {
        setError(response.message || 'Transfer gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat melakukan transfer');
      console.error('Transfer error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUser(null);
    setAmount('');
    setMessage('');
    setError('');
    setSuccess(false);
    setTransferType('normal');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard">
                <img
                  src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true"
                  alt="PayPlus Logo"
                  className="h-10"
                />
              </Link>
            </div>
            <nav className="hidden sm:flex space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/transfer"
                className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-200"
              >
                Transfer
              </Link>
              <Link
                to="/bills"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Bills
              </Link>
              <Link
                to="/expense"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Expenses
              </Link>
              <Link
                to="/income"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Income
              </Link>
            </nav>
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Transfer</h1>

            {/* Balance Card */}
            {userData && (
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl p-6 mb-8 shadow-md">
                <p className="text-sm font-medium text-indigo-200 mb-1">Saldo Anda</p>
                <p className="text-2xl font-bold">Rp {formatCurrency(userData.balance || 0)}</p>
              </div>
            )}

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Cari Penerima</h2>
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Nomor telepon"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow p-2 border rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2 text-gray-700">Hasil Pencarian</h3>
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.phone}
                        onClick={() => selectUser(user)}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Friends List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Daftar Teman</h2>
              {loadingFriends ? (
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : friends.length > 0 ? (
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.phone}
                      onClick={() => selectUser(friend)}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{friend.name}</p>
                        <p className="text-sm text-gray-500">{friend.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">Anda belum memiliki teman</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && selectedUser && (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setStep(1)}
              className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali
            </button>

            <h1 className="text-3xl font-bold mb-8 text-gray-800">Jumlah Transfer</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.phone}</p>
                </div>
              </div>
              
              {/* Transfer Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Transfer
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setTransferType('normal')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${transferType === 'normal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <Send className={`w-6 h-6 mb-2 ${transferType === 'normal' ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${transferType === 'normal' ? 'text-indigo-600' : 'text-gray-700'}`}>Normal</span>
                  </div>
                  <div
                    onClick={() => setTransferType('gift')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${transferType === 'gift' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <Gift className={`w-6 h-6 mb-2 ${transferType === 'gift' ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${transferType === 'gift' ? 'text-indigo-600' : 'text-gray-700'}`}>Hadiah</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah (Rp)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="pl-10 p-3 w-full border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    placeholder="0"
                  />
                </div>
                {amount && (
                  <p className="mt-2 text-sm text-gray-600">
                    Rp {formatCurrency(amount)}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Pesan {transferType === 'gift' ? '' : '(Opsional)'}
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="p-3 w-full border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  placeholder={transferType === 'gift' ? "Tulis ucapan untuk hadiah Anda" : "Tulis pesan untuk penerima"}
                  required={transferType === 'gift'}
                ></textarea>
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <button
                onClick={goToConfirmation}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedUser && (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setStep(2)}
              className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali
            </button>

            <h1 className="text-3xl font-bold mb-8 text-gray-800">Konfirmasi Transfer</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Penerima</p>
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">{selectedUser.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Jenis Transfer</p>
                <div className="flex items-center">
                  {transferType === 'normal' ? (
                    <>
                      <Send className="w-5 h-5 text-indigo-600 mr-2" />
                      <p className="font-medium text-gray-800">Normal</p>
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 text-indigo-600 mr-2" />
                      <p className="font-medium text-gray-800">Hadiah</p>
                    </>
                  )}
                </div>
              </div>

              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Jumlah</p>
                <p className="text-xl font-semibold text-gray-800">Rp {formatCurrency(amount)}</p>
              </div>

              {message && (
                <div className="border-b pb-4 mb-4">
                  <p className="text-sm text-gray-500 mb-1">Pesan</p>
                  <p className="text-gray-800">{message}</p>
                </div>
              )}

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                Kirim Transfer
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              {success ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Transfer Berhasil!</h2>
                  <p className="text-gray-600 mb-6">
                    Anda telah berhasil mentransfer Rp {formatCurrency(amount)} ke {selectedUser.name}
                    {transferType === 'gift' && " sebagai hadiah"}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Transfer Gagal</h2>
                  <p className="text-gray-600 mb-6">{error || 'Terjadi kesalahan saat melakukan transfer'}</p>
                </>
              )}

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200"
                >
                  Transfer Baru
                </button>
                <Link
                  to="/dashboard"
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition-colors duration-200"
                >
                  Ke Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};