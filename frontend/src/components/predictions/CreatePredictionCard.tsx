import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import PredictionModeSelector from "./PredictionModeSelector";
import YoutubeLinkForm from "./YoutubeLinkForm";
import ManualMetadataForm from "./ManualMetadataForm";
import { mockCreatePrediction } from "./mockApi";
import type {Channel} from "./types";

export default function CreatePredictionCard({ onCreated }: { onCreated?: () => void }) {
    const [mode, setMode] = useState<"link" | "manual">("link");
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [creating, setCreating] = useState(false);

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

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle>Create New Prediction</CardTitle>
            </CardHeader>
            <CardContent>
                <PredictionModeSelector mode={mode} onChange={setMode} />

                {mode === "link" ? (
                    <YoutubeLinkForm
                        onCreate={handleCreatePrediction}
                        creating={creating}
                        thumbnailFile={thumbnailFile}
                        setThumbnailFile={setThumbnailFile}
                    />
                ) : (
                    <ManualMetadataForm
                        onCreate={handleCreatePrediction}
                        creating={creating}
                        selectedChannel={selectedChannel}
                        setSelectedChannel={setSelectedChannel}
                        thumbnailFile={thumbnailFile}
                        setThumbnailFile={setThumbnailFile}
                    />
                )}
            </CardContent>
        </Card>
    );
}
