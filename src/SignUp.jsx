import logo2 from './images/signUp.jpg';  // Make sure this path matches your actual image location
import { GoogleSignUpButton } from './ButtonForSignUp';
import { SignUpForm } from './FormSignUp';
import { Link } from "react-router-dom";

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
                    <GoogleSignUpButton/>
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
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    </div>
    );
}

export default SignUp;