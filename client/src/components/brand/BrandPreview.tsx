import { X, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BrandPreviewProps {
  brandName: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryText?: string;
  onExploreFullPreview: () => void;
}

export default function BrandPreview({
  brandName,
  tagline,
  description,
  primaryColor,
  secondaryText,
  onExploreFullPreview
}: BrandPreviewProps) {
  return (
    <Card className="bg-card border-border rounded-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-primary text-2xl">Brand Preview</h2>
          <Button 
            className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md font-secondary uppercase tracking-wider transition-all"
            onClick={onExploreFullPreview}
          >
            Explore Full Preview
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2 bg-background rounded-lg p-5 border border-border overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center text-center p-6 relative">
              <div className="absolute top-0 right-0 text-xs text-muted-foreground">Website preview</div>
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <div 
                  className="w-12 h-12 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-primary-foreground" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-primary text-2xl mb-2">{brandName}</h3>
              <p className="text-sm text-muted-foreground mb-6">{tagline}</p>
              <p className="text-sm max-w-md mb-6">{description}</p>
              
              {secondaryText && (
                <div className="w-full flex flex-col items-start text-left mb-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Order</p>
                  <p className="text-sm">{secondaryText}</p>
                </div>
              )}
              
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md text-sm font-secondary tracking-wider transition-all"
              >
                Explore Brand
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-background rounded-lg border border-border overflow-hidden relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="absolute top-2 right-2 bg-card rounded-full p-1">
              <X className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="p-4 border-b border-border">
              <div className="flex items-center">
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-background font-bold text-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {brandName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold uppercase">{brandName}</h3>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-4">
                <span className="text-foreground">{description.substring(0, 50)}...</span> 
                {description.substring(50, 100)}
              </p>
              
              <p className="text-xs text-muted-foreground mb-4">
                {tagline}
              </p>
              
              <Button className="w-full bg-card hover:bg-secondary border border-border text-foreground py-2 px-4 rounded-full text-xs font-secondary tracking-wider transition-all flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Preview
              </Button>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
