import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp';
import { SignUpProvider } from './Context/ContextSignUp';
import { LoginProvider } from './Context/ContextLogin';
import Login from './Login';
import './App.css'
import Navbar from "./navbar";
import Home from "./home"
import Footer from './footer';
import Hero from './hero';
import JobDetails from './jobDetails';

// Array of paths where we don't want to show navbar and footer
const NavbarFooterRoutes = ['/'];

function App() {
  const currentPath = window.location.pathname;
  const shouldShowNavbarFooter = NavbarFooterRoutes.includes(currentPath);

  return (
    <div className="app">
      <div className="w-full">
        <Router>
          {shouldShowNavbarFooter && <Navbar />}
          <div className="content">
            <Routes>
              <Route path='/' element={<Home />} />
               <Route path='/SignUp' element={
                <SignUpProvider>
                  <SignUp/>
                </SignUpProvider>

              } />
                 <Route path='/Login' element={
          <LoginProvider>
             <Login/>
           </LoginProvider>
         }/>
              <Route path='/hero' element={<Hero />} />
              <Route path='/jobDetails' element={<JobDetails />} />
            </Routes>
          </div>
          {shouldShowNavbarFooter && <Footer />}
        </Router>
      </div>
    </div>
  );
}

export default App