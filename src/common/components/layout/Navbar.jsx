import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const navItems = [
    { label: 'Features', href: '#features', hasDropdown: true },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#changelog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InstaCV
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <div key={item.label} className="relative group">
                  <a
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative py-2"
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  
                  {/* Dropdown Menu for Features */}
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="p-4">
                        <div className="space-y-3">
                          <a href="#templates" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-medium text-gray-900">CV Templates</div>
                            <div className="text-sm text-gray-500">Professional resume templates</div>
                          </a>
                          <a href="#builder" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-medium text-gray-900">AI Builder</div>
                            <div className="text-sm text-gray-500">Smart CV generation</div>
                          </a>
                          <a href="#export" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="font-medium text-gray-900">Export Options</div>
                            <div className="text-sm text-gray-500">PDF, Word, and more</div>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleLogin}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50 z-40">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="space-y-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    className="block py-3 px-4 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                  
                  {/* Mobile dropdown for Features */}
                  {item.hasDropdown && (
                    <div className="ml-4 mt-2 space-y-2">
                      <a 
                        href="#templates" 
                        className="block py-2 px-4 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        CV Templates
                      </a>
                      <a 
                        href="#builder" 
                        className="block py-2 px-4 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        AI Builder
                      </a>
                      <a 
                        href="#export" 
                        className="block py-2 px-4 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Export Options
                      </a>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Action Buttons */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 justify-center"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    handleGetStarted();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg justify-center"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;