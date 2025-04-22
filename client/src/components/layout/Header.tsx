import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Settings, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import Sidebar from "./Sidebar";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="bg-background border-b border-border py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <h2 className="font-primary text-xl mr-6">{title}</h2>
        
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Input
            type="text"
            placeholder="Search..."
            className="bg-secondary border border-border rounded-md py-1 px-3 text-sm w-64 focus:ring-1 focus:ring-primary focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="h-4 w-4 absolute right-3 top-2 text-muted-foreground" />
        </form>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="rounded-md hover:bg-secondary">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-md hover:bg-secondary relative">
          <Settings className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-primary rounded-full w-2 h-2"></span>
        </Button>
        
        {user && (
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
