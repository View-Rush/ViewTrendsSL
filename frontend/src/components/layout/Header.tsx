import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/Button';
import { LogOut, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-lankan-saffron to-lankan-gold"></div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-lankan-saffron to-lankan-gold bg-clip-text text-transparent">
                            ViewTrendsSL
                        </h1>
                    </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="hidden md:flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Welcome,</span>
                            <span className="font-semibold">{user.username}</span>
                        </div>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="rounded-full bg-lankan-saffron/20 h-10 w-10 flex items-center justify-center"
                        >
                            {user?.username?.charAt(0).toUpperCase()}
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-card shadow-lg">
                                <button
                                    onClick={() => {
                                        navigate('/settings');
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 rounded-t-md"
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-accent text-red-600 flex items-center gap-2 rounded-b-md"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}