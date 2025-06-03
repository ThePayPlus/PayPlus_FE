import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Send, ArrowLeft, CheckCircle, AlertCircle, Gift } from 'lucide-react';
import { TransferController } from '../../controllers/TransferController.js';
import FriendController from '../../controllers/FriendController.js';

export const TransferPage = () => {
  const [formData, setFormData] = useState({
    step: 1,
    searchQuery: '',
    searchResults: [],
    selectedUser: null,
    amount: '',
    message: '',
    loading: false,
    error: '',
    success: false,
    userData: null,
    transferType: 'normal',
  });
  const [controller] = useState(() => new TransferController());
  const [transferMode, setTransferMode] = useState('search'); // 'search' or 'friend'
  const [friends, setFriends] = useState([]);

  // Fetch user profile only
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await controller.fetchUserData();
        setFormData((prev) => ({ ...prev, userData: data.userData }));
      } catch (error) {
        // handle error if needed
      }
    };
    fetchUserData();
    // eslint-disable-next-line
  }, []);

  // Fetch friends when mode is 'friend'
  useEffect(() => {
    if (transferMode === 'friend') {
      const fetchFriends = async () => {
        const response = await FriendController.getFriends();
        if (response.success) setFriends(response.friends);
      };
      fetchFriends();
    }
  }, [transferMode]);

  const handleChange = (name, value) => {
    const updatedData = controller.updateField(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (!formData.searchQuery.trim()) return;
    setFormData((prev) => ({ ...prev, loading: true, error: '' }));
    const result = await controller.searchUser(formData.searchQuery);
    setFormData((prev) => ({
      ...prev,
      searchResults: result.results || [],
      error: result.error || '',
      loading: false,
    }));
  };

  const selectUser = (user) => {
    setFormData((prev) => ({
      ...prev,
      selectedUser: user,
      step: 2,
      error: '',
    }));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      handleChange('amount', value);
    }
  };

  const goToConfirmation = () => {
    const validation = controller.validateAmount(formData.amount);
    if (!validation.valid) {
      setFormData((prev) => ({ ...prev, error: validation.message }));
      return;
    }
    setFormData((prev) => ({ ...prev, error: '', step: 3 }));
  };

  const handleTransfer = async () => {
    setFormData((prev) => ({ ...prev, loading: true, error: '' }));
    const response = await controller.transferMoney(
      formData.selectedUser,
      formData.amount,
      formData.transferType,
      formData.message
    );
    if (response.success) {
      setFormData((prev) => ({ ...prev, success: true, step: 4, loading: false }));
    } else {
      setFormData((prev) => ({
        ...prev,
        error: response.message || 'Transfer failed',
        loading: false,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      step: 1,
      searchQuery: '',
      searchResults: [],
      selectedUser: null,
      amount: '',
      message: '',
      loading: false,
      error: '',
      success: false,
      userData: formData.userData,
      transferType: 'normal',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const { step, searchQuery, searchResults, selectedUser, amount, message, loading, error, success, userData, transferType } = formData;

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
                <p className="text-sm font-medium text-indigo-200 mb-1">Your Balance</p>
                <p className="text-2xl font-bold">Rp {formatCurrency(userData.balance || 0)}</p>
              </div>
            )}

            {/* Transfer Mode Tabs */}
            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 rounded-l-lg ${transferMode === 'search' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border'}`}
                onClick={() => setTransferMode('search')}
              >
                Search Number
              </button>
              <button
                className={`flex-1 py-2 rounded-r-lg ${transferMode === 'friend' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border'}`}
                onClick={() => setTransferMode('friend')}
              >
                From Friends
              </button>
            </div>

            {/* Search by Number */}
            {transferMode === 'search' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Find Recipient</h2>
                <div className="flex mb-4">
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={searchQuery}
                    onChange={(e) => handleChange('searchQuery', e.target.value)}
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
                    <h3 className="text-md font-medium mb-2 text-gray-700">Search Results</h3>
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
            )}

            {/* Select from Friends */}
            {transferMode === 'friend' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Friend</h2>
                {friends.length === 0 ? (
                  <p className="text-gray-500">You have no friends yet.</p>
                ) : (
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
                )}
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedUser && (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setFormData((prev) => ({ ...prev, step: 1 }))}
              className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            <h1 className="text-3xl font-bold mb-8 text-gray-800">Transfer Amount</h1>

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
                  Transfer Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => handleChange('transferType', 'normal')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${transferType === 'normal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <Send className={`w-6 h-6 mb-2 ${transferType === 'normal' ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${transferType === 'normal' ? 'text-indigo-600' : 'text-gray-700'}`}>Normal</span>
                  </div>
                  <div
                    onClick={() => handleChange('transferType', 'gift')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${transferType === 'gift' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <Gift className={`w-6 h-6 mb-2 ${transferType === 'gift' ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${transferType === 'gift' ? 'text-indigo-600' : 'text-gray-700'}`}>Gift</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (Rp)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-medium">Rp</span>
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
                  Message (Only for Gift)
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="p-3 w-full border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  placeholder="Write a message for your gift"
                  required={transferType === 'gift'}
                  disabled={transferType !== 'gift'}
                  style={transferType !== 'gift' ? { backgroundColor: '#f3f4f6', color: '#a1a1aa', cursor: 'not-allowed' } : {}}
                ></textarea>
                {transferType !== 'gift' && (
                  <p className="text-xs text-gray-400 mt-1">Message can only be filled for Gift transfers.</p>
                )}
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <button
                onClick={goToConfirmation}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedUser && (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setFormData((prev) => ({ ...prev, step: 2 }))}
              className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            <h1 className="text-3xl font-bold mb-8 text-gray-800">Confirm Transfer</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Recipient</p>
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
                <p className="text-sm text-gray-500 mb-1">Transfer Type</p>
                <div className="flex items-center">
                  {transferType === 'normal' ? (
                    <>
                      <Send className="w-5 h-5 text-indigo-600 mr-2" />
                      <p className="font-medium text-gray-800">Normal</p>
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 text-indigo-600 mr-2" />
                      <p className="font-medium text-gray-800">Gift</p>
                    </>
                  )}
                </div>
              </div>

              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Amount</p>
                <p className="text-xl font-semibold text-gray-800">Rp {formatCurrency(amount)}</p>
              </div>

              {message && (
                <div className="border-b pb-4 mb-4">
                  <p className="text-sm text-gray-500 mb-1">Message</p>
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
                Send Transfer
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Transfer Successful!</h2>
                  <p className="text-gray-600 mb-6">
                    You have successfully transferred Rp {formatCurrency(amount)} to {selectedUser.name}
                    {transferType === 'gift' && " as a gift"}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Transfer Failed</h2>
                  <p className="text-gray-600 mb-6">{error || 'An error occurred while processing the transfer'}</p>
                </>
              )}

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200"
                >
                  New Transfer
                </button>
                <Link
                  to="/dashboard"
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition-colors duration-200"
                >
                  To Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};