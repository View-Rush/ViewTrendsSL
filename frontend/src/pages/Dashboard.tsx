import { useEffect } from "react";
import {
  TrendingUp,
  Video,
  Users,
  Target,
  Plus,
  VideoIcon,
  RefreshCw,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PredictionCard } from "@/components/dashboard/PredictionCard";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useChannelStore } from "@/stores/channelStore";
import { usePredictionStore } from "@/stores/predictionStore";
import { useVideoStore } from "@/stores/videoStore";
import { toast } from "sonner";

const accuracyData = [
  { name: "Week 1", accuracy: 78 },
  { name: "Week 2", accuracy: 82 },
  { name: "Week 3", accuracy: 85 },
  { name: "Week 4", accuracy: 88 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Zustand stores
  const {
    channels,
    loadChannels,
    loading: channelLoading,
    error: channelError,
  } = useChannelStore();

  const {
    predictions,
    loadPredictions,
    loading: predictionLoading,
    error: predictionError,
  } = usePredictionStore();

  const {
    videos,
    loadVideos,
    loading: videoLoading,
    error: videoError,
  } = useVideoStore();

  useEffect(() => {
    // Load all three datasets in parallel
    Promise.all([loadChannels(), loadPredictions(), loadVideos()]).catch((err) => {
      console.error("Dashboard data load failed:", err);
      toast.error("Failed to load dashboard data");
    });
  }, [loadChannels, loadPredictions, loadVideos]);

  // --- Aggregated metrics ---
  const totalChannels = channels.length;
  const totalVideos = videos.length;
  const totalPredictions = predictions.length;
  const completedPredictions = predictions.filter((p) => p.status === "completed");

  // ✅ Make sure return type is string to avoid TS type mismatch errors
  const calculateAccuracy = (predicted: number, actual: number): string => {
    if (actual === 0) return "0";
    return ((1 - Math.abs(predicted - actual) / actual) * 100).toFixed(0);
  };

  const avgAccuracy =
      completedPredictions.filter((p) => p.predicted_views && p.actual_views).length > 0
          ? (
              completedPredictions
                  .filter((p) => p.predicted_views && p.actual_views)
                  .reduce(
                      (sum, p) =>
                          sum +
                          parseFloat(calculateAccuracy(p.predicted_views!, p.actual_views!)),
                      0
                  ) /
              completedPredictions.filter((p) => p.predicted_views && p.actual_views).length
          ).toFixed(1)
          : "0";

  const loading = channelLoading || predictionLoading || videoLoading;

  // --- Error handling ---
  if (channelError || predictionError || videoError) {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-3">
          <p className="text-red-500 font-medium">
            {channelError || predictionError || videoError}
          </p>
          <Button
              onClick={() =>
                  Promise.all([loadChannels(true), loadPredictions(true), loadVideos(true)])
              }
          >
            Retry
          </Button>
        </div>
    );
  }

  return (
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
              title="Total Predictions"
              value={loading ? "..." : totalPredictions.toString()}
              change="+5% from last month"
              isPositive
              icon={Target}
              iconColor="bg-chart-1/20 text-chart-1"
          />
          <StatsCard
              title="Avg. Accuracy"
              value={loading ? "..." : `${avgAccuracy}%`}
              change="+2.1% from last month"
              isPositive
              icon={TrendingUp}
              iconColor="bg-chart-2/20 text-chart-2"
          />
          <StatsCard
              title="Active Channels"
              value={loading ? "..." : totalChannels.toString()}
              change={
                totalChannels > 0
                    ? `Tracking ${totalChannels} channels`
                    : "No data available"
              }
              isPositive
              icon={Users}
              iconColor="bg-chart-4/20 text-chart-4"
          />
          <StatsCard
              title="Videos Analyzed"
              value={loading ? "..." : totalVideos.toLocaleString()}
              change={
                totalVideos > 0
                    ? `${totalVideos.toLocaleString()} total`
                    : "No videos yet"
              }
              isPositive
              icon={Video}
              iconColor="bg-chart-3/20 text-chart-3"
          />
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3 flex-wrap">
            <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/predictions")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Prediction
            </Button>
            <Button
                variant="outline"
                className="border-border"
                onClick={() => navigate("/videos")}
            >
              <VideoIcon className="mr-2 h-4 w-4" />
              Add Video
            </Button>
            <Button
                variant="outline"
                className="border-border"
                onClick={() =>
                    Promise.all([loadChannels(true), loadPredictions(true), loadVideos(true)])
                }
                disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Sync All
            </Button>
          </CardContent>
        </Card>

        {/* Charts & Recent Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prediction Accuracy Chart */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Prediction Accuracy</CardTitle>
              <select className="text-sm bg-secondary border border-border rounded-md px-3 py-1.5">
                <option>Last 30 Days</option>
                <option>Last 60 Days</option>
                <option>Last 90 Days</option>
              </select>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                  />
                  <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Predictions */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Predictions</CardTitle>
              <Button
                  variant="link"
                  className="text-primary"
                  onClick={() => navigate("/predictions")}
              >
                View all
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {predictions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No recent predictions yet.
                  </p>
              ) : (
                  predictions.slice(0, 4).map((p) => (
                      <PredictionCard
                          key={p.id}
                          channel={`Video ${p.video_id}`}
                          accuracy={
                            p.actual_views && p.predicted_views
                                ? parseFloat(
                                    calculateAccuracy(p.predicted_views, p.actual_views)
                                )
                                : 0
                          }
                          status={
                            p.status === "completed"
                                ? "Completed"
                                : "Pending • in progress"
                          }
                      />
                  ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Channel Performance & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Channel Performance */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Channel Performance</CardTitle>
              <select className="text-sm bg-secondary border border-border rounded-md px-3 py-1.5">
                <option>By Accuracy</option>
                <option>By Engagement</option>
                <option>By Growth</option>
              </select>
            </CardHeader>
            <CardContent className="space-y-4">
              {channels.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No channels available. Try syncing channels first.
                  </p>
              ) : (
                  channels.slice(0, 3).map((channel) => (
                      <div key={channel.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {channel.channel_title}
                    </span>
                          <span className="text-sm font-bold text-success">
                      {Math.min(
                          100,
                          ((channel.view_count || 0) / 1_000_000) * 100
                      ).toFixed(0)}
                            %
                    </span>
                        </div>
                        <Progress
                            value={Math.min(
                                100,
                                ((channel.view_count || 0) / 1_000_000) * 100
                            )}
                            className="h-2"
                        />
                      </div>
                  ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <Button
                  variant="link"
                  className="text-primary"
                  onClick={() => navigate("/activities")}
              >
                View all
              </Button>
            </CardHeader>
            <CardContent className="space-y-1">
              <ActivityItem
                  icon={PlayCircle}
                  title="New prediction created"
                  description='You created a prediction for "React Hooks Tutorial"'
                  time="Today, 10:30 AM"
                  iconColor="bg-primary/20 text-primary"
              />
              <ActivityItem
                  icon={CheckCircle}
                  title="Prediction updated"
                  description='Actual views added for "Top 10 Travel Destinations"'
                  time="Yesterday, 3:45 PM"
                  iconColor="bg-success/20 text-success"
              />
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Dashboard;
