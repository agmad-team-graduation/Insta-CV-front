import React from 'react';
import { GoogleLoginButton } from './LoginComponnet/GeogleLoginButton';
import {EmailSignupButton} from './LoginComponnet/EmailSignUpButton';
import {LoginForm} from './LoginComponnet/LoginForm';
import Icon from './images/Icon.jpg'
function Login(){
  return(
    <div>
        <div className="mt-10 flex flex-col items-center text-center mb-6">
            <img
            src={Icon} // Replace with your actual image path
            alt="Logo"
            className="bg-white w-10 h-10 mb-2"
             />
           <h2 className="text-8xl text-lg font-semibold text-gray-700">
              Unlimited free access to our resources
           </h2>
        </div>
    <div className="w-full flex flex-col md:flex-row min-h-screen">
      <div className="mt-20 w-full md:w-1/2 flex flex-col items-center justify-start ">
         <div className='p-5'>
            <GoogleLoginButton/>

         </div>
         <div className='p-5'>
            <EmailSignupButton/>
         </div>
         <div>
            <p className="text-xs text-gray-500 ">
            By signing up, you agree to the{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            
          </p>
          <p className="text-xs text-gray-500">
            and acknowledge you’ve read our{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>.
          </p>
         </div>
      </div>
        <div className="w-full md:w-1/2  flex items-start justify-center ">
           <LoginForm/>
        </div>
    </div>
   </div>

  );
};
export default Login;