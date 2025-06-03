import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopUpController from '../../controllers/TopUpController';

export const TopUpPage = () => {
  const controller = new TopUpController();
  const bankOptions = controller.getBankOptions();
  
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState(bankOptions[0].name);
  const [topup, setTopup] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(null);

  useEffect(() => {
    let timer;
    if (redirectCountdown !== null) {
      if (redirectCountdown <= 0) {
        navigate('/Dashboard');
      } else {
        timer = setTimeout(() => {
          setRedirectCountdown(redirectCountdown - 1);
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [redirectCountdown, navigate]);

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setRedirectCountdown(null);
    
    try {
      const response = await controller.processTopUp(topup);
      
      if (response.success) {
        setResult({
          message: response.message,
          amount: response.data.amount,
          newBalance: response.data.newBalance
        });
        setRedirectCountdown(3); // Mulai hitung mundur 3 detik
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Terjadi kesalahan saat melakukan top up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard">
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="bg-white rounded-lg shadow-xs p-6 hover:shadow-md transition-shadow duration-300 max-w-sm w-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Select a bank for top-up</h2>
          <select value={selectedBank} onChange={handleBankChange} className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {bankOptions.map((bank, index) => (
              <option key={index} value={bank.name}>{bank.name}</option>
            ))}
          </select>
          <div className="flex justify-center mt-4">
            <img src={controller.getBankImage(selectedBank)} alt={selectedBank} className="h-10" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4">
            <div className="relative w-full mb-4">
              <input
                type="number"
                name="topup"
                value={topup}
                onChange={(e) => setTopup(e.target.value)}
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Input Amount"
                required
              />
            </div>
            <button 
              type="submit" 
              className="p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </form>
          
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          
          {result && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-center font-medium">{result.message}</p>
              <p className="text-gray-700 text-center mt-2">Amount: Rp{result.amount.toLocaleString()}</p>
              <p className="text-gray-700 text-center">New Balance: Rp{result.newBalance.toLocaleString()}</p>
              {redirectCountdown !== null && (
                <p className="text-blue-600 text-center mt-2">
                  Redirecting to Dashboard in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};