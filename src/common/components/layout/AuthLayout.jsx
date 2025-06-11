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
    <div className="min-h-screen bg-white">
      {/* Sidebar - Already has a fixed position and width of w-56 */}
      <Sidebar />
      
      {/* Main Content - Add margin to prevent content from going under sidebar */}
      <div className="ml-56">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout; 