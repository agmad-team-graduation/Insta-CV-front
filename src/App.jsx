import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { SignUpProvider } from './features/auth/context/ContextSignUp';
import { LoginProvider } from './features/auth/context/ContextLogin';
import Login from './features/auth/components/Login/login';
import "@/common/styles/App.css";
import LandingPage from "./pages/LandingPage"
import Footer from '@/common/components/layout/Footer';
import Dashboard from './dashboard/pages/Index';
import JobDetailsPage from './features/jobs/components/JobDetails/JobDetailsPage';
import { useCookies } from 'react-cookie';
import JobsPage from './features/jobs/components/AllJobs/JobsPage';
import AuthLayout from '@/common/components/layout/AuthLayout';
import { Toaster } from 'sonner';
import OAuth2Success from './features/auth/components/OAuth2Success';
import Profile from './features/profile/pages/Profile';
import GithubProfile from './features/github/githubProfile';
import ForgotPassword from './features/auth/components/ForgotPassword/forgotPassword';
import RecommendedJobs from './features/jobs/components/RecommendedJobs/recommendedJobs';
import SetPassword from './features/auth/components/SetPasswordForm/setPassword';
import InterviewQuestionsPage from './features/jobs/components/InterviewQuestions/interviewQuestionsPage';
import ResumeBuilder from './features/resume-builder/components/ResumeBuilder';
import ResumeBuilderLayout from './features/resume-builder/ResumeBuilderLayout';
import ResumesPage from './features/resume-builder/pages/ResumesPage';
import ResumePreviewPage from './features/resume-builder/pages/ResumePreviewPage';
import ProfileFlow from './features/profile/pages/ProfileFlow';
import SignUp from './features/auth/components/SignUp/signup';


function AppContent() {
  const location = useLocation();
  const [cookies] = useCookies(['isLoggedIn']);
  
  return (
    <>
      <Toaster />
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
            <Route path='/profile-flow' element={<ProfileFlow />} />
            <Route path='/jobs' element={<JobsPage />} />
            <Route path='/job-details/:jobID' element={<JobDetailsPage />} />
            {/* <Route path='/jobs/add' element={<AddJobPage />} /> */}
            <Route path='/profile' element={<Profile />} />
            <Route path='/github-profile' element={<GithubProfile />} />
            <Route path='/recommended-jobs' element={<RecommendedJobs />} />
            <Route path='/recommended-job-details/:jobID' element={<JobDetailsPage />} />
            <Route path='/interview-questions/:jobID' element={<InterviewQuestionsPage />} />
            <Route path='/resumes' element={<ResumesPage />} />
          </Route>
          <Route path='/resumes' element={<ResumeBuilderLayout />}>
            <Route path=':id' element={<ResumeBuilder />} />
            <Route path=':id/preview' element={<ResumePreviewPage />} />
          </Route>
        </Routes>
      </div>
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