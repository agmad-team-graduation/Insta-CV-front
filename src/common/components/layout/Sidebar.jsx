import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, GraduationCap, FileText, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { cn } from '@/common/lib/utils';
import { useCookies } from 'react-cookie';
import { Button } from '@/common/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'My Profile', href: '/profile' },
  { icon: Briefcase, label: 'Active jobs', href: '/jobs' },
  { icon: GraduationCap, label: 'AI Courses', href: '/courses' },
  { icon: FileText, label: 'Payout & Reports', href: '/reports' },
  { icon: FileText, label: 'Resume Builder', href: '/resume-builder' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['isLoggedIn']);

  const handleLogout = () => {
    removeCookie('isLoggedIn', { path: '/' });
    navigate('/');
  };

  return (
    <div className="h-screen w-56 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <span className="text-blue-600 font-bold text-xl">InstaCV</span>
        </Link>
      </div>
      
      <nav className="flex-1 pt-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 mx-2 rounded-md transition-colors",
                    "hover:bg-gray-50 hover:text-blue-600",
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-600"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <Avatar>
            <AvatarFallback className="bg-gray-200 text-gray-700">U</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-700 truncate">User Name</p>
            <p className="text-xs text-gray-500 truncate">user@example.com</p>
          </div>
        </div>
        
        <Button 
          onClick={handleLogout}
          className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white group flex items-center justify-center py-2 rounded-lg transition-all duration-300 font-medium"
        >
          <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;