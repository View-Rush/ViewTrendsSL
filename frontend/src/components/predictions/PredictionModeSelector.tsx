import { Button } from "@/components/ui/button";
import { Video, Link2, FilePlus2 } from "lucide-react";

interface Props {
    mode: "link" | "manual" | "fromVideos";
    onChange: (mode: "link" | "manual" | "fromVideos") => void;
}

export default function PredictionModeSelector({ mode, onChange }: Props) {
    const getVariant = (target: string) => (mode === target ? "default" : "ghost");
    const getBorder = (target: string) =>
        mode === target ? "border border-primary" : "";

    return (
        <div className="flex flex-wrap gap-3 mb-6">
            <Button
                variant={getVariant("link")}
                className={`flex items-center gap-2 ${getBorder("link")}`}
                onClick={() => onChange("link")}
            >
                <Link2 className="w-4 h-4" />
                From YouTube Video
            </Button>

            <Button
                variant={getVariant("manual")}
                className={`flex items-center gap-2 ${getBorder("manual")}`}
                onClick={() => onChange("manual")}
            >
                <FilePlus2 className="w-4 h-4" />
                Add Metadata Manually
            </Button>

            <Button
                variant={getVariant("fromVideos")}
                className={`flex items-center gap-2 ${getBorder("fromVideos")}`}
                onClick={() => onChange("fromVideos")}
            >
                <Video className="w-4 h-4" />
                From My Videos
            </Button>
        </div>
    );
}
