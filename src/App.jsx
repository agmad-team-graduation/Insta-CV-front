import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Navbar from "./navbar";
import Home from "./home"
import Footer from './footer';
import Hero from './hero';
import JobDetails from './jobDetails';

// Array of paths where we don't want to show navbar and footer
const noNavbarFooterRoutes = ['/hero', '/jobDetails'];

function App() {
  const currentPath = window.location.pathname;
  const shouldShowNavbarFooter = !noNavbarFooterRoutes.includes(currentPath);

  return (
    <div className="app">
      <div className="w-full">
        <Router>
          {shouldShowNavbarFooter && <Navbar />}
          <div className="content">
            <Routes>
              <Route path='/' element={<Home />} />
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