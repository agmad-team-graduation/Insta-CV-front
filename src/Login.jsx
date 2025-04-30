import React from 'react';
import { LoginForm } from './components/forms/LoginForm';
import Icon from './images/Icon.png';
import backgroundImage from './images/background.jpg';
import { FcGoogle } from "react-icons/fc"; // use Google's official look
import { Button } from "@/components/ui/button";
import { MdEmail } from "react-icons/md"; // email icon
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen m-0 p-0 overflow-hidden">
      <div
        className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 md:p-12 flex flex-col items-center">
          {/* Centered Icon and Heading */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={Icon}
              alt="Logo"
              className="bg-white w-10 h-10 mb-2"
            />
            <h2 className="text-center text-lg font-semibold text-gray-700">
              Unlimited free access to our resources
            </h2>
          </div>

          {/* Two-column content */}
          <div className="w-full flex flex-col md:flex-row">
            {/* Left Side - shifted upward */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-6 -mt-4">
              <div className="mb-4 w-full">
                <Button
                      variant="outline"
                      className="w-70 pt-4 pb-4 justify-center gap-2 rounded-3xl border-gray-300 text-gray-800 hover:bg-gray-100 text-sm font-medium shadow-sm px-4 py-2"
                    >
                      <FcGoogle className="w-4 h-4" />
                      Continue with Google
                    </Button>
              </div>
              <div className="mb-4 w-full">
                <Button 
                      variant="outline"
                      className=" w-70 pt-4 pb-4 justify-center gap-2 rounded-3xl border-gray-300 text-gray-800 hover:bg-gray-100 text-sm font-medium shadow-sm px-4 py-2"
                      onClick={() => navigate("/signup")} 
                
                    >
                      <MdEmail className="w-4 h-4 shrink-0 align-middle" />
                      Sign up with Email
                    </Button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to the{' '}
                <a href="#" className="underline">Terms of Service</a>
              </p>
              <p className="text-xs text-gray-500 text-center">
                and acknowledge you’ve read our{' '}
                <a href="#" className="underline">Privacy Policy</a>.
              </p>
            </div>

            {/* Right Side with Divider Line */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-6 border-l border-gray-300 md:pl-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
