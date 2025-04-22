import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, PlusCircle, Settings, Edit, Clock, Eye, ArrowDown } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BrandProfileForm } from "@/components/brand/brand-profile-form";
import { useQuery } from "@tanstack/react-query";
import { Brand } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [_, navigate] = useLocation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });
  
  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    toast({
      title: "Success",
      description: "Your brand has been created. Let's build your style guide!",
    });
    navigate("/brand-story");
  };
  
  const recentProjects = brands || [];
  
  return (
    <AppLayout title="Dashboard">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-primary text-4xl text-white tracking-tight">Dashboard</h1>
          <p className="text-light-gray text-sm mt-2 font-secondary">Manage your brand style guides and projects</p>
        </motion.div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              <span>Create New</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-primary border-dark-gray sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-primary text-white">Create New Brand Profile</DialogTitle>
            </DialogHeader>
            <BrandProfileForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Main Content */}
      <div className="space-y-8">
        {/* Recent Projects */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-primary text-white">Recent Projects</h2>
            <Button variant="ghost" className="text-light-gray hover:text-white">
              <Clock className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.length > 0 ? (
              recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="bg-card-bg border-card-border hover:shadow-lg transition-all duration-200 h-full">
                    <CardContent className="p-0">
                      <div className="h-40 bg-gradient-to-r from-gray-900 to-black relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="font-primary text-4xl text-white">{project.name.charAt(0)}</h3>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black to-transparent">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-light-gray font-secondary">
                              Last edited: {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-branding-orange font-secondary">45% Complete</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-primary text-xl text-white mb-1">{project.name}</h4>
                        <p className="text-light-gray text-sm font-secondary line-clamp-2 mb-3">{project.tagline || 'No tagline set'}</p>
                        
                        <div className="flex justify-between mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-light-gray bg-sidebar-hover border-dark-gray hover:text-white"
                            onClick={() => navigate("/brand-story")}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-light-gray bg-sidebar-hover border-dark-gray hover:text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="bg-card-bg border-card-border h-full">
                  <CardContent className="p-0">
                    <div className="h-40 bg-sidebar-hover animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-sidebar-hover rounded animate-pulse w-2/3"></div>
                      <div className="h-4 bg-sidebar-hover rounded animate-pulse w-full"></div>
                      <div className="flex justify-between mt-4">
                        <div className="h-9 bg-sidebar-hover rounded animate-pulse w-24"></div>
                        <div className="h-9 bg-sidebar-hover rounded animate-pulse w-24"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Empty state
              <Card className="bg-card-bg border-card-border col-span-full p-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-sidebar-hover flex items-center justify-center mb-4">
                    <PlusCircle className="h-8 w-8 text-light-gray" />
                  </div>
                  <h3 className="text-xl font-primary text-white mb-2">No projects yet</h3>
                  <p className="text-light-gray font-secondary mb-6">Create your first brand style guide to get started</p>
                  <Button 
                    className="btn-primary"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
        
        {/* Template Gallery */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-primary text-white">Template Gallery</h2>
            <Button variant="ghost" className="text-light-gray hover:text-white">
              <ArrowDown className="h-4 w-4 mr-2" />
              Browse All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Corporate", "Creative", "Minimalist"].map((template, index) => (
              <motion.div
                key={template}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-card-bg border-card-border h-full group cursor-pointer hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="font-primary text-3xl text-white">{template}</h3>
                      </div>
                      <div className="absolute inset-0 bg-branding-orange opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-primary text-lg text-white">{template} Template</h4>
                      <p className="text-light-gray text-sm font-secondary mb-4">Perfect for {template.toLowerCase()} businesses and brands</p>
                      
                      <Button className="w-full btn-primary">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
