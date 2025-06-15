import React, { useState, useEffect } from "react";
import apiClient from "@/common/utils/apiClient";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/common/components/ui/card";
import { Github, Loader2 } from "lucide-react";
import GithubProjectSection from "./components/GithubProjectSection";
import GithubSkillsSection from "./components/GithubSkillsSection";

const GithubProfile = () => {
  const [githubData, setGithubData] = useState(null);
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGithubProfile = async () => {
      try {
        setLoading(true);
        const response1 = await apiClient.post("/api/github/test/profile", {}, {
            withCredentials: true
        });
        setGithubData(response1.data);
        console.log("response1", response1.data);
        const response2 = await apiClient.get("/api/v1/profiles/me/skills");
        setSkills(response2.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching GitHub profile data:", err);
        setError("Failed to load GitHub profile data. Please try again later.");
        toast.error("Failed to load GitHub profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGithubProfile();
  }, []);

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