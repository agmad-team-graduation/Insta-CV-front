import { useNavigate} from "react-router-dom";
import { useEffect } from "react";
import { useCookies } from 'react-cookie';
import apiClient from '@/common/utils/apiClient';

const OAuth2Success = () => {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['isLoggedIn']);
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const expiresIn = params.get("expiresIn");
    const isProfileCreated = params.get("isProfileCreated");

    useEffect(() => {
        const handleOAuthSuccess = async () => {
            setCookie("isLoggedIn", token, { path: '/', maxAge: parseInt(expiresIn, 10) });
            const { data } = await apiClient.get('/api/v1/auth/me');
            setCookie("user", data, { path: '/', maxAge: parseInt(expiresIn, 10) });
            if (isProfileCreated === 'true') {
                navigate('/dashboard');
            } else {
                navigate('/profile-flow');
            }
        };

        handleOAuthSuccess();
    }, []);

};

export default OAuth2Success;
