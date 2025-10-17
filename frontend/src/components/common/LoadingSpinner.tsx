import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    fullPage?: boolean;
}

export function LoadingSpinner({ size = 'md', fullPage = false }: LoadingSpinnerProps) {
    const sizeMap = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    const spinner = (
        <Loader2 className={`${sizeMap[size]} animate-spin text-primary`} />
    );

    if (fullPage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                {spinner}
            </div>
        );
    }

    return <div className="flex items-center justify-center">{spinner}</div>;
}