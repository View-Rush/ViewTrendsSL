import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { useAuthInit } from "@/hooks/useAuthInit";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Channels from "./pages/Channels";
import VideoLibrary from "./pages/VideoLibrary";
import Predictions from "./pages/Predictions";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import {useAuthStore} from "@/stores/authStore.ts";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
    <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    </SidebarProvider>
);

const App = () => {
    useAuthInit();
    const { loading } = useAuthStore();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Dashboard />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/channels"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Channels />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/videos"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <VideoLibrary />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/predictions"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Predictions />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Analytics />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Settings />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
