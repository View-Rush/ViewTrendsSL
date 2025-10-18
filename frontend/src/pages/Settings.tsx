import { User, Bell, Key, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" className="bg-secondary border-border" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-3/20">
                  <Bell className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure your alerts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Prediction Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified when predictions complete</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Channel Syncs</Label>
                  <p className="text-sm text-muted-foreground">Alerts for channel data updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive performance summaries</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-2/20">
                  <Key className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <CardTitle>API Access</CardTitle>
                  <CardDescription>Manage your API keys</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">YouTube API Key</Label>
                <Input
                    id="api-key"
                    type="password"
                    defaultValue="••••••••••••••••"
                    className="bg-secondary border-border"
                />
              </div>
              <Button variant="outline" className="w-full border-border">
                Regenerate Key
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-4/20">
                <Palette className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <CardTitle>Model Preferences</CardTitle>
                <CardDescription>Configure prediction model settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Prediction Model</Label>
              <select
                  id="model"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm"
              >
                <option>Transformer Model (Recommended)</option>
                <option>Baseline Model</option>
                <option>Ensemble Model</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence">Minimum Confidence Threshold</Label>
              <Input
                  id="confidence"
                  type="number"
                  defaultValue="75"
                  min="0"
                  max="100"
                  className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground">
                Predictions below this confidence level will be flagged
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">Update Settings</Button>
          </CardContent>
        </Card>
      </div>
  );
};

export default Settings;
