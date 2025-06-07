// Mengimpor React dan hooks (useEffect untuk efek samping, useState untuk state lokal) dari library React
import React, { useEffect, useState } from 'react';
// Mengimpor hooks dan komponen dari react-router-dom untuk navigasi dan routing
// useParams: untuk mengakses parameter URL, useNavigate: untuk navigasi programatis, Link: untuk navigasi berbasis komponen
import { useParams, useNavigate, Link } from 'react-router-dom';
// Mengimpor ApiService dari file apiService.js untuk melakukan operasi API
import { ApiService } from '../../services/apiService.js';

// Mendefinisikan dan mengekspor komponen fungsional AddToSavings
export const AddToSavings = () => {
  // Mengekstrak parameter 'id' dari URL menggunakan useParams hook
  const { id } = useParams();
  // Inisialisasi fungsi navigate untuk navigasi programatis
  const navigate = useNavigate();

  // State untuk menyimpan data tabungan yang akan ditambahkan dananya
  const [savingToEdit, setSavingToEdit] = useState(null);
  // State untuk menyimpan jumlah dana yang akan ditambahkan
  const [amount, setAmount] = useState('');
  // State untuk mengelola status loading
  const [loading, setLoading] = useState(false);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState('');

  // Effect hook yang dijalankan saat komponen dimount atau id berubah
  useEffect(() => {
    // Fungsi async untuk mengambil data tabungan dari API
    const fetchSaving = async () => {
      // Mengaktifkan status loading
      setLoading(true);
      // Mengosongkan pesan error
      setError('');
      try {
        // Memanggil API untuk mendapatkan semua data tabungan
        const response = await ApiService.getSavings();
        // Memeriksa apakah respons berhasil
        if (response.success) {
          // Inisialisasi array kosong untuk menyimpan data tabungan
          let data = [];
          // Memeriksa struktur data respons dan mengekstrak array tabungan
          // Kasus 1: Jika response.data langsung berupa array
          if (Array.isArray(response.data)) {
            data = response.data;
          } 
          // Kasus 2: Jika response.data.savings adalah array
          else if (response.data.savings && Array.isArray(response.data.savings)) {
            data = response.data.savings;
          } 
          // Kasus 3: Jika response.data.records adalah array
          else if (response.data.records && Array.isArray(response.data.records)) {
            data = response.data.records;
          } 
          // Kasus 4: Mencari array di dalam objek response.data
          else if (typeof response.data === 'object') {
            // Mendefinisikan kemungkinan kunci yang berisi array tabungan
            const possibleKeys = ['savings', 'records', 'data'];
            // Iterasi melalui kemungkinan kunci
            for (const key of possibleKeys) {
              // Jika kunci ditemukan dan nilainya adalah array
              if (response.data[key] && Array.isArray(response.data[key])) {
                // Simpan array tersebut dan hentikan iterasi
                data = response.data[key];
                break;
              }
            }
          }
          // Mencari tabungan dengan id yang sesuai dengan parameter URL
          // String() digunakan untuk memastikan perbandingan string dengan string
          const saving = data.find((item) => String(item.id) === String(id));
          // Menyimpan data tabungan yang ditemukan ke state, atau null jika tidak ditemukan
          setSavingToEdit(saving || null);
        } else {
          // Jika respons tidak berhasil, tampilkan pesan error dari API atau pesan default
          setError(response.message || 'Failed to load savings data');
        }
      } catch (err) {
        // Menangani error yang tidak terduga
        setError('An error occurred while loading data');
      } finally {
        // Menonaktifkan status loading setelah operasi selesai (berhasil atau gagal)
        setLoading(false);
      }
    };
    // Memanggil fungsi fetchSaving
    fetchSaving();
  }, [id]); // Dependency array: effect akan dijalankan ulang jika id berubah

  // Handler untuk menangani submit form
  const handleSubmit = async (e) => {
    // Mencegah perilaku default form submit
    e.preventDefault();
    // Jika tidak ada tabungan yang dipilih, hentikan proses
    if (!savingToEdit) return;
    // Mengaktifkan status loading
    setLoading(true);
    // Mengosongkan pesan error
    setError('');
    try {
      // Memanggil API untuk menambahkan dana ke tabungan
      const response = await ApiService.addToSavings(savingToEdit.id, amount);
      // Memeriksa apakah respons berhasil
      if (response.success) {
        // Jika berhasil, navigasi ke halaman savings
        navigate('/savings');
      } else {
        // Jika gagal, tampilkan pesan error dari API atau pesan default
        setError(response.message || 'Failed to add funds to savings');
      }
    } catch (err) {
      // Menangani error yang tidak terduga
      setError('An error occurred while adding funds');
    } finally {
      // Menonaktifkan status loading setelah operasi selesai (berhasil atau gagal)
      setLoading(false);
    }
  };

  // Conditional rendering: Jika sedang loading, tampilkan pesan loading
  if (loading) {
    return <p className="text-center text-gray-500">Loading data...</p>;
  }

  // Conditional rendering: Jika ada error, tampilkan pesan error
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Conditional rendering: Jika tabungan tidak ditemukan, tampilkan pesan
  if (!savingToEdit) {
    return <p className="text-center text-red-500">Saving not found.</p>;
  }

  // Log data tabungan untuk debugging
  console.log('savingToEdit', savingToEdit);
  // Render komponen utama jika semua kondisi di atas tidak terpenuhi
  return (
    // Container utama dengan background abu-abu dan tinggi minimal sesuai layar
    <div className="bg-gray-50 min-h-screen">
      {/* Header dengan logo dan navigasi */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo PayPlus dengan link ke dashboard */}
            <div className="flex items-center">
              <a href="/Dashboard">
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </a>
            </div>
            {/* Navigasi menu yang hanya muncul pada layar sm dan lebih besar */}
            <nav className="hidden sm:flex space-x-4">
              <Link to="/Dashboard" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Dashboard</Link>
              <Link to="/Transfer" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Transfer</Link>
              <Link to="/bills" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Bills</Link>
              <Link to="/Expense" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Expenses</Link>
              <Link to="/Income" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">Income</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Konten utama */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Judul halaman */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Add to Savings</h1>
        {/* Menampilkan pesan error jika ada */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {/* Form untuk menambahkan dana ke tabungan */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          {/* Menampilkan nama tabungan */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Name</p>
            <p className="text-lg font-semibold text-gray-800">{savingToEdit.namaSavings}</p>
          </div>
          {/* Menampilkan deskripsi tabungan */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Description</p>
            <p className="text-gray-600">{savingToEdit.deskripsi}</p>
          </div>
          {/* Menampilkan target tabungan dengan format mata uang Indonesia */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600">Target</p>
            <p className="text-lg font-semibold text-gray-700">Rp {Number(savingToEdit.target).toLocaleString('id-ID')}</p>
          </div>
          {/* Menampilkan jumlah dana yang sudah terkumpul dengan format mata uang Indonesia */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Current Amount Collected</p>
            <p className="text-lg font-semibold text-green-600">Rp {Number(savingToEdit.terkumpul).toLocaleString('id-ID')}</p>
          </div>
          {/* Input field untuk jumlah dana yang akan ditambahkan */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Add (Rp)</label>
            <input
              name="amount"
              id="amount"
              type="number"
              step="0.01" // Memungkinkan input desimal dengan 2 angka di belakang koma
              value={amount}
              onChange={(e) => setAmount(e.target.value)} // Update state amount saat input berubah
              className="mt-1 p-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required // Input wajib diisi
              min="1" // Nilai minimum adalah 1
            />
          </div>
          {/* Tombol submit yang berubah tampilan berdasarkan status loading */}
          <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600" disabled={loading}>
            {loading ? 'Adding...' : 'Add Amount'} {/* Teks tombol berubah saat loading */}
          </button>
        </form>
      </main>
    </div>
  );
};