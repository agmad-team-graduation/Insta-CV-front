import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent } from "@/common/components/ui/card";
import { Github, Brain, Download, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: Github,
      title: "Connect GitHub",
      description: "Link your GitHub profile and select repositories you want to showcase. Our system analyzes your code, commits, and contributions.",
      color: "bg-blue-500"
    },
    {
      step: "02", 
      icon: Brain,
      title: "AI Analysis",
      description: "Advanced AI models process your GitHub data, extracting skills, projects, and achievements. Optionally add a job description for tailored results.",
      color: "bg-purple-500"
    },
    {
      step: "03",
      icon: Download,
      title: "Get Your CV",
      description: "Download your professionally crafted CV in multiple formats. Edit, customize, and generate variations for different job applications.",
      color: "bg-green-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-500/10 text-blue-200 border-blue-500/20">
            Simple Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From GitHub profile to professional CV in just three simple steps. 
            Let AI do the heavy lifting while you focus on landing your dream job.
          </p>
        </div>
        
        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <div className="text-sm font-bold text-gray-400 tracking-wider mb-2">
                      STEP {step.step}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;