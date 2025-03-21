import './index.css';
import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/sections/landingPage';
import { Footer } from './components/Footer';
import { Dashboard } from './components/sections/Dashboard';

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
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <FooterWrapper />
      </div>
    </Router>
  );
}

function FooterWrapper() {
  const location = useLocation();
  return location.pathname === '/' ? <Footer className={'w-full'} /> : null;
}

export default App;
