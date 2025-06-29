import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import apiClient from '@/common/utils/apiClient';
import Sidebar from './Sidebar';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Cookie } from 'lucide-react';
import PageLoader from "@/common/components/ui/PageLoader";
import MobileWarningModal from "@/common/components/ui/MobileWarningModal";
import { useIsMobile } from "@/common/hooks/use-mobile";


const AuthLayout = () => {
  const [cookies, setCookies] = useCookies(['isLoggedIn', 'user']);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const isMobile = useIsMobile();

  // Check authentication status
  const checkAuth = async () => {
    try {
      const res = await apiClient.get('/api/v1/auth/me');
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsAuthenticated(false);
      setCookies('isLoggedIn', '');
      setCookies('user', '');
      toast.error('You are not logged in');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If no login cookie, redirect immediately
    if (!cookies.isLoggedIn) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    // Validate token with backend
    checkAuth();
  }, [cookies.isLoggedIn, setCookies]);

  // Show mobile warning when authenticated and on mobile
  useEffect(() => {
    if (isAuthenticated && isMobile) {
      setShowMobileWarning(true);
    }
  }, [isAuthenticated, isMobile]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <PageLoader 
        title="Verifying Authentication" 
        subtitle="Please wait while we verify your login status..."
      />
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated || !cookies.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Mobile Header with Hamburger */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-30 flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSidebarToggle}
            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Mobile Logo */}
          <div className="flex items-center ml-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm tracking-tight">IC</span>
            </div>
            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              InstaCV
            </span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      {/* Main Content */}
      <div className={`
        ${isMobile ? 'pt-16' : 'md:ml-64'} 
        transition-all duration-300 ease-in-out
        min-h-screen
      `}>
        <Outlet />
      </div>

      {/* Mobile Warning Modal */}
      <MobileWarningModal 
        open={showMobileWarning} 
        onOpenChange={setShowMobileWarning}
      />
    </div>
  );
};

export default AuthLayout; 