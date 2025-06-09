import { useNavigate} from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

const OAuth2Success = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const expiresIn = params.get("expiresIn");

    useEffect(() => {
      Cookies.set("isLoggedIn", token,  { path: '/', maxAge: expiresIn});
      navigate("/");
    }, []);

};

export default OAuth2Success;
