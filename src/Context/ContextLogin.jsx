import React, { createContext, useState, useContext } from 'react';
import { useCookies } from 'react-cookie'; 
import { useNavigate } from 'react-router-dom';
import apiClient from '@/utils/apiClient'; 
import { toast } from 'sonner';


const AuthContext = createContext();

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [cookies, setCookie] = useCookies(['isLoggedIn', 'accessToken']);


  const handleSubmit = async () => {
    const newUser = { email, password };

    try {
      // now using axios instance
      const {data} = await apiClient.post('/api/v1/auth/login', newUser);

      setCookie('isLoggedIn', data.token, { path: '/', maxAge: data.expiresIn}); 
      navigate('/home'); 

      setEmail('');
      setPassword('');

    } catch (err) {
      toast.error(err.response.data.message,);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => useContext(AuthContext);
