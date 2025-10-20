import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PredictionModeSelector from "./PredictionModeSelector";
import YoutubeVideoForm from "./YoutubeLinkForm";
import YoutubeMetadataForm from "./YoutubeMetadataForm.tsx";
import type { Channel } from "./types";
import FromVideosSection from "@/components/predictions/FromVideosSection.tsx";
import type { VideoResponse } from "@/api";
import { videosService } from "@/services/videos.service.ts";
import { predictionsService } from "@/services/predictions.service.ts";
import VideoSummaryCard from "@/components/predictions/VideoSummaryCard.tsx";
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

    const videoId = searchParams.get("videoId");

    useEffect(() => {
        if (!videoId) return;
        const fetchVideo = async () => {
            try {
                const v = await videosService.getVideoById(Number(videoId));
                setVideo(v);
                if (v.source_type === "youtube") setMode("link");
                else setMode("manual");
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
        setVideoTitle('');
        setVideo(null);
        setPredictedViews(null);
        setEditMode(false);
    };

    const handleCreatePrediction = async (formPayload: any) => {
        if (!selectedChannel) {
            toast.error("Please select a channel before creating a prediction");
            return;
        }

        setCreating(true);
        try {
            const payload = {
                video: {
                    title: formPayload.title,
                    description: formPayload.description,
                    channel_id: selectedChannel.id,
                    duration: formPayload.duration,
                    category_id: formPayload.category,
                    default_language: formPayload.language,
                    tags: formPayload.tags,
                    published_at: formPayload.published_at,
                    thumbnail_url: formPayload.thumbnail,
                    is_draft: true,
                    is_uploaded: false,
                    source_type: "manual",
                },
                prediction: {
                    video_id: 0,
                    channel_id: selectedChannel.id,
                    days_after_upload: 0,
                },
            };

            const res = await predictionsService.createVideoAndPrediction(payload);
            toast.success(`Prediction created successfully for ${res.video.title}`);

            const predictions = res.prediction.prediction_breakdown;
            if (predictions && predictions.daily_predictions && Array.isArray(predictions.daily_predictions)) {
                setPredictedViews(predictions.daily_predictions);
            }

            setVideo(res.video);
            setVideoTitle(res.video.title ? res.video.title : "");
            setEditMode(true);
            onCreated?.();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Failed to create prediction");
        } finally {
            setCreating(false);
        }
    };

    const handleGoToVideos = () => {
        navigate("/videos", { state: { from: "predictions" } });
    };

    const handleEdit = () => {
        setEditMode(false);
    };

    return (
        <Card className="bg-card border-border">
            <CardHeader className="!flex !flex-row !items-start !justify-between !pb-2">
                <CardTitle className="text-left leading-tight">
                    {editMode
                        ? (
                            <>
                                Predictions for{" "}
                                <span className="text-primary font-semibold">
            "{videoTitle?.length > 40 ? videoTitle.slice(0, 40) + "..." : videoTitle}"
          </span>
                            </>
                        )
                        : "Create New Prediction"}
                </CardTitle>

                {editMode && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="mt-1"
                    >
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
                                prefill={video}
                            />
                        )}

                        {mode === "fromVideos" && (
                            <FromVideosSection onGoToVideos={handleGoToVideos} />
                        )}
                    </>
                ) : (
                    <VideoSummaryCard
                        video={video}
                        predictedViews={predictedViews}

                    />
                )}
            </CardContent>
        </Card>
    );
}
