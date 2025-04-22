import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Download, Upload, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LogoGuidePage() {
  return (
    <AppLayout title="Logo Guide">
      {/* Page Header */}
      <motion.div 
        className="flex justify-between items-start mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="font-primary text-4xl text-white tracking-tight">Logo Guide</h1>
          <p className="text-light-gray text-sm mt-2 font-secondary">Define your logo usage, variations and guidelines</p>
        </div>
        
        <div className="flex space-x-3">
          <Button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            <span>Upload Logo</span>
          </Button>
          <Button className="btn-primary">
            <Zap className="h-4 w-4 mr-2" />
            <span>Generate</span>
          </Button>
        </div>
      </motion.div>
      
      {/* Logo Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Logo Showcase Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Logo Showcase</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="primary" className="w-full">
                <TabsList className="w-full bg-sidebar-hover mb-6">
                  <TabsTrigger value="primary" className="font-secondary flex-1">Primary</TabsTrigger>
                  <TabsTrigger value="monochrome" className="font-secondary flex-1">Monochrome</TabsTrigger>
                  <TabsTrigger value="variations" className="font-secondary flex-1">Variations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="primary" className="mt-0">
                  <div className="bg-black rounded-xl p-10 flex items-center justify-center">
                    <div className="w-64 h-64 flex items-center justify-center">
                      <div className="text-branding-orange font-primary text-8xl">N</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download SVG
                    </Button>
                    
                    <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="monochrome" className="mt-0">
                  <div className="bg-black rounded-xl p-10 flex items-center justify-center">
                    <div className="w-64 h-64 flex items-center justify-center">
                      <div className="text-white font-primary text-8xl">N</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download SVG
                    </Button>
                    
                    <Button variant="outline" className="bg-sidebar-hover border-dark-gray text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="variations" className="mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-6 flex items-center justify-center">
                      <div className="text-black font-primary text-6xl">N</div>
                    </div>
                    <div className="bg-branding-orange rounded-xl p-6 flex items-center justify-center">
                      <div className="text-white font-primary text-6xl">N</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 flex items-center justify-center">
                      <div className="text-branding-orange font-primary text-6xl">N</div>
                    </div>
                    <div className="bg-black rounded-xl p-6 flex items-center justify-center border border-white">
                      <div className="text-white font-primary text-6xl">N</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Logo Construction Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Logo Construction</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-sidebar-hover rounded-xl p-6">
                <div className="relative w-full aspect-video flex items-center justify-center">
                  {/* Grid lines for logo construction */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                    {Array(8).fill(0).map((_, i) => (
                      <div key={`col-${i}`} className="border-r border-gray-700 h-full"></div>
                    ))}
                    {Array(8).fill(0).map((_, i) => (
                      <div key={`row-${i}`} className="border-b border-gray-700 w-full"></div>
                    ))}
                  </div>
                  
                  {/* Logo element */}
                  <div className="z-10 text-branding-orange font-primary text-6xl">N</div>
                  
                  {/* Clear space indicator */}
                  <div className="absolute inset-0 border-2 border-dashed border-light-gray m-10"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-primary text-lg mb-2">Clear Space</h3>
                  <p className="text-light-gray font-secondary text-sm">Maintain clear space around the logo equal to the height of the 'N' character to ensure visual impact.</p>
                </div>
                
                <div>
                  <h3 className="text-white font-primary text-lg mb-2">Minimum Size</h3>
                  <p className="text-light-gray font-secondary text-sm">Logo should never be smaller than 24px in height for digital applications or 0.5 inches for print.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Usage Rules Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Usage Rules</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-primary text-lg mb-4">Correct Usage</h3>
                  <div className="space-y-4">
                    <div className="bg-sidebar-hover rounded-lg p-4 border-l-4 border-success">
                      <div className="flex items-center justify-center h-20">
                        <div className="text-branding-orange font-primary text-4xl">N</div>
                      </div>
                      <p className="text-light-gray font-secondary text-xs mt-3">Use the logo in its original colors</p>
                    </div>
                    
                    <div className="bg-sidebar-hover rounded-lg p-4 border-l-4 border-success">
                      <div className="flex items-center justify-center h-20">
                        <div className="text-white font-primary text-4xl">N</div>
                      </div>
                      <p className="text-light-gray font-secondary text-xs mt-3">Monochrome version on dark backgrounds</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-primary text-lg mb-4">Incorrect Usage</h3>
                  <div className="space-y-4">
                    <div className="bg-sidebar-hover rounded-lg p-4 border-l-4 border-destructive">
                      <div className="flex items-center justify-center h-20">
                        <div className="text-pink-500 font-primary text-4xl">N</div>
                      </div>
                      <p className="text-light-gray font-secondary text-xs mt-3">Don't change the brand colors</p>
                    </div>
                    
                    <div className="bg-sidebar-hover rounded-lg p-4 border-l-4 border-destructive">
                      <div className="flex items-center justify-center h-20">
                        <div className="text-branding-orange font-primary text-4xl transform rotate-45">N</div>
                      </div>
                      <p className="text-light-gray font-secondary text-xs mt-3">Don't rotate or distort the logo</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-primary text-lg mb-4">Background Compatibility</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg p-3 flex items-center justify-center h-20">
                    <div className="text-branding-orange font-primary text-3xl">N</div>
                  </div>
                  <div className="bg-black rounded-lg p-3 flex items-center justify-center h-20">
                    <div className="text-branding-orange font-primary text-3xl">N</div>
                  </div>
                  <div className="bg-gray-500 rounded-lg p-3 flex items-center justify-center h-20">
                    <div className="text-white font-primary text-3xl">N</div>
                  </div>
                  <div className="bg-branding-orange rounded-lg p-3 flex items-center justify-center h-20">
                    <div className="text-white font-primary text-3xl">N</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card className="bg-card-bg border-card-border sticky top-24">
            <CardHeader>
              <CardTitle className="font-primary text-2xl text-white">Logo Generator</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <p className="text-light-gray font-secondary">Need a new logo? Try our AI-powered logo generator.</p>
              
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Logo Style</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-sidebar-hover border-2 border-branding-orange rounded-md p-3 text-center cursor-pointer">
                    <p className="text-white font-secondary font-medium">Minimal</p>
                  </div>
                  <div className="bg-sidebar-hover border border-dark-gray rounded-md p-3 text-center cursor-pointer hover:border-light-gray">
                    <p className="text-light-gray font-secondary">Abstract</p>
                  </div>
                  <div className="bg-sidebar-hover border border-dark-gray rounded-md p-3 text-center cursor-pointer hover:border-light-gray">
                    <p className="text-light-gray font-secondary">Wordmark</p>
                  </div>
                  <div className="bg-sidebar-hover border border-dark-gray rounded-md p-3 text-center cursor-pointer hover:border-light-gray">
                    <p className="text-light-gray font-secondary">Emblematic</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-secondary text-light-gray">Color Scheme</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-sidebar-hover border-2 border-branding-orange rounded-md p-3 flex items-center justify-center cursor-pointer h-10">
                    <div className="w-6 h-6 rounded-full bg-branding-orange"></div>
                  </div>
                  <div className="bg-sidebar-hover border border-dark-gray rounded-md p-3 flex items-center justify-center cursor-pointer hover:border-light-gray h-10">
                    <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="bg-sidebar-hover border border-dark-gray rounded-md p-3 flex items-center justify-center cursor-pointer hover:border-light-gray h-10">
                    <div className="w-6 h-6 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full btn-primary">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Logo
                </Button>
              </div>
              
              <div className="border-t border-dark-gray mt-4 pt-4">
                <p className="text-xs text-light-gray font-secondary mb-2">Or upload your existing logo:</p>
                <Button variant="outline" className="w-full bg-sidebar-hover border-dark-gray text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
