import { useNavigate} from "react-router-dom";
import { useEffect } from "react";
import { useCookies } from 'react-cookie';
import apiClient from '@/common/utils/apiClient';
import useUserStore from '@/store/userStore';
import { toast } from 'sonner';

const OAuth2Success = () => {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['isLoggedIn', 'user']);
    const { updateUserPhoto } = useUserStore();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const expiresIn = params.get("expiresIn");

    useEffect(() => {
        const handleOAuthSuccess = async () => {
            if (!token) {
                toast.error("Authentication failed. Please try again.");
                navigate('/login');
                return;
            }

            setCookie("isLoggedIn", token, { path: '/', maxAge: parseInt(expiresIn, 10) });
            
            try {
                const { data } = await apiClient.get('/api/v1/auth/me');
                setCookie("user", data, { path: '/', maxAge: parseInt(expiresIn, 10) });

                // If user has a photo, update the global store
                if (data.photoUrl) {
                    updateUserPhoto(data.photoUrl);
                }

                if (data.profileCreated) {
                    navigate('/dashboard');
                } else {
                    navigate('/profile-flow');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Login successful but failed to fetch user data.');
                navigate('/login');
            }
        };

        handleOAuthSuccess();
    }, []);

    return null; // This component doesn't render anything
};

export default OAuth2Success;
