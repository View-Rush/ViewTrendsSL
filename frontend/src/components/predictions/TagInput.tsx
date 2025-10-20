import React, { useState } from "react";
import { X } from "lucide-react";

interface Props {
    tags: string[];
    onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: Props) {
    const [inputValue, setInputValue] = useState("");

    const addTag = (val: string) => {
        const cleaned = val.trim();
        if (!cleaned || tags.includes(cleaned)) return;
        onChange([...tags, cleaned]);
        setInputValue("");
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["Enter", "Comma"].includes(e.key)) {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="w-full">
            <label className="block font-medium mb-1">Tags</label>

            <div className="flex flex-wrap items-center gap-2 p-2 border border-border rounded-md bg-secondary focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                {tags.map((tag) => (
                    <div
                        key={tag}
                        className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm text-foreground border border-border shadow-sm"
                    >
                        <span className="font-medium">#{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type and press Enter"
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground text-sm min-w-[100px]"
                />
            </div>
        </div>
    );
}
