import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from './images/Icon.png';
import backgroundImage from './images/background.jpg';
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

function VerifyPassword() {
  const navigate = useNavigate();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  console.log(queryParams);
  const token = queryParams.get('verificationToken');
  const email = queryParams.get('email');
    const name = queryParams.get('name');


  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:name,
          email:email,
          password:password,
          verificationToken: token,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      const data = await response.json();
      navigate('/Login'); 

    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen m-0 p-0 overflow-hidden">
      <div
        className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 md:p-12 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <img
              src={Icon}
              alt="Logo"
              className="bg-white w-10 h-10 mb-2"
            />
            <h2 className="text-center text-lg font-semibold text-gray-700">
              Unlimited free access to our resources
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col items-start mt-4 w-full max-w-sm">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Enter a password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition self-center"
              >
                Submit
              </button>
            </form>
            {/* End Form */}

            {/* Message */}
            
          </div>      
        </div>
      </div>
    </div>
  );
}

export default VerifyPassword;
