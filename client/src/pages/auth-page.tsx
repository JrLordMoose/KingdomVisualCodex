import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-primary flex">
      {/* Left Column - Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-6xl font-primary text-branding-orange tracking-tight mb-4">KNGDM</h1>
            <p className="text-white font-secondary">
              Visual Codex - The intelligent brand style guide generator
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Tabs 
              defaultValue="login" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8 bg-sidebar-hover">
                <TabsTrigger 
                  value="login"
                  className="font-secondary data-[state=active]:bg-branding-orange data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="font-secondary data-[state=active]:bg-branding-orange data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right Column - Hero */}
      <div className="hidden lg:flex flex-1 bg-black relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center p-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-5xl font-primary text-white mb-6 leading-tight">
              <span className="block">Create stunning</span>
              <span className="text-branding-orange">brand guidelines</span>
              <span className="block">in minutes</span>
            </h2>
            
            <ul className="space-y-4 text-white font-secondary">
              <li className="flex items-center">
                <span className="text-branding-orange mr-2">•</span>
                <span>AI-powered brand style guide generation</span>
              </li>
              <li className="flex items-center">
                <span className="text-branding-orange mr-2">•</span>
                <span>Complete color, typography, and logo systems</span>
              </li>
              <li className="flex items-center">
                <span className="text-branding-orange mr-2">•</span>
                <span>Export to multiple formats for your team</span>
              </li>
              <li className="flex items-center">
                <span className="text-branding-orange mr-2">•</span>
                <span>Collaborate with your team in real-time</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-gradient-to-tr from-black via-gray-900 to-branding-orange rounded-tl-full opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        ></motion.div>
        
        <motion.div 
          className="absolute top-40 -right-20 w-40 h-40 rounded-full bg-branding-orange opacity-10"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        ></motion.div>
        
        <motion.div 
          className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-branding-orange opacity-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        ></motion.div>
      </div>
    </div>
  );
}
