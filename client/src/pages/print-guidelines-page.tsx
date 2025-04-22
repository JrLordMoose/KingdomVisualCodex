import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Download, Zap, Eye, Printer, LayersIcon, ImageIcon, Package, MapPin } from "lucide-react";
import { motion } from "framer-motion";

type PrintAssetsProps = {
  title: string;
  description: string;
  image: React.ReactNode;
  downloadOptions?: string[];
};

const PrintAsset = ({ title, description, image, downloadOptions = ["PDF", "AI", "EPS"] }: PrintAssetsProps) => {
  return (
    <Card className="bg-card-bg border-card-border">
      <div className="h-48 bg-sidebar-hover flex items-center justify-center">
        {image}
      </div>
      <CardContent className="p-4">
        <h4 className="text-white font-primary text-lg mb-1">{title}</h4>
        <p className="text-light-gray text-sm font-secondary mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {downloadOptions.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="bg-sidebar-hover border-dark-gray text-white text-xs px-2"
            >
              <Download className="h-3 w-3 mr-1" />
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

type SpecificationItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const SpecificationItem = ({ title, description, icon }: SpecificationItemProps) => {
  return (
    <div className="bg-sidebar-hover rounded-lg p-4 flex items-start">
      <div className="mr-3 mt-1">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-secondary text-sm font-medium mb-1">{title}</h4>
        <p className="text-light-gray text-xs font-secondary">{description}</p>
      </div>
    </div>
  );
};

export default function PrintGuidelinesPage() {
  const [activeTab, setActiveTab] = useState("business-cards");
  
  return (
    <AppLayout title="Print Guidelines">
      {/* Page Header */}
      <motion.div 
        className="flex justify-between items-start mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="font-primary text-4xl text-white tracking-tight">Print Guidelines</h1>
          <p className="text-light-gray text-sm mt-2 font-secondary">Define standards for your brand's physical and print materials</p>
        </div>
        
        <div className="flex space-x-3">
          <Button className="btn-secondary">
            <Printer className="h-4 w-4 mr-2" />
            <span>Print Guide</span>
          </Button>
          <Button className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            <span>Download Assets</span>
          </Button>
        </div>
      </motion.div>
      
      {/* Print Guidelines Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Print Assets Gallery Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Print Assets Gallery</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-sidebar-hover mb-6">
                  <TabsTrigger value="business-cards" className="font-secondary">Business Cards</TabsTrigger>
                  <TabsTrigger value="stationery" className="font-secondary">Stationery</TabsTrigger>
                  <TabsTrigger value="marketing" className="font-secondary">Marketing</TabsTrigger>
                  <TabsTrigger value="signage" className="font-secondary">Signage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="business-cards" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PrintAsset
                      title="Standard Business Card"
                      description="Corporate business card with minimal design"
                      image={
                        <div className="w-64 h-36 bg-black border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="absolute top-4 left-4">
                            <div className="text-branding-orange font-primary text-xl">N</div>
                          </div>
                          <div className="absolute bottom-4 right-4 text-right">
                            <p className="text-white font-secondary text-xs">John Doe</p>
                            <p className="text-light-gray font-secondary text-xs">Creative Director</p>
                          </div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Premium Business Card"
                      description="Premium business card with foil printing"
                      image={
                        <div className="w-64 h-36 bg-gradient-to-br from-black to-gray-800 border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="absolute top-4 left-4">
                            <div className="text-branding-orange font-primary text-xl">NEXUS</div>
                          </div>
                          <div className="absolute bottom-4 right-4 text-right">
                            <p className="text-white font-secondary text-xs">Jane Smith</p>
                            <p className="text-light-gray font-secondary text-xs">CEO & Founder</p>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="stationery" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PrintAsset
                      title="Letterhead"
                      description="Official company letterhead design"
                      image={
                        <div className="w-64 h-80 bg-white border border-dark-gray rounded-md flex items-center justify-center relative transform rotate-3">
                          <div className="absolute top-4 left-4">
                            <div className="text-black font-primary text-xl">NEXUS</div>
                          </div>
                          <div className="h-2/3 w-3/4 mx-auto border-t border-b border-gray-300"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="h-0.5 w-full bg-branding-orange mb-2"></div>
                            <p className="text-gray-600 font-secondary text-[8px]">123 Business Avenue, Suite 200 | New York, NY 10001 | 212-555-1234 | nexus.com</p>
                          </div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Envelopes"
                      description="Branded envelopes in various sizes"
                      image={
                        <div className="w-72 h-40 bg-white border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="absolute top-3 left-3">
                            <div className="text-black font-primary text-lg">NEXUS</div>
                          </div>
                          <div className="absolute bottom-3 right-3 text-right">
                            <p className="text-gray-600 font-secondary text-[8px]">123 Business Avenue, Suite 200</p>
                            <p className="text-gray-600 font-secondary text-[8px]">New York, NY 10001</p>
                          </div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Notepads"
                      description="Custom branded notepads for meetings"
                      image={
                        <div className="w-64 h-64 bg-white border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="absolute top-4 left-0 right-0 flex justify-center">
                            <div className="text-black font-primary text-xl">NEXUS</div>
                          </div>
                          <div className="w-4/5 h-2/3 border border-gray-200 rounded"></div>
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <div className="h-1 w-16 bg-branding-orange"></div>
                          </div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Folders"
                      description="Presentation folders for documents"
                      image={
                        <div className="w-64 h-40 bg-black border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="w-56 h-32 bg-dark-gray rounded flex items-center justify-center">
                            <div className="text-branding-orange font-primary text-xl">NEXUS</div>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="marketing" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PrintAsset
                      title="Brochures"
                      description="Tri-fold company brochures"
                      image={
                        <div className="w-64 h-48 bg-white border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="flex">
                            <div className="w-1/3 h-40 bg-black flex items-center justify-center">
                              <span className="text-branding-orange font-primary transform -rotate-90 text-xl">NEXUS</span>
                            </div>
                            <div className="w-2/3 h-40 p-2">
                              <div className="h-1/3 border-b border-gray-300 mb-2"></div>
                              <div className="h-1/3 border-b border-gray-300 mb-2"></div>
                              <div className="h-1/3"></div>
                            </div>
                          </div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Flyers"
                      description="Single-page promotional flyers"
                      image={
                        <div className="w-48 h-64 bg-black border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="absolute top-4 left-4">
                            <div className="text-branding-orange font-primary text-xl">NEXUS</div>
                          </div>
                          <div className="h-24 w-36 bg-sidebar-hover rounded"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="h-16 w-full">
                              <div className="w-full h-2 bg-dark-gray rounded mb-2"></div>
                              <div className="w-3/4 h-2 bg-dark-gray rounded mb-2"></div>
                              <div className="w-1/2 h-2 bg-dark-gray rounded"></div>
                            </div>
                          </div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Posters"
                      description="Large format promotional posters"
                      image={
                        <div className="w-40 h-56 bg-gradient-to-b from-black to-gray-900 border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="absolute top-4 left-0 right-0 flex justify-center">
                            <div className="text-branding-orange font-primary text-xl">NEXUS</div>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-branding-orange bg-opacity-20 flex items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-branding-orange bg-opacity-40"></div>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="w-full h-2 bg-dark-gray rounded mb-2"></div>
                            <div className="w-3/4 h-2 bg-dark-gray rounded"></div>
                          </div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Business Materials"
                      description="Catalogs, reports, and presentations"
                      image={
                        <div className="w-56 h-40 bg-white border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="absolute top-0 left-0 bottom-0 w-12 bg-black flex items-center justify-center">
                            <span className="text-branding-orange font-primary transform -rotate-90 text-lg">NEXUS</span>
                          </div>
                          <div className="absolute top-4 left-16 right-4 bottom-4">
                            <div className="h-1/4 border-b border-gray-300 mb-2"></div>
                            <div className="h-1/4 border-b border-gray-300 mb-2"></div>
                            <div className="h-1/4 border-b border-gray-300 mb-2"></div>
                            <div className="h-1/4"></div>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="signage" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PrintAsset
                      title="Office Signage"
                      description="Interior office and door signs"
                      image={
                        <div className="w-64 h-32 bg-gray-900 border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="w-56 h-24 bg-black flex items-center justify-center rounded">
                            <div className="text-branding-orange font-primary text-2xl">NEXUS</div>
                          </div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Building Signage"
                      description="External building and storefront signs"
                      image={
                        <div className="w-64 h-36 bg-sidebar-hover border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="w-48 h-16 bg-black rounded-md flex items-center justify-center">
                            <div className="text-branding-orange font-primary text-2xl">NEXUS</div>
                          </div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Banners & Flags"
                      description="Event and promotional banners"
                      image={
                        <div className="w-32 h-64 bg-black border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="text-branding-orange font-primary text-4xl transform -rotate-90">NEXUS</div>
                        </div>
                      }
                    />
                    
                    <PrintAsset
                      title="Vehicle Graphics"
                      description="Fleet and vehicle branding"
                      image={
                        <div className="w-64 h-40 bg-white border border-dark-gray rounded-md flex items-center justify-center relative">
                          <div className="w-56 h-24 bg-sidebar-hover rounded-2xl flex items-center justify-center">
                            <div className="text-branding-orange font-primary text-2xl">NEXUS</div>
                          </div>
                          <div className="absolute bottom-6 left-20 right-20 h-4 bg-dark-gray rounded-full"></div>
                        </div>
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Print Specifications Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Print Specifications</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-white font-primary text-lg mb-4">Paper Stock</h3>
                  <div className="space-y-3">
                    <SpecificationItem
                      title="Business Cards"
                      description="16pt Matte or Gloss Coated Cover Stock (Premium: 32pt Triplex with Colored Core)"
                      icon={<LayersIcon className="h-5 w-5 text-branding-orange" />}
                    />
                    
                    <SpecificationItem
                      title="Letterhead"
                      description="70# Uncoated Text, Natural White"
                      icon={<LayersIcon className="h-5 w-5 text-branding-orange" />}
                    />
                    
                    <SpecificationItem
                      title="Brochures"
                      description="100# Gloss Text for Tri-Folds, 80# Matte Text for Extended Info"
                      icon={<LayersIcon className="h-5 w-5 text-branding-orange" />}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-primary text-lg mb-4">Printing Techniques</h3>
                  <div className="space-y-3">
                    <SpecificationItem
                      title="Standard Printing"
                      description="4-Color Process (CMYK) for most materials"
                      icon={<ImageIcon className="h-5 w-5 text-branding-orange" />}
                    />
                    
                    <SpecificationItem
                      title="Special Techniques"
                      description="Spot UV, Foil Stamping (Brand Orange), Embossing for premium materials"
                      icon={<ImageIcon className="h-5 w-5 text-branding-orange" />}
                    />
                    
                    <SpecificationItem
                      title="Large Format"
                      description="UV-Resistant Inks for outdoor signage and displays"
                      icon={<ImageIcon className="h-5 w-5 text-branding-orange" />}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-primary text-lg mb-4">Size Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <SpecificationItem
                    title="Business Cards"
                    description={'3.5" x 2" (Standard US) or 85mm x 55mm (EU Standard)'}
                    icon={<LayersIcon className="h-5 w-5 text-light-gray" />}
                  />
                  
                  <SpecificationItem
                    title="Letterhead"
                    description={'8.5" x 11" (US) or A4 (International)'}
                    icon={<LayersIcon className="h-5 w-5 text-light-gray" />}
                  />
                  
                  <SpecificationItem
                    title="Envelopes"
                    description={'#10 (4.125" x 9.5") or A7 (5.25" x 7.25") for correspondence'}
                    icon={<LayersIcon className="h-5 w-5 text-light-gray" />}
                  />
                  
                  <SpecificationItem
                    title="Brochures"
                    description={'8.5" x 11" tri-fold, 11" x 17" bi-fold'}
                    icon={<LayersIcon className="h-5 w-5 text-light-gray" />}
                  />
                  
                  <SpecificationItem
                    title="Posters"
                    description={'18" x 24", 24" x 36", A2, A1, A0'}
                    icon={<LayersIcon className="h-5 w-5 text-light-gray" />}
                  />
                  
                  <SpecificationItem
                    title="Folders"
                    description={'9" x 12" with 4" pocket, business card slits'}
                    icon={<LayersIcon className="h-5 w-5 text-light-gray" />}
                  />
                </div>
              </div>
              
              <div className="border-t border-dark-gray pt-6">
                <h3 className="text-white font-primary text-lg mb-4">Bleed & Margins</h3>
                <div className="bg-sidebar-hover p-6 rounded-xl">
                  <div className="relative w-full aspect-video max-w-md mx-auto border border-dashed border-light-gray rounded-lg p-6">
                    {/* Bleed indicator */}
                    <div className="absolute inset-0 border-2 border-red-500 opacity-30 rounded"></div>
                    
                    {/* Trim area */}
                    <div className="absolute inset-3 border border-branding-orange opacity-50 rounded"></div>
                    
                    {/* Safe area */}
                    <div className="absolute inset-6 border border-green-500 opacity-50 rounded flex items-center justify-center">
                      <div className="text-white text-xs font-secondary bg-sidebar-bg bg-opacity-80 px-2 py-1 rounded">
                        Safe Area
                      </div>
                    </div>
                    
                    {/* Labels */}
                    <div className="absolute -top-6 left-0 right-0 flex justify-center">
                      <div className="text-xs text-red-500 font-secondary px-2 py-1 bg-sidebar-bg bg-opacity-80 rounded">
                        Bleed: 0.125" (3mm)
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                      <div className="text-xs text-branding-orange font-secondary px-2 py-1 bg-sidebar-bg bg-opacity-80 rounded">
                        Trim Line
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 -right-16 transform -translate-y-1/2">
                      <div className="text-xs text-green-500 font-secondary px-2 py-1 bg-sidebar-bg bg-opacity-80 rounded">
                        Margin: 0.25" (6mm)
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center max-w-md mx-auto">
                    <p className="text-light-gray text-xs font-secondary">
                      Always include 0.125" (3mm) bleed for all printed materials. Keep important text and graphics within the safe area, at least 0.25" (6mm) from trim edge.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Brand in Print Context Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-primary text-2xl text-white">Brand in Print Context</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 text-light-gray hover:text-white" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-primary text-xl mb-4">Packaging</h3>
                  <div className="bg-sidebar-hover rounded-xl p-6 flex items-center justify-center h-60 relative">
                    <div className="absolute inset-0 m-6 border border-dashed border-dark-gray rounded-lg flex items-center justify-center">
                      <Package className="h-12 w-12 text-branding-orange opacity-40" />
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-card-bg border-dark-gray text-white text-xs"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View 3D Preview
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-primary text-xl mb-4">Environmental</h3>
                  <div className="bg-sidebar-hover rounded-xl p-6 flex items-center justify-center h-60 relative">
                    <div className="absolute inset-0 m-6 border border-dashed border-dark-gray rounded-lg flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-branding-orange opacity-40" />
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-card-bg border-dark-gray text-white text-xs"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Examples
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-primary text-xl mb-4">Signage Applications</h3>
                <div className="bg-sidebar-hover rounded-xl p-6 flex items-center justify-center h-60 relative">
                  <div className="w-full max-w-3xl mx-auto grid grid-cols-3 gap-4">
                    <div className="bg-card-bg rounded p-2 aspect-video flex items-center justify-center">
                      <div className="text-branding-orange font-primary text-xl">NEXUS</div>
                    </div>
                    <div className="bg-black rounded p-2 aspect-video flex items-center justify-center">
                      <div className="text-branding-orange font-primary text-xl">NEXUS</div>
                    </div>
                    <div className="bg-white rounded p-2 aspect-video flex items-center justify-center">
                      <div className="text-black font-primary text-xl">NEXUS</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-primary text-xl mb-4">Special Print Effects</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-sidebar-hover rounded-lg p-4 text-center">
                    <div className="w-full aspect-square rounded-md bg-black flex items-center justify-center mb-2">
                      <div className="text-branding-orange font-primary text-xl" style={{ filter: "drop-shadow(0 0 2px rgba(232, 80, 0, 0.5))" }}>N</div>
                    </div>
                    <p className="text-white text-sm font-secondary">Foil Stamping</p>
                  </div>
                  
                  <div className="bg-sidebar-hover rounded-lg p-4 text-center">
                    <div className="w-full aspect-square rounded-md bg-black flex items-center justify-center mb-2">
                      <div className="text-white font-primary text-xl opacity-80" style={{ filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))" }}>N</div>
                    </div>
                    <p className="text-white text-sm font-secondary">Spot UV</p>
                  </div>
                  
                  <div className="bg-sidebar-hover rounded-lg p-4 text-center">
                    <div className="w-full aspect-square rounded-md bg-black flex items-center justify-center mb-2">
                      <div className="text-gray-800 font-primary text-xl" style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.2)" }}>N</div>
                    </div>
                    <p className="text-white text-sm font-secondary">Embossing</p>
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
              <CardTitle className="font-primary text-2xl text-white">Print Vendors</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <p className="text-white font-secondary text-sm">Approved Vendors</p>
                <div className="border border-dark-gray rounded-md divide-y divide-dark-gray">
                  <div className="p-3">
                    <p className="text-white font-secondary text-sm">PrintEx Solutions</p>
                    <p className="text-light-gray text-xs font-secondary">Business Cards, Letterhead, Envelopes</p>
                  </div>
                  <div className="p-3">
                    <p className="text-white font-secondary text-sm">SignWorks International</p>
                    <p className="text-light-gray text-xs font-secondary">Signage, Banners, Large Format</p>
                  </div>
                  <div className="p-3">
                    <p className="text-white font-secondary text-sm">Rapid Color Group</p>
                    <p className="text-light-gray text-xs font-secondary">Marketing Materials, Brochures</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-secondary text-sm">Print Request Process</p>
                <div className="bg-sidebar-hover p-3 rounded-md">
                  <ol className="list-decimal text-light-gray text-xs font-secondary space-y-2 pl-4">
                    <li className="text-white">Download print-ready templates</li>
                    <li>Submit request through brand portal</li>
                    <li>Approval from brand manager required</li>
                    <li>Use approved vendors only</li>
                    <li>Quality check required before mass production</li>
                  </ol>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-secondary text-sm">Production Timeline</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-sidebar-hover rounded-md p-3">
                    <p className="text-white text-xs font-secondary font-medium">Business Cards</p>
                    <p className="text-light-gray text-xs font-secondary">3-5 business days</p>
                  </div>
                  <div className="bg-sidebar-hover rounded-md p-3">
                    <p className="text-white text-xs font-secondary font-medium">Stationery</p>
                    <p className="text-light-gray text-xs font-secondary">5-7 business days</p>
                  </div>
                  <div className="bg-sidebar-hover rounded-md p-3">
                    <p className="text-white text-xs font-secondary font-medium">Brochures</p>
                    <p className="text-light-gray text-xs font-secondary">7-10 business days</p>
                  </div>
                  <div className="bg-sidebar-hover rounded-md p-3">
                    <p className="text-white text-xs font-secondary font-medium">Signage</p>
                    <p className="text-light-gray text-xs font-secondary">10-14 business days</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-dark-gray pt-4 mt-4">
                <Button className="w-full btn-primary">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Print Assets
                </Button>
                
                <Button className="w-full bg-sidebar-hover border border-dark-gray text-white hover:bg-dark-gray mt-3">
                  <Download className="h-4 w-4 mr-2" />
                  Download Print Guidelines PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
