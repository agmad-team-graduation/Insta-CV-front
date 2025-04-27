import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import SignUp from './SignUp';
import { SignUpProvider } from './Context/ContextSignUp';
import { LoginProvider } from './Context/ContextLogin';
import Login from './Login';
import './App.css'
import Navbar from "./navbar";
import LandingPage from "./landingPage"
import Footer from './footer';
import Home from './home';
import JobDetails from './jobDetails';
import { useCookies } from 'react-cookie';
import Jobs from './jobs';
import AuthLayout from './components/AuthLayout';

// Array of paths where we want to show navbar and footer
const PublicRoutes = ['/', '/signup'];

// Create a wrapper component to use useLocation hook
function AppContent() {
  const location = useLocation();
  const isPublicRoute = PublicRoutes.includes(location.pathname);
  const [cookies] = useCookies(['isLoggedIn']);
  
  return (
    <>
      {isPublicRoute && <Navbar />}
      <div className="content">
        <Routes>
          {/* Public routes */}
          <Route path='/' element={cookies.isLoggedIn ? <Navigate to="/home" /> : <LandingPage />} />
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
          
          {/* Protected routes with sidebar */}
          <Route element={<AuthLayout />}>
            <Route path='/home' element={<Home />} />
            <Route path='/jobs' element={<Jobs />} />
            <Route path='/job-details/:jobID' element={<JobDetails />} />
          </Route>
        </Routes>
      </div>
      {isPublicRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="app">
      <div className="w-full">
        <Router>
          <AppContent />
        </Router>
      </div>
    </div>
  );
}

export default App