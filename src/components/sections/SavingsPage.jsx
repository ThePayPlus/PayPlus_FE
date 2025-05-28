import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../../services';

export const SavingsPage = () => {
  const [savingsList, setSavingsList] = useState([]);
  const [alert, setAlert] = useState('');
  const [totalTarget, setTotalTarget] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavingsData();
  }, []);

  const fetchSavingsData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getSavings();
      
      if (response.success) {
        // Perbaikan: Cek berbagai kemungkinan struktur data response
        let data = [];
        
        if (response.data) {
          // Jika response.data adalah array langsung
          if (Array.isArray(response.data)) {
            data = response.data;
          }
          // Jika response.data memiliki property 'savings'
          else if (response.data.savings && Array.isArray(response.data.savings)) {
            data = response.data.savings;
          }
          // Jika response.data memiliki property 'records'
          else if (response.data.records && Array.isArray(response.data.records)) {
            data = response.data.records;
          }
          // Jika response.data adalah object dengan data savings di dalamnya
          else if (typeof response.data === 'object') {
            // Cari property yang berisi array
            const possibleKeys = ['savings', 'records', 'data'];
            for (const key of possibleKeys) {
              if (response.data[key] && Array.isArray(response.data[key])) {
                data = response.data[key];
                break;
              }
            }
          }
        }
        
        setSavingsList(data);
        calculateTotals(data);
        setError('');
      } else {
        setError(response.message || 'Gagal memuat data savings');
        setSavingsList([]);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data');
      console.error('Fetch savings error:', err);
      setSavingsList([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (list) => {
    let totalTarget = 0;
    let totalCollected = 0;
    list.forEach(s => {
      totalTarget += Number(s.target) || 0;
      totalCollected += Number(s.terkumpul) || 0;
    });
    setTotalTarget(totalTarget);
    setTotalCollected(totalCollected);
  };

  const handleDeleteSavings = async (savingsId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus savings ini?')) {
      try {
        const response = await ApiService.deleteSavings(savingsId);
        if (response.success) {
          setAlert('Savings berhasil dihapus');
          fetchSavingsData(); // Refresh data
          setTimeout(() => setAlert(''), 3000);
        } else {
          setAlert(response.message || 'Gagal menghapus savings');
        }
      } catch (err) {
        setAlert('Terjadi kesalahan saat menghapus savings');
        console.error('Delete savings error:', err);
      }
    }
  };

  return (
    <div className="bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard">
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </Link>
            </div>
            <nav className="hidden sm:flex space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Dashboard</Link>
              <Link to="/Transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Transfer</Link>
              <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Bills</Link>
              <Link to="/Expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Expenses</Link>
              <Link to="/Income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Income</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Alert Messages */}
        {alert && (
          <div className={`font-bold mb-8 p-4 rounded ${
            alert.includes('berhasil') ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'
          }`}>
            {alert}
          </div>
        )}
        
        {error && (
          <div className="font-bold mb-8 text-red-800 bg-red-100 p-4 rounded">
            {error}
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8 text-gray-800">Savings Page</h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Memuat data savings...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-2">
              <div className="flex items-center p-4 bg-white rounded-lg shadow">
                <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.211 6.339A8 8 0 1 1 6.339 2.789a4.5 4.5 0 1 0 10.872 3.55Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Total Savings Target</p>
                  <p id="totalSavings" className="text-lg font-semibold text-gray-700">
                    {`Rp ${Number(totalTarget || 0).toLocaleString('id-ID')}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow">
                <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.211 6.339A8 8 0 1 1 6.339 2.789a4.5 4.5 0 1 0 10.872 3.55Z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Savings Collected</p>
                  <p id="savingsCollected" className="text-lg font-semibold text-gray-700">
                    {`Rp ${Number(totalCollected || 0).toLocaleString('id-ID')}`}
                  </p>
                </div>
              </div>
            </div>

            <Link to="/addsavings">
              <button id="addSavingsButton" className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
                Add Savings
              </button>
            </Link>

            <div id="savingsContainer" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {savingsList.length > 0 ? (
                savingsList.map(s => (
                  <div className="bg-white rounded-lg shadow-md p-6" key={s.id}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{s.namaSavings}</h3>
                    <p className="text-gray-600 mb-4">{s.deskripsi}</p>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-500">Target</p>
                      <p className="text-lg font-semibold text-gray-700">Rp {s.target.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-500">Amount Collected</p>
                      <p className="text-lg font-semibold text-green-600">Rp {s.terkumpul.toLocaleString('id-ID')}</p>
                    </div>
                    {s.target !== s.terkumpul && s.target > s.terkumpul ? (
                      <>
                        <Link to={`/addtosavings/${s.id}`}>
                          <button className="mt-4 mr-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">
                            Add to Savings
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDeleteSavings(s.id)}
                          className="mt-4 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold text-green-600">Target achieved!</p>
                        <button 
                          onClick={() => handleDeleteSavings(s.id)}
                          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-800"
                        >
                          Transfer to balance
                        </button>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <span className="text-gray-700">You have no savings.</span>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
