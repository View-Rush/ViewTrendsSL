import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FromVideosSectionProps {
    onGoToVideos: () => void;
}

export default function FromVideosSection({ onGoToVideos }: FromVideosSectionProps) {
    return (
        <div className="flex flex-col items-center gap-4 py-6">
            <p className="text-sm text-muted-foreground text-center max-w-sm">
                You can pick one of your existing uploaded videos to create a prediction.
            </p>
            <Button
                variant="default"
                onClick={onGoToVideos}
                className="flex items-center gap-2"
            >
                Go to My Videos <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
    );
}
