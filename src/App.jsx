import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import SignUp from './SignUp';
import { SignUpProvider } from './Context/ContextSignUp';
import { LoginProvider } from './Context/ContextLogin';
import Login from './Login';
import './App.css'
import Navbar from "./components/navbar";
import LandingPage from "./landingPage"
import Footer from './components/footer';
import Home from './home';
import JobDetails from './jobDetails';
import { useCookies } from 'react-cookie';
import Jobs from './jobs';
import AuthLayout from './components/AuthLayout';
import SetEmail from './emailForgetPassword';
import SetPassword from './SetPassword';
import AddJobCard from './addJob';
import { Toaster } from 'sonner';
import OAuth2Success from './oauth2-success';
import VerifyPassword from './VerifyPassword';


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
          <Route path='/SetEmail' element={
              <SetEmail/>
            
          }/>
          <Route path='/SetPassword' element={<SetPassword />} />
          <Route path='/email-verification' element={<VerifyPassword />}/>
          <Route path='/oauth2-success' element={<OAuth2Success />} />

          
          {/* Protected routes with sidebar */}
          <Route element={<AuthLayout />}>
            <Route path='/home' element={<Home />} />
            <Route path='/jobs' element={<Jobs />} />
            <Route path='/job-details/:jobID' element={<JobDetails />} />
            <Route path='/jobs/add' element={<AddJobCard />} />
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
        <Router>
          <AppContent />
        </Router>
      </div>
    </div>
  );
}

export default App