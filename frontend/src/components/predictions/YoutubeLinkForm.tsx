import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ThumbnailUploader from "./ThumbnailUploader";
import { mockFetchMetadataFromYoutube } from "./mockApi";
import { toast } from "sonner";

interface Props {
    onCreate: (payload: any) => void;
    creating: boolean;
    thumbnailFile: File | null;
    setThumbnailFile: (file: File | null) => void;
}

export default function YoutubeLinkForm({
                                            onCreate,
                                            creating,
                                            thumbnailFile,
                                            setThumbnailFile,
                                        }: Props) {
    const [url, setUrl] = useState("");
    const [fetching, setFetching] = useState(false);
    const [meta, setMeta] = useState<any | null>(null);

    const handleFetch = async () => {
        setFetching(true);
        try {
            const data = await mockFetchMetadataFromYoutube(url);
            setMeta(data);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setFetching(false);
        }
    };

    const handleCreate = () => {
        onCreate({
            source_url: url,
            metadata: meta,
            thumbnail: thumbnailFile ? thumbnailFile.name : meta?.thumbnailUrl,
        });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="yt-url">Enter Video URL</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        id="yt-url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
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
                        <ThumbnailUploader file={thumbnailFile} onChange={setThumbnailFile} />
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
                    Paste a YouTube URL and click “Fetch”.
                </div>
            )}
        </div>
    );
}
