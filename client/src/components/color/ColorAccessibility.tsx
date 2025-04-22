import { useState } from "react";
import { MoreHorizontal, Plus, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AccessibilityCheckProps {
  foregroundColor: string;
  backgroundColor: string;
  contrastRatio: number;
  isPassing: boolean;
}

interface ColorAccessibilitySectionProps {
  checks: AccessibilityCheckProps[];
  onRunChecks: () => void;
  isLoading?: boolean;
}

function AccessibilityCheckItem({ foregroundColor, backgroundColor, contrastRatio, isPassing }: AccessibilityCheckProps) {
  return (
    <motion.div 
      className="flex items-center border border-border rounded-md p-3"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-8 h-8 flex-shrink-0 rounded" style={{ backgroundColor: foregroundColor }}></div>
        <div className="text-xs">on</div>
        <div className="w-8 h-8 flex-shrink-0 rounded" style={{ backgroundColor: backgroundColor }}></div>
      </div>
      
      <div className="ml-4 flex items-center">
        <div className={`text-xs font-bold ${isPassing ? 'text-success' : 'text-destructive'} mr-2`}>
          {isPassing ? 'PASS' : 'FAIL'}
        </div>
        <div className="text-xs text-muted-foreground">{contrastRatio.toFixed(2)}:1</div>
      </div>
    </motion.div>
  );
}

export default function ColorAccessibilitySection({ checks, onRunChecks, isLoading = false }: ColorAccessibilitySectionProps) {
  return (
    <Card className="bg-card border-border rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-primary text-2xl">Accessibility</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-sm text-muted-foreground hover:text-foreground transition-all">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-sm text-primary hover:text-foreground transition-all" 
            aria-label="Run accessibility check"
            onClick={onRunChecks}
            disabled={isLoading}
          >
            <ShieldCheck className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {checks.map((check, index) => (
          <AccessibilityCheckItem 
            key={index}
            foregroundColor={check.foregroundColor}
            backgroundColor={check.backgroundColor}
            contrastRatio={check.contrastRatio}
            isPassing={check.isPassing}
          />
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        className="flex items-center text-sm font-medium text-primary hover:text-foreground transition-all"
        onClick={onRunChecks}
        disabled={isLoading}
      >
        <ShieldCheck className="h-5 w-5 mr-1" />
        Run More Checks
      </Button>
    </Card>
  );
}
