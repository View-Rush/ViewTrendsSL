import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { predictionsService } from '@/services/predictions.service';
import { formatNumber, formatDate } from '@/lib/utils';
import { Plus, Search, Eye, Zap } from 'lucide-react';
// import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Predictions() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

    const { data: predictionsData, isLoading } = useQuery({
        queryKey: ['predictions', statusFilter],
        queryFn: () =>
            predictionsService.getPredictions({
                status: statusFilter === 'all' ? undefined : statusFilter,
                limit: 100,
            }),
    });

    const filteredPredictions = predictionsData?.predictions?.filter((p) =>
        p.id.toString().includes(searchTerm)
    );

    // Prepare chart data
    const chartData = filteredPredictions?.slice(0, 10).map((p) => ({
        id: `#${p.id}`,
        predicted: p.predicted_views,
        actual: p.actual_views || 0,
    })) || [];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Predictions</h1>
                        <p className="text-muted-foreground mt-2">
                            Track and manage your video view predictions
                        </p>
                    </div>
                    <Button variant="lankan" onClick={() => navigate('/predictions/create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Prediction
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by prediction ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'completed'].map((filter) => (
                            <Button
                                key={filter}
                                variant={statusFilter === filter ? 'lankan' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter(filter as 'all'| 'pending' | 'completed')}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                {chartData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Predicted vs Actual Views</CardTitle>
                            <CardDescription>Comparison of your recent predictions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="id" />
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

                {/* Predictions Table */}
                {isLoading ? (
                    <LoadingSpinner fullPage />
                ) : filteredPredictions && filteredPredictions.length > 0 ? (
                    <div className="space-y-4">
                        {filteredPredictions.map((prediction) => (
                            <Card
                                key={prediction.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate(`/predictions/${prediction.id}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                        {/* ID and Status */}
                                        <div>
                                            <p className="text-sm text-muted-foreground">Prediction</p>
                                            <p className="font-semibold">#{prediction.id}</p>
                                            <span
                                                className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
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

                                        {/* Predicted Views */}
                                        <div>
                                            <p className="text-sm text-muted-foreground">Predicted Views</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Eye className="h-4 w-4 text-blue-500" />
                                                <p className="font-semibold">{formatNumber(prediction.predicted_views)}</p>
                                            </div>
                                            {prediction.confidence_score && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Confidence: {(prediction.confidence_score * 100).toFixed(0)}%
                                                </p>
                                            )}
                                        </div>

                                        {/* Actual Views / Accuracy */}
                                        <div>
                                            {prediction.actual_views !== null && prediction.actual_views !== undefined ? (
                                                <>
                                                    <p className="text-sm text-muted-foreground">Actual Views</p>
                                                    <p className="font-semibold">{formatNumber(prediction.actual_views)}</p>
                                                    {prediction.accuracy_score && (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            Accuracy: {prediction.accuracy_score.toFixed(1)}%
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-muted-foreground">Predicted Date</p>
                                                    <p className="font-semibold">{formatDate(prediction.target_date)}</p>
                                                </>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <div className="flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/predictions/${prediction.id}`);
                                                }}
                                            >
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Zap className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium mb-2">No predictions yet</p>
                            <p className="text-muted-foreground text-center mb-6">
                                {searchTerm
                                    ? 'No predictions match your search'
                                    : 'Create your first prediction to get started'}
                            </p>
                            <Button variant="lankan" onClick={() => navigate('/predictions/create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Prediction
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}