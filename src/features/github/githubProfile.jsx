import React, { useState, useEffect } from "react";
import apiClient from "@/common/utils/apiClient";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/common/components/ui/card";
import { Github, Loader2, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import GithubProjectSection from "./components/GithubProjectSection";
import GithubSkillsSection from "./components/GithubSkillsSection";
import useUserStore from "@/store/userStore";
import PageLoader from "@/common/components/ui/PageLoader";
import { FRONTEND_BASE_URL } from '@/config';

const GithubProfile = () => {
  const [githubData, setGithubData] = useState(null);
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tokenProcessed, setTokenProcessed] = useState(false);
  
  const { fetchUserData, user } = useUserStore();

  const fetchGithubProfile = async (forceRefresh = false, accessToken = "") => {
    try {
      setLoading(true);
      setRefreshing(true);
      
      const response1 = await apiClient.post(`/api/github/test/profile`, {
        accessToken,
        forceRefresh
      });
      setGithubData(response1.data);
      
      const response2 = await apiClient.get("/api/v1/profiles/me/skills");
      setSkills(response2.data);
      setError(null);
      
      if (forceRefresh) {
        toast.success("GitHub profile refreshed successfully");
      }
      
      return true;
    } catch (err) {
      console.error("Error fetching GitHub profile data:", err);
      
      if (!githubData && accessToken !== "") {
        setError("Please connect your GitHub account to view your profile.");
        toast.error(err.response?.data?.message || "Failed to fetch GitHub profile");
      } else if (accessToken !== "") {
        toast.error("Failed to refresh GitHub profile. Please try again.");
      }
      
      return false;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSkillAdded = (skillName) => {
    setSkills(prevSkills => {
      if (!Array.isArray(prevSkills)) {
        return [{ skill: skillName }];
      }
      
      const exists = prevSkills.some(s => 
        (typeof s === 'string' ? s : s.name || s.skill) === skillName
      );
      
      if (!exists) {
        return [...prevSkills, { skill: skillName }];
      }
      
      return prevSkills;
    });
  };

  const handleDisconnect = async () => {
    try {
      await apiClient.delete("/api/github/test/profile");
      setGithubData(null);
      setSkills(null);
      setError("Please connect your GitHub account to view your profile.");
      
      // Fetch fresh user data from backend to update GitHub connection status
      await fetchUserData(true);
      
      toast.success("GitHub account disconnected successfully");
    } catch (err) {
      console.error("Error disconnecting GitHub:", err);
      toast.error("Failed to disconnect GitHub account");
    }
  };

  const handleConnect = async () => {
    try {
      // Reset token processed flag
      setTokenProcessed(false);
      
      const response = await apiClient.get("/api/github/test/authorize");
      const authUrl = response.data.authLink;
  
      const popup = window.open(authUrl, "_blank", "width=500,height=600");
  
      if (!popup) {
        toast.error("Popup blocked! Please allow popups for this site.");
        return;
      }
  
      window.addEventListener(
        "message",
        async (event) => {
          if (event.origin !== FRONTEND_BASE_URL) return;
          if (tokenProcessed) return; // Prevent multiple processing
  
          const { githubToken, error } = event.data;
  
          if (error) {
            toast.error(error);
            return;
          }
  
          if (githubToken) {
            console.log("githubToken", githubToken);
            setTokenProcessed(true); // Mark as processed
            const success = await fetchGithubProfile(true, githubToken);
            if (success) {
              // Fetch fresh user data from backend to update GitHub connection status
              await fetchUserData(true);
            }
          }
        }
        // ,
        // { once: true }
      );
    } catch (error) {
      toast.error("Failed to connect to GitHub. Please try again.");
    }
  };

  // Initialize user data and handle GitHub profile loading
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Always fetch fresh user data to get the correct GitHub connection status
        const userData = await fetchUserData(true);
        
        // Only fetch GitHub profile if user has GitHub connected
        if (userData?.githubConnected) {
          await fetchGithubProfile(false, "");
        } else {
          // If not connected, set loading to false and show connect UI
          setLoading(false);
          setError("Please connect your GitHub account to view your profile.");
        }
      } catch (error) {
        console.error("Error initializing component:", error);
        setLoading(false);
        setError("Failed to load user data. Please try again.");
      }
    };

    initializeComponent();
  }, []); // Only run once on mount

  if (loading) {
    return (
      <PageLoader 
        title="Loading GitHub Profile" 
        subtitle="We're analyzing your repositories and skills..."
      />
    );
  }

  if (error || !githubData) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-5xl mt-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-6">
                <Github className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Connect Your GitHub Account</h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Connect your GitHub account to showcase your projects and skills on your profile.
                We'll analyze your public repositories to highlight your expertise.
              </p>
              <Button 
                onClick={handleConnect}
                className="px-6 py-2"
                size="lg"
              >
                <Github className="w-5 h-5 mr-2" />
                Connect GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl mt-8">
      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {githubData?.avatarUrl ? (
                <img 
                  src={githubData.avatarUrl} 
                  alt="GitHub Avatar" 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <Github className="w-10 h-10 text-gray-700 mt-1" />
              )}
              <div className="flex flex-col">
                {githubData?.name && (
                  <div className="mb-2">
                    <div className="text-black text-xl font-semibold mb-1">{githubData.name}</div>
                    {githubData?.username && (
                      <div className="text-gray-500 text-sm mb-3">@{githubData.username}</div>
                    )}
                  </div>
                )}
                {githubData?.bio && (
                  <div className="mb-2">
                    <div className="text-gray-500 font-semibold text-sm mb-1">Bio</div>
                    <div className="text-black text-base">{githubData.bio}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                onClick={handleConnect}
                disabled={refreshing}
                title="Refresh GitHub profile"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50 hover:text-red-600 transition-colors"
                onClick={handleDisconnect}
                title="Disconnect GitHub"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      {githubData?.skills && githubData.skills.length > 0 && (
        <div className="mb-6">
          <GithubSkillsSection 
            skills={githubData.skills} 
            userSkills={skills} 
            onSkillAdded={handleSkillAdded}
          />
        </div>
      )}

      {/* Projects Section */}
      {githubData?.repositories && githubData.repositories.length > 0 && (
        <div className="mb-6">
          <GithubProjectSection projects={githubData.repositories} />
        </div>
      )}

      {/* Empty state if no data */}
      {(!githubData?.skills || githubData.skills.length === 0) && 
       (!githubData?.repositories || githubData.repositories.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <Github className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No GitHub Data Found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any skills or projects from your GitHub profile. 
              Make sure your repositories are public and contain relevant information.
            </p>
            <Button onClick={handleConnect}>
              Connect GitHub
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GithubProfile; 