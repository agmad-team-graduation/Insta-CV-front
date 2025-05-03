import React, { useState } from 'react';  // Also missing import useState
import Icon from './images/Icon.png';
import backgroundImage from './images/background.jpg';
import { toast } from 'sonner';


function SetEmail() {
    
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request'); 
      }
      
      const data = await response.json();
      toast.success(data.message,{
        bodyClassName:"mt-4 text-center text-green-600 text-sm",
      });
    } catch (err) {
      console.error('Error:', err);
      toast.error("Something Wrong");
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
                htmlFor="email"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Enter an email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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

            {/* Display server message if available */}
            
          </div>      
        </div>
      </div>
    </div>
  );
}

export default SetEmail;
