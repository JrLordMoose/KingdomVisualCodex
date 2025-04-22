import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Settings, CreditCard, Bell, Key, Globe, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AppLayout title="Profile">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-primary text-white">Profile Settings</h1>
          <p className="text-light-gray mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <Card className="bg-card-bg border-card-border shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20 border-2 border-branding-orange">
                  <AvatarFallback className="bg-branding-orange text-xl">
                    {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : user?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">{user?.fullName || user?.username}</h3>
                  <p className="text-light-gray text-sm mt-1">{user?.username}</p>
                </div>
                
                <Badge className="bg-branding-orange text-white hover:bg-branding-orange/90">Free Plan</Badge>
                
                <div className="w-full mt-6">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-12 lg:col-span-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-sidebar-hover mb-6 w-full justify-start">
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-branding-orange data-[state=active]:text-white"
              >
                <User className="mr-2 h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-branding-orange data-[state=active]:text-white"
              >
                <Key className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="data-[state=active]:bg-branding-orange data-[state=active]:text-white"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-branding-orange data-[state=active]:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card className="bg-card-bg border-card-border shadow-none">
                <CardHeader>
                  <CardTitle className="text-white">Account Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={user?.username} className="bg-sidebar-hover border-card-border focus:border-branding-orange focus:ring-branding-orange" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="user@example.com" className="bg-sidebar-hover border-card-border focus:border-branding-orange focus:ring-branding-orange" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        defaultValue={user?.fullName ? user.fullName.split(' ')[0] : ''} 
                        className="bg-sidebar-hover border-card-border focus:border-branding-orange focus:ring-branding-orange" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        defaultValue={user?.fullName ? user.fullName.split(' ')[1] || '' : ''} 
                        className="bg-sidebar-hover border-card-border focus:border-branding-orange focus:ring-branding-orange" 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-branding-orange hover:bg-branding-orange/90">Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="bg-card-bg border-card-border shadow-none">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription>Manage your passwords and security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" className="bg-sidebar-hover border-card-border focus:border-branding-orange focus:ring-branding-orange" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" className="bg-sidebar-hover border-card-border focus:border-branding-orange focus:ring-branding-orange" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" className="bg-sidebar-hover border-card-border focus:border-branding-orange focus:ring-branding-orange" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-branding-orange hover:bg-branding-orange/90">Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <Card className="bg-card-bg border-card-border shadow-none">
                <CardHeader>
                  <CardTitle className="text-white">Billing Information</CardTitle>
                  <CardDescription>Manage your subscription and payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-sidebar-hover p-4 rounded-md border border-card-border">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">Current Plan: Free</h3>
                        <p className="text-light-gray text-sm mt-1">Limited features and exports</p>
                      </div>
                      <Button variant="outline" className="border-branding-orange text-branding-orange hover:bg-branding-orange hover:text-white">
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Available Plans</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-sidebar-hover border-card-border shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-lg">Professional</CardTitle>
                          <CardDescription>$19/month</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <p className="text-light-gray">✓ Unlimited brands</p>
                          <p className="text-light-gray">✓ Advanced export options</p>
                          <p className="text-light-gray">✓ Team collaboration (up to 3)</p>
                          <p className="text-light-gray">✓ Custom domain</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">Select Plan</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card className="bg-sidebar-hover border-card-border shadow-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-branding-orange text-white text-xs px-2 py-1">
                          Popular
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-lg">Enterprise</CardTitle>
                          <CardDescription>$49/month</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <p className="text-light-gray">✓ Everything in Professional</p>
                          <p className="text-light-gray">✓ Unlimited team members</p>
                          <p className="text-light-gray">✓ Advanced AI features</p>
                          <p className="text-light-gray">✓ Priority support</p>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-branding-orange hover:bg-branding-orange/90">Select Plan</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="bg-card-bg border-card-border shadow-none">
                <CardHeader>
                  <CardTitle className="text-white">Application Settings</CardTitle>
                  <CardDescription>Manage your preferences and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Notifications</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-light-gray text-xs">Receive updates about your account via email</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                          <p className="text-light-gray text-xs">Receive marketing and promotional emails</p>
                        </div>
                        <Switch id="marketing-emails" defaultChecked={false} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Appearance</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="dark-mode">Dark Mode</Label>
                          <p className="text-light-gray text-xs">Use dark theme throughout the application</p>
                        </div>
                        <Switch id="dark-mode" defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reduced-motion">Reduced Motion</Label>
                          <p className="text-light-gray text-xs">Reduce interface animations and transitions</p>
                        </div>
                        <Switch id="reduced-motion" defaultChecked={false} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Language & Region</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select 
                          id="language" 
                          className="w-full rounded-md bg-sidebar-hover border-card-border text-white py-2 px-3 focus:border-branding-orange focus:ring-branding-orange"
                        >
                          <option value="en">English</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select 
                          id="timezone" 
                          className="w-full rounded-md bg-sidebar-hover border-card-border text-white py-2 px-3 focus:border-branding-orange focus:ring-branding-orange"
                        >
                          <option value="utc">UTC (GMT)</option>
                          <option value="est">Eastern Standard Time (EST)</option>
                          <option value="pst">Pacific Standard Time (PST)</option>
                          <option value="cet">Central European Time (CET)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-branding-orange hover:bg-branding-orange/90">Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}