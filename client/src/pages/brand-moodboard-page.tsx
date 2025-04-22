import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Grid3X3, Image, Palette } from "lucide-react";

// Sample moodboard data
const SAMPLE_IMAGES = [
  { id: 1, url: "https://placehold.co/600x400/111/bbb?text=Mood+Image+1", tags: ["dark", "modern", "tech"] },
  { id: 2, url: "https://placehold.co/600x400/111/bbb?text=Mood+Image+2", tags: ["clean", "minimal"] },
  { id: 3, url: "https://placehold.co/600x400/111/bbb?text=Mood+Image+3", tags: ["bold", "vibrant"] },
  { id: 4, url: "https://placehold.co/600x400/111/bbb?text=Mood+Image+4", tags: ["pattern", "texture"] },
  { id: 5, url: "https://placehold.co/600x400/111/bbb?text=Mood+Image+5", tags: ["typography", "layout"] },
  { id: 6, url: "https://placehold.co/600x400/111/bbb?text=Mood+Image+6", tags: ["inspiration"] },
];

// Color palettes sampled from moodboard
const COLOR_PALETTES = [
  { id: 1, name: "Tech Dark", colors: ["#101010", "#232323", "#E85000", "#FFFFFF", "#999999"] },
  { id: 2, name: "Modern Accent", colors: ["#121212", "#212121", "#F05A28", "#EFEFEF", "#707070"] },
];

export default function BrandMoodboardPage() {
  const [activeTab, setActiveTab] = useState("gallery");
  const [layout, setLayout] = useState<"grid" | "masonry">("grid");
  
  return (
    <AppLayout title="Brand Moodboard">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-primary text-white">Brand Moodboard</h1>
          <p className="text-light-gray mt-1">Collect visual inspiration for your brand identity</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload size={16} />
            Upload Images
          </Button>
          <Button className="bg-branding-orange hover:bg-branding-orange/90">Generate AI Moodboard</Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-sidebar-hover">
            <TabsTrigger 
              value="gallery" 
              className="data-[state=active]:bg-branding-orange data-[state=active]:text-white"
            >
              Image Gallery
            </TabsTrigger>
            <TabsTrigger 
              value="palettes" 
              className="data-[state=active]:bg-branding-orange data-[state=active]:text-white"
            >
              Color Palettes
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "gallery" && (
            <div className="flex gap-1 bg-sidebar-hover rounded-md p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={layout === "grid" ? "bg-dark-gray" : ""}
                onClick={() => setLayout("grid")}
              >
                <Grid3X3 size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={layout === "masonry" ? "bg-dark-gray" : ""}
                onClick={() => setLayout("masonry")}
              >
                <Image size={18} />
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="gallery" className="mt-0">
          <div className={`grid ${layout === "grid" ? "grid-cols-2 md:grid-cols-3 gap-4" : "grid-cols-1 md:grid-cols-2 gap-4"}`}>
            {SAMPLE_IMAGES.map((image) => (
              <div 
                key={image.id} 
                className={`overflow-hidden rounded-md bg-card-bg border border-card-border relative group
                  ${layout === "masonry" && image.id % 3 === 0 ? "md:col-span-2" : ""}`}
              >
                <img 
                  src={image.url} 
                  alt={`Moodboard image ${image.id}`} 
                  className="w-full h-auto object-cover transition-transform duration-200 group-hover:scale-105" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <div className="flex flex-wrap gap-1">
                    {image.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded-full bg-dark-gray text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="palettes" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COLOR_PALETTES.map((palette) => (
              <Card key={palette.id} className="bg-card-bg border-card-border shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="font-primary text-white">{palette.name}</CardTitle>
                  <CardDescription>Extracted from moodboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {palette.colors.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div 
                          className="w-12 h-12 rounded-md cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-light-gray mt-1">{color}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs flex items-center gap-1"
                    >
                      <Palette size={14} />
                      Save to Brand
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}