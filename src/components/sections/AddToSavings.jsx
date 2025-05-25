import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const AddToSavings = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [savingsList, setSavingsList] = useState([]); // Could be fetched from an API or context
  const [savingToEdit, setSavingToEdit] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    // Simulate fetching savings list and finding the item by ID
    const list = JSON.parse(localStorage.getItem('savingsList') || '[]');
    setSavingsList(list);

    const saving = list.find((item) => item.id === parseInt(id));
    if (saving) {
      setSavingToEdit(saving);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!savingToEdit) return;

    const updatedList = savingsList.map((s) =>
      s.id === savingToEdit.id
        ? { ...s, terkumpul: parseFloat(s.terkumpul) + parseFloat(amount) }
        : s
    );

    localStorage.setItem('savingsList', JSON.stringify(updatedList));
    navigate('/savings'); // Or wherever you want to redirect after
  };

  if (!savingToEdit) {
    return <p className="text-center text-red-500">Saving not found.</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/Dashboard">
              <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" className="h-10" />
              </a>
            </div>
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

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Add to Savings</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Name</p>
            <p className="text-lg font-semibold text-gray-800">{savingToEdit.nama}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Description</p>
            <p className="text-gray-600">{savingToEdit.deskripsi}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600">Target</p>
            <p className="text-lg font-semibold text-gray-700">Rp {Number(savingToEdit.target).toLocaleString('id-ID')}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Current Amount Collected</p>
            <p className="text-lg font-semibold text-green-600">Rp {Number(savingToEdit.terkumpul).toLocaleString('id-ID')}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Add (Rp)</label>
            <input
              name="amount"
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600">
            Add Amount
          </button>
        </form>
      </main>
    </div>
  );
};