function SidebarContent() {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="mb-8">
          <img src="/flowcv-logo.png" alt="FlowCV" className="h-8" />
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
  
        <div className="mt-auto">
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