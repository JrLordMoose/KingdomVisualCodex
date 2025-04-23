import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Zap, Eye, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Brand } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";

type BrandStoryFormValues = {
  name: string;
  tagline: string;
  missionStatement: string;
  keywords: string[];
  tone: string;
  demographics: string[];
  psychographics: string[];
  narrative: {
    origin: string;
    values: string;
    vision: string;
  };
};

const brandStorySchema = z.object({
  name: z.string().min(2),
  tagline: z.string().optional(),
  missionStatement: z.string().max(250).optional(),
  keywords: z.array(z.string()).optional(),
  tone: z.string().optional(),
  demographics: z.array(z.string()).optional(),
  psychographics: z.array(z.string()).optional(),
  narrative: z.object({
    origin: z.string().optional(),
    values: z.string().optional(),
    vision: z.string().optional(),
  }),
});

export default function BrandStoryPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [showCreateBrandForm, setShowCreateBrandForm] = useState(false);
  const [editMode, setEditMode] = useState({
    basics: false,
    voice: false,
    narrative: false,
    audience: false,
  });
  
  const { toast } = useToast();
  
  const { data: brandData, isLoading, error } = useQuery<Brand>({
    queryKey: ["/api/brands/current"],
    // Don't throw error on 404 - we'll handle it in the UI
    queryFn: async ({ signal }) => {
      const response = await fetch('/api/brands/current', { signal });
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch brand data');
      }
      return response.json();
    }
  });
  
  const form = useForm<BrandStoryFormValues>({
    resolver: zodResolver(brandStorySchema),
    defaultValues: {
      name: brandData?.name || "",
      tagline: brandData?.tagline || "",
      missionStatement: brandData?.missionStatement || "",
      keywords: brandData?.keywords || [],
      tone: brandData?.tone || "",
      demographics: brandData?.demographics || [],
      psychographics: brandData?.psychographics || [],
      narrative: brandData?.narrative as any || {
        origin: "",
        values: "",
        vision: "",
      },
    },
  });
  
  // Update form values when data is loaded
  useEffect(() => {
    if (brandData) {
      form.reset({
        name: brandData.name,
        tagline: brandData.tagline || "",
        missionStatement: brandData.missionStatement || "",
        keywords: brandData.keywords || [],
        tone: brandData.tone || "",
        demographics: brandData.demographics || [],
        psychographics: brandData.psychographics || [],
        narrative: brandData.narrative as any || {
          origin: "",
          values: "",
          vision: "",
        },
      });
    }
  }, [brandData, form]);
  
  const updateBrandMutation = useMutation({
    mutationFn: async (data: Partial<BrandStoryFormValues>) => {
      const res = await apiRequest("PATCH", `/api/brands/${brandData?.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Brand story updated",
        description: "Your brand story has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/brands/current"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update brand story",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const regenerateNarrativeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/generate-narrative", {
        brandName: form.getValues("name"),
        tagline: form.getValues("tagline"),
        missionStatement: form.getValues("missionStatement"),
        keywords: form.getValues("keywords"),
        tone: form.getValues("tone"),
      });
      return await res.json();
    },
    onSuccess: (data) => {
      form.setValue("narrative", data.narrative);
      updateBrandMutation.mutate({ narrative: data.narrative });
      toast({
        title: "Narrative regenerated",
        description: "Your brand narrative has been regenerated with AI.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to regenerate narrative",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleToggleEdit = (section: keyof typeof editMode) => {
    setEditMode(prev => {
      // If turning off edit mode, save the changes
      if (prev[section]) {
        const formData = form.getValues();
        updateBrandMutation.mutate(formData);
      }
      
      return {
        ...prev,
        [section]: !prev[section]
      };
    });
  };
  
  // Sample data for display when real data isn't loaded yet
  const keywords = brandData?.keywords || ["Innovative", "Connecting", "Forward-thinking", "Professional", "Dynamic"];
  const demographics = brandData?.demographics || [
    "Business executives and decision-makers, ages 35-55",
    "Mid to large-size organizations across tech, finance, and healthcare sectors",
    "Primarily urban markets in North America and Western Europe"
  ];
  const psychographics = brandData?.psychographics || [
    "Forward-thinking professionals who value innovation",
    "Results-oriented, with emphasis on measurable outcomes",
    "Seek balance between cutting-edge solutions and proven methodologies",
    "Value strategic partnerships over transactional relationships"
  ];
  
  const narrativeContent = brandData?.narrative as any || {
    origin: "Nexus was born from a profound recognition of the disconnect between visionary ideas and practical implementation. Founded in 2018, we identified that the most brilliant concepts often remained unrealized due to gaps in resources, expertise, and strategic direction. Our purpose stems from a fundamental belief that transformative ideas deserve the opportunity to materialize—regardless of their origin.",
    values: "At the core of Nexus's operational philosophy lies a commitment to innovation, integrity, and inclusivity. We approach each partnership with meticulous attention to detail and unwavering professionalism, while maintaining the adaptability to navigate complex challenges. Our collaborative methodology emphasizes transparent communication and mutual respect, ensuring that every stakeholder's voice contributes to the collective vision.",
    vision: "Nexus envisions a future where the barriers between imagination and reality have dissolved, creating an ecosystem where innovative ideas can flourish and scale efficiently. We're committed to expanding our technological capabilities and global presence, while remaining firmly anchored to our founding mission. As we evolve, we aspire to be recognized not merely as service providers, but as transformational partners who fundamentally enhance how organizations conceptualize and implement change."
  };
  
  // Create a new brand mutation
  const createBrandMutation = useMutation({
    mutationFn: async (data: BrandStoryFormValues) => {
      const res = await apiRequest("POST", "/api/brands", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Brand created",
        description: "Your brand has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/brands/current"] });
      setShowCreateBrandForm(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create brand",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle submit for creating a new brand
  const handleCreateBrand = (data: BrandStoryFormValues) => {
    createBrandMutation.mutate(data);
  };

  // If no brand found and not loading, show create brand form or button
  if (!isLoading && !brandData) {
    return (
      <AppLayout title="Create Brand">
        <motion.div 
          className="flex flex-col items-center justify-center min-h-[80vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {showCreateBrandForm ? (
            <div className="w-full max-w-2xl">
              <h1 className="font-primary text-4xl text-white tracking-tight mb-8 text-center">Create Your First Brand</h1>
              
              <Card className="bg-card-bg border-card-border">
                <CardContent className="pt-6 space-y-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateBrand)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Name*</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none"
                                placeholder="Enter your brand name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tagline"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Tagline</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none"
                                placeholder="A short, memorable phrase that captures your brand essence"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="missionStatement"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="flex justify-between">
                              <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Mission Statement</FormLabel>
                              <span className="text-xs text-light-gray font-secondary">{field.value?.length || 0}/250</span>
                            </div>
                            <FormControl>
                              <Textarea
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none resize-none h-24"
                                placeholder="Describe your brand's purpose and objectives"
                                maxLength={250}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateBrandForm(false)}
                          className="border-dark-gray text-light-gray hover:text-white hover:bg-sidebar-hover"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="btn-primary"
                          disabled={createBrandMutation.isPending}
                        >
                          {createBrandMutation.isPending ? "Creating..." : "Create Brand"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="rounded-full bg-card-bg border border-card-border p-6 inline-block">
                <BuildingStorefront className="h-12 w-12 text-branding-orange" />
              </div>
              <div className="space-y-3">
                <h1 className="font-primary text-4xl text-white tracking-tight">Create Your First Brand</h1>
                <p className="text-light-gray max-w-md font-secondary">
                  Start by creating a brand to define your identity, story, colors, and more.
                </p>
              </div>
              <Button 
                className="btn-primary px-8 py-6 text-lg mt-4"
                onClick={() => setShowCreateBrandForm(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Brand
              </Button>
            </div>
          )}
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Brand Story">
      {/* Page Header */}
      <motion.div 
        className="flex justify-between items-start mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="font-primary text-4xl text-white tracking-tight">Brand Story</h1>
          <p className="text-light-gray text-sm mt-2 font-secondary">Define the narrative and personality of your brand</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            className="btn-secondary"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            <span>Preview</span>
          </Button>
          <Button 
            className="btn-primary"
            onClick={() => regenerateNarrativeMutation.mutate()}
            disabled={regenerateNarrativeMutation.isPending}
          >
            {regenerateNarrativeMutation.isPending ? (
              <span>Regenerating...</span>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                <span>Regenerate</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>
      
      <Form {...form}>
        <form>
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              {/* Brand Basics Card */}
              <Card className="bg-card-bg border-card-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-primary text-2xl text-white">Brand Basics</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleToggleEdit('basics')}
                  >
                    <Edit className="h-5 w-5 text-light-gray hover:text-white" />
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-5">
                  {editMode.basics ? (
                    <>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Name</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tagline"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Tagline</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="missionStatement"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="flex justify-between">
                              <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Mission Statement</FormLabel>
                              <span className="text-xs text-light-gray font-secondary">{field.value?.length || 0}/250</span>
                            </div>
                            <FormControl>
                              <Textarea
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none resize-none h-24"
                                maxLength={250}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => handleToggleEdit('basics')}
                          className="btn-primary"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Name</h3>
                        <p className="text-white font-secondary">{form.watch("name") || (isLoading ? "Loading..." : "Not set")}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Tagline</h3>
                        <p className="text-white font-secondary">{form.watch("tagline") || (isLoading ? "Loading..." : "No tagline set")}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Mission Statement</h3>
                        <p className="text-white font-secondary">{form.watch("missionStatement") || (isLoading ? "Loading..." : "No mission statement set")}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Brand Voice Card */}
              <Card className="bg-card-bg border-card-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-primary text-2xl text-white">Brand Voice</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleToggleEdit('voice')}
                  >
                    <Edit className="h-5 w-5 text-light-gray hover:text-white" />
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-5">
                  {editMode.voice ? (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Keywords</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(field.value) && field.value.map((keyword, index) => (
                                    <div key={index} className="bg-sidebar-hover border border-dark-gray rounded-md px-3 py-1.5 text-white text-sm font-secondary flex items-center">
                                      {keyword}
                                      <X 
                                        className="h-3.5 w-3.5 ml-2 text-light-gray hover:text-white cursor-pointer" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const newKeywords = [...field.value];
                                          newKeywords.splice(index, 1);
                                          field.onChange(newKeywords);
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                                <div className="flex">
                                  <Input
                                    className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none"
                                    placeholder="Add new keyword"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        e.preventDefault();
                                        const newValue = [...(field.value || []), e.currentTarget.value.trim()];
                                        field.onChange(newValue);
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tone"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Tone</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {["Professional", "Conversational", "Bold", "Friendly", "Technical", "Playful"].map((tone) => (
                                  <div 
                                    key={tone}
                                    onClick={() => field.onChange(tone)}
                                    className={`bg-sidebar-hover ${
                                      field.value === tone 
                                        ? 'border-2 border-branding-orange text-white font-medium' 
                                        : 'border border-dark-gray text-light-gray hover:border-light-gray'
                                    } rounded-md p-3 text-center cursor-pointer font-secondary`}
                                  >
                                    {tone}
                                  </div>
                                ))}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => handleToggleEdit('voice')}
                          className="btn-primary"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {keywords.map((keyword, index) => (
                            <div key={index} className="bg-sidebar-hover border border-dark-gray rounded-md px-3 py-1.5 text-white text-sm font-secondary">
                              {keyword}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Tone</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="bg-sidebar-hover border-2 border-branding-orange rounded-md p-3 text-center cursor-pointer">
                            <p className="text-white font-secondary font-medium">{form.watch("tone") || "Professional"}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Brand Narrative Card */}
              <Card className="bg-card-bg border-card-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-primary text-2xl text-white">Brand Narrative</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => regenerateNarrativeMutation.mutate()}
                      disabled={regenerateNarrativeMutation.isPending}
                    >
                      <Zap className={`h-5 w-5 ${regenerateNarrativeMutation.isPending ? 'text-gray' : 'text-ai-accent'}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleToggleEdit('narrative')}
                    >
                      <Edit className="h-5 w-5 text-light-gray hover:text-white" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 text-white">
                  {editMode.narrative ? (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="narrative.origin"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-lg font-primary text-branding-orange">Origin & Purpose</FormLabel>
                            <FormControl>
                              <Textarea
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="narrative.values"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-lg font-primary text-branding-orange">Values & Approach</FormLabel>
                            <FormControl>
                              <Textarea
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="narrative.vision"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-lg font-primary text-branding-orange">Vision & Future</FormLabel>
                            <FormControl>
                              <Textarea
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => handleToggleEdit('narrative')}
                          className="btn-primary"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-primary text-branding-orange mb-2">Origin & Purpose</h3>
                        <p className="font-secondary text-white leading-relaxed">
                          {form.watch("narrative.origin") || narrativeContent.origin}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-primary text-branding-orange mb-2">Values & Approach</h3>
                        <p className="font-secondary text-white leading-relaxed">
                          {form.watch("narrative.values") || narrativeContent.values}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-primary text-branding-orange mb-2">Vision & Future</h3>
                        <p className="font-secondary text-white leading-relaxed">
                          {form.watch("narrative.vision") || narrativeContent.vision}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar Column */}
            <div>
              {/* Target Audience Card */}
              <Card className="bg-card-bg border-card-border sticky top-24">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-primary text-2xl text-white">Target Audience</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleToggleEdit('audience')}
                  >
                    <Edit className="h-5 w-5 text-light-gray hover:text-white" />
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-5">
                  {editMode.audience ? (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="demographics"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Demographics</FormLabel>
                            <FormControl>
                              <Textarea
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none resize-none h-24"
                                placeholder="Enter demographics, one per line"
                                value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                onChange={(e) => field.onChange(e.target.value.split('\n'))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="psychographics"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Psychographics</FormLabel>
                            <FormControl>
                              <Textarea
                                className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none resize-none h-24"
                                placeholder="Enter psychographics, one per line"
                                value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                onChange={(e) => field.onChange(e.target.value.split('\n'))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => handleToggleEdit('audience')}
                          className="btn-primary"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Demographics</h3>
                        <div className="px-4 py-3 bg-sidebar-hover rounded-md border border-dark-gray">
                          <ul className="space-y-2 text-white font-secondary text-sm">
                            {demographics.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-branding-orange mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Psychographics</h3>
                        <div className="px-4 py-3 bg-sidebar-hover rounded-md border border-dark-gray">
                          <ul className="space-y-2 text-white font-secondary text-sm">
                            {psychographics.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-branding-orange mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button className="w-full flex items-center justify-center btn-primary px-4 py-3">
                          <span>Generate Personas</span>
                          <Zap className="h-5 w-5 ml-2" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-card-bg border-card-border max-w-3xl max-h-[80vh] overflow-y-auto" style={{ borderRadius: '8px' }}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-primary text-white">
              Brand Story Preview
            </DialogTitle>
            <p className="text-light-gray font-secondary mt-2 text-sm">
              Preview how your brand story will appear in the final brand guide
            </p>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Brand Header */}
            <div className="text-center space-y-3 border-b border-dark-gray pb-6">
              <h1 className="text-3xl font-primary text-white tracking-tight">
                {form.watch("name") || "Brand Name"}
              </h1>
              
              {form.watch("tagline") && (
                <p className="text-light-gray text-lg italic font-secondary">
                  "{form.watch("tagline")}"
                </p>
              )}
              
              {form.watch("missionStatement") && (
                <p className="text-white font-secondary mt-4 max-w-2xl mx-auto">
                  {form.watch("missionStatement")}
                </p>
              )}
            </div>
            
            {/* Brand Story Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-primary text-branding-orange mb-3">Our Story</h2>
                <p className="text-white font-secondary leading-relaxed">
                  {form.watch("narrative.origin") || narrativeContent.origin}
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-primary text-branding-orange mb-3">Our Values</h2>
                <p className="text-white font-secondary leading-relaxed">
                  {form.watch("narrative.values") || narrativeContent.values}
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-primary text-branding-orange mb-3">Our Vision</h2>
                <p className="text-white font-secondary leading-relaxed">
                  {form.watch("narrative.vision") || narrativeContent.vision}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 border-t border-dark-gray pt-6 mt-6">
                {keywords.map((keyword, index) => (
                  <div key={index} className="bg-sidebar-hover border border-dark-gray rounded-md px-3 py-1.5 text-white text-sm font-secondary">
                    {keyword}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
