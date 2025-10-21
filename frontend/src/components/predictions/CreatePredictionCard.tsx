import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PredictionModeSelector from "./PredictionModeSelector";
import YoutubeVideoForm from "./YoutubeLinkForm";
import YoutubeMetadataForm from "./YoutubeMetadataForm";
import type { Channel } from "./types";
import FromVideosSection from "@/components/predictions/FromVideosSection";
import type { VideoResponse } from "@/api";
import { videosService } from "@/services/videos.service";
import { predictionsService } from "@/services/predictions.service";
import VideoSummaryCard from "@/components/predictions/VideoSummaryCard";
import { Pencil } from "lucide-react";

export default function CreatePredictionCard({ onCreated }: { onCreated?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const initialMode: "link" | "manual" | "fromVideos" = (() => {
        if (location.pathname.endsWith("/manual")) return "manual";
        if (location.pathname.endsWith("/fromVideos")) return "fromVideos";
        return "link";
    })();

    const [mode, setMode] = useState<"link" | "manual" | "fromVideos">(initialMode);
    const [video, setVideo] = useState<VideoResponse | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [creating, setCreating] = useState(false);
    const [predictedViews, setPredictedViews] = useState<number[] | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [videoTitle, setVideoTitle] = useState<string>("");

    const [manualMetadata, setManualMetadata] = useState<any>(null);

    const videoId = searchParams.get("videoId");

    useEffect(() => {
        if (!videoId) return;
        const fetchVideo = async () => {
            try {
                const v = await videosService.getVideoById(Number(videoId));
                setVideo(v);

                if (v.channel_id) {
                    setSelectedChannel({ id: v.channel_id } as Channel);
                }

                if (v.source_type === "youtube") {
                    setManualMetadata(null);
                    setThumbnailFile(null);
                    setMode("link");
                } else {
                    setMode("manual");
                }

                toast.success(`Loaded video: ${v.title}`);
            } catch {
                toast.error("Failed to load video details");
            }
        };
        fetchVideo();
    }, [videoId]);

    const handleModeChange = (newMode: "link" | "manual" | "fromVideos") => {
        setMode(newMode);
        navigate(`/predictions/create/${newMode}`);

        const hasYoutubeVideo = !!video && video.source_type === "youtube";
        const switchingToManual = newMode === "manual";

        if (hasYoutubeVideo && !switchingToManual) {
            setVideo(null);
            setVideoTitle("");
            setPredictedViews(null);
            setEditMode(false);
            setManualMetadata(null);
            setThumbnailFile(null);
        }
    };

    const handleVideoFetched = (fetchedVideo: VideoResponse) => {
        setVideo(fetchedVideo);
        if (fetchedVideo.channel_id) {
            setSelectedChannel({ id: fetchedVideo.channel_id } as Channel);
        }
        toast.success(`Fetched metadata for ${fetchedVideo.title}`);
    };

    const handleCreatePrediction = async (formPayload: any) => {
        const channelId: string | number | undefined =
            selectedChannel?.id || video?.channel_id;

        if (!channelId) {
            toast.error("Channel not found. Please select or ensure the video has a channel ID.");
            return;
        }

        setCreating(true);
        try {
            const payload = {
                video: {
                    title: formPayload.title || video?.title,
                    description: formPayload.description || video?.description,
                    channel_id: channelId,
                    duration: formPayload.duration || video?.duration,
                    category_id: formPayload.category || video?.category_id,
                    default_language: formPayload.language || video?.default_language,
                    tags: formPayload.tags || video?.tags,
                    published_at: formPayload.published_at || video?.published_at,
                    thumbnail_url: formPayload.thumbnail_url || video?.thumbnail_url,
                    is_draft: true,
                    is_uploaded: false,
                    source_type: (video?.source_type as "manual" | "youtube") || "manual", // ✅ FIXED
                },
                prediction: {
                    video_id: 0,
                    channel_id: channelId,
                    days_after_upload: 0,
                },
            };

            const res = await predictionsService.createVideoAndPrediction(payload as any);
            toast.success(`Prediction created successfully for ${res.video.title}`);

            const predictions = res.prediction.prediction_breakdown;
            if (predictions?.daily_predictions?.length)
                setPredictedViews(predictions.daily_predictions);

            setVideo(res.video);
            setVideoTitle(res.video.title || "");
            setEditMode(true);
            onCreated?.();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Failed to create prediction");
        } finally {
            setCreating(false);
        }
    };

    return (
        <Card className="bg-card border-border">
            <CardHeader className="!flex !flex-row !items-start !justify-between !pb-2">
                <CardTitle className="text-left leading-tight">
                    {editMode ? (
                        <>
                            Predictions for{" "}
                            <span className="text-primary font-semibold">
                "
                                {videoTitle?.length > 40
                                    ? videoTitle.slice(0, 40) + "..."
                                    : videoTitle}
                                "
              </span>
                        </>
                    ) : (
                        "Create New Prediction"
                    )}
                </CardTitle>

                {editMode && (
                    <Button variant="outline" size="sm" onClick={() => setEditMode(false)} className="mt-1">
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                    </Button>
                )}
            </CardHeader>

            <CardContent className="pt-4">
                {!editMode ? (
                    <>
                        <PredictionModeSelector mode={mode} onChange={handleModeChange} />

                        {mode === "link" && (
                            <YoutubeVideoForm
                                onCreate={handleCreatePrediction}
                                creating={creating}
                                onVideoFetched={handleVideoFetched}
                                prefill={video}
                            />
                        )}

                        {mode === "manual" && (
                            <YoutubeMetadataForm
                                onCreate={handleCreatePrediction}
                                creating={creating}
                                selectedChannel={selectedChannel}
                                setSelectedChannel={setSelectedChannel}
                                thumbnailFile={thumbnailFile}
                                setThumbnailFile={setThumbnailFile}
                                prefill={manualMetadata || video}
                            />
                        )}

                        {mode === "fromVideos" && (
                            <FromVideosSection onGoToVideos={() => navigate("/videos", { state: { from: "predictions" } })} />
                        )}
                    </>
                ) : (
                    <VideoSummaryCard video={video} predictedViews={predictedViews} />
                )}
            </CardContent>
        </Card>
    );
}
