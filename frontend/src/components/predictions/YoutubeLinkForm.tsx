import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { VideosService } from "@/api"; // ✅ use generated API client

interface Props {
    onCreate: (payload: any) => void;
    creating: boolean;
}

export default function YoutubeLinkForm({ onCreate, creating }: Props) {
    const [url, setUrl] = useState("");
    const [fetching, setFetching] = useState(false);
    const [meta, setMeta] = useState<any | null>(null);

    /**
     * ✅ Improved extractVideoId function
     * Handles:
     * - Full YouTube links (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)
     * - Short links (e.g. https://youtu.be/dQw4w9WgXcQ)
     * - Embedded links (e.g. https://www.youtube.com/embed/dQw4w9WgXcQ)
     * - Raw video IDs (e.g. dQw4w9WgXcQ)
     */
    const extractVideoId = (input: string): string | null => {
        // YouTube video ID regex pattern (11 valid characters)
        const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;

        try {
            // Try parsing as a full URL
            const u = new URL(input);

            // Check if it’s a valid YouTube domain
            const isYoutubeDomain =
                u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be");

            if (!isYoutubeDomain) return null;

            // Handle youtube.com/watch?v=...
            if (u.hostname.includes("youtube.com")) {
                const vParam = u.searchParams.get("v");
                if (vParam && videoIdPattern.test(vParam)) return vParam;

                // Handle embedded or share links like /embed/<id>
                const pathParts = u.pathname.split("/");
                const possibleId = pathParts[pathParts.length - 1];
                if (videoIdPattern.test(possibleId)) return possibleId;
            }

            // Handle youtu.be/<id>
            if (u.hostname.includes("youtu.be")) {
                const possibleId = u.pathname.slice(1);
                if (videoIdPattern.test(possibleId)) return possibleId;
            }

            return null;
        } catch {
            // If it's not a valid URL, check if it's directly a video ID
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

            setMeta({
                title: video.title,
                description: video.description,
                thumbnailUrl: video.thumbnail_url,
                videoId: video.video_id,
                duration: video.duration,
                publishedAt: video.published_at,
                channelId: video.channel_id,
                privacyStatus: video.privacy_status,
            });

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

        onCreate({
            source_url: url,
            metadata: meta,
            thumbnail: meta.thumbnailUrl,
        });
    };

    return (
        <div className="space-y-4">
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
                        className="w-full sm:w-[160px] px-6 whitespace-nowrap"
                    >
                        {fetching ? "Fetching..." : "Fetch"}
                    </Button>
                </div>
            </div>

            {meta ? (
                <div className="flex flex-col md:flex-row gap-4 border border-border p-4 rounded-lg">
                    <div className="w-full md:w-1/3 flex justify-center items-center">
                        <img
                            src={meta.thumbnailUrl || "https://via.placeholder.com/150"}
                            alt="Thumbnail"
                            className="rounded-md max-h-40"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">{meta.title}</h3>
                        <p className="text-sm text-muted-foreground">{meta.description}</p>
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
                    Paste a YouTube URL or video ID and click “Fetch”.
                </div>
            )}
        </div>
    );
}
