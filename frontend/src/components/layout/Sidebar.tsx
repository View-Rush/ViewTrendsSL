import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    Home,
    BarChart3,
    Tv,
    Radio,
    TrendingUp,
    Settings,
    X,
} from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const navItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Radio, label: 'Channels', href: '/channels' },
    { icon: Tv, label: 'Videos', href: '/videos' },
    { icon: TrendingUp, label: 'Predictions', href: '/predictions' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (href: string) => {
        return location.pathname === href || location.pathname.startsWith(href + '/');
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r bg-background transition-transform md:relative md:top-0 md:h-screen md:translate-x-0 md:border-r',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 md:hidden"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <button
                                    key={item.href}
                                    onClick={() => {
                                        navigate(item.href);
                                        onClose?.();
                                    }}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-gradient-to-r from-lankan-saffron/20 to-lankan-gold/20 text-lankan-saffron'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Settings - sticky at bottom */}
                    <div className="border-t p-4 space-y-2">
                        <button
                            onClick={() => {
                                navigate('/settings');
                                onClose?.();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}