import React, { createContext, useState, useContext } from 'react';
import { useCookies } from 'react-cookie'; // ✅ import useCookies
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate(); // ✅ use the hook here

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [cookies, setCookie] = useCookies(['isLoggedIn', 'accessToken']);


  const handleSubmit = async () => {
    const newUser = { email, password };

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json(); 

      setCookie('isLoggedIn', JSON.stringify(data), { path: '/', maxAge: 86400 }); 

      setMessage('Login successful!');
      setEmail('');
      setPassword('');
      navigate('/home'); 

    } catch (err) {
      console.error(err);
      setMessage('Login Failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        message,
        setMessage,
        handleSubmit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => useContext(AuthContext);
