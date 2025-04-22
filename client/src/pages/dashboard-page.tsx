import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import BrandPreview from "@/components/brand/BrandPreview";
import { motion } from "framer-motion";
import { Plus, Clock, LayoutGrid, BarChart3 } from "lucide-react";

// Brand creation form schema
const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  tagline: z.string().optional(),
  missionStatement: z.string().optional(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Fetch user's brands
  const { 
    data: brands = [], 
    isLoading: brandsLoading,
    error: brandsError
  } = useQuery({
    queryKey: ["/api/brands"],
    enabled: !!user,
  });
  
  // Brand creation form
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      tagline: "",
      missionStatement: "",
    },
  });
  
  const onSubmit = async (data: BrandFormValues) => {
    try {
      await apiRequest("POST", "/api/brands", data);
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({
        title: "Brand created",
        description: `${data.name} has been created successfully.`,
      });
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error creating brand",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout title="Dashboard">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="section-title">Dashboard</h1>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" /> Create Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-primary text-2xl">Create a New Brand</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brand name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brand tagline" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="missionStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission Statement (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter mission statement" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="btn-primary">Create Brand</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="text-muted-foreground mb-8 text-sm max-w-3xl">
          <p>Welcome to your KNGDM Visual Codex dashboard. Here you can manage your brand style guides and create new ones.</p>
        </div>
        
        {/* Recent Brands */}
        <div className="mb-8">
          <h2 className="font-primary text-2xl mb-4">Recent Brands</h2>
          
          {brandsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card border-border animate-pulse">
                  <CardContent className="p-6 h-40"></CardContent>
                </Card>
              ))}
            </div>
          ) : brandsError ? (
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <p className="text-destructive">Error loading brands</p>
              </CardContent>
            </Card>
          ) : brands.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-60">
                <h3 className="font-primary text-xl mb-2">No brands yet</h3>
                <p className="text-muted-foreground mb-4">Create your first brand to get started</p>
                <Button 
                  className="btn-primary"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Brand
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((brand, i) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-primary transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-primary text-xl">{brand.name}</h3>
                          <p className="text-xs text-muted-foreground">{brand.tagline || "No tagline"}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-foreground">
                            {brand.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground text-xs space-x-4 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(brand.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <LayoutGrid className="h-3 w-3 mr-1" />
                          <span>6 sections</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-background hover:bg-secondary text-foreground border border-border py-1.5 px-3 rounded-md text-sm font-secondary tracking-wider transition-all group-hover:border-primary"
                      >
                        Edit Style Guide
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: brands.length * 0.1 }}
              >
                <Card 
                  className="bg-card border-border border-dashed cursor-pointer hover:border-primary transition-colors h-full"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center mb-4">
                      <Plus className="h-6 w-6" />
                    </div>
                    <h3 className="font-primary text-xl mb-1">Create New Brand</h3>
                    <p className="text-muted-foreground text-sm">Add a new brand to your collection</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
        
        {/* Analytics Summary */}
        {brands.length > 0 && (
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-6">
              <h2 className="font-primary text-2xl mb-4">Analytics Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="flex items-center mb-2">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-bold text-sm">Total Brands</h3>
                  </div>
                  <p className="text-3xl font-primary">{brands.length}</p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 mr-2 text-warning" />
                    <h3 className="font-bold text-sm">Latest Update</h3>
                  </div>
                  <p className="text-sm">
                    {new Date(Math.max(...brands.map(b => new Date(b.updatedAt).getTime()))).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="flex items-center mb-2">
                    <LayoutGrid className="h-5 w-5 mr-2 text-info" />
                    <h3 className="font-bold text-sm">Active Guides</h3>
                  </div>
                  <p className="text-3xl font-primary">{brands.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Brand Preview */}
        {brands.length > 0 && (
          <BrandPreview 
            brandName={brands[0].name}
            tagline={brands[0].tagline || "Brand Tagline"}
            description={brands[0].missionStatement || "Your brand description will appear here. Define your brand's story, values, and mission in the Brand Story section."}
            primaryColor="#E85000"
            secondaryText="Your brand journey begins here. Explore all sections to complete your style guide."
            onExploreFullPreview={() => console.log("Explore full preview")}
          />
        )}
      </div>
    </AppLayout>
  );
}
