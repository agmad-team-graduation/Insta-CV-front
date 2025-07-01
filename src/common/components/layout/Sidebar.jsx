import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, GraduationCap, FileText, LogOut, Github } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Badge } from '@/common/components/ui/badge';
import { cn } from '@/common/lib/utils';
import { useCookies } from 'react-cookie';
import { Button } from '@/common/components/ui/button';
import useResumeStore from '@/features/resume-builder/store/resumeStore';
import useUserStore from '@/store/userStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'My Profile', href: '/profile' },
  { icon: Github, label: 'Github Profile', href: '/github-profile', hasBadge: true },
  { icon: Briefcase, label: 'Active jobs', href: '/jobs' },
  { icon: FileText, label: 'Resumes', href: '/resumes' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['isLoggedIn', 'user']);
  const { createNewResume } = useResumeStore();
  
  // Use the global user store
  const { 
    user, 
    userPhoto, 
    fetchUserPhoto, 
    clearUser, 
    initializeFromCookies 
  } = useUserStore();

  // Load user photo if not already loaded
  useEffect(() => {
    if (cookies.isLoggedIn && !userPhoto) {
      fetchUserPhoto();
    }
  }, [cookies.isLoggedIn, userPhoto, fetchUserPhoto]);

  const handleLogout = () => {
    clearUser(); 
    removeCookie('isLoggedIn', { path: '/' });
    removeCookie('user', { path: '/' });
    navigate('/');
  };

  const handleResumeBuilderClick = async (e) => {
    e.preventDefault();
    try {
      const newResumeId = await createNewResume();
      navigate(`/resume-builder/${newResumeId}`);
    } catch (error) {
      console.error('Error creating new resume:', error);
    }
  };

  // Use user data from store or fallback
  const displayUser = user || { name: 'User Name', email: 'user@example.com' };

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 flex flex-col fixed left-0 top-0 shadow-xl backdrop-blur-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <Link to="/" className="flex items-center group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg tracking-tight">IC</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-sm"></div>
          </div>
          <div className="ml-3">
            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              InstaCV
            </span>
            <div className="text-xs text-slate-500 font-medium">Professional CV Builder</div>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 pt-6 px-3">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Special handling for jobs section to include recommended-jobs
            const isActive = item.href === '/jobs' 
              ? location.pathname.startsWith('/jobs') || location.pathname.startsWith('/recommended-jobs')
              : location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm",
                  "hover:scale-[1.02] hover:-translate-y-0.5",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" 
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90"></div>
                )}
                <div className="relative z-10 flex items-center w-full">
                  <Icon className={cn(
                    "h-5 w-5 mr-3 transition-all duration-200",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                  )} />
                  <span className="font-medium">{item.label}</span>
                  {item.hasBadge && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "ml-auto text-[10px] px-1.5 py-0.5",
                        user?.githubConnected 
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                        isActive && user?.githubConnected && "bg-blue-200 text-blue-800",
                        isActive && !user?.githubConnected && "bg-gray-200 text-gray-800"
                      )}
                    >
                      <Github className="w-2.5 h-2.5 mr-0.5" />
                      {user?.githubConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-200/60 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50">
          <div className="relative">
            <Avatar className="w-12 h-12 ring-2 ring-white shadow-lg">
              {userPhoto ? (
                <AvatarImage src={userPhoto} alt={displayUser.name} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                  {displayUser.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate text-left">{displayUser.name}</p>
            <p className="text-xs text-slate-500 truncate text-left">{displayUser.email}</p>
          </div>
        </div>
        
        <Button 
          onClick={handleLogout}
          className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white group flex items-center justify-center py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5"
        >
          <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;