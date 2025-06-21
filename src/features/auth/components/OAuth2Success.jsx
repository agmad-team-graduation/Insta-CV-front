import { useNavigate} from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
import apiClient from '@/common/utils/apiClient';

const OAuth2Success = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const expiresIn = params.get("expiresIn");
    const isProfileCreated = params.get("isProfileCreated");

    useEffect(() => {
        const handleOAuthSuccess = async () => {
            Cookies.set("isLoggedIn", token, { path: '/', maxAge: expiresIn});
            
            // Check if user has a profile using the isProfileCreated parameter
            if (isProfileCreated === 'true') {
                // Profile exists, navigate to dashboard
                navigate('/dashboard');
            } else {
                // Profile not created, navigate to profile flow
                navigate('/profile-flow');
            }
        };

        handleOAuthSuccess();
    }, []);

};

export default OAuth2Success;
