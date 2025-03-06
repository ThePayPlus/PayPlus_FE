import './index.css'
import { useState } from 'react'
import './App.css'
import { LoadingScreen } from './components/LoadingScreen'
import { LandingPage } from './components/sections/LandingPage';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
    {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)}/>} 
    <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"} bg-white text-purple-700`}> 
      <LandingPage/>
    </div>
    </>
  )
}

export default App
