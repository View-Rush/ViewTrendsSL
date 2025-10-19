import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    file: File | null;
    onChange: (file: File | null) => void;
}

export default function ThumbnailUploader({ file, onChange }: Props) {
    return (
        <div>
            <label htmlFor="thumbnail-upload" className="block mb-1 font-medium">
                Thumbnail
            </label>
            <div className="flex items-center gap-2">
                <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onChange(e.target.files?.[0] || null)}
                />
                <label htmlFor="thumbnail-upload">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Upload
                    </Button>
                </label>
                {file && (
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Thumbnail preview"
                        className="h-12 rounded-md object-cover"
                    />
                )}
            </div>
        </div>
    );
}
