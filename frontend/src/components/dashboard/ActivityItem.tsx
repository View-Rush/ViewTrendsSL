import type {LucideIcon} from "lucide-react";

interface ActivityItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
    time: string;
    iconColor: string;
}

export function ActivityItem({ icon: Icon, title, description, time, iconColor }: ActivityItemProps) {
    return (
        <div className="flex gap-4 py-3">
            <div className={`p-2 rounded-lg h-fit ${iconColor}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-sm">{title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                <p className="text-xs text-muted-foreground mt-1">{time}</p>
            </div>
        </div>
    );
}
