import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { SignUp } from './features/auth/components/SignUp';
import { SignUpProvider } from './features/auth/context/ContextSignUp';
import { LoginProvider } from './features/auth/context/ContextLogin';
import { Login } from './features/auth/components/Login';
import "@/common/styles/App.css";
import Navbar from "@/common/components/layout/Navbar";
import LandingPage from "./pages/LandingPage"
import Footer from '@/common/components/layout/Footer';
import Dashboard from './pages/Dashboard';
import JobDetailsPage from './features/jobs/components/JobDetails/JobDetailsPage';
import { useCookies } from 'react-cookie';
import JobsPage from './features/jobs/components/AllJobs/JobsPage';
import AuthLayout from '@/common/components/layout/AuthLayout';
import AddJobPage from './features/jobs/components/AddJob/AddJobPage';
import { Toaster } from 'sonner';
import OAuth2Success from './features/auth/components/OAuth2Success';
import Profile from './features/profile/pages/Profile';
import GithubProfile from './features/github/githubProfile';
import { ForgotPassword } from './features/auth/components/ForgotPassword';
import RecommendedJobs from './features/jobs/components/RecommendedJobs/recommendedJobs';
import { SetPassword } from './features/auth/components/SetPasswordForm';
import InterviewQuestionsPage from './features/jobs/components/InterviewQuestions/interviewQuestionsPage';


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
            <Route path='/jobs' element={<JobsPage />} />
            <Route path='/job-details/:jobID' element={<JobDetailsPage />} />
            <Route path='/jobs/add' element={<AddJobPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/github-profile' element={<GithubProfile />} />
            <Route path='/recommended-jobs' element={<RecommendedJobs />} />
            <Route path='/recommended-job-details/:jobID' element={<JobDetailsPage />} />
            <Route path='/interview-questions/:jobID' element={<InterviewQuestionsPage />} />
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