import { TrendingUp, Target, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { predictionsService } from "@/services/predictions.service";
import type { PredictionResponse } from "@/api";
import { toast } from "sonner";
import CreatePredictionCard from "@/components/predictions/CreatePredictionCard.tsx";

const Predictions = () => {
  const [predictions, setPredictions] = useState<PredictionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const data = await predictionsService.getPredictions({ limit: 100 });
      setPredictions(data.predictions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to load predictions');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateAccuracy = (predicted: number, actual: number) => {
    return ((1 - Math.abs(predicted - actual) / actual) * 100).toFixed(0);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }
  return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Predictions</h1>
            <p className="text-muted-foreground mt-1">Create and manage video performance predictions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Predictions</p>
                  <h3 className="text-2xl font-bold">{predictions.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/20">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <h3 className="text-2xl font-bold">
                    {predictions.filter(p => p.status === "completed").length}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-chart-3/20">
                  <TrendingUp className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                  <h3 className="text-2xl font-bold">
                    {predictions.filter(p => p.predicted_views && p.actual_views).length > 0
                        ? (predictions
                                .filter(p => p.predicted_views && p.actual_views)
                                .reduce((sum, p) => sum + parseFloat(calculateAccuracy(p.predicted_views!, p.actual_views!)), 0) /
                            predictions.filter(p => p.predicted_views && p.actual_views).length).toFixed(1)
                        : 0}%
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CreatePredictionCard />

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>All Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.map((prediction) => (
                  <div
                      key={prediction.id}
                      className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Video ID: {prediction.video_id}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Created: {new Date(prediction.created_at).toLocaleDateString()}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Predicted: </span>
                            <span className="font-medium text-primary">{prediction.predicted_views?.toLocaleString() || 'N/A'}</span>
                          </div>
                          {prediction.actual_views && (
                              <>
                                <div>
                                  <span className="text-muted-foreground">Actual: </span>
                                  <span className="font-medium">{prediction.actual_views.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Accuracy: </span>
                                  <span className="font-bold text-success">
                              {calculateAccuracy(prediction.predicted_views!, prediction.actual_views)}%
                            </span>
                                </div>
                              </>
                          )}
                        </div>
                      </div>
                      <Badge variant={prediction.status === "completed" ? "default" : "secondary"}>
                        {prediction.status}
                      </Badge>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Predictions;
