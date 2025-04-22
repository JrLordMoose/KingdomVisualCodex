import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import BrandStoryPage from "@/pages/brand-story-page";
import BrandMoodboardPage from "@/pages/brand-moodboard-page";
import LogoGuidePage from "@/pages/logo-guide-page";
import ColorGuidePage from "@/pages/color-guide-page";
import TypographyPage from "@/pages/typography-page";
import DigitalGuidelinesPage from "@/pages/digital-guidelines-page";
import PrintGuidelinesPage from "@/pages/print-guidelines-page";
import ExportPage from "@/pages/export-page";
import ProfilePage from "@/pages/profile-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/brand-story" component={BrandStoryPage} />
      <ProtectedRoute path="/brand-moodboard" component={BrandMoodboardPage} />
      <ProtectedRoute path="/logo-guide" component={LogoGuidePage} />
      <ProtectedRoute path="/color-guide" component={ColorGuidePage} />
      <ProtectedRoute path="/typography" component={TypographyPage} />
      <ProtectedRoute path="/digital-guidelines" component={DigitalGuidelinesPage} />
      <ProtectedRoute path="/print-guidelines" component={PrintGuidelinesPage} />
      <ProtectedRoute path="/export" component={ExportPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
