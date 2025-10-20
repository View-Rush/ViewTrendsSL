import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PredictedViewsChart from "@/components/predictions/PredictedViewsChart.tsx";
import { Pencil } from "lucide-react";

interface VideoSummaryCardProps {
    video: any; // ideally VideoResponse type
    predictedViews?: number[] | null;
    onEdit?: () => void;
}

export default function VideoSummaryCard({ video, predictedViews, onEdit }: VideoSummaryCardProps) {
    if (!video) return null;

    // Helper to cap long titles for header
    const truncatedTitle =
        video.title?.length > 40 ? `${video.title.slice(0, 40)}...` : video.title;

    return (
        <div className="space-y-6">
            {/* ✅ Predicted Views Chart (comes first) */}
            {predictedViews && (
                <PredictedViewsChart
                    videoId={video.id.toString()}
                    predictionData={predictedViews}
                    startDate={video.published_at}
                />
            )}

            {/* ✅ Video Summary Card */}
            <Card className="bg-card border-border">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>
                        Video Summary – <span className="font-normal text-muted-foreground">"{truncatedTitle}"</span>
                    </CardTitle>
                    {onEdit && (
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                        </Button>
                    )}
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Video Details */}
                    <div className="border border-border rounded-lg p-4">
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Title</p>
                                <p className="font-medium">{video.title}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Channel ID</p>
                                <p className="font-medium">{video.channel_id}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Language</p>
                                <p className="font-medium">{video.default_language || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Category</p>
                                <p className="font-medium">{video.category_id || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Duration</p>
                                <p className="font-medium">{video.duration || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Published At</p>
                                <p className="font-medium">
                                    {video.published_at
                                        ? new Date(video.published_at).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        {video.thumbnail_url && (
                            <div className="mt-4 flex flex-col items-start">
                                <p className="text-muted-foreground text-sm mb-1">Thumbnail</p>
                                <img
                                    src={video.thumbnail_url}
                                    alt="Thumbnail"
                                    className="rounded-lg border border-border w-48"
                                />
                            </div>
                        )}

                        {video.tags?.length > 0 && (
                            <div className="mt-3">
                                <p className="text-muted-foreground text-sm mb-1">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {video.tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
