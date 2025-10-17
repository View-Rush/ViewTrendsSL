import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const registerSchema = z
    .object({
        email: z.string().email('Invalid email address'),
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            await authService.register({
                email: data.email,
                username: data.username,
                password: data.password,
            });
            toast.success('Account created successfully! Please login.');
            navigate('/login');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-lankan-saffron/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2">
                    <div className="flex items-center justify-center mb-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-lankan-saffron to-lankan-gold"></div>
                    </div>
                    <CardTitle className="text-center text-2xl">Create Account</CardTitle>
                    <CardDescription className="text-center">
                        Join ViewTrendsSL and start predicting trends
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                {...register('email')}
                                type="email"
                                placeholder="your@email.com"
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input
                                {...register('username')}
                                placeholder="Choose a username"
                                disabled={isLoading}
                            />
                            {errors.username && (
                                <p className="text-sm text-destructive">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                {...register('password')}
                                type="password"
                                placeholder="Enter a strong password"
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm Password</label>
                            <Input
                                {...register('confirmPassword')}
                                type="password"
                                placeholder="Confirm your password"
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                            variant="lankan"
                        >
                            {isLoading ? <LoadingSpinner /> : 'Create Account'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-lankan-saffron hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}