import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Props {
    tags: string[];
    onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: Props) {
    return (
        <div className="md:col-span-2">
            <label className="block font-medium mb-1">Tags</label>
            <Input
                placeholder="Type a tag and press Enter"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        const val = (e.currentTarget as HTMLInputElement).value.trim();
                        if (val && !tags.includes(val)) {
                            onChange([...tags, val]);
                            (e.currentTarget as HTMLInputElement).value = "";
                        }
                    }
                }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        className="flex items-center gap-2"
                        onClick={() => onChange(tags.filter((t) => t !== tag))}
                    >
                        #{tag} ✕
                    </Badge>
                ))}
            </div>
        </div>
    );
}
