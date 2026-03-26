import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResumeOptimizer from "./pages/ResumeOptimizer";
import InterviewPractice from "./pages/InterviewPractice";
import ApplicationTracker from "./pages/ApplicationTracker";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import NotificationSettings from "./pages/NotificationSettings";
import ProfileSettings from "./pages/ProfileSettings";
import Preferences from "./pages/Preferences";
import Privacy from "./pages/Privacy";
import Account from "./pages/Account";
import InterviewGuide from "./pages/InterviewGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/dashboard/resume-optimizer" element={
              <DashboardLayout>
                <ResumeOptimizer />
              </DashboardLayout>
            } />
            <Route path="/dashboard/interview-practice" element={
              <DashboardLayout>
                <InterviewPractice />
              </DashboardLayout>
            } />
            <Route path="/dashboard/application-tracker" element={
              <DashboardLayout>
                <ApplicationTracker />
              </DashboardLayout>
            } />
            <Route path="/dashboard/profile" element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            } />
            <Route path="/dashboard/notifications" element={
              <DashboardLayout>
                <NotificationSettings />
              </DashboardLayout>
            } />
            <Route path="/dashboard/profile-settings" element={
              <DashboardLayout>
                <ProfileSettings />
              </DashboardLayout>
            } />
            <Route path="/dashboard/preferences" element={
              <DashboardLayout>
                <Preferences />
              </DashboardLayout>
            } />
            <Route path="/dashboard/privacy" element={
              <DashboardLayout>
                <Privacy />
              </DashboardLayout>
            } />
            <Route path="/dashboard/account" element={
              <DashboardLayout>
                <Account />
              </DashboardLayout>
            } />
            <Route path="/interview-guide" element={<InterviewGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
