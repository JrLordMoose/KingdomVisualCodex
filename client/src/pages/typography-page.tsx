import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Download, Zap, Check, Plus, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Typography } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type FontCardProps = {
  font: Typography;
  onClick?: () => void;
  isSelected?: boolean;
};

const FontCard = ({ font, onClick, isSelected }: FontCardProps) => {
  return (
    <div 
      className={`bg-card-bg border ${isSelected ? 'border-branding-orange' : 'border-card-border'} rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg`}
      onClick={onClick}
    >
      <div className="p-6 h-40 flex flex-col justify-center">
        <h4 
          className="text-3xl text-white mb-4"
          style={{ fontFamily: font.fontFamily }}
        >
          {font.fontFamily}
        </h4>
        <p 
          className="text-light-gray text-sm"
          style={{ fontFamily: font.fontFamily }}
        >
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
      <div className="bg-sidebar-hover p-4 flex justify-between items-center">
        <div>
          <p className="text-white font-secondary text-sm">{font.fontFamily}</p>
          <p className="text-light-gray text-xs font-secondary">{font.category}</p>
        </div>
        {isSelected && <Check className="h-5 w-5 text-branding-orange" />}
      </div>
    </div>
  );
};

export default function TypographyPage() {
  const [selectedFont, setSelectedFont] = useState<Typography | null>(null);
  const [newFontFamily, setNewFontFamily] = useState("");
  const [newFontCategory, setNewFontCategory] = useState("Headings");
  const [newFontWeights, setNewFontWeights] = useState<string[]>(["400", "700"]);
  const { toast } = useToast();
  
  const { data: typography, isLoading } = useQuery<Typography[]>({
    queryKey: ["/api/typography"],
  });
  
  const addTypographyMutation = useMutation({
    mutationFn: async (typographyData: Partial<Typography>) => {
      const res = await apiRequest("POST", "/api/typography", typographyData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Font added",
        description: "The font has been added to your typography system",
      });
      setNewFontFamily("");
      queryClient.invalidateQueries({ queryKey: ["/api/typography"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding font",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const generateTypographyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/generate-typography", {});
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Typography generated",
        description: "New font pairs have been added to your typography system",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/typography"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error generating typography",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleAddFont = () => {
    if (!newFontFamily) {
      toast({
        title: "Font family required",
        description: "Please provide a font family name",
        variant: "destructive",
      });
      return;
    }
    
    addTypographyMutation.mutate({
      fontFamily: newFontFamily,
      category: newFontCategory,
      weights: newFontWeights,
      styles: ["normal"],
    });
  };
  
  // Default typography if none are loaded yet
  const defaultTypography = [
    { id: 1, brandId: 1, fontFamily: 'Anton', category: 'Headings', weights: ['400'], styles: ['normal'] },
    { id: 2, brandId: 1, fontFamily: 'Roboto Mono', category: 'Body', weights: ['400', '500', '700'], styles: ['normal', 'italic'] },
  ];
  
  const displayTypography = typography?.length ? typography : defaultTypography;
  
  // Group typography by category
  const typographyByCategory = displayTypography.reduce((acc, font) => {
    const category = font.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(font);
    return acc;
  }, {} as Record<string, Typography[]>);
  
  return (
    <AppLayout title="Typography">
      {/* Page Header */}
      <motion.div 
        className="flex justify-between items-start mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="font-primary text-4xl text-white tracking-tight">Typography</h1>
          <p className="text-light-gray text-sm mt-2 font-secondary">Define your brand's typography system and hierarchy</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            className="btn-secondary"
            onClick={handleAddFont}
            disabled={addTypographyMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Font</span>
          </Button>
          <Button 
            className="btn-primary"
            onClick={() => generateTypographyMutation.mutate()}
            disabled={generateTypographyMutation.isPending}
          >
            <Zap className="h-4 w-4 mr-2" />
            <span>{generateTypographyMutation.isPending ? "Generating..." : "Generate Pairs"}</span>
          </Button>
        </div>
      </motion.div>
      
      {/* Typography Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Font Showcase Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Font Showcase</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full bg-sidebar-hover mb-6">
                  <TabsTrigger value="all" className="font-secondary">All Fonts</TabsTrigger>
                  <TabsTrigger value="headings" className="font-secondary">Headings</TabsTrigger>
                  <TabsTrigger value="body" className="font-secondary">Body</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      // Loading skeletons
                      Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-sidebar-hover rounded-xl animate-pulse h-64"></div>
                      ))
                    ) : (
                      displayTypography.map((font) => (
                        <FontCard
                          key={font.id}
                          font={font}
                          onClick={() => setSelectedFont(font)}
                          isSelected={selectedFont?.id === font.id}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="headings" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      Array(2).fill(0).map((_, i) => (
                        <div key={i} className="bg-sidebar-hover rounded-xl animate-pulse h-64"></div>
                      ))
                    ) : (
                      displayTypography
                        .filter(font => font.category === 'Headings')
                        .map((font) => (
                          <FontCard
                            key={font.id}
                            font={font}
                            onClick={() => setSelectedFont(font)}
                            isSelected={selectedFont?.id === font.id}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="body" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      Array(2).fill(0).map((_, i) => (
                        <div key={i} className="bg-sidebar-hover rounded-xl animate-pulse h-64"></div>
                      ))
                    ) : (
                      displayTypography
                        .filter(font => font.category === 'Body')
                        .map((font) => (
                          <FontCard
                            key={font.id}
                            font={font}
                            onClick={() => setSelectedFont(font)}
                            isSelected={selectedFont?.id === font.id}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Typography Scale Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Typography Scale</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-sidebar-hover rounded-xl p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h1 className="font-primary text-5xl text-white">Page Title</h1>
                    <p className="text-light-gray text-xs font-secondary">3rem / 48px</p>
                  </div>
                  <div className="border-b border-dashed border-dark-gray"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-primary text-4xl text-white">Section Heading</h2>
                    <p className="text-light-gray text-xs font-secondary">2.25rem / 36px</p>
                  </div>
                  <div className="border-b border-dashed border-dark-gray"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-primary text-2xl text-white">Subsection Heading</h3>
                    <p className="text-light-gray text-xs font-secondary">1.5rem / 24px</p>
                  </div>
                  <div className="border-b border-dashed border-dark-gray"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-primary text-xl text-white">Card Title</h4>
                    <p className="text-light-gray text-xs font-secondary">1.25rem / 20px</p>
                  </div>
                  <div className="border-b border-dashed border-dark-gray"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <p className="font-secondary text-base text-white">Body Text</p>
                    <p className="text-light-gray text-xs font-secondary">1rem / 16px</p>
                  </div>
                  <div className="border-b border-dashed border-dark-gray"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <p className="font-secondary text-sm text-white">Small Text / Caption</p>
                    <p className="text-light-gray text-xs font-secondary">0.875rem / 14px</p>
                  </div>
                  <div className="border-b border-dashed border-dark-gray"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <p className="font-secondary text-xs uppercase tracking-wider text-white">Button Text / Label</p>
                    <p className="text-light-gray text-xs font-secondary">0.75rem / 12px</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-primary text-lg mb-4">Line Heights</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-sidebar-hover p-4 rounded-lg">
                    <p className="text-white font-secondary text-sm">Headings</p>
                    <p className="text-light-gray text-xs font-secondary">--leading-tight: 1.25</p>
                  </div>
                  
                  <div className="bg-sidebar-hover p-4 rounded-lg">
                    <p className="text-white font-secondary text-sm">Body</p>
                    <p className="text-light-gray text-xs font-secondary">--leading-normal: 1.5</p>
                  </div>
                  
                  <div className="bg-sidebar-hover p-4 rounded-lg">
                    <p className="text-white font-secondary text-sm">Labels</p>
                    <p className="text-light-gray text-xs font-secondary">--leading-none: 1</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Typography Rules Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Typography Rules</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-primary text-lg mb-4">Font Usage</h3>
                  <div className="bg-sidebar-hover p-5 rounded-xl space-y-4">
                    <div className="space-y-2">
                      <p className="text-white font-secondary text-sm font-medium">Headings</p>
                      <p className="text-light-gray text-xs font-secondary">
                        Use <span className="text-white font-medium">Anton</span> for all headings. Keep headings concise and descriptive.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-white font-secondary text-sm font-medium">Body Text</p>
                      <p className="text-light-gray text-xs font-secondary">
                        Use <span className="text-white font-medium">Roboto Mono</span> for all body text. Maintain consistent line heights.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-white font-secondary text-sm font-medium">UI Elements</p>
                      <p className="text-light-gray text-xs font-secondary">
                        Use <span className="text-white font-medium">Roboto Mono</span> for UI elements, labels, and buttons. Use uppercase for labels.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-primary text-lg mb-4">Do's and Don'ts</h3>
                  <div className="space-y-4">
                    <div className="bg-sidebar-hover rounded-lg p-4 border-l-4 border-success">
                      <p className="text-white font-secondary text-sm font-medium mb-2">Do:</p>
                      <ul className="text-light-gray text-xs font-secondary space-y-2">
                        <li className="flex items-start">
                          <span className="text-success mr-2">•</span>
                          <span>Maintain consistent type scale across all materials</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-success mr-2">•</span>
                          <span>Use proper hierarchy to guide user attention</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-success mr-2">•</span>
                          <span>Maintain adequate contrast for readability</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-sidebar-hover rounded-lg p-4 border-l-4 border-destructive">
                      <p className="text-white font-secondary text-sm font-medium mb-2">Don't:</p>
                      <ul className="text-light-gray text-xs font-secondary space-y-2">
                        <li className="flex items-start">
                          <span className="text-destructive mr-2">•</span>
                          <span>Mix too many font weights or styles</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-destructive mr-2">•</span>
                          <span>Use decorative fonts for body text</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-destructive mr-2">•</span>
                          <span>Stretch or distort fonts unnaturally</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-primary text-lg mb-4">Special Treatments</h3>
                <div className="bg-sidebar-hover p-5 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-white font-secondary text-sm font-medium">Links</p>
                      <p className="text-branding-orange underline text-sm font-secondary cursor-pointer hover:text-opacity-80">
                        Clickable Link
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-white font-secondary text-sm font-medium">Quotes</p>
                      <p className="text-white text-sm font-secondary italic border-l-2 border-branding-orange pl-3">
                        "Quoted text example"
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-white font-secondary text-sm font-medium">Emphasis</p>
                      <p className="text-white text-sm font-secondary">
                        Regular text with <span className="text-branding-orange font-medium">emphasized</span> words
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          {selectedFont ? (
            <Card className="bg-card-bg border-card-border sticky top-24">
              <CardHeader>
                <CardTitle className="font-primary text-2xl text-white">{selectedFont.fontFamily}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div>
                  <p className="text-light-gray font-secondary text-xs uppercase tracking-wider mb-2">Preview</p>
                  <div className="bg-sidebar-hover p-4 rounded-lg">
                    <p 
                      className="text-white text-xl mb-2"
                      style={{ fontFamily: selectedFont.fontFamily }}
                    >
                      ABCDEFGHIJKLM
                    </p>
                    <p 
                      className="text-white text-xl mb-4"
                      style={{ fontFamily: selectedFont.fontFamily }}
                    >
                      NOPQRSTUVWXYZ
                    </p>
                    <p 
                      className="text-light-gray text-sm"
                      style={{ fontFamily: selectedFont.fontFamily }}
                    >
                      abcdefghijklmnopqrstuvwxyz
                    </p>
                    <p 
                      className="text-light-gray text-sm"
                      style={{ fontFamily: selectedFont.fontFamily }}
                    >
                      0123456789!@#$%&*()
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Category</p>
                  <p className="text-white font-secondary">{selectedFont.category}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Available Weights</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFont.weights.map((weight, index) => (
                      <div 
                        key={index}
                        className="bg-sidebar-hover border border-dark-gray rounded-md px-3 py-1 text-white text-xs font-secondary"
                      >
                        {weight}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Styles</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFont.styles.map((style, index) => (
                      <div 
                        key={index}
                        className="bg-sidebar-hover border border-dark-gray rounded-md px-3 py-1 text-white text-xs font-secondary"
                      >
                        {style}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-dark-gray pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <Button className="w-full btn-primary mt-3">
                    <a 
                      href={`https://fonts.google.com/specimen/${selectedFont.fontFamily.replace(/\s+/g, '+')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full"
                    >
                      View on Google Fonts
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card-bg border-card-border sticky top-24">
              <CardHeader>
                <CardTitle className="font-primary text-2xl text-white">Add New Font</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Font Family</label>
                  <Input 
                    placeholder="Enter font family name" 
                    className="bg-sidebar-hover border-dark-gray text-white" 
                    value={newFontFamily}
                    onChange={(e) => setNewFontFamily(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Category</label>
                  <Select
                    value={newFontCategory}
                    onValueChange={setNewFontCategory}
                  >
                    <SelectTrigger className="bg-sidebar-hover border-dark-gray text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-sidebar-hover border-dark-gray text-white">
                      <SelectItem value="Headings">Headings</SelectItem>
                      <SelectItem value="Body">Body</SelectItem>
                      <SelectItem value="UI">UI</SelectItem>
                      <SelectItem value="Display">Display</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Font Weights</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["300", "400", "500", "700"].map((weight) => (
                      <div 
                        key={weight}
                        onClick={() => {
                          if (newFontWeights.includes(weight)) {
                            setNewFontWeights(newFontWeights.filter(w => w !== weight));
                          } else {
                            setNewFontWeights([...newFontWeights, weight]);
                          }
                        }}
                        className={`
                          bg-sidebar-hover
                          ${newFontWeights.includes(weight) 
                            ? 'border-2 border-branding-orange text-white' 
                            : 'border border-dark-gray text-light-gray hover:border-light-gray'
                          }
                          rounded-md p-2 text-center cursor-pointer font-secondary text-sm
                        `}
                      >
                        {weight}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full btn-primary mt-4"
                  onClick={handleAddFont}
                  disabled={addTypographyMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {addTypographyMutation.isPending ? "Adding..." : "Add Font"}
                </Button>
                
                <div className="mt-4">
                  <p className="text-xs text-light-gray font-secondary mb-3">
                    <AlertTriangle className="h-3 w-3 inline-block mr-1 text-warning" />
                    Make sure the font is available in Google Fonts or import it separately.
                  </p>
                  
                  <Button 
                    className="w-full bg-sidebar-hover border border-dark-gray text-white hover:bg-dark-gray"
                  >
                    <a 
                      href="https://fonts.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full"
                    >
                      Browse Google Fonts
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
