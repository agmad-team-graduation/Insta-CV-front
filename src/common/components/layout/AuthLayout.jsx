import { Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Sidebar from './Sidebar';

const AuthLayout = () => {
  const [cookies] = useCookies(['isLoggedIn']);
  
  // Redirect to login if not authenticated
  if (!cookies.isLoggedIn) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar - Updated width to match new sidebar */}
      <Sidebar />
      
      {/* Main Content - Updated margin to match new sidebar width */}
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout; 