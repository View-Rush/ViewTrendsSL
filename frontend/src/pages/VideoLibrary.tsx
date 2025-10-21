import { useEffect } from "react";
import { Search, Filter, Video, ArrowRight, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useVideoStore } from "@/stores/videoStore";

const VideoLibrary = () => {
    const { videos, loadVideos, loading, error } = useVideoStore();
    const navigate = useNavigate();

    useEffect(() => {
        loadVideos().catch((err) => {
            console.error("Failed to load videos:", err);
            toast.error("Failed to load videos");
        });
    }, [loadVideos]);

    const handleMakePrediction = (video: any) => {
        const route =
            video.source_type === "youtube"
                ? `/predictions/create/link?videoId=${video.id}`
                : `/predictions/create/manual?videoId=${video.id}`;
        navigate(route);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-3">
                <p className="text-red-500 font-medium">⚠️ {error}</p>
                <Button onClick={() => loadVideos(true)}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Video Library</h1>
                    <p className="text-muted-foreground mt-1">
                        Browse and analyze all tracked videos
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="border-border"
                    onClick={() => loadVideos(true)}
                    disabled={loading}
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Sync Videos
                </Button>
            </div>

            {/* Search & Filters */}
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

            {/* Video Grid */}
            {videos.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                    No videos found. Try syncing or adding new ones.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <Card
                            key={video.id}
                            className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden group flex flex-col"
                        >
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-chart-5/20 relative">
                                {video.thumbnail_url ? (
                                    <img
                                        src={video.thumbnail_url}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Video className="h-12 w-12 text-muted-foreground/50" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge
                                        variant="secondary"
                                        className={
                                            video.is_uploaded
                                                ? "bg-success/20"
                                                : video.is_draft
                                                    ? "bg-warning/20"
                                                    : "bg-muted/20"
                                        }
                                    >
                                        {video.is_draft
                                            ? "Draft"
                                            : video.is_uploaded
                                                ? "Uploaded"
                                                : "Pending"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content */}
                            <CardContent className="p-4 flex flex-col flex-grow justify-between">
                                <div>
                                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {video.title || "Untitled Video"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Channel ID: {video.channel_id}
                                    </p>

                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Views</p>
                                            <p className="font-bold">
                                                {video.view_count?.toLocaleString() ?? "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Likes</p>
                                            <p className="font-bold">
                                                {video.like_count?.toLocaleString() ?? "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Comments</p>
                                            <p className="font-bold">
                                                {video.comment_count?.toLocaleString() ?? "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="default"
                                    className="mt-4 w-full flex items-center justify-center gap-2"
                                    onClick={() => handleMakePrediction(video)}
                                >
                                    Make Prediction <ArrowRight className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideoLibrary;
