import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, Star, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import apiClient from './utils/apiClient';

function JobDetails() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { jobID } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(['isLoggedIn']);
  const token = cookies.isLoggedIn || '';

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await apiClient.get(`/api/v1/jobs/${jobID}`);
        
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobID]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!job) {
    return <div className="min-h-screen flex items-center justify-center">Job not found</div>;
  }



  // Calculate pie chart data and percentages
  const matchedSkillsCount = job.skillMatchingAnalysis.matchedSkills?.length || 0;
  const unmatchedSkillsCount = job.skillMatchingAnalysis.unmatchedJobSkills?.length || 0;
  const totalSkillsCount = matchedSkillsCount + unmatchedSkillsCount;
  
  // Calculate percentages
  const matchedPercentage = totalSkillsCount > 0 ? Math.round((matchedSkillsCount / totalSkillsCount) * 100) : 0;
  const unmatchedPercentage = totalSkillsCount > 0 ? Math.round((unmatchedSkillsCount / totalSkillsCount) * 100) : 0;
  
  // Ensure we have non-zero values for the pie chart
  const matchedValue = matchedSkillsCount || 0;
  const unmatchedValue = unmatchedSkillsCount || 0;
  
  // Create the pie chart data with fallback values to ensure it renders
  const pieData = [
    { name: "Matched", value: matchedValue > 0 ? matchedValue : 0, color: "#4ade80", percentage: matchedPercentage },
    { name: "Unmatched", value: unmatchedValue > 0 ? unmatchedValue : 0, color: "#f87171", percentage: unmatchedPercentage },
  ];
  
  // If both values are 0, add dummy data to render an empty chart
  if (matchedValue === 0 && unmatchedValue === 0) {
    pieData[0].value = 1;
    pieData[1].value = 0;
  }

  return (
    <div className="min-h-screen flex items-start pt-[10vh]">
      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top navigation row with back button and add job button */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="flex items-center space-x-3 text-lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back</span>
          </Button>
        </div>

        {/* Main content area with left taking 2/3 and right taking 1/3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left area (2/3 width) */}
          <Card className="md:col-span-2 flex flex-col justify-between p-6">
            <CardContent className="flex flex-col flex-grow space-y-6">
              {/* Job title and company */}
              <div>
                <h2 className="text-3xl font-semibold mb-2">{job.title || "No Title"}</h2>
                <p className="text-muted-foreground text-xl">@ {job.company || "Company"}</p>
              </div>

              {/* Job Description Section */}
              <div className="space-y-5 flex-grow">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Job Description</h3>
                  <div className="text-left text-muted-foreground whitespace-pre-line">
                    {job.description || "No description available."}
                  </div>
                </div>
                
                {/* Hard Skills */}
                {job.hardSkills && job.hardSkills.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-xl font-medium mb-3">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {job.hardSkills.map((skill, index) => (
                        <Button 
                          key={`hard-${index}`} 
                          variant="secondary" 
                          className="text-lg px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                          {typeof skill === 'string' ? skill : (skill.skill || 'Unknown')}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Resume generation and save buttons pinned at bottom */}
              <div className="pt-6 space-y-3">
                <Button className="w-full text-lg py-6">Generate Resume for this Job</Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Skill Match (1/3 width) */}
          <Card className="p-5">
            <CardContent className="space-y-5 p-0">
              <h3 className="text-2xl font-semibold">Your Skill Match</h3>
              
              {/* Pie chart visualizing skill match */}
              <div className="flex justify-center">
                <PieChart width={250} height={250}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    paddingAngle={5}
                    startAngle={90}
                    endAngle={-270}
                    label={({index}) => `${pieData[index].percentage}%`}
                    labelLine={false}
                    fontSize={16}
                    fontWeight="bold"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>

              {/* Add a clearer legend for the pie chart */}
              <div className="flex justify-center gap-6">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 mr-2" 
                    style={{ backgroundColor: pieData[0].color }}
                  ></div>
                  <span>Matched: {matchedSkillsCount}</span>
                </div>
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 mr-2" 
                    style={{ backgroundColor: pieData[1].color }}
                  ></div>
                  <span>Unmatched: {unmatchedSkillsCount}</span>
                </div>
              </div>
              
              {/* Skill match summary */}
              <p className="text-lg text-muted-foreground text-center">
                {(matchedValue > 0 || unmatchedValue > 0) ? (
                  `${matchedValue} Matched / ${unmatchedValue} Unmatched Skills`
                ) : (
                  "No skills to match"
                )}
              </p>
              
              {/* Matched skills */}
              {job.skillMatchingAnalysis.matchedSkills?.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-2">Matched Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skillMatchingAnalysis.matchedSkills.map((matchedSkill, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {matchedSkill.jobSkill.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Unmatched skills */}
              {job.skillMatchingAnalysis.unmatchedJobSkills?.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-2">Missing Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skillMatchingAnalysis.unmatchedJobSkills.map((unmatchedSkill, index) => (
                      <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {unmatchedSkill.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
            </CardContent>
          </Card>
        </div>

        {/* Section for similar job recommendations */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">
            Similar Jobs You May Like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job suggestion card 1 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <h4 className="text-xl font-medium text-primary">Jobarople</h4>
                <p className="text-md text-muted-foreground">Lorem ipsum dolor sit amet.</p>
                <Button variant="outline" className="w-full mt-2">View Details</Button>
              </CardContent>
            </Card>

            {/* Job suggestion card 2 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <h4 className="text-xl font-medium text-primary">Company</h4>
                <p className="text-md text-muted-foreground">Consectetur adipiscing elit.</p>
                <Button variant="outline" className="w-full mt-2">View Details</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;