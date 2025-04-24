// components/Hero.jsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Upload, Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import exp from "constants"

const templates = [
  {
    id: 1,
    name: "ATLANTIC BLUE - MULTI-COLUMN RESUME WITH SIDEBAR",
    image: "/template1.png"
  },
  {
    id: 2,
    name: "EXECUTIVE - SERIF FONT, BLACK AND WHITE RESUME",
    image: "/template2.png"
  },
  {
    id: 3,
    name: "BLUE STEEL - MINIMALISTIC RESUME, CLASSIC",
    image: "/template3.png"
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-4rem)] flex gap-6">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="ml-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <div className="w-64 bg-gray-100 rounded-xl p-6 fixed">
            <SidebarContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 rounded-xl p-6 md:p-8 md:ml-64">
          <div className="max-w-5xl">
            <h1 className="text-2xl font-bold mb-2">
              Start building your resume
            </h1>
            <p className="text-gray-500 mb-8">
              Your first resume – 100% free, all design features, unlimited downloads – yes really.
            </p>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* New Blank Template */}
              <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
                <Button 
                  variant="ghost" 
                  className="w-full h-full min-h-[200px] flex flex-col items-center justify-center"
                >
                  <Plus className="h-8 w-8 mb-2 text-gray-400" />
                  <span className="text-gray-600">New blank</span>
                </Button>
              </Card>

              {/* Import Resume */}
              <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
                <Button 
                  variant="ghost" 
                  className="w-full h-full min-h-[200px] flex flex-col items-center justify-center"
                >
                  <Upload className="h-8 w-8 mb-2 text-gray-400" />
                  <span className="text-gray-600">Import resume</span>
                </Button>
              </Card>

              {/* Resume Templates */}
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={template.image} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-600 text-center">
                      {template.name}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

// Sidebar Content Component
function SidebarContent() {
    return (
      <div className="flex flex-col h-auto">
        <div className="mb-8 flex items-center gap-2">
          <img src="/logos/main-icon.png" alt="InstaCV" className="h-12" />
          <span className="text-xl font-bold">InstaCV</span>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left font-medium"
          >
            Resume
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-gray-600"
          >
            Cover Letter
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-gray-600"
          >
            Job Tracker
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-gray-600"
          >
            More
          </Button>
        </div>
  
        <div className="mt-6">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-gray-600"
          >
            My account
          </Button>
        </div>
      </div>
    )
  }