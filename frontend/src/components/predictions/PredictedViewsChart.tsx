import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2 } from "lucide-react";

interface PredictedViewsChartProps {
    videoId: string;
    predictionData: number[]; // 30 predicted daily views
    startDate?: string; // optional, e.g. upload date or day 0
}

export default function PredictedViewsChart({
                                                videoId,
                                                predictionData,
                                                startDate,
                                            }: PredictedViewsChartProps) {
    const [chartData, setChartData] = useState<{ day: string; views: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (predictionData && predictionData.length > 0) {
            const baseDate = startDate ? new Date(startDate) : new Date();
            const formatted = predictionData.map((v, i) => {
                const d = new Date(baseDate);
                d.setDate(d.getDate() + i);
                return {
                    day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                    views: v,
                };
            });
            setChartData(formatted);
            setLoading(false);
        }
    }, [predictionData, startDate]);

    if (loading) {
        return (
            <Card className="bg-card border-border flex items-center justify-center h-64">
                <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
            </Card>
        );
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle>Predicted Views (30 Days)</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Forecast for video <span className="font-medium">{videoId}</span>
                </p>
            </CardHeader>

            <CardContent>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => v.toLocaleString()} />
                            <Tooltip
                                formatter={(value: number) => value.toLocaleString()}
                                labelStyle={{ fontWeight: "bold" }}
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No prediction data available
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
