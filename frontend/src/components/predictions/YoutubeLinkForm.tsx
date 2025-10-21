import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {VideoResponse, VideosService} from "@/api";

interface Props {
    onCreate: (payload: any) => void;
    onVideoFetched: (video: VideoResponse) => void;
    creating: boolean;
    prefill?: VideoResponse | null;
}

export default function YoutubeVideoForm({
                                             onCreate,
                                             onVideoFetched,
                                             creating,
                                             prefill,
                                         }: Props) {
    const [url, setUrl] = useState("");
    const [fetching, setFetching] = useState(false);
    const [meta, setMeta] = useState<VideoResponse | null>(null);

    const extractVideoId = (input: string): string | null => {
        const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;
        try {
            const u = new URL(input);
            const isYoutubeDomain =
                u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be");

            if (!isYoutubeDomain) return null;

            if (u.hostname.includes("youtube.com")) {
                const vParam = u.searchParams.get("v");
                if (vParam && videoIdPattern.test(vParam)) return vParam;

                const pathParts = u.pathname.split("/");
                const possibleId = pathParts[pathParts.length - 1];
                if (videoIdPattern.test(possibleId)) return possibleId;
            }

            if (u.hostname.includes("youtu.be")) {
                const possibleId = u.pathname.slice(1);
                if (videoIdPattern.test(possibleId)) return possibleId;
            }

            return null;
        } catch {
            if (videoIdPattern.test(input.trim())) return input.trim();
            return null;
        }
    };

    const handleFetch = async () => {
        const videoId = extractVideoId(url);
        if (!videoId) {
            toast.error("Please enter a valid YouTube video URL or ID.");
            return;
        }

        setFetching(true);
        try {
            const video = await VideosService.importYoutubeVideoApiV1VideosImportPost(videoId);

            const fetched = {
                title: video.title,
                description: video.description,
                thumbnailUrl: video.thumbnail_url,
                videoId: video.video_id,
                duration: video.duration,
                publishedAt: video.published_at,
                channelId: video.channel_id,
                privacyStatus: video.privacy_status,
            };

            setMeta(fetched as any);
            onVideoFetched(video);
            toast.success("Fetched metadata successfully!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to fetch metadata");
        } finally {
            setFetching(false);
        }
    };

    const handleCreate = () => {
        if (!meta) {
            toast.error("No metadata available");
            return;
        }
        onCreate(meta);
    };

    useEffect(() => {
        if (prefill) setMeta(prefill);
    }, [prefill]);

    return (
        <div className="space-y-4">
            {/* Input */}
            <div className="space-y-2">
                <Label htmlFor="yt-url">Enter Video URL or ID</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        id="yt-url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or dQw4w9WgXcQ"
                        className="flex-1"
                    />
                    <Button
                        onClick={handleFetch}
                        disabled={!url || fetching}
                        className="w-full sm:w-[160px]"
                    >
                        {fetching ? "Fetching..." : "Fetch"}
                    </Button>
                </div>
            </div>

            {/* Metadata Preview */}
            {meta ? (
                <div className="flex flex-col md:flex-row gap-4 border border-border p-4 rounded-lg">
                    <div className="w-full md:w-1/3 flex justify-center items-center">
                        <img
                            src={meta.thumbnail_url || "https://via.placeholder.com/150"}
                            alt="Thumbnail"
                            className="rounded-md max-h-40 object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">{meta.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {meta.description}
                        </p>
                        <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={handleCreate}
                            disabled={creating}
                        >
                            {creating ? "Creating..." : "Create Prediction"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="border border-dashed border-border p-4 rounded-md text-muted-foreground">
                    {fetching
                        ? "Fetching video metadata..."
                        : "Paste a YouTube URL or video ID and click “Fetch”."}
                </div>
            )}
        </div>
    );
}
