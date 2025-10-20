import {useEffect, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import PredictionModeSelector from "./PredictionModeSelector";
import YoutubeVideoForm from "./YoutubeLinkForm";
import ManualMetadataForm from "./ManualMetadataForm";
import { mockCreatePrediction } from "./mockApi";
import type {Channel} from "./types";
import FromVideosSection from "@/components/predictions/FromVideosSection.tsx";
import type {VideoResponse} from "@/api";
import {videosService} from "@/services/videos.service.ts";

export default function CreatePredictionCard({ onCreated }: { onCreated?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const initialMode: "link" | "manual" | "fromVideos" = (() => {
        if (location.pathname.endsWith("/manual")) return "manual";
        if (location.pathname.endsWith("/fromVideos")) return "fromVideos";
        return "link"; // default
    })();

    const [mode, setMode] = useState<"link" | "manual" | "fromVideos">(initialMode);
    const [video, setVideo] = useState<VideoResponse | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [creating, setCreating] = useState(false)

    const videoId = searchParams.get("videoId");

    useEffect(() => {
        if (!videoId) return;

        const fetchVideo = async () => {
            try {
                const v = await videosService.getVideoById(Number(videoId));
                setVideo(v);

                // Auto-switch mode if necessary
                if (v.source_type === "youtube") setMode("link");
                else setMode("manual");

                toast.success(`Loaded video: ${v.title}`);
            } catch (error) {
                toast.error("Failed to load video details");
            }
        };

        fetchVideo();
    }, [videoId]);

    useEffect(() => {
        if (location.pathname.endsWith("/manual") && mode !== "manual") setMode("manual");
        else if (location.pathname.endsWith("/fromVideos") && mode !== "fromVideos") setMode("fromVideos");
        else if (location.pathname.endsWith("/link") && mode !== "link") setMode("link");
    }, [location.pathname]);

    const handleModeChange = (newMode: "link" | "manual" | "fromVideos") => {
        setMode(newMode);
        navigate(`/predictions/create/${newMode}`);
    };

    const handleCreatePrediction = async (payload: any) => {
        setCreating(true);
        try {
            await mockCreatePrediction(payload);
            toast.success("Prediction created successfully");
            onCreated?.();
        } catch {
            toast.error("Failed to create prediction");
        } finally {
            setCreating(false);
        }
    };

    const handleGoToVideos = () => {
        // You can add state or query params here if needed
        navigate("/videos", { state: { from: "predictions" } });
    };

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle>Create New Prediction</CardTitle>
            </CardHeader>
            <CardContent>
                <PredictionModeSelector mode={mode} onChange={handleModeChange} />
                    {mode === "link" && (
                        <YoutubeVideoForm
                            onCreate={handleCreatePrediction}
                            creating={creating}
                            prefill={video}
                        />
                    )}

                    {mode === "manual" && (
                        <ManualMetadataForm
                            onCreate={handleCreatePrediction}
                            creating={creating}
                            selectedChannel={selectedChannel}
                            setSelectedChannel={setSelectedChannel}
                            thumbnailFile={thumbnailFile}
                            setThumbnailFile={setThumbnailFile}
                            prefill={video}
                        />
                    )}

                    {mode === "fromVideos" && <FromVideosSection onGoToVideos={handleGoToVideos} />}

            </CardContent>
        </Card>
    );
}
