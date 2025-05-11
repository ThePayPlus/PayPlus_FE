import './index.css';
import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/sections/LandingPage';
import { Dashboard } from './components/sections/Dashboard';
import { LoginPage } from './components/sections/LoginPage';
import { SignupPage } from './components/sections/SignupPage';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
