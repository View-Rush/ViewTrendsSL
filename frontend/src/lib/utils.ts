import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function formatDateTime(date: string): string {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function calculateAccuracy(predicted: number, actual: number): number {
    if (actual === 0) return predicted === 0 ? 100 : 0;
    const error = Math.abs(predicted - actual) / actual;
    return Math.max(0, 100 - error * 100);
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'completed':
            return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
        case 'pending':
            return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
        case 'failed':
            return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
        default:
            return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
}