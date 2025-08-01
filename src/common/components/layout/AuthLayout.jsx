import { Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import apiClient from '@/common/utils/apiClient';
import Sidebar from './Sidebar';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
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
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar - Updated width to match new sidebar */}
      <Sidebar />
      
      {/* Main Content - Updated margin to match new sidebar width */}
      <div className="ml-64">
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