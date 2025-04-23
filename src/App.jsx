import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./navbar";
import './App.css'
import { CardWithForm } from './card';
import SignUp from './SignUp';
import { SignUpProvider } from './Context/ContextSignUp';
import { LoginProvider } from './Context/ContextLogin';
import Login from './Login';
function App() {
  return (
    <div className="app">
      <Routes>
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

      </Routes>
    </div>
  );
}


export default App
