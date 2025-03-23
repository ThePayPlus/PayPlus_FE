import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add scroll effect for header shadow
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (window.scrollY > 50) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white text-gray-800 w-full">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm z-50">
        <nav className="w-full px-6 py-0 ">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="logo">
              <img id="logo" className='w-50 h-auto' src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" alt="PayPlus Logo" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <Link to="/login" className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition duration-300">
                Log in
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button id="menu-toggle" className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4">
              <Link to="/login"  className="block bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition duration-300 text-center">
                Log in
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="hero pt-32 pb-20 px-6">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            {/* Left Column */}
            <div className="md:w-1/2 mb-16 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Simplify Your <span className="gradient-text">Financial Life</span>
              </h1>
              <p className="text-xl mb-8 text-gray-600 leading-relaxed">PayPlus helps you manage money, track expenses, and achieve your financial goals with ease and precision.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup" className="bg-indigo-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-indigo-600 transition duration-300 text-center hover:scale-105">
                  Get Started
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=1" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=8" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=13" alt="User" />
                </div>
                <p className="text-sm text-gray-600">Joined by 10,000+ users</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:w-1/2 relative">
              <img src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/dasboard.png?raw=true" alt="Finance Dashboard" className="rounded-lg shadow-2xl animate-float ml-4" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose PayPlus?</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="text-center bg-white p-8 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Budgeting</h3>
                <p className="text-gray-600">Set and track budgets with a list of budgets and a very intuitive interface.</p>
              </div>

              {/* Feature 2 */}
              <div className="text-center bg-white p-8 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
                <p className="text-gray-600">Automatically categorize and analyze your spending habits.</p>
              </div>

              {/* Feature 3 */}
              <div className="text-center bg-white p-8 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Goal Setting</h3>
                <p className="text-gray-600">Set financial goals and track your progress over time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-16">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg">
                <p className="text-gray-600 mb-4">"PayPlus mengubah cara aku ngatur keuangan. Gampang banget dipakai, fiturnya keren, dan yang bikin seru, ngatur budget jadi lebih asyik."</p>
                <div className="flex items-center">
                  <img src="https://i.pravatar.cc/60?img=8" alt="User" className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Andy Sanjaya</h4>
                    <p className="text-gray-600">Gold Member User</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg">
                <p className="text-gray-600 mb-4">"Pakai PayPlus, ngatur uang jadi jauh lebih simpel. Fiturnya lengkap, gampang dipahami, dan bikin budgeting terasa ringan dan menyenangkan. Top deh pokoknya 😊"</p>
                <div className="flex items-center">
                  <img src="https://i.pravatar.cc/60?img=1" alt="User" className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Putri Andini</h4>
                    <p className="text-gray-600">Silver Member User</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
