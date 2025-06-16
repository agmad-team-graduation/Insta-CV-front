import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/common/components/ui/card";
import { Github } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/common/utils/apiClient";

const GithubProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchGithubProfile();
  }, []);

  const fetchGithubProfile = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const response = await apiClient.post("/api/github/test/profile", {
        accessToken: "",
        forceRefresh
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching GitHub profile:", error);
      toast.error("Failed to fetch GitHub profile");
    } finally {
      setLoading(false);
    }
  };

  const onGithubConnect = async () => {
    try {
      const response = await apiClient.get("/api/github/test/authorize");
      const authUrl = response.data.authLink;
  
      const popup = window.open(authUrl, "_blank", "width=500,height=600");
  
      if (!popup) {
        toast.error("Popup blocked! Please allow popups for this site.");
        return;
      }
  
      // Listen for message from popup
      window.addEventListener(
        "message",
        async (event) => {
          if (event.origin !== window.location.origin) return;
  
          const { githubToken, error } = event.data;
  
          if (error) {
            toast.error(error);
            return;
          }
  
          if (githubToken) {
            // Now call /profile with the GitHub token
            const profileResponse = await apiClient.post("/api/github/test/profile", {
              accessToken: githubToken,
              forceRefresh: true
            });
  
            const profile = profileResponse.data;
  
            if (profile?.username) {
              console.log("GitHub profile received:", profile);
              toast.success(`Connected as ${profile.username}`);
              setProfile(profile);
            }
          }
        },
        { once: true }
      );
    } catch (error) {
      toast.error("Failed to connect to GitHub. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl mt-8">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Github className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black text-center">GitHub Profile</h1>
              <p className="text-gray-600 text-center">Your skills and projects from GitHub</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center gap-4">
            <Button 
              onClick={onGithubConnect}
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              Connect GitHub
            </Button>
            <Button 
              variant="outline"
              onClick={() => fetchGithubProfile(true)}
              disabled={loading}
            >
              Refresh Profile
            </Button>
          </div>

          {loading ? (
            <div className="mt-6 text-center">Loading GitHub profile...</div>
          ) : profile ? (
            <div className="mt-6">
              {/* Add your GitHub profile display components here */}
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="mt-6 text-center text-gray-600">
              No GitHub profile data available. Connect your GitHub account to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GithubProfile; 