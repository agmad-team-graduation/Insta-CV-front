import React, { useState, useEffect } from "react";
import apiClient from "@/common/utils/apiClient";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/common/components/ui/card";
import { Github, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import GithubProjectSection from "./components/GithubProjectSection";
import GithubSkillsSection from "./components/GithubSkillsSection";

const GithubProfile = () => {
  const [githubData, setGithubData] = useState(null);
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGithubProfile = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const response1 = await apiClient.post(`/api/github/test/profile?forceRefresh=${forceRefresh}`, {}, {
          withCredentials: true
      });
      setGithubData(response1.data);
      console.log("response1", response1.data);
      const response2 = await apiClient.get("/api/v1/profiles/me/skills");
      setSkills(response2.data);
      setError(null);
      if (forceRefresh) {
        toast.success("GitHub profile refreshed successfully");
      }
    } catch (err) {
      console.error("Error fetching GitHub profile data:", err);
      toast.error("Please connect/reconnect your GitHub account to refresh the profile.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGithubProfile(false);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGithubProfile(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-5xl mt-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading GitHub profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-5xl mt-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Github className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load GitHub Profile</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
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
              <Github className="w-10 h-10 text-gray-700 mt-1" />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-black mb-7 ml-4">GitHub Profile</h1>
                {githubData?.name && (
                  <div className="mb-2">
                    <div className="text-gray-500 font-semibold text-sm mb-1 text-left ml-6">Name</div>
                    <div className="text-black text-base text-left mb-3 ml-6">{githubData.name}</div>
                  </div>
                )}
                {githubData?.bio && (
                  <div className="mb-2">
                    <div className="text-gray-500 font-semibold text-sm mb-1 ml-6 text-left">Bio</div>
                    <div className="text-black text-base ml-6 text-left">{githubData.bio}</div>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh GitHub profile"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      {githubData?.skills && githubData.skills.length > 0 && (
        <div className="mb-6">
          <GithubSkillsSection skills={githubData.skills} userSkills={skills} />
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
       (!githubData?.projects || githubData.projects.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <Github className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No GitHub Data Found</h3>
            <p className="text-gray-600">
              We couldn't find any skills or projects from your GitHub profile. 
              Make sure your repositories are public and contain relevant information.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GithubProfile; 