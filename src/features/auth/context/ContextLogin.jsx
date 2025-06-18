import React, { createContext, useState, useContext } from 'react';
import { useCookies } from 'react-cookie'; 
import { useNavigate } from 'react-router-dom';
import apiClient from '@/common/utils/apiClient'; 
import { toast } from 'sonner';
import useUserStore from '@/store/userStore';

const AuthContext = createContext();

export const LoginProvider = ({ children }) => {
    const navigate = useNavigate(); 
    const { updateUserPhoto } = useUserStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    const [cookies, setCookie] = useCookies(['isLoggedIn', 'accessToken', 'user']);

    const handleSubmit = async () => {
        const newUser = { email, password };

        try {
            const { data } = await apiClient.post('/api/v1/auth/login', newUser);

            // Store token and user data
            setCookie('isLoggedIn', data.token, { path: '/', maxAge: data.expiresIn });
            setCookie('user', data.user, { path: '/', maxAge: data.expiresIn });
            setUser(data.user);

            // If user has a photo, update the global store
            if (data.user.photoUrl) {
                updateUserPhoto(data.user.photoUrl);
            }

            navigate('/'); 

            setEmail('');
            setPassword('');

        } catch (err) {
            toast.error(err.response.data.message);
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
                handleSubmit,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const UseAuth = () => useContext(AuthContext);
