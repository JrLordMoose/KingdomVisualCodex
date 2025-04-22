import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

type AppLayoutProps = {
  children: ReactNode;
  title: string;
};

export function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Header activeTitle={title} />
        
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
