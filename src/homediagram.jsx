import { Github, Settings2, RefreshCw, Clock9 } from "lucide-react";
import { Card } from "@/components/ui/card";

const IntegrationSection = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-20 px-4">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 mb-4 text-sm">
          <span>Integrations</span>
        </div>
        <h2 className="text-4xl font-semibold mb-4">Integrates with</h2>
        <p className="text-gray-600 text-xl">
          Seamlessly integrate with your favorite tools
        </p>
      </div>

      {/* Integration Diagram */}
      <div className="relative h-[300px] flex items-center justify-center">
        {/* Connection Lines */}
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 800 300"
          style={{ zIndex: 0 }}
        >
          {/* Line to GitHub */}
          <path
            d="M 400,150 L 600,150"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeDasharray="8,8"
            fill="none"
          />
          {/* Line to Google */}
          <path
            d="M 400,150 L 200,150"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeDasharray="8,8"
            fill="none"
          />
        </svg>

        {/* Center Logo */}
        <Card className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-4 bg-black w-16 h-16 flex items-center justify-center">
          <img
            src="/logos/InstaCV.png"
            alt="InstaCV Logo"
            className="w-10 h-10"
          />
        </Card>

        {/* GitHub Integration */}
        <Card className="absolute right-20 top-1/2 -translate-y-1/2 p-4 w-16 h-16 flex items-center justify-center bg-white hover:shadow-lg transition-all">
          <Github className="w-8 h-8" />
        </Card>

        {/* Google Integration */}
        <Card className="absolute left-20 top-1/2 -translate-y-1/2 p-4 w-16 h-16 flex items-center justify-center bg-white hover:shadow-lg transition-all">
          <svg 
            viewBox="0 0 24 24" 
            className="w-8 h-8"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-medium">Seamless Automation</h3>
        </div>
        <div className="flex items-center gap-3">
          <Clock9 className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-medium">Real-Time Data Sync</h3>
        </div>
        <div className="flex items-center gap-3">
          <Settings2 className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-medium">Customizable Solutions</h3>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSection;