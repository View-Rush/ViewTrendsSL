import { Plus, RefreshCw, Users, Video, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { channelsService } from "@/services/channels.service";
import type { ChannelResponse } from "@/api";
import { toast } from "sonner";

const Channels = () => {
  const [channels, setChannels] = useState<ChannelResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      setLoading(true);
      const data = await channelsService.getChannels({ limit: 100 });
      setChannels(data.channels);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load channels');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-3xl font-bold">Channels</h1>
            <p className="text-muted-foreground mt-1">Manage and track your YouTube channels</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync All
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Channel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Channels</p>
                  <h3 className="text-2xl font-bold">{channels.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/20">
                  <Video className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Videos</p>
                  <h3 className="text-2xl font-bold">
                    {channels.reduce((sum, ch) => sum + (ch.video_count || 0), 0)}
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
                    {channels.length > 0
                        ? (channels.reduce((sum, ch) => sum + (ch.avg_accuracy || 0), 0) / channels.length).toFixed(1)
                        : 0}%
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>All Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channels.map((channel) => (
                  <div key={channel.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-chart-5 flex items-center justify-center text-white font-bold">
                          {channel.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{channel.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">{channel.subscriber_count || 0} subscribers</span>
                            <span className="text-sm text-muted-foreground">{channel.video_count || 0} videos</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={channel.is_connected ? "default" : "secondary"}>
                          {channel.is_connected ? "connected" : "not connected"}
                        </Badge>
                        <Button variant="outline" size="sm" className="border-border">
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Prediction Accuracy</span>
                          <span className="text-sm font-bold text-success">{channel.avg_accuracy || 0}%</span>
                        </div>
                        <Progress value={channel.avg_accuracy || 0} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Total Predictions</span>
                          <span className="text-sm font-bold">{channel.prediction_count || 0}</span>
                        </div>
                        <Progress value={Math.min((channel.prediction_count || 0) * 2, 100)} className="h-2" />
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Channels;
