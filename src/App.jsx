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

// Array of paths where we want to show navbar and footer
const NavbarFooterRoutes = ['/', '/signup'];

// Create a wrapper component to use useLocation hook
function AppContent() {
  const location = useLocation();
  const shouldShowNavbarFooter = NavbarFooterRoutes.includes(location.pathname);
  const [cookies] = useCookies(['isLoggedIn']);
  
  return (
    <>
      {shouldShowNavbarFooter && <Navbar />}
      <div className="content">
        <Routes>
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
          <Route path='/home' element={cookies.isLoggedIn ? <Home /> : <Navigate to="/" />} />
          <Route path='/jobDetails' element={cookies.isLoggedIn ? <JobDetails /> : <Navigate to="/" />} />
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
        <Router>
          <AppContent />
        </Router>
      </div>
    </div>
  );
}

export default App