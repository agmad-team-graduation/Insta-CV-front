import { Card, CardContent } from "@/common/components/ui/card";
import { Github, Brain, Target, FileText, Zap, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Github,
      title: "GitHub Integration",
      description: "Connect your GitHub profile and let our AI analyze your repositories, contributions, and coding patterns to showcase your real skills.",
      gradient: "from-gray-600 to-gray-800"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI models understand your code, extract key achievements, and translate technical work into professional accomplishments.",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      icon: Target,
      title: "Job-Tailored CVs",
      description: "Paste any job description and get a CV specifically crafted to highlight relevant skills and experiences for that position.",
      gradient: "from-purple-600 to-purple-800"
    },
    {
      icon: FileText,
      title: "Professional Templates",
      description: "Choose from modern, ATS-friendly templates designed by industry experts to make your CV stand out to recruiters.",
      gradient: "from-green-600 to-green-800"
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Generate multiple CV versions in seconds. Perfect for applying to different roles or updating your resume regularly.",
      gradient: "from-orange-600 to-orange-800"
    },
    {
      icon: Users,
      title: "Smart AI Processing",
      description: "Our proprietary AI models work behind the scenes to analyze your data, gather insights, and create compelling CV content automatically.",
      gradient: "from-pink-600 to-pink-800"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our AI CV Builder?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage the power of artificial intelligence to create CVs that truly represent your coding journey and achievements.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;