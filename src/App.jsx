import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { SignUp } from './features/auth/components/SignUp';
import { SignUpProvider } from './features/auth/context/ContextSignUp';
import { LoginProvider } from './features/auth/AuthContext';
import { Login } from './features/auth/components/Login';
import './styles/App.css'
import Navbar from "./components/layout/Navbar";
import LandingPage from "./pages/LandingPage"
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import JobDetails from './pages/JobDetails';
import { useCookies } from 'react-cookie';
import Jobs from './pages/Jobs';
import AuthLayout from './components/layout/AuthLayout';
import AddJobCard from './features/jobs/components/AddJobForm';
import { Toaster } from 'sonner';
import OAuth2Success from './features/auth/components/OAuth2Success';
import Profile from './pages/Profile';
import { ForgotPassword } from './features/auth/components/ForgotPassword';
import { SetPassword } from './features/auth/components/SetPasswordForm';


// Array of paths where we want to show navbar and footer
const NavbarFooterRoutes = ['/', '/signup'];

// Create a wrapper component to use useLocation hook
function AppContent() {
  const location = useLocation();
  const shouldShowNavbarFooter = NavbarFooterRoutes.includes(location.pathname);
  const [cookies] = useCookies(['isLoggedIn']);
  
  return (
    <>
            <Toaster />

      {shouldShowNavbarFooter && <Navbar />}
      <div className="content">
        <Routes>
          <Route path='/' element={cookies.isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path='/signup' element={
            <SignUpProvider>
              <SignUp/>
            </SignUpProvider>
          } />
          <Route path='/login' element={
            <LoginProvider>
              <Login/>
            </LoginProvider>
          }/>
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/set-password' element={<SetPassword />} />
          <Route path='/email-verification' element={<SetPassword />} />
          <Route path='/oauth2-success' element={<OAuth2Success />} />
          
          {/* Protected routes with sidebar */}
          <Route element={<AuthLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/jobs' element={<Jobs />} />
            <Route path='/job-details/:jobID' element={<JobDetails />} />
            <Route path='/jobs/add' element={<AddJobCard />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </div>
      {shouldShowNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="app">
      <div className="w-full">
        <AppContent />
      </div>
    </div>
  );
}

export default App