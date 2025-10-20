import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import {Link, Navigate, useLocation, useNavigate} from 'react-router-dom';
import { Youtube, Mail } from 'lucide-react';

export default function Auth() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signIn, signUp, signInWithGoogle, loading } = useAuthStore();

    const from = (location.state as any)?.from?.pathname || "/dashboard";

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect if already logged in
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) return;

        setIsSubmitting(true);
        const { error } = await signIn(loginEmail, loginPassword);
        if (!error) navigate(from, { replace: true });
        setIsSubmitting(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!registerName || !registerEmail || !registerPassword) return;

        setIsSubmitting(true);
        const { error } = await signUp(registerEmail, registerPassword, registerName);
        if (!error) navigate('/dashboard');
        setIsSubmitting(false);
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        await signInWithGoogle();
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
            <Card className="w-full max-w-md p-8 bg-card/50 backdrop-blur border-border/50 shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Youtube className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">
                            ViewTrendsSL
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-center">
                        Sign in to access your prediction dashboard
                    </p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">Sign In</TabsTrigger>
                        <TabsTrigger value="register">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleLogin}
                            disabled={isSubmitting}
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Continue with Google
                        </Button>
                    </TabsContent>

                    <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="register-name">Full Name</Label>
                                <Input
                                    id="register-name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                    id="register-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-password">Password</Label>
                                <Input
                                    id="register-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleLogin}
                            disabled={isSubmitting}
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Continue with Google
                        </Button>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <Link to="/" className="hover:text-foreground transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </Card>
        </div>
    );
}
