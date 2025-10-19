import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThumbnailUploader from "./ThumbnailUploader";
import ChannelSelector from "./ChannelSelector";
import TagInput from "./TagInput";
import type { Channel } from "./types";

interface Props {
    onCreate: (payload: any) => void;
    creating: boolean;
    selectedChannel: Channel | null;
    setSelectedChannel: (c: Channel | null) => void;
    thumbnailFile: File | null;
    setThumbnailFile: (file: File | null) => void;
}

export default function ManualMetadataForm({
                                               onCreate,
                                               creating,
                                               selectedChannel,
                                               setSelectedChannel,
                                               thumbnailFile,
                                               setThumbnailFile,
                                           }: Props) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        publishTime: "",
        duration: "",
        category: "",
        language: "",
    });
    const [tags, setTags] = useState<string[]>([]);

    const handleCreate = () => {
        onCreate({
            channel_id: selectedChannel?.id,
            ...form,
            tags,
            thumbnail: thumbnailFile?.name,
        });
    };

    return (
        <div className="space-y-4">
            <ChannelSelector value={selectedChannel} onChange={setSelectedChannel} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Title</Label>
                    <Input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </div>
                <div>
                    <Label>Publish Time</Label>
                    <Input
                        value={form.publishTime}
                        onChange={(e) => setForm({ ...form, publishTime: e.target.value })}
                        placeholder="YYYY-MM-DDTHH:mm:ssZ"
                    />
                </div>

                <div className="md:col-span-2">
                    <Label>Description</Label>
                    <textarea
                        className="w-full rounded-md border border-border p-2 bg-secondary"
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div>
                    <Label>Video Duration</Label>
                    <Input
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    />
                </div>

                <ThumbnailUploader file={thumbnailFile} onChange={setThumbnailFile} />

                <div>
                    <Label>Category</Label>
                    <Input
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                </div>

                <div>
                    <Label>Language</Label>
                    <Input
                        value={form.language}
                        onChange={(e) => setForm({ ...form, language: e.target.value })}
                    />
                </div>

                <TagInput tags={tags} onChange={setTags} />

                <div className="md:col-span-2 flex justify-end">
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleCreate}
                        disabled={creating}
                    >
                        {creating ? "Creating..." : "Create Prediction"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
