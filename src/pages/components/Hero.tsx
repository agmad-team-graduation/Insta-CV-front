import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { Github, Sparkles, ArrowRight, Edit3, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="secondary" className="mb-6 bg-blue-500/10 text-blue-200 border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300">
          <Sparkles className="w-4 h-4 mr-2" />
          Powered by Advanced AI
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Create Professional CVs
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Your Way</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          Sign up to connect your GitHub for instant AI-powered CV generation, or build from scratch with complete manual customization. 
          Create professional resumes that highlight exactly what matters most for your target job.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            variant="default"
            size="lg" 
            onClick={handleSignUp}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Sign Up to Get Started
            <ArrowRight className="w-5 h-5 m-2" />
          </Button>
          
          <Button 
            variant="default"
            size="lg" 
            onClick={handleLogin}
            className="bg-transparent border-2 border-white/30 text-white hover:bg-white/20 hover:text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Log In
          </Button>
        </div>
        
        <div className="flex justify-center items-center space-x-8 text-gray-400">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">GitHub Integration</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse delay-500"></div>
            <span className="text-sm">Manual Customization</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse delay-1000"></div>
            <span className="text-sm">AI-Powered Content</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;