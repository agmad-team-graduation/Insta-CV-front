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
import { Toaster } from 'sonner';
import OAuth2Success from './features/auth/components/OAuth2Success';
import Profile from './features/profile/pages/Profile';
import GithubProfile from './features/github/githubProfile';
import { ForgotPassword } from './features/auth/components/ForgotPassword';
import RecommendedJobs from './features/jobs/components/RecommendedJobs/recommendedJobs';
import { SetPassword } from './features/auth/components/SetPasswordForm';
import InterviewQuestionsPage from './features/jobs/components/InterviewQuestions/interviewQuestionsPage';
import ResumeBuilder from './features/resume-builder/components/ResumeBuilder';
import ResumeBuilderLayout from './features/resume-builder/ResumeBuilderLayout';
import ResumesPage from './features/resume-builder/pages/ResumesPage';

// Array of paths where we want to show navbar and footer
const NavbarFooterRoutes = ['/', '/signup'];

// Create a wrapper component to use useLocation hook
const AppContent = () => {
  const location = useLocation();
  const [cookies] = useCookies(['isLoggedIn']);
  const token = cookies.isLoggedIn || '';
  const showNavbarFooter = NavbarFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbarFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpProvider><SignUp /></SignUpProvider>} />
          <Route path="/login" element={<LoginProvider><Login /></LoginProvider>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/oauth2/success" element={<OAuth2Success />} />

          {/* Protected routes */}
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/github-profile" element={<GithubProfile />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/recommended" element={<RecommendedJobs />} />
            <Route path="/job-details/:jobID" element={<JobDetailsPage />} />
            <Route path="/interview-questions/:jobID" element={<InterviewQuestionsPage />} />
            <Route path="/resumes" element={<ResumesPage />} />
            <Route path="/resumes/:id" element={<ResumeBuilderLayout><ResumeBuilder /></ResumeBuilderLayout>} />
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showNavbarFooter && <Footer />}
      <Toaster />
    </div>
  );
};

function App() {
  return <AppContent />;
}

export default App;