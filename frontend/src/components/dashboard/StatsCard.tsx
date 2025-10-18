import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  iconColor: string;
}

export function StatsCard({ title, value, change, isPositive, icon: Icon, iconColor }: StatsCardProps) {
  return (
      <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <h3 className="text-3xl font-bold mb-2">{value}</h3>
            <div className="flex items-center gap-1">
              {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-success" />
              ) : (
                  <ArrowDownRight className="h-4 w-4 text-danger" />
              )}
              <span className={`text-sm ${isPositive ? 'text-success' : 'text-danger'}`}>
              {change}
            </span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <Button variant="link" className="mt-4 px-0 text-primary">
          View
        </Button>
      </Card>
  );
}
