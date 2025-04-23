import logo from './images/image.png';
import logo2 from './images/signUp.jpg';
import { GoogleSignUpButton } from './ButtonForSignUp';
import { Honda } from './FormSignUp';
import { Link } from "react-router-dom";



function SignUp(){
    
    return(
    <div className="w-full flex flex-col md:flex-row min-h-screen">
         <div className="w-full md:w-1/2 flex flex-col items-start justify-start ">
            <div>
               <img src={logo} alt="logo" className="w-3/4" />
           </div>
         <div className='pb-4'>
            <h2 className="text-xl pl-9 font-semibold text-first">
             Access world to automations
         </h2>
         </div>
         <div className='w-[85%]'>
           <Honda />
         </div>
          <div className="flex items-center gap-2 w-full py-4">
            <div className="w-40 h-px bg-gray-300" />
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="w-40 h-px bg-gray-300" />
         </div>
         <div>
           <GoogleSignUpButton/>
         </div>
         <div>
          <p className="text-sm text-center text-gray-600 mt-4">
  Already have an account?{" "}
  <Link to="/Login" className="text-blue-600 hover:underline font-medium">
    Login here
  </Link>
</p>
         </div>
         
        
</div>
        <div className="w-full md:w-1/2  flex items-center justify-center ">
           <img src={logo2} alt='logo'/>
       </div>
    </div>

    );
};
export default SignUp;