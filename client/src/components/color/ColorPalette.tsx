import { useState } from "react";
import { Copy, RefreshCw, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ColorProps {
  id: number;
  name: string;
  hexCode: string;
  colorType: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

interface ColorPaletteProps {
  title: string;
  colors: ColorProps[];
  onAddColor: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

function ColorSwatch({ id, name, hexCode, colorType, onEdit, onDelete }: ColorProps) {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(hexCode);
    toast({
      title: "Copied to clipboard",
      description: `${hexCode} has been copied to your clipboard.`,
      duration: 2000,
    });
  };
  
  return (
    <motion.div 
      className="flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="color-swatch" 
        style={{ backgroundColor: hexCode }}
      ></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-sm mb-1">{name}</p>
          <p className="text-xs text-muted-foreground">{hexCode}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-primary hover:text-foreground transition-all">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function ColorPalette({ title, colors, onAddColor, onRefresh, isLoading = false }: ColorPaletteProps) {
  return (
    <Card className="bg-card border-border rounded-xl mb-8">
      <CardContent className="p-6">
        <div className="card-header">
          <h2 className="font-primary text-2xl">{title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {colors.map((color) => (
            <ColorSwatch 
              key={color.id} 
              id={color.id} 
              name={color.name} 
              hexCode={color.hexCode} 
              colorType={color.colorType}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="flex items-center text-sm font-medium text-primary hover:text-foreground transition-all"
            onClick={onAddColor}
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Color
          </Button>
          
          {onRefresh && (
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onRefresh}
                className="text-sm text-muted-foreground hover:text-foreground transition-all"
                disabled={isLoading}
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
