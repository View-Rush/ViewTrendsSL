import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { channelsService } from '@/services/channels.service';
import { videosService } from '@/services/videos.service';
import { predictionsService } from '@/services/predictions.service';
import { formatNumber } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Tv, Radio, TrendingUp, Plus, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();

    const { data: channelsData } = useQuery({
        queryKey: ['channels', { limit: 100 }],
        queryFn: () => channelsService.getChannels({ limit: 100 }),
    });

    const { data: videosData } = useQuery({
        queryKey: ['videos', { limit: 100 }],
        queryFn: () => videosService.getVideos({ limit: 100 }),
    });

    const { data: predictionsData } = useQuery({
        queryKey: ['predictions', { limit: 100 }],
        queryFn: () => predictionsService.getPredictions({ limit: 100 }),
    });

    const { data: performanceData } = useQuery({
        queryKey: ['predictions-performance'],
        queryFn: () => predictionsService.getPerformance(),
    });

    const stats = [
        {
            title: 'Total Channels',
            value: formatNumber(channelsData?.total || 0),
            icon: Radio,
            color: 'from-lankan-saffron',
        },
        {
            title: 'Total Videos',
            value: formatNumber(videosData?.total || 0),
            icon: Tv,
            color: 'from-lankan-gold',
        },
        {
            title: 'Predictions',
            value: formatNumber(performanceData?.total_predictions || 0),
            icon: TrendingUp,
            color: 'from-blue-500',
        },
        {
            title: 'Avg Accuracy',
            value: `${(performanceData?.average_accuracy || 0).toFixed(1)}%`,
            icon: BarChart3,
            color: 'from-green-500',
        },
    ];

    // Mock data for chart
    const chartData = [
        { name: 'Jan', accuracy: 75 },
        { name: 'Feb', accuracy: 78 },
        { name: 'Mar', accuracy: 82 },
        { name: 'Apr', accuracy: 80 },
        { name: 'May', accuracy: 85 },
        { name: 'Jun', accuracy: 88 },
    ];

    const predictionStatus = [
        { name: 'Completed', value: performanceData?.completed_predictions || 0, color: '#10b981' },
        { name: 'Pending', value: performanceData?.pending_predictions || 0, color: '#f59e0b' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome to ViewTrendsSL - Monitor your YouTube predictions
                        </p>
                    </div>
                    <Button variant="lankan" onClick={() => navigate('/predictions/create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Prediction
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title} className="overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{stat.title}</p>
                                            <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                        </div>
                                        <div className={`bg-gradient-to-br ${stat.color} to-transparent p-3 rounded-lg`}>
                                            <Icon className="h-6 w-6 text-white/80" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Prediction Accuracy Trend</CardTitle>
                            <CardDescription>Accuracy over the last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="accuracy" stroke="#FF9933" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Prediction Status</CardTitle>
                            <CardDescription>Current predictions breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {predictionStatus.some(s => s.value > 0) ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={predictionStatus}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {predictionStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-300 text-muted-foreground">
                                    No predictions yet
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Predictions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Predictions</CardTitle>
                            <CardDescription>Your latest video predictions</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/predictions')}>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {predictionsData?.predictions && predictionsData.predictions.length > 0 ? (
                            <div className="space-y-4">
                                {predictionsData.predictions.slice(0, 5).map((prediction) => (
                                    <div
                                        key={prediction.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">Prediction #{prediction.id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Predicted: {formatNumber(prediction.predicted_views)} views
                                            </p>
                                        </div>
                                        <div className="text-right">
                      <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                              prediction.status === 'completed'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : prediction.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                      >
                        {prediction.status}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Zap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground">No predictions yet</p>
                                <Button
                                    variant="lankan"
                                    size="sm"
                                    onClick={() => navigate('/predictions/create')}
                                    className="mt-4"
                                >
                                    Create First Prediction
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}