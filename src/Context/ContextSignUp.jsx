"use client"

import React, { createContext, useState, useContext } from 'react';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';

const AuthContext = createContext();
export const SignUpProvider = ({children})=>{
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const handleSubmit = async ()=>{
        
        const newUser = {email,name};
        
        try{
            const response = await apiClient.post('/api/v1/email/send-verification', newUser);
            
           
           toast.success(response.data.message);
           
            setEmail('');
            setName('');
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

