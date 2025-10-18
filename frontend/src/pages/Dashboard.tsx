import { TrendingUp, Video, Users, Target, Plus, VideoIcon, RefreshCw, PlayCircle, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PredictionCard } from "@/components/dashboard/PredictionCard";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const accuracyData = [
  { name: "Week 1", accuracy: 78 },
  { name: "Week 2", accuracy: 82 },
  { name: "Week 3", accuracy: 85 },
  { name: "Week 4", accuracy: 88 },
];

const Dashboard = () => {
  return (
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
              title="Total Predictions"
              value="127"
              change="+5% from last month"
              isPositive={true}
              icon={Target}
              iconColor="bg-chart-1/20 text-chart-1"
          />
          <StatsCard
              title="Avg. Accuracy"
              value="85.4%"
              change="+2.1% from last month"
              isPositive={true}
              icon={TrendingUp}
              iconColor="bg-chart-2/20 text-chart-2"
          />
          <StatsCard
              title="Active Channels"
              value="8"
              change="+1 new this month"
              isPositive={true}
              icon={Users}
              iconColor="bg-chart-4/20 text-chart-4"
          />
          <StatsCard
              title="Videos Analyzed"
              value="243"
              change="+18 from last month"
              isPositive={true}
              icon={Video}
              iconColor="bg-chart-3/20 text-chart-3"
          />
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Prediction
            </Button>
            <Button variant="outline" className="border-border">
              <VideoIcon className="mr-2 h-4 w-4" />
              Add Video
            </Button>
            <Button variant="outline" className="border-border">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Channel
            </Button>
          </CardContent>
        </Card>

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
              <Button variant="link" className="text-primary">View all</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <PredictionCard channel="Tech Insights Channel" accuracy={8.3} />
              <PredictionCard channel="Travel Vibes" accuracy={-3.7} />
              <PredictionCard channel="Culinary Masters" accuracy={12.1} />
              <PredictionCard channel="FitLife" accuracy={0} status="Pending • 3 days left" />
            </CardContent>
          </Card>
        </div>

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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tech Insights</span>
                  <span className="text-sm font-bold text-success">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Travel Vibes</span>
                  <span className="text-sm font-bold text-success">84%</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">FitLife</span>
                  <span className="text-sm font-bold text-warning">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <Button variant="link" className="text-primary">View all</Button>
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
