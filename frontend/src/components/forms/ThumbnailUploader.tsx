import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { videosService } from "@/services/videos.service"; // ✅ import your wrapped service
import type { ThumbnailUploadResponse } from "@/api"; // generated type

interface Props {
    userId: string;
    file: File | null;
    onChange: (file: File | null, data?: ThumbnailUploadResponse) => void;
}

export default function ThumbnailUploader({ userId, file, onChange }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(
        file ? URL.createObjectURL(file) : null
    );
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFile = async (f: File) => {
        if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
            toast.error("Only JPG, PNG, and WEBP files are allowed");
            return;
        }
        if (f.size > 5 * 1024 * 1024) {
            toast.error("File size must be under 5 MB");
            return;
        }

        try {
            setUploading(true);
            toast.message("Uploading thumbnail...");

            const result = await videosService.uploadThumbnail(f, userId);

            setPreview(result.public_url);
            onChange(f, result);

            toast.success("Thumbnail uploaded successfully");
        } catch (e) {
            console.error(e);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    };

    const handleRemove = () => {
        onChange(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="md:col-span-2 space-y-2">
            <Label>Thumbnail</Label>

            {/* Dropzone when no file */}
            {!file ? (
                <div
                    className={`flex flex-col items-center justify-center rounded-xl p-8 text-center cursor-pointer border-2 border-dashed transition-all
          ${
                        dragActive
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary/40 hover:border-primary/70"
                    }`}
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                >
                    <UploadCloud
                        className={`h-10 w-10 mb-2 transition-opacity ${
                            dragActive ? "opacity-100 text-primary" : "opacity-70"
                        }`}
                    />
                    <p
                        className={`text-sm mb-1 transition-colors ${
                            dragActive ? "text-primary font-medium" : "text-muted-foreground"
                        }`}
                    >
                        {dragActive
                            ? "Drop your image here"
                            : "Click or drag an image here to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground">Max size: 5 MB</p>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                // Compact row preview
                <div className="flex items-center justify-between border border-border rounded-lg p-2 pr-4 bg-secondary/40">
                    <div className="flex items-center gap-3">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Thumbnail preview"
                                className="w-10 h-10 rounded-md object-cover border border-border"
                            />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                        <div className="text-sm truncate max-w-[180px]">{file.name}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Change"}
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            disabled={uploading}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            )}
        </div>
    );
}
