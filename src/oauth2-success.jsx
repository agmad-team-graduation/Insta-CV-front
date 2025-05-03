import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const OAuth2Success = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const expiresIn = params.get("expiresIn");

    Cookies.set("isLoggedIn", token,  { path: '/', maxAge: expiresIn});

    navigate("/home");

  return <p>Redirecting...</p>;
};

export default OAuth2Success;
