import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const AuthContext = createContext();
export const SignUpProvider = ({children})=>{
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [password,setPassword]=useState('');
    const [message,setMessage]=useState('');
    const navigate = useNavigate(); 
    const handleSubmit = async ()=>{
        
        const newUser = {email,name,password};
        try{
            const response = await apiClient.post('/api/v1/auth/register', newUser);
            setMessage('Signup successful!');
            setEmail('');
            setName('');
            setPassword('');
            navigate('/Login'); 
           }
        catch(err){
            console.error(err);
            setMessage("SignUp Failed")
           }
        };
    return (
     <AuthContext.Provider
       value={{
        email,
        setEmail,
        name,
        setName,
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

export const UseAuth= ()=> {
  return useContext(AuthContext);
};

