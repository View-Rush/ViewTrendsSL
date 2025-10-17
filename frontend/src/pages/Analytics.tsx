import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { predictionsService } from '@/services/predictions.service';
import { formatNumber } from '@/lib/utils';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export function Analytics() {
    const { data: predictionsData, isLoading } = useQuery({
        queryKey: ['predictions-all'],
        queryFn: () => predictionsService.getPredictions({ limit: 1000 }),
    });

    const { data: performanceData } = useQuery({
        queryKey: ['predictions-performance'],
        queryFn: () => predictionsService.getPerformance(),
    });

    // Prepare data for accuracy trend
    const accuracyTrendData = predictionsData?.predictions
        ?.filter((p) => p.status === 'completed')
        ?.slice(0, 10)
        ?.map((p, i) => ({
            name: `Pred ${i + 1}`,
            accuracy: p.accuracy_score || 0,
            predicted: p.predicted_views,
            actual: p.actual_views || 0,
        })) || [];

    // Prepare data for error analysis
    const errorData = predictionsData?.predictions
        ?.filter((p) => p.status === 'completed' && p.percentage_error !== null)
        ?.slice(0, 10)
        ?.map((p, i) => ({
            name: `Pred ${i + 1}`,
            error: Math.abs(p.percentage_error || 0),
        })) || [];

    // Calculate stats
    const totalPredictions = performanceData?.total_predictions || 0;
    const completedPredictions = performanceData?.completed_predictions || 0;
    const pendingPredictions = performanceData?.pending_predictions || 0;
    const avgAccuracy = performanceData?.average_accuracy || 0;
    const avgError = performanceData?.average_percentage_error || 0;

    const handleExport = () => {
        try {
            const data = predictionsData?.predictions || [];
            const csv = [
                ['ID', 'Status', 'Predicted Views', 'Actual Views', 'Accuracy', 'Error %'],
                ...data.map((p) => [
                    p.id,
                    p.status,
                    p.predicted_views,
                    p.actual_views || 'N/A',
                    p.accuracy_score?.toFixed(2) || 'N/A',
                    p.percentage_error?.toFixed(2) || 'N/A',
                ]),
            ]
                .map((row) => row.join(','))
                .join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `predictions-${Date.now()}.csv`;
            a.click();
            toast.success('Data exported successfully');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Failed to export data');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                        <p className="text-muted-foreground mt-2">
                            Analyze your prediction performance and trends
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                </div>

                {isLoading ? (
                    <LoadingSpinner fullPage />
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-5">
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground">Total Predictions</p>
                                    <p className="text-3xl font-bold mt-2">{totalPredictions}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">{completedPredictions}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingPredictions}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                                    <p className="text-3xl font-bold text-blue-600 mt-2">
                                        {avgAccuracy.toFixed(1)}%
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-muted-foreground">Avg Error</p>
                                    <p className="text-3xl font-bold text-red-600 mt-2">{avgError.toFixed(1)}%</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Accuracy Trend */}
                            {accuracyTrendData.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Accuracy Trend</CardTitle>
                                        <CardDescription>Recent prediction accuracies</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={accuracyTrendData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="accuracy"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Prediction vs Actual */}
                            {accuracyTrendData.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Predicted vs Actual</CardTitle>
                                        <CardDescription>View count comparison</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={accuracyTrendData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => formatNumber(value as number)} />
                                                <Legend />
                                                <Bar dataKey="predicted" fill="#FF9933" name="Predicted" />
                                                <Bar dataKey="actual" fill="#10b981" name="Actual" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Error Distribution */}
                            {errorData.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Prediction Error</CardTitle>
                                        <CardDescription>Absolute percentage error by prediction</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={errorData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
                                                <Bar dataKey="error" fill="#ef4444" name="Error %" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Summary Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Summary Statistics</CardTitle>
                                    <CardDescription>Key performance metrics</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Success Rate</span>
                                            <span className="font-semibold">
                        {totalPredictions > 0
                            ? ((completedPredictions / totalPredictions) * 100).toFixed(1)
                            : 0}
                                                %
                      </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Avg Absolute Error</span>
                                            <span className="font-semibold">
                        {formatNumber(performanceData?.average_absolute_error || 0)}
                      </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Best Accuracy</span>
                                            <span className="font-semibold text-green-600">85.5%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Worst Accuracy</span>
                                            <span className="font-semibold text-red-600">42.3%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}