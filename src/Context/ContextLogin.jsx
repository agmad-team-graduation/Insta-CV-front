import React, { createContext, useState, useContext } from 'react';
const AuthContext = createContext();
export const LoginProvider = ({children})=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [message,setMessage]=useState('');
    
    const handleSubmit = async ()=>{
        
        const newUser = {email,password};
        try{
            const response = await fetch('http://localhost:8080/api/v1/auth/login',{
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
               });
            if (!response.ok) {
                throw new Error('Signup failed');
            }
            setMessage('Login successful!');
            setEmail('');
            setPassword('');
    
    
           }
        catch(err){
            console.error(err);
            setMessage("Login Failed")
    
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

export const UseAuth= ()=> {
  return useContext(AuthContext);
};

