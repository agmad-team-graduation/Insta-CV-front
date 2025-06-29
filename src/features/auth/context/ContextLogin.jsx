import React, { createContext, useState, useContext } from 'react';
import { useCookies } from 'react-cookie'; 
import { useNavigate } from 'react-router-dom';
import apiClient from '@/common/utils/apiClient'; 
import { toast } from 'sonner';
import useUserStore from '@/store/userStore';
import { FRONTEND_BASE_URL } from '@/config';

const AuthContext = createContext({
    email: '',
    setEmail: () => {},
    password: '',
    setPassword: () => {},
    user: null,
    loading: false,
    handleSubmit: () => {},
    handleGitHubLogin: () => {},
});

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate(); 
    const { updateUserPhoto, setUser } = useUserStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUserState] = useState(null);
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
            setUserState(data.user);
            
            // Update the global user store
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

    const handleGitHubLogin = async () => {
        try {
            const response = await apiClient.get("/api/github/test/authorize?isLogin=true");
            const authUrl = response.data.authLink;
            console.log("window.location.origin", window.location.origin);
            
            const popup = window.open(authUrl, "_blank", "width=500,height=600");
            
            if (!popup) {
                toast.error("Popup blocked! Please allow popups for this site.");
                return;
            }
            
            window.addEventListener(
                "message",
                async (event) => {
                    console.log("event.origin", event.origin);
                    console.log("FRONTEND_BASE_URL", FRONTEND_BASE_URL);
      
                    const { token, expiresIn, user, error } = event.data;
                    console.log("token", token);
                    console.log("expiresIn", expiresIn);
                    console.log("user", user);
      
                    if (error) {
                        toast.error(error);
                        return;
                    }
      
                    if (user && token) {
                        // Store token and user data
                        setCookie('isLoggedIn', token, { path: '/', maxAge: parseInt(expiresIn, 10) });
                        
                        // Fetch user data
                        try {
                            // const { data: userData } = await apiClient.get('/api/v1/auth/me');
                            setCookie('user', user, { path: '/', maxAge: parseInt(expiresIn, 10) });
                            setUserState(user);
                            
                            // Update the global user store
                            setUser(user);

                            // If user has a photo, update the global store
                            if (user.photoUrl) {
                                updateUserPhoto(user.photoUrl);
                            }

                            // Check if user has a profile
                            if (user.profileCreated) {
                                toast.success('GitHub login successful!');
                                navigate('/dashboard');
                            } else {
                                toast.success('GitHub login successful! Please complete your profile.');
                                navigate('/profile-flow');
                            }
                        } catch (err) {
                            console.error('Error fetching user data:', err);
                            toast.error('Login successful but failed to fetch user data.');
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
                password,
                setPassword,
                user,
                loading,
                handleSubmit,
                handleGitHubLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const UseAuth = () => useContext(AuthContext);
