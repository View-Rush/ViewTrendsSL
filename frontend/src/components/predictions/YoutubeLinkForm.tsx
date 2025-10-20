import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { VideosService } from "@/api"; // ✅ use generated API client
import type { VideoResponse } from "@/api";

interface Props {
    onCreate: (payload: any) => void;
    creating: boolean;
    /** ✅ Optional prefill video data (e.g., when coming from /videos page) */
    prefill?: VideoResponse | null;
}

export default function YoutubeLinkForm({ onCreate, creating, prefill }: Props) {
    const [url, setUrl] = useState("");
    const [fetching, setFetching] = useState(false);
    const [meta, setMeta] = useState<any | null>(null);
    const [isPrefilled, setIsPrefilled] = useState(false);

    /**
     * Extracts a YouTube video ID from:
     * - Full links (youtube.com/watch?v=...)
     * - Short links (youtu.be/...)
     * - Embed links
     * - Raw 11-char IDs
     */
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

    /** ✅ Fetch metadata from backend */
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

            setMeta(fetched);
            setIsPrefilled(false);
            toast.success("Fetched metadata successfully!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to fetch metadata");
        } finally {
            setFetching(false);
        }
    };

    /** ✅ Handle create prediction */
    const handleCreate = () => {
        if (!meta) {
            toast.error("No metadata available");
            return;
        }

        onCreate({
            source_url: url,
            metadata: meta,
            thumbnail: meta.thumbnailUrl,
        });
    };

    /** ✅ Auto-prefill if coming from /videos */
    useEffect(() => {
        if (prefill) {
            setMeta({
                title: prefill.title,
                description: prefill.description,
                thumbnailUrl: prefill.thumbnail_url,
                videoId: prefill.video_id,
                duration: prefill.duration,
                publishedAt: prefill.published_at,
                channelId: prefill.channel_id,
                privacyStatus: prefill.privacy_status,
            });

            if (prefill.video_id)
                setUrl(`https://www.youtube.com/watch?v=${prefill.video_id}`);

            setIsPrefilled(true);
        }
    }, [prefill]);

    /** ✅ Update URL text (keep meta visible) */
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        // ⚠️ Don’t clear meta here — user can still see old info until new fetch
    };

    return (
        <div className="space-y-4">
            {/* === Input Section === */}
            <div className="space-y-2">
                <Label htmlFor="yt-url">Enter Video URL or ID</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        id="yt-url"
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="https://youtube.com/watch?v=... or dQw4w9WgXcQ"
                        className="flex-1"
                    />
                    <Button
                        onClick={handleFetch}
                        disabled={!url || fetching}
                        className="w-full sm:w-[160px] px-6 whitespace-nowrap"
                    >
                        {fetching ? "Fetching..." : "Fetch"}
                    </Button>
                </div>
            </div>

            {/* === Metadata Preview === */}
            {meta ? (
                <div className="flex flex-col md:flex-row gap-4 border border-border p-4 rounded-lg transition-all">
                    <div className="w-full md:w-1/3 flex justify-center items-center">
                        <img
                            src={meta.thumbnailUrl || "https://via.placeholder.com/150"}
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
