import React, { useState } from 'react';
import BRI from '../../assets/BRI.png';
import BCA from '../../assets/BCA.png';
import BNI from '../../assets/BNI.png';
import Mandiri from '../../assets/mandiri.png';
import Jatim from '../../assets/jatim.png';
import Bali from '../../assets/bali.png';
import BJB from '../../assets/bjb.png';
import Kalteng from '../../assets/kalteng.png';
import Sumsel from '../../assets/sumsel.png';

const bankOptions = [
  { name: 'BRI', image: BRI },
  { name: 'BCA', image: BCA },
  { name: 'BNI', image: BNI },
  { name: 'Mandiri', image: Mandiri },
  { name: 'Bank Jatim', image: Jatim },
  { name: 'Bank Bali', image: Bali },
  { name: 'Bank BJB', image: BJB },
  { name: 'Bank Kalteng', image: Kalteng },
  { name: 'Bank Sumsel', image: Sumsel },
];

export const TopUpPage = () => {
  const [selectedBank, setSelectedBank] = useState(bankOptions[0].name);
  const [topup, setTopup] = useState('');
  const [saldo, setSaldo] = useState('');

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/User?action=topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ topup }),
      });
      const result = await response.text();
      setSaldo(result);
    } catch (error) {
      console.error('Topup error:', error);
    }
  };

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
            <img src={bankOptions.find(bank => bank.name === selectedBank).image} alt={selectedBank} className="h-10" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4">
            <div className="relative w-full mb-4">
              <input
                type="text"
                name="topup"
                value={topup}
                onChange={(e) => setTopup(e.target.value)}
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Input Amount"
                required
              />
            </div>
            <button type="submit" className="p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none w-full">Confirm</button>
          </form>
          {saldo && <h4 className="text-green-500 mt-4 text-center">{saldo}</h4>}
        </div>
      </main>
    </div>
  );
};