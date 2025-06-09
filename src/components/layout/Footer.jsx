import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 mt-20 py-20">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img 
                src="/logos/InstaCV.png" 
                alt="InstaCV Logo" 
                className="w-30 h-30 rounded-lg p-2"
              />
            </div>
            <p className="text-gray-600">
              AI-powered CV generation platform for modern job seekers.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-[#7C3AED]">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-[#7C3AED]">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-[#7C3AED]">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto">
                  About Us
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto">
                  Features
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto">
                  Pricing
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto">
                  Blog
                </Button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Support</h3>
            <ul className="space-y-4">
              <li>
                <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto">
                  Help Center
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto">
                  Privacy Policy
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto">
                  Terms of Service
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto">
                  FAQ
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact */}
            <div>
            <h3 className="font-semibold mb-6 text-lg">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">support@instacv.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">+20 100-468-3576</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">Egypt</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="mb-4 md:mb-0">
            <span>© 2025 InstaCV. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto text-sm">
              Privacy Policy
            </Button>
            <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto text-sm">
              Terms of Service
            </Button>
            <Button variant="link" className="text-gray-600 hover:text-[#7C3AED] p-0 h-auto text-sm">
              Cookies Policy
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;