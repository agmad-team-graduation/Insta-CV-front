import React from 'react';
import { Button } from "@/common/components/ui/button";
import { Link } from "react-router-dom";
import { CornerDownRight } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="w-full bg-white pt-1">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center -ml-4">
            <Link to="/" className="flex items-center">
              <img
                src="/logos/InstaCV.png" 
                alt="InstaCV"
                className="h-60 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/features" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link 
              to="/changelog" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Changelog
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Buttons Section */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button 
                className="bg-[#505ABB] hover:bg-[#4750a0] text-white px-6 py-3 h-12 rounded-lg text-base font-medium flex items-center"
                style={{ minWidth: "130px" }}>
                  Login
              </Button>
            </Link>

            <Link to="/signup">
              <Button 
                variant="default" 
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-3 h-12 rounded-lg text-base font-medium flex items-center"
              >
                <CornerDownRight className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
};

export default Navbar;