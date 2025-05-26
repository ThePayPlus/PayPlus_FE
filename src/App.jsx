import './index.css';
import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/sections/LandingPage';
import { Dashboard } from './components/sections/Dashboard';
import { LoginPage } from './components/sections/LoginPage';
import { BillPage } from './components/sections/BillPage';
import { SignupPage } from './components/sections/SignupPage';
import { SavingsPage } from './components/sections/SavingsPage';
import { AddSavings } from './components/sections/AddSavings';
import { AddToSavings } from './components/sections/AddtoSavings';
import Settings from './components/sections/Settings';
import Income from './components/sections/IncomeRecord';
import Expense from './components/sections/ExpenseRecord';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log(`isLoaded: ${isLoaded}`);
  }, [isLoaded]);

  return (
    <Router basename="/PayPlus_FE">
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      <div className={`min-h-screen flex flex-col transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} bg-white text-purple-700`}>
        <Routes>
          <Route path="/" element={<LandingPage className={'flex-grow'} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/bills" element={<BillPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/addsavings" element={<AddSavings />} />
          <Route path="/addtosavings" element={<AddToSavings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
