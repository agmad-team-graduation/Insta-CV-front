import React, { createContext, useState, useContext } from 'react';
import { useCookies } from 'react-cookie'; 
import { useNavigate } from 'react-router-dom';
import apiClient from '@/utils/apiClient';    // ← use your absolute alias, adjust path if needed

const AuthContext = createContext();

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [cookies, setCookie] = useCookies(['isLoggedIn', 'accessToken']);


  const handleSubmit = async () => {
    const newUser = { email, password };

    try {
      // now using axios instance
      const { data } = await apiClient.post('/api/v1/auth/login', newUser);
      console.log(data);

      setCookie('isLoggedIn', data.token, { path: '/', maxAge: 86400 }); 

      setMessage('Login successful!');
      setEmail('');
      setPassword('');
      navigate('/home'); 

    } catch (err) {
      console.error(err);
      setMessage('Invalid email or password');
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
