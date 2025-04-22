import { MoreHorizontal, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ColorMeaningProps {
  color: string;
  title: string;
  description: string;
}

interface ColorMeaningSectionProps {
  meanings: ColorMeaningProps[];
  onAddMeaning: () => void;
}

function ColorMeaningItem({ color, title, description }: ColorMeaningProps) {
  return (
    <motion.div 
      className="flex border-b border-border pb-4 last:border-b-0 last:pb-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 rounded bg-primary flex-shrink-0" style={{ backgroundColor: color }}></div>
      <div className="ml-4">
        <h3 className="text-sm font-bold mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

export default function ColorMeaningSection({ meanings, onAddMeaning }: ColorMeaningSectionProps) {
  return (
    <Card className="bg-card border-border rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-primary text-2xl">Color Meaning</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-sm text-muted-foreground hover:text-foreground transition-all">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-sm text-muted-foreground hover:text-foreground transition-all">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {meanings.map((meaning, index) => (
          <ColorMeaningItem 
            key={index}
            color={meaning.color}
            title={meaning.title}
            description={meaning.description}
          />
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        className="flex items-center text-sm font-medium text-primary hover:text-foreground transition-all"
        onClick={onAddMeaning}
      >
        <Plus className="h-5 w-5 mr-1" />
        Add Meaning
      </Button>
    </Card>
  );
}
