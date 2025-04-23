import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, Star } from "lucide-react";

// Pie chart data for matched and unmatched skills
const pieData = [
  { name: "Matched", value: 3, color: "#4ade80" },
  { name: "Unmatched", value: 2, color: "#f87171" },
];

function JobDetails() {
  return (
    <div className="min-h-screen flex items-start pt-[15vh]">
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Back button at the top */}
        <Button variant="ghost" className="flex items-center space-x-3 text-lg">
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </Button>

        {/* Main content area with left taking 2/3 and right taking 1/3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left area (2/3 width) */}
          <Card className="md:col-span-2 flex flex-col justify-between p-6">
            <CardContent className="flex flex-col flex-grow space-y-6">
              {/* Job title and company */}
              <div>
                <h2 className="text-3xl font-semibold mb-2">Frontend Engineer</h2>
                <p className="text-muted-foreground text-xl">@ Company</p>
              </div>

              {/* Job Description Section */}
              <div className="space-y-4 flex-grow">
                <h3 className="text-2xl font-semibold">Job Description</h3>
                <p className="text-lg text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
                </p>
                {/* Job tags */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" className="text-lg px-6 py-3">Remote</Button>
                  <Button variant="secondary" className="text-lg px-6 py-3">Full-Time</Button>
                  <Button variant="secondary" className="text-lg px-6 py-3">Another Tag</Button>
                </div>
              </div>

              {/* Resume generation and save buttons pinned at bottom */}
              <div className="pt-6 space-y-3">
                <Button className="w-full text-lg py-6">Generate Resume for this Job</Button>
                <Button variant="ghost" className="w-full text-lg py-6 flex items-center justify-center space-x-3">
                  <Star className="w-6 h-6" />
                  <span>Save Job</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Skill Match (1/3 width) */}
          <Card className="p-6">
            <CardContent className="space-y-6">
              <h3 className="text-2xl font-semibold">Your Skill Match</h3>
              {/* Pie chart visualizing skill match */}
              <div className="flex justify-center">
                <PieChart width={180} height={180}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              {/* Skill match summary */}
              <p className="text-lg text-muted-foreground text-center">3/5 Skills Matched</p>
              <Button className="w-full text-lg py-6">Learn These Skills</Button>
            </CardContent>
          </Card>
        </div>

        {/* Section for similar job recommendations */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Similar Jobs You May Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job suggestion card 1 */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <h4 className="text-xl font-medium">Jobarople</h4>
                <p className="text-lg text-muted-foreground">Lorem ipsum dolor sit amet.</p>
              </CardContent>
            </Card>

            {/* Job suggestion card 2 */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <h4 className="text-xl font-medium">Company</h4>
                <p className="text-lg text-muted-foreground">Consectetur adipiscing elit.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;