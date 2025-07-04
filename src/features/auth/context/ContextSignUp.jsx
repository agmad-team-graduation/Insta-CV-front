"use client"

import React, { createContext, useState, useContext } from 'react';
import apiClient from "@/common/utils/apiClient";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import useUserStore from '@/store/userStore';
import { FRONTEND_BASE_URL } from '@/config';

const AuthContext = createContext({
    email: '',
    setEmail: () => {},
    name: '',
    setName: () => {},
    handleSubmit: () => {},
    handleGitHubSignup: () => {},
});

export const SignUpProvider = ({children})=>{
    const navigate = useNavigate();
    const { updateUserPhoto, setUser } = useUserStore();
    const [cookies, setCookie] = useCookies(['isLoggedIn', 'user']);
    
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [tokenProcessed, setTokenProcessed] = useState(false);

    const handleSubmit = async () => {
        const newUser = { email, name };
        try {
            const response = await apiClient.post('/api/v1/email/send-verification', newUser);
            setEmail('');
            setName('');
            return { success: true, message: response.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Signup failed' };
        }
    };

    const handleGitHubSignup = async () => {
        try {
            // Reset token processed flag
            setTokenProcessed(false);
            
            const response = await apiClient.get("/api/github/test/authorize?isLogin=true");
            const authUrl = response.data.authLink;
      
            const popup = window.open(authUrl, "_blank", "width=500,height=600");
      
            if (!popup) {
                toast.error("Popup blocked! Please allow popups for this site.");
                return;
            }
      
            window.addEventListener(
                "message",
                async (event) => {
                    if (event.origin !== FRONTEND_BASE_URL) return;
                    if (tokenProcessed) return; // Prevent multiple processing
      
                    const { user, token, expiresIn, error } = event.data;
      
                    if (error) {
                        toast.error(error);
                        return;
                    }
      
                    if (user && token) {
                        setTokenProcessed(true); // Mark as processed
                        
                        // Store token and user data
                        setCookie('isLoggedIn', token, { path: '/', maxAge: parseInt(expiresIn, 10) });
                        
                        // Fetch user data
                        try {
                            // const { data: userData } = await apiClient.get('/api/v1/auth/me');
                            setCookie('user', user, { path: '/', maxAge: parseInt(expiresIn, 10) });

                            // Update the global user store
                            setUser(user);

                            // If user has a photo, update the global store
                            if (user.photoUrl) {
                                updateUserPhoto(user.photoUrl);
                            }

                            // Check if user has a profile
                            if (user.profileCreated) {
                                toast.success('GitHub signup successful!');
                                navigate('/dashboard');
                            } else {
                                toast.success('GitHub signup successful! Please complete your profile.');
                                navigate('/profile-flow');
                            }
                        } catch (err) {
                            console.error('Error fetching user data:', err);
                            toast.error('Signup successful but failed to fetch user data.');
                        }
                    }
                }
                // ,
                // { once: true }
            );
        } catch (error) {
            toast.error("Failed to connect to GitHub. Please try again.");
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
        handleGitHubSignup,
      }}
    >
      {children}
    </AuthContext.Provider>
    );
    
};

export const UseAuth= ()=> useContext(AuthContext);
