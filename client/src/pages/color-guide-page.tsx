import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Download, Plus, Copy, Zap, Info, Check, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Color } from "@shared/schema";

type ColorSwatchProps = {
  color: string;
  name: string;
  hex: string;
  rgb: string;
  category: string;
  onClick?: () => void;
  isSelected?: boolean;
};

const ColorSwatch = ({ color, name, hex, rgb, category, onClick, isSelected }: ColorSwatchProps) => {
  const { toast } = useToast();
  
  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: `${label}: ${value}`,
    });
  };
  
  const textColor = color === "#FFFFFF" || color === "#F9F9F9" ? "#000000" : "#FFFFFF";
  
  return (
    <div 
      className={`color-card bg-card-bg border ${isSelected ? 'border-branding-orange' : 'border-card-border'} rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg`}
      onClick={onClick}
    >
      <div 
        className="h-32 flex items-center justify-center" 
        style={{ backgroundColor: color }}
      >
        <span className="font-primary text-4xl" style={{ color: textColor }}>{name.charAt(0)}</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-white font-primary text-lg">{name}</h4>
            <p className="text-light-gray text-xs font-secondary">{category}</p>
          </div>
          {isSelected && <Check className="h-5 w-5 text-branding-orange" />}
        </div>
        
        <div className="flex justify-between mt-3">
          <button 
            className="text-light-gray hover:text-white text-xs flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(hex, "HEX");
            }}
          >
            <span>{hex}</span>
            <Copy className="h-3 w-3 ml-1" />
          </button>
          
          <button 
            className="text-light-gray hover:text-white text-xs flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(rgb, "RGB");
            }}
          >
            <span>{rgb}</span>
            <Copy className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

type ColorContrastCheckProps = {
  foreground: string;
  background: string;
};

const ColorContrastCheck = ({ foreground, background }: ColorContrastCheckProps) => {
  // Simple contrast ratio calculation
  const calculateContrastRatio = (fg: string, bg: string) => {
    // Extract RGB values
    const getRGB = (hex: string) => {
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return [r, g, b];
    };
    
    const fgRGB = getRGB(fg);
    const bgRGB = getRGB(bg);
    
    // Calculate relative luminance
    const calculateLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map(value => {
        value = value / 255;
        return value <= 0.03928
          ? value / 12.92
          : Math.pow((value + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const fgLuminance = calculateLuminance(fgRGB);
    const bgLuminance = calculateLuminance(bgRGB);
    
    // Calculate contrast ratio
    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    return ratio.toFixed(2);
  };
  
  const ratio = parseFloat(calculateContrastRatio(foreground, background));
  const passes = ratio >= 4.5; // WCAG AA standard for normal text
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        <div className="w-6 h-6 rounded-l border border-dark-gray" style={{ backgroundColor: foreground }}></div>
        <div className="w-6 h-6 rounded-r border border-dark-gray" style={{ backgroundColor: background }}></div>
      </div>
      <span className={`text-xs font-secondary ${passes ? 'text-success' : 'text-error'}`}>
        {ratio}:1 {passes ? 'Pass' : 'Fail'}
      </span>
    </div>
  );
};

export default function ColorGuidePage() {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newColorCategory, setNewColorCategory] = useState("Primary");
  const { toast } = useToast();
  
  const { data: colors, isLoading } = useQuery<Color[]>({
    queryKey: ["/api/colors"],
  });
  
  const addColorMutation = useMutation({
    mutationFn: async (colorData: Partial<Color>) => {
      const res = await apiRequest("POST", "/api/colors", colorData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Color added",
        description: "The color has been added to your palette",
      });
      setNewColorName("");
      setNewColorHex("#000000");
      queryClient.invalidateQueries({ queryKey: ["/api/colors"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding color",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const generatePaletteMutation = useMutation({
    mutationFn: async (baseColor: string) => {
      const res = await apiRequest("POST", "/api/ai/generate-palette", { baseColor });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Palette generated",
        description: "New colors have been added to your palette",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/colors"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error generating palette",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleAddColor = () => {
    if (!newColorName) {
      toast({
        title: "Name required",
        description: "Please provide a name for your color",
        variant: "destructive",
      });
      return;
    }
    
    // Convert hex to RGB
    const hex = newColorHex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const rgbValue = `${r}, ${g}, ${b}`;
    
    addColorMutation.mutate({
      name: newColorName,
      hexValue: newColorHex,
      rgbValue,
      category: newColorCategory,
    });
  };
  
  const handleGeneratePalette = () => {
    if (selectedColor) {
      generatePaletteMutation.mutate(selectedColor.hexValue);
    } else {
      toast({
        title: "No color selected",
        description: "Please select a base color for the palette generation",
        variant: "destructive",
      });
    }
  };
  
  // Group colors by category
  const colorsByCategory = colors ? colors.reduce((acc, color) => {
    const category = color.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(color);
    return acc;
  }, {} as Record<string, Color[]>) : {};
  
  // Default colors if none are loaded yet
  const defaultColors = [
    { id: 1, name: "Branding Orange", hexValue: "#E85000", rgbValue: "232, 80, 0", category: "Primary" },
    { id: 2, name: "White", hexValue: "#F9F9F9", rgbValue: "249, 249, 249", category: "Primary" },
    { id: 3, name: "Black", hexValue: "#000000", rgbValue: "0, 0, 0", category: "Primary" },
    { id: 4, name: "Gray", hexValue: "#646464", rgbValue: "100, 100, 100", category: "Secondary" },
    { id: 5, name: "Light Gray", hexValue: "#787878", rgbValue: "120, 120, 120", category: "Secondary" },
    { id: 6, name: "Dark Gray", hexValue: "#333333", rgbValue: "51, 51, 51", category: "Secondary" },
  ];
  
  const displayColors = colors?.length ? colors : defaultColors;
  
  return (
    <AppLayout title="Color Guide">
      {/* Page Header */}
      <motion.div 
        className="flex justify-between items-start mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="font-primary text-4xl text-white tracking-tight">Color Guide</h1>
          <p className="text-light-gray text-sm mt-2 font-secondary">Define your brand's color palette and usage guidelines</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            className="btn-secondary"
            onClick={handleAddColor}
            disabled={addColorMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Color</span>
          </Button>
          <Button 
            className="btn-primary"
            onClick={handleGeneratePalette}
            disabled={generatePaletteMutation.isPending || !selectedColor}
          >
            <Zap className="h-4 w-4 mr-2" />
            <span>{generatePaletteMutation.isPending ? "Generating..." : "Generate Palette"}</span>
          </Button>
        </div>
      </motion.div>
      
      {/* Color Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Color Palette Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Color Palette</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full bg-sidebar-hover mb-6">
                  <TabsTrigger value="all" className="font-secondary">All Colors</TabsTrigger>
                  <TabsTrigger value="primary" className="font-secondary">Primary</TabsTrigger>
                  <TabsTrigger value="secondary" className="font-secondary">Secondary</TabsTrigger>
                  <TabsTrigger value="accents" className="font-secondary">Accents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                      // Loading skeletons
                      Array(6).fill(0).map((_, i) => (
                        <div key={i} className="bg-sidebar-hover rounded-xl animate-pulse h-64"></div>
                      ))
                    ) : (
                      displayColors.map((color) => (
                        <ColorSwatch
                          key={color.id}
                          color={color.hexValue}
                          name={color.name}
                          hex={color.hexValue}
                          rgb={color.rgbValue || ''}
                          category={color.category || 'Primary'}
                          onClick={() => setSelectedColor(color)}
                          isSelected={selectedColor?.id === color.id}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="primary" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-sidebar-hover rounded-xl animate-pulse h-64"></div>
                      ))
                    ) : (
                      displayColors
                        .filter(color => color.category === 'Primary')
                        .map((color) => (
                          <ColorSwatch
                            key={color.id}
                            color={color.hexValue}
                            name={color.name}
                            hex={color.hexValue}
                            rgb={color.rgbValue || ''}
                            category={color.category || 'Primary'}
                            onClick={() => setSelectedColor(color)}
                            isSelected={selectedColor?.id === color.id}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="secondary" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-sidebar-hover rounded-xl animate-pulse h-64"></div>
                      ))
                    ) : (
                      displayColors
                        .filter(color => color.category === 'Secondary')
                        .map((color) => (
                          <ColorSwatch
                            key={color.id}
                            color={color.hexValue}
                            name={color.name}
                            hex={color.hexValue}
                            rgb={color.rgbValue || ''}
                            category={color.category || 'Secondary'}
                            onClick={() => setSelectedColor(color)}
                            isSelected={selectedColor?.id === color.id}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="accents" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-sidebar-hover rounded-xl animate-pulse h-64"></div>
                      ))
                    ) : (
                      displayColors
                        .filter(color => color.category === 'Accent')
                        .map((color) => (
                          <ColorSwatch
                            key={color.id}
                            color={color.hexValue}
                            name={color.name}
                            hex={color.hexValue}
                            rgb={color.rgbValue || ''}
                            category={color.category || 'Accent'}
                            onClick={() => setSelectedColor(color)}
                            isSelected={selectedColor?.id === color.id}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Color Application Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Color Application</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-primary text-lg mb-4">UI Elements</h3>
                  <div className="space-y-4 bg-sidebar-hover p-6 rounded-xl">
                    <div className="space-y-2">
                      <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Buttons</p>
                      <div className="flex gap-3">
                        <Button className="bg-branding-orange text-white">Primary</Button>
                        <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white">Secondary</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Cards</p>
                      <div className="p-4 bg-card-bg border border-card-border rounded-md">
                        <p className="text-white font-secondary text-sm">Card Example</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Text</p>
                      <div className="space-y-1">
                        <p className="text-white font-primary">Primary Text</p>
                        <p className="text-light-gray font-secondary">Secondary Text</p>
                        <p className="text-branding-orange font-secondary">Accent Text</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-primary text-lg mb-4">Color Harmony</h3>
                  <div className="bg-sidebar-hover p-6 rounded-xl">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Primary + White</p>
                        <ColorContrastCheck foreground="#E85000" background="#F9F9F9" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Primary + Black</p>
                        <ColorContrastCheck foreground="#E85000" background="#000000" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">White + Black</p>
                        <ColorContrastCheck foreground="#F9F9F9" background="#000000" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Gray + White</p>
                        <ColorContrastCheck foreground="#646464" background="#F9F9F9" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-ai-accent" />
                      <p className="text-xs text-light-gray font-secondary">
                        WCAG AA compliance requires a contrast ratio of at least 4.5:1 for normal text
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-primary text-lg mb-4">Color Proportions</h3>
                <div className="bg-sidebar-hover p-6 rounded-xl">
                  <div className="relative h-16 w-full flex items-center rounded-md overflow-hidden">
                    <div className="h-full bg-black" style={{ width: '60%' }}></div>
                    <div className="h-full bg-branding-orange" style={{ width: '20%' }}></div>
                    <div className="h-full bg-gray-600" style={{ width: '10%' }}></div>
                    <div className="h-full bg-white" style={{ width: '10%' }}></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white font-secondary text-sm">Recommended Color Distribution</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <div className="text-center">
                      <p className="text-xs text-light-gray font-secondary">Primary Black</p>
                      <p className="text-xs text-white font-secondary">60%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-light-gray font-secondary">Branding Orange</p>
                      <p className="text-xs text-white font-secondary">20%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-light-gray font-secondary">Gray</p>
                      <p className="text-xs text-white font-secondary">10%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-light-gray font-secondary">White</p>
                      <p className="text-xs text-white font-secondary">10%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          {selectedColor ? (
            <Card className="bg-card-bg border-card-border sticky top-24">
              <div 
                className="h-40 flex items-center justify-center" 
                style={{ backgroundColor: selectedColor.hexValue }}
              >
                <span 
                  className="font-primary text-5xl" 
                  style={{ color: selectedColor.hexValue === "#FFFFFF" || selectedColor.hexValue === "#F9F9F9" ? "#000000" : "#FFFFFF" }}
                >
                  {selectedColor.name.charAt(0)}
                </span>
              </div>
              
              <CardHeader>
                <CardTitle className="font-primary text-2xl text-white">{selectedColor.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">HEX</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-secondary">{selectedColor.hexValue}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedColor.hexValue);
                          toast({
                            title: "Copied to clipboard",
                            description: `HEX: ${selectedColor.hexValue}`,
                          });
                        }}
                      >
                        <Copy className="h-3 w-3 text-light-gray hover:text-white" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">RGB</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-secondary">{selectedColor.rgbValue}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedColor.rgbValue || '');
                          toast({
                            title: "Copied to clipboard",
                            description: `RGB: ${selectedColor.rgbValue}`,
                          });
                        }}
                      >
                        <Copy className="h-3 w-3 text-light-gray hover:text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Category</p>
                  <p className="text-white font-secondary">{selectedColor.category}</p>
                </div>
                
                <div className="space-y-3">
                  <p className="text-light-gray font-secondary text-xs uppercase tracking-wider">Accessibility</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-light-gray font-secondary">On White</p>
                      <ColorContrastCheck foreground={selectedColor.hexValue} background="#FFFFFF" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-light-gray font-secondary">On Black</p>
                      <ColorContrastCheck foreground={selectedColor.hexValue} background="#000000" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-dark-gray pt-4 space-y-3">
                  <div className="flex justify-between">
                    <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    
                    <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  
                  <Button 
                    className="w-full btn-primary"
                    onClick={handleGeneratePalette}
                    disabled={generatePaletteMutation.isPending}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {generatePaletteMutation.isPending ? "Generating..." : "Generate Palette"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card-bg border-card-border sticky top-24">
              <CardHeader>
                <CardTitle className="font-primary text-2xl text-white">Add New Color</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Color Name</label>
                  <Input 
                    placeholder="Enter color name" 
                    className="bg-sidebar-hover border-dark-gray text-white" 
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Hex Value</label>
                  <div className="flex">
                    <div 
                      className="w-12 h-12 rounded-l border border-dark-gray flex-shrink-0"
                      style={{ backgroundColor: newColorHex }}
                    ></div>
                    <Input 
                      type="text"
                      placeholder="#000000" 
                      className="bg-sidebar-hover border-dark-gray text-white rounded-l-none flex-1" 
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Primary", "Secondary", "Accent"].map((category) => (
                      <div 
                        key={category}
                        onClick={() => setNewColorCategory(category)}
                        className={`
                          bg-sidebar-hover
                          ${newColorCategory === category 
                            ? 'border-2 border-branding-orange text-white' 
                            : 'border border-dark-gray text-light-gray hover:border-light-gray'
                          }
                          rounded-md p-2 text-center cursor-pointer font-secondary text-sm
                        `}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full btn-primary mt-4"
                  onClick={handleAddColor}
                  disabled={addColorMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {addColorMutation.isPending ? "Adding..." : "Add Color"}
                </Button>
                
                <div className="mt-4">
                  <p className="text-xs text-light-gray font-secondary">
                    <AlertTriangle className="h-3 w-3 inline-block mr-1 text-warning" />
                    Make sure to use the full HEX format (e.g., #E85000)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
