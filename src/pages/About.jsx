import { Card } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { ExternalLink } from "lucide-react";

import teamMember1 from "@/common/assets/images/honda.jpg";
import teamMember2 from "@/common/assets/images/morad.jpg";
import teamMember3 from "@/common/assets/images/sa7afy.jpg";
import teamMember4 from "@/common/assets/images/osama.jpg";
import teamMember5 from "@/common/assets/images/sawy.jpg";

const teamMembers = [
  {
    id: 1,
    name: "Mohand Magdy",
    role: "Full Stack Developer",
    image: teamMember1,
    cvLink: "https://drive.google.com/file/d/1wBUWzkuUTF3goZF72sYqDMJB8ekTBcb0/view?usp=drive_link"
  },
  {
    id: 2,
    name: "Youssef Morad",
    role: "Frontend Developer",
    image: teamMember2,
    cvLink: "https://drive.google.com/file/d/15Jy_Q3CNbyZZlkr1aVh0v8-iTzz_hGdv/view?usp=sharing&usp=embed_facebook"
  },
  {
    id: 3,
    name: "Youssef Abdalla",
    role: "Backend Developer",
    image: teamMember3,
    cvLink: "https://drive.google.com/file/d/1sL6fFobJ-JAFD9n1AIs7NN-gE_ewtnCz/view"
  },
  {
    id: 4,
    name: "Osama Maher",
    role: "UI/UX Designer",
    image: teamMember4,
    cvLink: "https://drive.google.com/file/d/1GuZgOKn9biaH8ma2m3WTMnR3PUQnnn7B/view?usp=sharing"
  },
  {
    id: 5,
    name: "Mostafa ElSawy",
    role: "Software Engineer",
    image: teamMember5,
    cvLink: "https://drive.google.com/file/d/1jFrV3Z_DSqg_Yx8ngB_wsiq2GWduABC3/view?usp=sharing"
  }
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-shift opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Passionate professionals dedicated to creating exceptional digital experiences and innovative solutions.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card 
              key={member.id}
              className="group relative overflow-hidden bg-white/90 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-scale-in backdrop-blur-md"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Content */}
              <div className="p-8 text-center relative z-10">
                {/* Profile Image */}
                <div className="relative mx-auto mb-6 w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>

                {/* Name and Role */}
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {member.name}
                </h3>

                {/* CV Link Button */}
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="mt-4 font-semibold shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
                >
                  <a
                    href={member.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink size={20} className="mb-0.5" />
                    View CV
                  </a>
                </Button>
              </div>

              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-blue rounded-full blur-3xl opacity-5 group-hover:opacity-15 transition-opacity duration-500"></div>
            </Card>
          ))}
        </div>

        {/* Demo Video Section - Commented out for now */}
        {/*
        <div className="text-center mt-16 animate-fade-in">
          <div className="max-w-4xl mx-auto p-8 bg-gradient-card rounded-2xl border border-border/20 shadow-card">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Watch Our Demo
            </h2>
            <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                See our team in action and discover what we can accomplish together.
            </p>
            <br />
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default About;