import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  BookText, 
  Image, 
  Palette, 
  Type, 
  Laptop, 
  Printer, 
  FileOutput, 
  Settings 
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location === path ? "sidebar-link-active" : "";
  };
  
  const iconSize = 20;
  
  return (
    <div className="w-64 h-full bg-sidebar-bg border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="font-primary text-2xl tracking-wide">KNGDM</h1>
      </div>
      
      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          <h2 className="font-secondary text-xs uppercase tracking-wider text-muted-foreground mb-2 px-3">Main</h2>
          
          <Link href="/">
            <a className={`sidebar-link ${isActive("/")}`}>
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </a>
          </Link>
          
          <Link href="/brand-story">
            <a className={`sidebar-link ${isActive("/brand-story")}`}>
              <BookText className="h-5 w-5 mr-3" />
              Brand Story
            </a>
          </Link>
        </div>
        
        <div className="px-3 pt-4 pb-2">
          <h2 className="font-secondary text-xs uppercase tracking-wider text-muted-foreground mb-2 px-3">Style Guide</h2>
          
          <Link href="/logo-guide">
            <a className={`sidebar-link ${isActive("/logo-guide")}`}>
              <Image className="h-5 w-5 mr-3" />
              Logo Guide
            </a>
          </Link>
          
          <Link href="/color-guide">
            <a className={`sidebar-link ${isActive("/color-guide")}`}>
              <Palette className="h-5 w-5 mr-3" />
              Color Guide
            </a>
          </Link>
          
          <Link href="/typography">
            <a className={`sidebar-link ${isActive("/typography")}`}>
              <Type className="h-5 w-5 mr-3" />
              Typography
            </a>
          </Link>
          
          <Link href="/digital-guidelines">
            <a className={`sidebar-link ${isActive("/digital-guidelines")}`}>
              <Laptop className="h-5 w-5 mr-3" />
              Digital Guidelines
            </a>
          </Link>
          
          <Link href="/print-guidelines">
            <a className={`sidebar-link ${isActive("/print-guidelines")}`}>
              <Printer className="h-5 w-5 mr-3" />
              Print Guidelines
            </a>
          </Link>
          
          <Link href="/export">
            <a className={`sidebar-link ${isActive("/export")}`}>
              <FileOutput className="h-5 w-5 mr-3" />
              Export
            </a>
          </Link>
        </div>
      </nav>
      
      {/* User section */}
      <div className="p-4 border-t border-sidebar-border flex items-center">
        {user ? (
          <>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.username}</p>
            </div>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <Link href="/auth">
              <a className="text-sm text-primary">Sign in</a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
