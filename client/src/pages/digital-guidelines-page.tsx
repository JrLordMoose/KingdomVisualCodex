import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Download, Zap, Copy, Plus, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

type ComponentCardProps = {
  title: string;
  children: React.ReactNode;
};

const ComponentCard = ({ title, children }: ComponentCardProps) => {
  return (
    <div className="border border-dark-gray rounded-lg overflow-hidden">
      <div className="bg-sidebar-hover p-3 border-b border-dark-gray">
        <h4 className="text-white font-secondary text-sm">{title}</h4>
      </div>
      <div className="bg-card-bg p-4 flex items-center justify-center min-h-[120px]">
        {children}
      </div>
    </div>
  );
};

export default function DigitalGuidelinesPage() {
  const [activeTab, setActiveTab] = useState("components");
  const { toast } = useToast();
  
  const handleCopyCSS = (css: string) => {
    navigator.clipboard.writeText(css);
    toast({
      title: "Copied to clipboard",
      description: "CSS code has been copied"
    });
  };
  
  return (
    <AppLayout title="Digital Guidelines">
      {/* Page Header */}
      <motion.div 
        className="flex justify-between items-start mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="font-primary text-4xl text-white tracking-tight">Digital Guidelines</h1>
          <p className="text-light-gray text-sm mt-2 font-secondary">Define how your brand is presented in digital platforms</p>
        </div>
        
        <div className="flex space-x-3">
          <Button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            <span>Export Code</span>
          </Button>
          <Button className="btn-primary">
            <Zap className="h-4 w-4 mr-2" />
            <span>Generate Assets</span>
          </Button>
        </div>
      </motion.div>
      
      {/* Digital Guidelines Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Component Library Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Digital Assets</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-sidebar-hover mb-6">
                  <TabsTrigger value="components" className="font-secondary">UI Components</TabsTrigger>
                  <TabsTrigger value="icons" className="font-secondary">Icons & Graphics</TabsTrigger>
                  <TabsTrigger value="layouts" className="font-secondary">Layouts</TabsTrigger>
                  <TabsTrigger value="animations" className="font-secondary">Animations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="components" className="mt-0 space-y-6">
                  <h3 className="text-white font-primary text-xl mb-4">Button Styles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <ComponentCard title="Primary Button">
                      <Button className="bg-branding-orange text-white hover:bg-[#C64500]">
                        Primary Action
                      </Button>
                    </ComponentCard>
                    
                    <ComponentCard title="Secondary Button">
                      <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white hover:bg-[#202020]">
                        Secondary Action
                      </Button>
                    </ComponentCard>
                    
                    <ComponentCard title="Text Button">
                      <Button variant="ghost" className="text-branding-orange hover:text-white hover:bg-sidebar-hover">
                        Text Action
                      </Button>
                    </ComponentCard>
                    
                    <ComponentCard title="Icon Button">
                      <Button size="icon" className="bg-branding-orange text-white rounded-full h-10 w-10">
                        <Plus className="h-5 w-5" />
                      </Button>
                    </ComponentCard>
                  </div>
                  
                  <h3 className="text-white font-primary text-xl mb-4">Form Elements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <ComponentCard title="Input Field">
                      <input 
                        type="text" 
                        placeholder="Text input" 
                        className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none" 
                      />
                    </ComponentCard>
                    
                    <ComponentCard title="Dropdown">
                      <select className="w-full bg-sidebar-hover border border-dark-gray rounded-md px-4 py-2.5 text-white font-secondary focus:border-branding-orange focus:outline-none">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>
                    </ComponentCard>
                    
                    <ComponentCard title="Checkbox">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="sample-checkbox" 
                          className="h-4 w-4 rounded border-dark-gray text-branding-orange focus:ring-branding-orange bg-sidebar-hover" 
                        />
                        <label htmlFor="sample-checkbox" className="ml-2 text-sm text-white font-secondary">
                          Checkbox label
                        </label>
                      </div>
                    </ComponentCard>
                    
                    <ComponentCard title="Radio Button">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="radio1" 
                            name="radio-group" 
                            className="h-4 w-4 border-dark-gray text-branding-orange focus:ring-branding-orange bg-sidebar-hover" 
                          />
                          <label htmlFor="radio1" className="ml-2 text-sm text-white font-secondary">
                            Option 1
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="radio2" 
                            name="radio-group" 
                            className="h-4 w-4 border-dark-gray text-branding-orange focus:ring-branding-orange bg-sidebar-hover" 
                          />
                          <label htmlFor="radio2" className="ml-2 text-sm text-white font-secondary">
                            Option 2
                          </label>
                        </div>
                      </div>
                    </ComponentCard>
                  </div>
                  
                  <h3 className="text-white font-primary text-xl mb-4">Cards & Containers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ComponentCard title="Content Card">
                      <div className="w-full bg-card-bg border border-card-border rounded-xl p-4">
                        <h5 className="text-white font-primary text-lg mb-2">Card Title</h5>
                        <p className="text-light-gray text-sm font-secondary">
                          Card content with description text goes here.
                        </p>
                      </div>
                    </ComponentCard>
                    
                    <ComponentCard title="Alert/Notification">
                      <div className="w-full bg-sidebar-hover border-l-4 border-branding-orange rounded-r-md p-3">
                        <p className="text-white text-sm font-secondary">
                          This is an important notification message.
                        </p>
                      </div>
                    </ComponentCard>
                  </div>
                </TabsContent>
                
                <TabsContent value="icons" className="mt-0 space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-primary text-xl">Brand Icons</h3>
                    <Button variant="outline" size="sm" className="bg-sidebar-hover border-dark-gray text-white text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Icons
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {['home', 'search', 'user', 'settings', 'mail', 'bell', 'heart', 'bookmark'].map((icon, index) => (
                      <div key={index} className="bg-sidebar-hover rounded-md p-4 flex flex-col items-center justify-center text-center hover:border hover:border-dark-gray cursor-pointer transition-all">
                        <div className="w-10 h-10 flex items-center justify-center bg-card-bg rounded-md mb-2">
                          <span className="text-branding-orange text-xl">●</span>
                        </div>
                        <p className="text-white text-xs font-secondary">{icon}</p>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-white font-primary text-xl mb-4">Social Media Icons</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'pinterest', 'reddit'].map((social, index) => (
                      <div key={index} className="bg-sidebar-hover rounded-md p-4 flex flex-col items-center justify-center text-center hover:border hover:border-dark-gray cursor-pointer transition-all">
                        <div className="w-10 h-10 flex items-center justify-center bg-card-bg rounded-md mb-2">
                          <span className="text-white text-xl">●</span>
                        </div>
                        <p className="text-white text-xs font-secondary">{social}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="layouts" className="mt-0 space-y-6">
                  <h3 className="text-white font-primary text-xl mb-4">Website Layout</h3>
                  <div className="bg-sidebar-hover p-4 rounded-lg mb-6">
                    <div className="w-full bg-card-bg rounded-md p-2 mb-3">
                      <div className="h-6 bg-dark-gray rounded w-full"></div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/4 bg-card-bg rounded-md p-2 h-40">
                        <div className="h-full bg-dark-gray rounded w-full"></div>
                      </div>
                      <div className="w-2/4 bg-card-bg rounded-md p-2 h-40">
                        <div className="h-full bg-dark-gray rounded w-full"></div>
                      </div>
                      <div className="w-1/4 bg-card-bg rounded-md p-2 h-40">
                        <div className="h-full bg-dark-gray rounded w-full"></div>
                      </div>
                    </div>
                    <div className="w-full bg-card-bg rounded-md p-2 mt-3">
                      <div className="h-6 bg-dark-gray rounded w-full"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-white font-primary text-xl mb-4">Mobile Layout</h3>
                  <div className="flex justify-center mb-6">
                    <div className="w-1/3 bg-sidebar-hover p-3 rounded-lg border border-dark-gray">
                      <div className="w-full bg-card-bg rounded-md p-2 mb-3">
                        <div className="h-4 bg-dark-gray rounded w-full"></div>
                      </div>
                      <div className="w-full bg-card-bg rounded-md p-2 h-40 mb-3">
                        <div className="h-full bg-dark-gray rounded w-full"></div>
                      </div>
                      <div className="w-full bg-card-bg rounded-md p-2 h-20 mb-3">
                        <div className="h-full bg-dark-gray rounded w-full"></div>
                      </div>
                      <div className="w-full bg-card-bg rounded-md p-2 h-20">
                        <div className="h-full bg-dark-gray rounded w-full"></div>
                      </div>
                      <div className="w-full bg-card-bg rounded-md p-2 mt-3">
                        <div className="h-4 bg-dark-gray rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-white font-primary text-xl mb-4">Grid System</h3>
                  <div className="bg-sidebar-hover p-4 rounded-lg">
                    <div className="grid grid-cols-12 gap-2">
                      {Array(12).fill(0).map((_, i) => (
                        <div key={i} className="h-8 bg-branding-orange bg-opacity-20 flex items-center justify-center rounded">
                          <span className="text-xs text-branding-orange font-secondary">{i+1}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-8 bg-branding-orange bg-opacity-30 flex items-center justify-center rounded">
                          <span className="text-xs text-branding-orange font-secondary">1/4</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-8 bg-branding-orange bg-opacity-40 flex items-center justify-center rounded">
                          <span className="text-xs text-branding-orange font-secondary">1/3</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Array(2).fill(0).map((_, i) => (
                        <div key={i} className="h-8 bg-branding-orange bg-opacity-50 flex items-center justify-center rounded">
                          <span className="text-xs text-branding-orange font-secondary">1/2</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="animations" className="mt-0 space-y-6">
                  <h3 className="text-white font-primary text-xl mb-4">Micro-interactions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <ComponentCard title="Button Hover">
                      <Button className="bg-branding-orange text-white transition-all hover:bg-[#C64500] hover:scale-105">
                        Hover Me
                      </Button>
                    </ComponentCard>
                    
                    <ComponentCard title="Button Press">
                      <Button className="bg-branding-orange text-white transition-all active:scale-95">
                        Press Me
                      </Button>
                    </ComponentCard>
                    
                    <ComponentCard title="Fade In">
                      <div className="p-4 bg-sidebar-hover rounded-md opacity-50 hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-secondary">Hover to reveal</p>
                      </div>
                    </ComponentCard>
                    
                    <ComponentCard title="Slide In">
                      <div className="overflow-hidden rounded-md">
                        <div className="p-4 bg-sidebar-hover transform hover:translate-x-0 -translate-x-4 transition-transform duration-300">
                          <p className="text-white text-sm font-secondary">Hover to slide</p>
                        </div>
                      </div>
                    </ComponentCard>
                  </div>
                  
                  <h3 className="text-white font-primary text-xl mb-4">Loading States</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ComponentCard title="Spinner">
                      <div className="h-10 w-10 border-4 border-t-branding-orange border-r-branding-orange border-b-dark-gray border-l-dark-gray rounded-full animate-spin"></div>
                    </ComponentCard>
                    
                    <ComponentCard title="Progress Bar">
                      <div className="w-full bg-dark-gray rounded-full h-2.5 overflow-hidden">
                        <div className="bg-branding-orange h-2.5 rounded-full w-2/3"></div>
                      </div>
                    </ComponentCard>
                    
                    <ComponentCard title="Pulse">
                      <div className="h-10 w-10 bg-branding-orange rounded-full animate-pulse"></div>
                    </ComponentCard>
                    
                    <ComponentCard title="Skeleton">
                      <div className="space-y-2 w-full">
                        <div className="h-4 bg-dark-gray rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-dark-gray rounded animate-pulse"></div>
                        <div className="h-4 bg-dark-gray rounded animate-pulse w-1/2"></div>
                      </div>
                    </ComponentCard>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Digital Brand Applications Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Digital Brand Applications</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-primary text-xl mb-4">Website</h3>
                  <div className="bg-sidebar-hover rounded-xl p-4 h-60 flex items-center justify-center relative">
                    <div className="absolute inset-0 m-4 border border-dashed border-dark-gray rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-light-gray font-secondary text-sm mb-2">Website Preview</p>
                        <Button variant="outline" size="sm" className="bg-sidebar-hover border-dark-gray text-white text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Example
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-primary text-xl mb-4">Mobile App</h3>
                  <div className="bg-sidebar-hover rounded-xl p-4 h-60 flex items-center justify-center relative">
                    <div className="absolute inset-0 m-4 border border-dashed border-dark-gray rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-light-gray font-secondary text-sm mb-2">Mobile App Preview</p>
                        <Button variant="outline" size="sm" className="bg-sidebar-hover border-dark-gray text-white text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Example
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-primary text-xl mb-4">Email Templates</h3>
                <div className="bg-sidebar-hover rounded-xl p-4 flex items-center justify-center relative h-40">
                  <div className="absolute inset-0 m-4 border border-dashed border-dark-gray rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-light-gray font-secondary text-sm mb-2">Email Template Preview</p>
                      <Button variant="outline" size="sm" className="bg-sidebar-hover border-dark-gray text-white text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Examples
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-primary text-xl mb-4">Social Media</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Instagram Post', 'Facebook Cover', 'Twitter Banner', 'LinkedIn Post'].map((social, index) => (
                    <div key={index} className="bg-card-bg rounded-md border border-dark-gray p-4 aspect-square flex flex-col items-center justify-center text-center">
                      <p className="text-white text-xs font-secondary mb-2">{social}</p>
                      <Button variant="outline" size="sm" className="bg-sidebar-hover border-dark-gray text-white text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Template
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* CSS Code Card */}
          <Card className="bg-card-bg border-card-border sticky top-24">
            <CardHeader>
              <CardTitle className="font-primary text-2xl text-white">Implementation Code</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-white font-secondary text-sm">Variables</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleCopyCSS(`
:root {
  --branding-orange: #E85000;
  --white: #F9F9F9;
  --primary: #000000;
  --gray: #646464;
  --light-gray: #787878;
  --dark-gray: #333333;
  --sidebar-bg: #000000;
  --sidebar-hover: #202020;
  --card-bg: #000000;
  --card-border: #333333;
}`)}
                  >
                    <Copy className="h-4 w-4 text-light-gray hover:text-white" />
                  </Button>
                </div>
                <div className="bg-sidebar-hover p-3 rounded-md text-xs font-mono text-light-gray overflow-x-auto">
                  <pre>{`:root {
  --branding-orange: #E85000;
  --white: #F9F9F9;
  --primary: #000000;
  --gray: #646464;
  --light-gray: #787878;
  --dark-gray: #333333;
  --sidebar-bg: #000000;
  --sidebar-hover: #202020;
  --card-bg: #000000;
  --card-border: #333333;
}`}</pre>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-white font-secondary text-sm">Buttons</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleCopyCSS(`
.btn-primary {
  background-color: var(--branding-orange);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-family: 'Roboto Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s ease;
}

.btn-primary:hover {
  background-color: #C64500;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--dark-gray);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-family: 'Roboto Mono', monospace;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background-color: var(--sidebar-hover);
}`)}
                  >
                    <Copy className="h-4 w-4 text-light-gray hover:text-white" />
                  </Button>
                </div>
                <div className="bg-sidebar-hover p-3 rounded-md text-xs font-mono text-light-gray overflow-x-auto">
                  <pre>{`.btn-primary {
  background-color: var(--branding-orange);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-family: 'Roboto Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s ease;
}

.btn-primary:hover {
  background-color: #C64500;
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--dark-gray);
  color: var(--white);
  /* Additional styles... */
}`}</pre>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-white font-secondary text-sm">Forms</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleCopyCSS(`
input[type="text"],
input[type="email"],
input[type="password"],
select,
textarea {
  background-color: var(--sidebar-hover);
  border: 1px solid var(--dark-gray);
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  color: var(--white);
  font-family: 'Roboto Mono', monospace;
  width: 100%;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--branding-orange);
  outline: none;
}`)}
                  >
                    <Copy className="h-4 w-4 text-light-gray hover:text-white" />
                  </Button>
                </div>
                <div className="bg-sidebar-hover p-3 rounded-md text-xs font-mono text-light-gray overflow-x-auto">
                  <pre>{`input[type="text"],
input[type="email"],
input[type="password"],
select,
textarea {
  background-color: var(--sidebar-hover);
  border: 1px solid var(--dark-gray);
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  color: var(--white);
  font-family: 'Roboto Mono', monospace;
  width: 100%;
}

input:focus {
  border-color: var(--branding-orange);
  outline: none;
}`}</pre>
                </div>
              </div>
              
              <div className="border-t border-dark-gray pt-4 mt-4">
                <Button className="w-full btn-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full CSS
                </Button>
                
                <Button className="w-full bg-sidebar-hover border border-dark-gray text-white hover:bg-dark-gray mt-3">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Developer Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
