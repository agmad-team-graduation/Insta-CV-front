import logo2 from "../../../assets/images/signUp.jpg";  // Make sure this path matches your actual image location
import { SignUpForm } from './FormSignUp'; // Remove or fix this line
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // use Google's official look
import { Button } from "@/components/ui/button";

function SignUp(){
    return(
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-white overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                    <p className="mt-2 text-sm text-gray-600">Access world to automations</p>
                </div>
                
                <div className="w-full">
                    <SignUpForm />
                </div>
                
                <div className="flex items-center justify-center gap-2 w-full py-4">
                    <div className="w-full h-px bg-gray-300" />
                    <span className="text-sm text-gray-500 px-2">OR</span>
                    <div className="w-full h-px bg-gray-300" />
                </div>
                
                <div>
                     <Button
                          className="w-90 justify-center gap-3 rounded-xl text-white hover:bg-[#4750a0] text-base font-medium shadow-sm"
                          style={{ background: "#505ABB" }}
                            onClick={() => window.location.href = "http://localhost:8080/api/auth/oauth2/authorize/google"}

                        >
                          <FcGoogle className="w-5 h-5"  />
                          Sign up with your Google account
                        </Button>
                </div>
                
                <p className="text-sm text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/Login" className="text-blue-600 hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
        
        <div className="hidden md:block md:w-1/2 h-screen">
            <div className="h-full w-full flex items-center justify-center">
                <img 
                    src='/images/signup.png'  // Use the imported image
                    alt='Sign up illustration'
                    className=""
                />
            </div>
        </div>
    </div>
    );
}

export default SignUp;