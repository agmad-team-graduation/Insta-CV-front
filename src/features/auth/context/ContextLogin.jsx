import React, { createContext, useState, useContext } from 'react';
import { useCookies } from 'react-cookie'; 
import { useNavigate } from 'react-router-dom';
import apiClient from '@/common/utils/apiClient'; 
import { toast } from 'sonner';
import useUserStore from '@/store/userStore';

const AuthContext = createContext({
    email: '',
    setEmail: () => {},
    password: '',
    setPassword: () => {},
    user: null,
    loading: false,
    handleSubmit: () => {},
});

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate(); 
    const { updateUserPhoto } = useUserStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [cookies, setCookie] = useCookies(['isLoggedIn', 'accessToken', 'user']);

    const handleSubmit = async (loginData = null) => {
        // Use provided data or fallback to state
        const userData = loginData || { email, password };
        
        if (!userData.email || !userData.password) {
            toast.error('Please enter both email and password');
            return;
        }

        setLoading(true);
        
        try {
            const { data } = await apiClient.post('/api/v1/auth/login', userData);

            // Store token and user data
            setCookie('isLoggedIn', data.token, { path: '/', maxAge: data.expiresIn });
            setCookie('user', data.user, { path: '/', maxAge: data.expiresIn });
            setUser(data.user);

            // If user has a photo, update the global store
            if (data.user.photoUrl) {
                updateUserPhoto(data.user.photoUrl);
            }

            // Check if user has a profile using the isProfileCreated attribute
            if (data.user.profileCreated) {
                // Profile exists, navigate to dashboard
                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                // Profile not created, navigate to profile flow
                toast.success('Login successful! Please complete your profile.');
                navigate('/profile-flow');
            }

            setEmail('');
            setPassword('');

        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                email,
                setEmail,
                password,
                setPassword,
                user,
                loading,
                handleSubmit,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const UseAuth = () => useContext(AuthContext);
