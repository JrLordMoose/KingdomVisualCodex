import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, FileText, Clock, Link, Mail, FileCode, Eye, CloudIcon, Zap, Check, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type FormatCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
};

const FormatCard = ({ title, description, icon, isSelected, onClick }: FormatCardProps) => {
  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-sidebar-hover border-branding-orange' 
          : 'bg-card-bg border-dark-gray hover:border-light-gray'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="mr-3">
          {icon}
        </div>
        <div>
          <h4 className="text-white font-primary text-lg mb-1">{title}</h4>
          <p className="text-light-gray text-xs font-secondary">{description}</p>
        </div>
        {isSelected && (
          <div className="ml-auto">
            <Check className="h-5 w-5 text-branding-orange" />
          </div>
        )}
      </div>
    </div>
  );
};

type ExportHistoryItemProps = {
  title: string;
  format: string;
  date: string;
  sections: string[];
  url?: string;
};

const ExportHistoryItem = ({ title, format, date, sections, url }: ExportHistoryItemProps) => {
  return (
    <div className="p-4 bg-sidebar-hover rounded-lg">
      <div className="flex justify-between mb-2">
        <h4 className="text-white font-secondary text-sm font-medium">{title}</h4>
        <span className="text-light-gray text-xs font-secondary">{date}</span>
      </div>
      
      <div className="flex items-center mb-2">
        <span className="inline-flex items-center px-2 py-1 rounded bg-card-bg text-light-gray text-xs font-secondary mr-2">
          {format}
        </span>
        <span className="text-light-gray text-xs font-secondary">
          {sections.length} sections
        </span>
      </div>
      
      <div className="flex">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2 h-8 bg-sidebar-hover border-dark-gray text-white text-xs"
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
        
        {url && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 bg-sidebar-hover border-dark-gray text-white text-xs"
          >
            <Link className="h-3 w-3 mr-1" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
};

export default function ExportPage() {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [exportName, setExportName] = useState("Nexus Brand Guidelines");
  const [isWhiteLabeled, setIsWhiteLabeled] = useState(false);
  const [selectedSections, setSelectedSections] = useState([
    "brand-story",
    "logo-guide",
    "color-guide",
    "typography",
    "digital-guidelines",
    "print-guidelines"
  ]);
  const [emailRecipient, setEmailRecipient] = useState("");
  const { toast } = useToast();
  
  const handleSectionToggle = (sectionId: string) => {
    if (selectedSections.includes(sectionId)) {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
    } else {
      setSelectedSections([...selectedSections, sectionId]);
    }
  };
  
  const sections = [
    { id: "brand-story", name: "Brand Story", description: "Core brand narrative and values" },
    { id: "logo-guide", name: "Logo Guide", description: "Logo usage and variations" },
    { id: "color-guide", name: "Color Guide", description: "Brand color palette and usage" },
    { id: "typography", name: "Typography", description: "Font system and hierarchy" },
    { id: "digital-guidelines", name: "Digital Guidelines", description: "Web and digital applications" },
    { id: "print-guidelines", name: "Print Guidelines", description: "Print and physical materials" }
  ];
  
  const exportMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/export", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Export successful",
        description: "Your brand guidelines have been exported successfully.",
      });
      if (data.url) {
        window.open(data.url, "_blank");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleExport = () => {
    if (selectedSections.length === 0) {
      toast({
        title: "No sections selected",
        description: "Please select at least one section to export.",
        variant: "destructive",
      });
      return;
    }
    
    const exportData = {
      format: selectedFormat,
      name: exportName,
      sections: selectedSections,
      whiteLabeled: isWhiteLabeled,
      recipient: emailRecipient || undefined
    };
    
    exportMutation.mutate(exportData);
  };
  
  return (
    <AppLayout title="Export">
      {/* Page Header */}
      <motion.div 
        className="flex justify-between items-start mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="font-primary text-4xl text-white tracking-tight">Export</h1>
          <p className="text-light-gray text-sm mt-2 font-secondary">Export and share your brand style guide in multiple formats</p>
        </div>
        
        <Button 
          className="btn-primary"
          onClick={handleExport}
          disabled={exportMutation.isPending}
        >
          {exportMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          <span>Generate Export</span>
        </Button>
      </motion.div>
      
      {/* Export Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Export Format Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader>
              <CardTitle className="font-primary text-2xl text-white">Export Format</CardTitle>
              <CardDescription className="text-light-gray font-secondary">
                Choose how you want your brand guidelines to be formatted
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="document" className="w-full">
                <TabsList className="w-full bg-sidebar-hover mb-6">
                  <TabsTrigger value="document" className="font-secondary">Document</TabsTrigger>
                  <TabsTrigger value="website" className="font-secondary">Website</TabsTrigger>
                  <TabsTrigger value="design" className="font-secondary">Design Files</TabsTrigger>
                  <TabsTrigger value="code" className="font-secondary">Code</TabsTrigger>
                </TabsList>
                
                <TabsContent value="document" className="mt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormatCard
                      title="PDF Document"
                      description="A comprehensive PDF document with all selected sections"
                      icon={<FileText className="h-8 w-8 text-branding-orange" />}
                      isSelected={selectedFormat === "pdf"}
                      onClick={() => setSelectedFormat("pdf")}
                    />
                    
                    <FormatCard
                      title="PowerPoint"
                      description="Editable PowerPoint presentation for team sharing"
                      icon={<FileText className="h-8 w-8 text-light-gray" />}
                      isSelected={selectedFormat === "ppt"}
                      onClick={() => setSelectedFormat("ppt")}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="website" className="mt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormatCard
                      title="Hosted Microsite"
                      description="A dedicated web page for your brand guidelines"
                      icon={<CloudIcon className="h-8 w-8 text-branding-orange" />}
                      isSelected={selectedFormat === "web"}
                      onClick={() => setSelectedFormat("web")}
                    />
                    
                    <FormatCard
                      title="Notion Export"
                      description="Export to Notion for collaborative editing"
                      icon={<FileText className="h-8 w-8 text-light-gray" />}
                      isSelected={selectedFormat === "notion"}
                      onClick={() => setSelectedFormat("notion")}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="design" className="mt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormatCard
                      title="Figma Library"
                      description="Figma design system with components and styles"
                      icon={<FileText className="h-8 w-8 text-light-gray" />}
                      isSelected={selectedFormat === "figma"}
                      onClick={() => setSelectedFormat("figma")}
                    />
                    
                    <FormatCard
                      title="Sketch Library"
                      description="Sketch design system with symbols and styles"
                      icon={<FileText className="h-8 w-8 text-light-gray" />}
                      isSelected={selectedFormat === "sketch"}
                      onClick={() => setSelectedFormat("sketch")}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="mt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormatCard
                      title="CSS Variables"
                      description="CSS custom properties for web development"
                      icon={<FileCode className="h-8 w-8 text-branding-orange" />}
                      isSelected={selectedFormat === "css"}
                      onClick={() => setSelectedFormat("css")}
                    />
                    
                    <FormatCard
                      title="Design Tokens"
                      description="JSON format design tokens for cross-platform use"
                      icon={<FileCode className="h-8 w-8 text-light-gray" />}
                      isSelected={selectedFormat === "tokens"}
                      onClick={() => setSelectedFormat("tokens")}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Export Configuration Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader>
              <CardTitle className="font-primary text-2xl text-white">Export Configuration</CardTitle>
              <CardDescription className="text-light-gray font-secondary">
                Customize your export settings and content
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Export Name</Label>
                  <Input
                    value={exportName}
                    onChange={(e) => setExportName(e.target.value)}
                    placeholder="Enter export name"
                    className="bg-sidebar-hover border-dark-gray text-white"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="white-label" 
                    checked={isWhiteLabeled}
                    onCheckedChange={(checked) => setIsWhiteLabeled(checked === true)}
                    className="data-[state=checked]:bg-branding-orange data-[state=checked]:border-branding-orange"
                  />
                  <Label htmlFor="white-label" className="text-white">
                    White label export (remove KNGDM branding)
                  </Label>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-secondary text-base mb-3">Sections to Include</h3>
                <div className="space-y-3">
                  {sections.map((section) => (
                    <div key={section.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={section.id} 
                        checked={selectedSections.includes(section.id)}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                        className="mt-1 data-[state=checked]:bg-branding-orange data-[state=checked]:border-branding-orange"
                      />
                      <div>
                        <Label htmlFor={section.id} className="text-white block">
                          {section.name}
                        </Label>
                        <p className="text-light-gray text-xs font-secondary">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-secondary text-base mb-3">Delivery Options</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">Email to Recipients (Optional)</Label>
                    <Input
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      placeholder="email@example.com"
                      className="bg-sidebar-hover border-dark-gray text-white"
                    />
                    <p className="text-light-gray text-xs font-secondary mt-1">
                      Separate multiple emails with commas
                    </p>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-md bg-black border border-dark-gray">
                    <div className="w-10 h-10 rounded-full bg-sidebar-hover flex items-center justify-center mr-3">
                      <Link className="h-5 w-5 text-light-gray" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-secondary">
                        Shareable Link
                      </p>
                      <p className="text-light-gray text-xs font-secondary">
                        A link will be generated after export
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto bg-sidebar-hover border-dark-gray text-white text-xs"
                      disabled
                    >
                      <Link className="h-3 w-3 mr-1" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Export History Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-primary text-2xl text-white">Export History</CardTitle>
                <CardDescription className="text-light-gray font-secondary">
                  Recently generated exports
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-light-gray hover:text-white"
              >
                <Clock className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <ExportHistoryItem
                  title="Nexus Brand Guidelines"
                  format="PDF"
                  date="2 hours ago"
                  sections={["Brand Story", "Logo Guide", "Color Guide"]}
                  url="https://example.com/nexus-guidelines"
                />
                
                <ExportHistoryItem
                  title="Nexus Digital Guidelines"
                  format="Web"
                  date="Yesterday"
                  sections={["Digital Guidelines", "Color Guide", "Typography"]}
                  url="https://example.com/nexus-digital"
                />
                
                <ExportHistoryItem
                  title="Nexus Print Assets"
                  format="PDF"
                  date="3 days ago"
                  sections={["Print Guidelines", "Logo Guide"]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Preview Card */}
          <Card className="bg-card-bg border-card-border sticky top-24">
            <CardHeader>
              <CardTitle className="font-primary text-2xl text-white">Export Preview</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <div className="bg-sidebar-hover border border-dark-gray rounded-md p-4 flex flex-col items-center text-center h-60 justify-center">
                {selectedFormat === "pdf" && (
                  <div className="w-24 h-32 bg-black border border-gray-700 rounded relative overflow-hidden mb-3">
                    <div className="absolute top-0 left-0 right-0 h-4 bg-branding-orange flex items-center justify-center">
                      <div className="text-black text-[6px] font-primary">NEXUS</div>
                    </div>
                    <div className="mt-6 space-y-1 px-1">
                      <div className="h-1 bg-gray-800 rounded-full w-3/4 mx-auto"></div>
                      <div className="h-1 bg-gray-800 rounded-full w-5/6 mx-auto"></div>
                      <div className="h-1 bg-gray-800 rounded-full w-2/3 mx-auto"></div>
                      <div className="h-1 bg-gray-800 rounded-full w-4/5 mx-auto"></div>
                    </div>
                  </div>
                )}
                
                {selectedFormat === "web" && (
                  <div className="w-32 h-24 bg-black border border-gray-700 rounded relative overflow-hidden mb-3">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-sidebar-hover border-b border-gray-700 flex items-center justify-between px-1">
                      <div className="text-branding-orange text-[6px] font-primary">NEXUS</div>
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                      </div>
                    </div>
                    <div className="mt-4 h-full flex">
                      <div className="w-1/3 h-full border-r border-gray-700 py-1 flex flex-col items-center">
                        <div className="w-3/4 h-0.5 bg-gray-700 rounded mb-1"></div>
                        <div className="w-3/4 h-0.5 bg-gray-700 rounded mb-1"></div>
                        <div className="w-3/4 h-0.5 bg-branding-orange rounded mb-1"></div>
                      </div>
                      <div className="w-2/3 p-1">
                        <div className="h-0.5 bg-gray-700 rounded mb-1 w-1/2"></div>
                        <div className="h-2 bg-gray-800 rounded mb-1"></div>
                        <div className="h-0.5 bg-gray-700 rounded mb-1 w-3/4"></div>
                        <div className="h-0.5 bg-gray-700 rounded mb-1 w-2/3"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedFormat === "css" && (
                  <div className="w-32 h-24 bg-black border border-gray-700 rounded relative overflow-hidden mb-3 font-mono">
                    <div className="absolute inset-0 p-1 flex flex-col text-left">
                      <span className="text-[4px] text-gray-500">{":root {"}</span>
                      <span className="text-[4px] text-branding-orange">&nbsp;&nbsp;{"--primary: #E85000;"}</span>
                      <span className="text-[4px] text-white">&nbsp;&nbsp;{"--text: #F9F9F9;"}</span>
                      <span className="text-[4px] text-gray-400">&nbsp;&nbsp;{"--background: #000000;"}</span>
                      <span className="text-[4px] text-gray-500">{"}"}</span>
                    </div>
                  </div>
                )}
                
                {selectedFormat === "figma" && (
                  <div className="w-36 h-24 bg-black border border-gray-700 rounded relative overflow-hidden mb-3">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-sidebar-hover border-b border-gray-700"></div>
                    <div className="absolute left-0 top-3 bottom-0 w-6 bg-sidebar-hover border-r border-gray-700"></div>
                    <div className="absolute right-0 top-3 bottom-0 w-6 bg-sidebar-hover border-l border-gray-700"></div>
                    <div className="absolute inset-8 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-branding-orange"></div>
                    </div>
                  </div>
                )}
                
                <p className="text-white text-sm font-secondary mb-1">Preview Unavailable</p>
                <p className="text-light-gray text-xs font-secondary">
                  Export will be generated based on your selected settings
                </p>
                
                <Button 
                  className="mt-3"
                  variant="outline"
                  size="sm"
                  disabled
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Export
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white font-secondary text-base">Export Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-light-gray text-xs font-secondary">Format</p>
                    <p className="text-white text-xs font-secondary">{
                      selectedFormat === "pdf" ? "PDF Document" :
                      selectedFormat === "web" ? "Hosted Microsite" :
                      selectedFormat === "css" ? "CSS Variables" :
                      selectedFormat === "figma" ? "Figma Library" :
                      "Custom Format"
                    }</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-light-gray text-xs font-secondary">Sections</p>
                    <p className="text-white text-xs font-secondary">{selectedSections.length} selected</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-light-gray text-xs font-secondary">White Label</p>
                    <p className="text-white text-xs font-secondary">{isWhiteLabeled ? "Yes" : "No"}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-light-gray text-xs font-secondary">Estimated Size</p>
                    <p className="text-white text-xs font-secondary">~ 2.4 MB</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-sidebar-hover rounded-md p-3 flex items-start">
                <AlertTriangle className="h-4 w-4 text-warning mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-secondary">Export Limitations</p>
                  <p className="text-light-gray text-xs font-secondary mt-1">
                    Free plan allows up to 3 exports per month. Consider upgrading for unlimited exports and additional features.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-dark-gray pt-4 mt-4">
                <Button 
                  className="w-full btn-primary"
                  onClick={handleExport}
                  disabled={exportMutation.isPending}
                >
                  {exportMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Generate Export
                </Button>
                
                <Button className="w-full bg-sidebar-hover border border-dark-gray text-ai-accent hover:text-white hover:bg-ai-accent mt-3">
                  <Zap className="h-4 w-4 mr-2" />
                  AI-Enhance Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
