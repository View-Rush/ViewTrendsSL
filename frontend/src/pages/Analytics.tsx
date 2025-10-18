import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const accuracyData = [
  { month: "Jan", accuracy: 78, predictions: 12 },
  { month: "Feb", accuracy: 82, predictions: 18 },
  { month: "Mar", accuracy: 85, predictions: 22 },
  { month: "Apr", accuracy: 88, predictions: 25 },
  { month: "May", accuracy: 91, predictions: 28 },
  { month: "Jun", accuracy: 89, predictions: 22 },
];

const categoryData = [
  { name: "Education", value: 35, accuracy: 92 },
  { name: "Travel", value: 25, accuracy: 88 },
  { name: "Food", value: 20, accuracy: 85 },
  { name: "Fitness", value: 20, accuracy: 83 },
];

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

const Analytics = () => {
  return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into prediction performance and trends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Accuracy Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                  />
                  <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Predictions Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                  />
                  <Bar dataKey="predictions" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index] }}
                          />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm font-bold text-success">{category.accuracy}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all"
                            style={{
                              width: `${category.accuracy}%`,
                              backgroundColor: COLORS[index],
                            }}
                        />
                      </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Highest Accuracy</h4>
                <p className="text-2xl font-bold mb-1">92%</p>
                <p className="text-sm text-muted-foreground">Education category</p>
              </div>
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <h4 className="font-semibold text-success mb-2">Most Active</h4>
                <p className="text-2xl font-bold mb-1">35%</p>
                <p className="text-sm text-muted-foreground">Education content</p>
              </div>
              <div className="p-4 bg-chart-3/10 border border-chart-3/20 rounded-lg">
                <h4 className="font-semibold text-chart-3 mb-2">Growth Trend</h4>
                <p className="text-2xl font-bold mb-1">+13%</p>
                <p className="text-sm text-muted-foreground">Accuracy improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Analytics;
