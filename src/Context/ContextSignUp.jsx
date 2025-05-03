"use client"

import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';

const AuthContext = createContext();
export const SignUpProvider = ({children})=>{
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [password,setPassword]=useState('');
    const navigate = useNavigate(); 
    const handleSubmit = async ()=>{
        
        const newUser = {email,name,password};
        
        try{
            const response = await apiClient.post('/api/v1/auth/register', newUser);
            
           
  navigate('/Login');
           
            setEmail('');
            setName('');
            setPassword('');
}
           
        catch(err){
          toast.error(err.response.data.message)
            console.error(err);
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

