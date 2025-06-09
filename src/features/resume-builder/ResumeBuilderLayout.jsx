import { Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const ResumeBuilderLayout = () => {
  const [cookies] = useCookies(['isLoggedIn']);
  
  // Redirect to login if not authenticated
  if (!cookies.isLoggedIn) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* No sidebar, just the content */}
      <Outlet />
    </div>
  );
};

export default ResumeBuilderLayout;