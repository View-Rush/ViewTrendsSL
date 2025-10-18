import { Search, Filter, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { videosService } from "@/services/videos.service";
import type { VideoResponse } from "@/api";
import { toast } from "sonner";

const VideoLibrary = () => {
    const [videos, setVideos] = useState<VideoResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        try {
            setLoading(true);
            const data = await videosService.getVideos({ limit: 100 });
            setVideos(data.videos);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to load videos');
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
            <div>
                <h1 className="text-3xl font-bold">Video Library</h1>
                <p className="text-muted-foreground mt-1">Browse and analyze all tracked videos</p>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search videos..."
                        className="pl-10 bg-secondary border-border"
                    />
                </div>
                <Button variant="outline" className="border-border">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <Card key={video.id} className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden group">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-chart-5/20 relative">
                            {video.thumbnail_url ? (
                                <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Video className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                            )}
                            {video.predicted_views && video.actual_views && (
                                <div className="absolute top-2 right-2">
                                    <Badge className={(Math.abs(video.predicted_views - video.actual_views) / video.actual_views) * 100 <= 10 ? "bg-success" : "bg-warning"}>
                                        {((1 - Math.abs(video.predicted_views - video.actual_views) / video.actual_views) * 100).toFixed(0)}% accuracy
                                    </Badge>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {video.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">Channel ID: {video.channel_id}</p>
                            <div className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="text-muted-foreground">Actual Views</p>
                                    <p className="font-bold">{video.actual_views?.toLocaleString() || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Predicted</p>
                                    <p className="font-bold text-primary">{video.predicted_views?.toLocaleString() || 'N/A'}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="mt-3">
                                {video.is_draft ? 'Draft' : video.is_uploaded ? 'Uploaded' : 'Pending'}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VideoLibrary;
