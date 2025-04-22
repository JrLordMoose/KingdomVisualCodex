import { useState } from "react";
import { Bell, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AIAssistant } from "@/components/brand/ai-assistant";

export function Header({ activeTitle }: { activeTitle: string }) {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
  };
  
  return (
    <>
      <header className="bg-primary border-b border-dark-gray h-16 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="w-64 bg-sidebar-hover text-white border-dark-gray focus:border-branding-orange pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-light-gray absolute left-3 top-2.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-md hover:bg-sidebar-hover">
            <Bell className="h-5 w-5 text-light-gray" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-branding-orange"></span>
          </button>
          
          <button 
            className="p-2 rounded-md bg-ai-accent hover:bg-opacity-80 flex items-center"
            onClick={toggleAIAssistant}
          >
            <Zap className="h-5 w-5 text-white" />
            <span className="ml-2 text-white text-sm font-secondary">AI</span>
          </button>
          
          <div className="relative group">
            <button className="w-8 h-8 rounded-full bg-branding-orange text-white flex items-center justify-center font-secondary text-sm">
              <span>N</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-sidebar-hover rounded-md shadow-lg p-2 text-xs font-secondary border border-dark-gray opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
              <p className="text-white font-medium">Nexus</p>
              <p className="text-light-gray mt-1">Current active brand</p>
            </div>
          </div>
        </div>
      </header>
      
      {showAIAssistant && <AIAssistant onClose={toggleAIAssistant} />}
    </>
  );
}
