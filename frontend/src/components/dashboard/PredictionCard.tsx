import { Card } from "@/components/ui/card";

interface PredictionCardProps {
  channel: string;
  accuracy: number;
  thumbnail?: string;
  status?: string;
}

export function PredictionCard({ channel, accuracy, thumbnail, status }: PredictionCardProps) {
  const getAccuracyColor = (acc: number) => {
    if (acc >= 85) return "text-success";
    if (acc >= 70) return "text-warning";
    return "text-danger";
  };

  return (
      <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
            {thumbnail ? (
                <img src={thumbnail} alt={channel} className="w-full h-full object-cover" />
            ) : (
                <div className="text-muted-foreground text-xs text-center px-2">No thumbnail</div>
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-1">{channel}</h4>
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
          </div>
          {accuracy !== undefined && (
              <div className={`text-lg font-bold ${getAccuracyColor(accuracy)}`}>
                {accuracy > 0 ? '+' : ''}{accuracy.toFixed(1)}%
              </div>
          )}
        </div>
      </Card>
  );
}
