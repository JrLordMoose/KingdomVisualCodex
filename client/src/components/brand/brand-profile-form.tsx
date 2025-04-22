import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, X, Zap } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BrandProfileFormValues, brandProfileFormSchema } from "@shared/schema";

type BrandProfileFormProps = {
  initialData?: Partial<BrandProfileFormValues>;
  onSuccess?: () => void;
};

export function BrandProfileForm({ initialData, onSuccess }: BrandProfileFormProps) {
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || []);
  const [keywordInput, setKeywordInput] = useState("");
  const [demographics, setDemographics] = useState<string[]>(initialData?.demographics || []);
  const [demographicInput, setDemographicInput] = useState("");
  const [psychographics, setPsychographics] = useState<string[]>(initialData?.psychographics || []);
  const [psychographicInput, setPsychographicInput] = useState("");
  const [selectedTone, setSelectedTone] = useState<string>(initialData?.tone || "Professional");
  
  const { toast } = useToast();
  
  const form = useForm<BrandProfileFormValues>({
    resolver: zodResolver(brandProfileFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      tagline: initialData?.tagline || "",
      missionStatement: initialData?.missionStatement || "",
      keywords: initialData?.keywords || [],
      tone: initialData?.tone || "Professional",
      demographics: initialData?.demographics || [],
      psychographics: initialData?.psychographics || [],
    },
  });
  
  const createBrandMutation = useMutation({
    mutationFn: async (data: BrandProfileFormValues) => {
      const res = await apiRequest("POST", "/api/brands", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Brand profile created",
        description: "Your brand profile has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create brand profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const newKeywords = [...keywords, keywordInput.trim()];
      setKeywords(newKeywords);
      form.setValue("keywords", newKeywords);
      setKeywordInput("");
    }
  };
  
  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = keywords.filter(k => k !== keyword);
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords);
  };
  
  const handleAddDemographic = () => {
    if (demographicInput.trim() && !demographics.includes(demographicInput.trim())) {
      const newDemographics = [...demographics, demographicInput.trim()];
      setDemographics(newDemographics);
      form.setValue("demographics", newDemographics);
      setDemographicInput("");
    }
  };
  
  const handleRemoveDemographic = (demographic: string) => {
    const newDemographics = demographics.filter(d => d !== demographic);
    setDemographics(newDemographics);
    form.setValue("demographics", newDemographics);
  };
  
  const handleAddPsychographic = () => {
    if (psychographicInput.trim() && !psychographics.includes(psychographicInput.trim())) {
      const newPsychographics = [...psychographics, psychographicInput.trim()];
      setPsychographics(newPsychographics);
      form.setValue("psychographics", newPsychographics);
      setPsychographicInput("");
    }
  };
  
  const handleRemovePsychographic = (psychographic: string) => {
    const newPsychographics = psychographics.filter(p => p !== psychographic);
    setPsychographics(newPsychographics);
    form.setValue("psychographics", newPsychographics);
  };
  
  const handleSelectTone = (tone: string) => {
    setSelectedTone(tone);
    form.setValue("tone", tone);
  };
  
  const onSubmit = (data: BrandProfileFormValues) => {
    // Ensure the arrays are included in the form data
    const formData = {
      ...data,
      keywords,
      demographics,
      psychographics,
      tone: selectedTone,
    };
    createBrandMutation.mutate(formData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brand Basics Card */}
          <Card className="bg-card-bg border-card-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-primary text-2xl text-white">Brand Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your brand name" 
                        className="bg-sidebar-hover border-dark-gray text-white" 
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
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-secondary text-light-gray">Tagline</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter a catchy tagline" 
                        className="bg-sidebar-hover border-dark-gray text-white" 
                        {...field} 
                      />
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
                    <div className="flex justify-between">
                      <FormLabel className="text-xs uppercase tracking-wider font-secondary text-light-gray">Mission Statement</FormLabel>
                      <span className="text-xs text-light-gray font-secondary">
                        {field.value?.length || 0}/250
                      </span>
                    </div>
                    <FormControl>
                      <Textarea 
                        placeholder="Define your brand's mission statement" 
                        className="bg-sidebar-hover border-dark-gray text-white resize-none h-24" 
                        maxLength={250}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Target Audience Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader>
              <CardTitle className="font-primary text-2xl text-white">Target Audience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <FormLabel className="text-xs uppercase tracking-wider font-secondary text-light-gray">Demographics</FormLabel>
                <div className="px-4 py-3 bg-sidebar-hover rounded-md border border-dark-gray min-h-24">
                  <ul className="space-y-2 text-white font-secondary text-sm">
                    {demographics.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-branding-orange mr-2">•</span>
                        <span className="flex-1">{item}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveDemographic(item)}
                          className="text-light-gray hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex mt-2">
                  <Input
                    value={demographicInput}
                    onChange={(e) => setDemographicInput(e.target.value)}
                    placeholder="Add demographic"
                    className="bg-sidebar-hover border-dark-gray text-white rounded-r-none"
                  />
                  <Button 
                    type="button"
                    onClick={handleAddDemographic}
                    className="bg-sidebar-hover border border-dark-gray hover:bg-branding-orange hover:border-branding-orange text-white rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <FormLabel className="text-xs uppercase tracking-wider font-secondary text-light-gray">Psychographics</FormLabel>
                <div className="px-4 py-3 bg-sidebar-hover rounded-md border border-dark-gray min-h-24">
                  <ul className="space-y-2 text-white font-secondary text-sm">
                    {psychographics.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-branding-orange mr-2">•</span>
                        <span className="flex-1">{item}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemovePsychographic(item)}
                          className="text-light-gray hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex mt-2">
                  <Input
                    value={psychographicInput}
                    onChange={(e) => setPsychographicInput(e.target.value)}
                    placeholder="Add psychographic"
                    className="bg-sidebar-hover border-dark-gray text-white rounded-r-none"
                  />
                  <Button 
                    type="button"
                    onClick={handleAddPsychographic}
                    className="bg-sidebar-hover border border-dark-gray hover:bg-branding-orange hover:border-branding-orange text-white rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Brand Voice Card */}
          <Card className="bg-card-bg border-card-border lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Brand Voice</CardTitle>
              <Button variant="outline" className="flex items-center bg-sidebar-hover border-dark-gray text-ai-accent hover:text-white hover:bg-ai-accent">
                <Zap className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <FormLabel className="text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Keywords</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <div 
                      key={index} 
                      className="bg-sidebar-hover border border-dark-gray rounded-md px-3 py-1.5 text-white text-sm font-secondary flex items-center"
                    >
                      <span>{keyword}</span>
                      <button 
                        type="button"
                        className="ml-2 text-light-gray hover:text-white"
                        onClick={() => handleRemoveKeyword(keyword)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="border border-dashed border-dark-gray rounded-md px-3 py-1.5 text-light-gray hover:text-white text-sm font-secondary flex items-center hover:bg-sidebar-hover">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="Add keyword"
                      className="border-0 bg-transparent p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                    />
                    <button 
                      type="button"
                      onClick={handleAddKeyword}
                      className="ml-2"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <FormLabel className="text-xs uppercase tracking-wider font-secondary text-light-gray">Brand Tone</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Professional", "Conversational", "Bold", "Friendly", "Technical", "Playful", "Luxury", "Minimalist"].map((tone) => (
                    <div 
                      key={tone}
                      onClick={() => handleSelectTone(tone)}
                      className={`bg-sidebar-hover ${
                        selectedTone === tone 
                          ? 'border-2 border-branding-orange text-white font-medium' 
                          : 'border border-dark-gray text-light-gray hover:border-light-gray'
                      } rounded-md p-3 text-center cursor-pointer font-secondary`}
                    >
                      {tone}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            className="btn-secondary"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="btn-primary"
            disabled={createBrandMutation.isPending}
          >
            {createBrandMutation.isPending ? "Creating..." : "Create Brand Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
