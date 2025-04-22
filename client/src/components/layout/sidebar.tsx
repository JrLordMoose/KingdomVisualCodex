import { useLocation } from "wouter";
import { LucideIcon, BarChart3, Image, Palette, Type, Monitor, FileText, Grid, Download } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type SidebarNavItem = {
  title: string;
  icon: LucideIcon;
  href: string;
};

const dashboardItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/",
  },
  {
    title: "Brand Story",
    icon: FileText,
    href: "/brand-story",
  },
  {
    title: "Logo Guide",
    icon: Image,
    href: "/logo-guide",
  },
  {
    title: "Color Guide",
    icon: Palette,
    href: "/color-guide",
  },
  {
    title: "Typography",
    icon: Type,
    href: "/typography",
  },
];

const guidelinesItems: SidebarNavItem[] = [
  {
    title: "Digital Guidelines",
    icon: Monitor,
    href: "/digital-guidelines",
  },
  {
    title: "Print Guidelines",
    icon: FileText,
    href: "/print-guidelines",
  },
  {
    title: "Brand Moodboard",
    icon: Grid,
    href: "/brand-moodboard",
  },
  {
    title: "Export",
    icon: Download,
    href: "/export",
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="w-64 bg-sidebar-bg border-r border-dark-gray flex-shrink-0 fixed h-full z-10">
      <div className="p-6 border-b border-dark-gray">
        <h1 className="font-primary text-2xl tracking-tight text-white">KNGDM</h1>
      </div>
      
      <div className="py-4">
        <h3 className="font-secondary text-xs uppercase tracking-wider text-gray px-6 py-2">Dashboard</h3>
        
        {dashboardItems.map((item) => (
          <a 
            key={item.href}
            href={item.href} 
            className={`sidebar-link ${location === item.href ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, "", item.href);
            }}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.title}
          </a>
        ))}
      </div>
      
      <div className="py-4">
        <h3 className="font-secondary text-xs uppercase tracking-wider text-gray px-6 py-2">Guidelines</h3>
        
        {guidelinesItems.map((item) => (
          <a 
            key={item.href}
            href={item.href} 
            className={`sidebar-link ${location === item.href ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, "", item.href);
            }}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.title}
          </a>
        ))}
      </div>
      
      <div className="absolute bottom-0 w-full border-t border-dark-gray p-4">
        <a 
          href="/profile" 
          className="flex items-center p-2 rounded hover:bg-sidebar-hover"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, "", "/profile");
          }}
        >
          <div className="w-8 h-8 rounded-full bg-branding-orange text-white flex items-center justify-center font-secondary text-sm">
            <span>{user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : user?.username.substring(0, 2).toUpperCase()}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
            <p className="text-xs text-gray">Free Plan</p>
          </div>
        </a>
      </div>
    </div>
  );
}
