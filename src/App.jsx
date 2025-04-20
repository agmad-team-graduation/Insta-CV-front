import { BrowserRouter as Router , Route, Routes} from 'react-router';
import './App.css'
import Navbar from "./navbar";
import Home from "./home"
import Footer from './footer';


function App() {
  return (
    <div className="app">
      <div className="w-full">
        <Router>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path='/' element={<Home />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </div>
  );
}


export default App
