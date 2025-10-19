import { Button } from "@/components/ui/button";

interface Props {
    mode: "link" | "manual";
    onChange: (mode: "link" | "manual") => void;
}

export default function PredictionModeSelector({ mode, onChange }: Props) {
    return (
        <div className="flex gap-4 mb-6">
            <Button
                variant={mode === "link" ? "default" : "ghost"}
                className={mode === "link" ? "border border-red-400" : ""}
                onClick={() => onChange("link")}
            >
                Use YouTube Link
            </Button>
            <Button
                variant={mode === "manual" ? "default" : "ghost"}
                className={mode === "manual" ? "border border-red-400" : ""}
                onClick={() => onChange("manual")}
            >
                Add Metadata Manually
            </Button>
        </div>
    );
}
