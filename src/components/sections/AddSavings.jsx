// Mengimpor React dan hook useState dari library React
import React, { useState } from 'react';
// Mengimpor komponen Link dan hook useNavigate dari react-router-dom untuk navigasi
import { Link, useNavigate } from 'react-router-dom';
// Mengimpor ApiService dari file apiService.js untuk melakukan operasi API
import { ApiService } from '../../services/apiService.js';

// Mendefinisikan dan mengekspor komponen fungsional AddSavings
export const AddSavings = () => {
  // Mendeklarasikan state formData dengan useState hook untuk menyimpan data form
  const [formData, setFormData] = useState({
    nama: '',      // State untuk menyimpan nama tabungan
    deskripsi: '', // State untuk menyimpan deskripsi tabungan
    target: ''     // State untuk menyimpan target jumlah tabungan
  });
  // State untuk mengelola status loading saat form disubmit
  const [loading, setLoading] = useState(false);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState('');
  // State untuk menyimpan pesan sukses jika operasi berhasil
  const [success, setSuccess] = useState('');
  // Menggunakan hook useNavigate untuk navigasi programatis
  const navigate = useNavigate();

  // Handler untuk menangani perubahan pada input form
  const handleChange = (e) => {
    // Mengekstrak name dan value dari event target
    const { name, value } = e.target;
    // Memperbarui state formData dengan nilai baru sambil mempertahankan nilai lainnya
    setFormData((prev) => ({
      ...prev,
      [name]: value // Menggunakan computed property name untuk memperbarui field yang sesuai
    }));
    // Menghapus pesan error jika ada saat user mulai mengetik
    if (error) setError('');
  };

  // Handler untuk menangani submit form
  const handleSubmit = async (e) => {
    // Mencegah perilaku default form submit
    e.preventDefault();
    // Mengaktifkan status loading
    setLoading(true);
    // Mengosongkan pesan error dan success
    setError('');
    setSuccess('');

    try {
      // Mengekstrak nilai dari formData
      const { nama, deskripsi, target } = formData;
      
      // Validasi nama tabungan
      if (!nama.trim()) {
        setError('The savings name cannot be blank.');
        setLoading(false);
        return;
      }
      
      // Validasi deskripsi tabungan
      if (!deskripsi.trim()) {
        setError('Description cannot be empty');
        setLoading(false);
        return;
      }
      
      // Validasi target tabungan harus lebih dari 0
      if (!target || parseInt(target) <= 0) {
        setError('The target must be more than 0');
        setLoading(false);
        return;
      }

      // Memanggil API untuk menambahkan tabungan baru
      const response = await ApiService.addSavings(nama, deskripsi, target);

      // Memeriksa respons dari API
      if (response.success) {
        // Jika berhasil, tampilkan pesan sukses
        setSuccess('Savings successfully added!');
        // Reset form ke nilai awal
        setFormData({
          nama: '',
          deskripsi: '',
          target: ''
        });
        
        // Redirect ke halaman savings setelah 2 detik
        setTimeout(() => {
          navigate('/savings');
        }, 2000);
      } else {
        // Jika gagal, tampilkan pesan error dari API atau pesan default
        setError(response.message || 'Failed to add savings');
      }
    } catch (err) {
      // Menangani error yang tidak terduga
      setError('An unexpected error has occurred');
      // Mencatat error ke console untuk debugging
      console.error('Add savings error:', err);
    } finally {
      // Menonaktifkan status loading setelah operasi selesai (berhasil atau gagal)
      setLoading(false);
    }
  };

  // Render komponen
  return (
    // Container utama dengan background abu-abu dan tinggi minimal sesuai layar
    <div className="bg-gray-50 min-h-screen">
      {/* Header dengan logo dan navigasi */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo PayPlus dengan link ke dashboard */}
            <div className="flex items-center">
              <Link to="/dashboard">
                <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </Link>
            </div>
            {/* Navigasi menu yang hanya muncul pada layar sm dan lebih besar */}
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

      {/* Konten utama */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Judul halaman */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Add Savings</h1>

        {/* Menampilkan pesan sukses jika ada */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {/* Menampilkan pesan error jika ada */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Form untuk menambahkan tabungan baru */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          {/* Input field untuk nama tabungan */}
          <div className="mb-4">
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="nama"
              id="nama"
              type="text"
              value={formData.nama}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 p-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Example: Holiday"
            />
          </div>
          {/* Textarea untuk deskripsi tabungan */}
          <div className="mb-4">
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="deskripsi"
              id="deskripsi"
              rows="3"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 p-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Description of your savings goals"
            ></textarea>
          </div>
          {/* Input field untuk target tabungan */}
          <div className="mb-4">
            <label htmlFor="target" className="block text-sm font-medium text-gray-700">Target (Rp)</label>
            <input
              name="target"
              id="target"
              type="number"
              min="1"
              value={formData.target}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 p-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Example: 5000000"
            />
          </div>
          {/* Tombol submit yang berubah tampilan berdasarkan status loading */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-2 px-4 rounded shadow transition-colors duration-200 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
      </main>
    </div>
  );
};

