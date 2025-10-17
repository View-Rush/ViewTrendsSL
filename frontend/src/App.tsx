import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from 'sonner';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Channels } from '@/pages/Channels';
import { Videos } from '@/pages/Videos';
import { Predictions } from '@/pages/Predictions';
import { CreatePrediction } from '@/pages/CreatePrediction';
import { Analytics } from '@/pages/Analytics';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function App() {
    const { initialize, isLoading } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (isLoading) {
        return <LoadingSpinner fullPage />;
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            // <ProtectedRoute>
                                <Dashboard />
                            // </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/channels"
                        element={
                            // <ProtectedRoute>
                                <Channels />
                            // </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/videos"
                        element={
                            // <ProtectedRoute>
                                <Videos />
                            // </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/predictions"
                        element={
                            // <ProtectedRoute>
                                <Predictions />
                            // </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/predictions/create"
                        element={
                            // <ProtectedRoute>
                                <CreatePrediction />
                            // </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            // <ProtectedRoute>
                                <Analytics />
                            // </ProtectedRoute>
                        }
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="top-right" />
        </>
    );
}