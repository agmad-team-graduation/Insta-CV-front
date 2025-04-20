import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CornerDownRight } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="w-full bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center -ml-4">
            <Link to="/" className="flex items-center">
              <img
                src="/logos/InstaCV.png" 
                alt="InstaCV"
                className="h-70 w-auto"
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

          {/* Get Started Button */}
          <div className="flex items-center mr-[-1rem]">
            <Button 
              variant="default" 
              className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg px-6 h-12 flex items-center"
            >
              <CornerDownRight />
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
};

export default Navbar;