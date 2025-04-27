import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config'; 

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
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`,{
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
               });
            if (!response.ok) {
                throw new Error('Signup failed');
            }
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

