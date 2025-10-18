import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { TrendingUp, PlayCircle, BarChart3, Sparkles, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [videoUrl, setVideoUrl] = useState('');
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        if (!videoUrl) return;

        setLoading(true);
        // Simulate prediction
        setTimeout(() => {
            setPrediction({
                estimatedViews: Math.floor(Math.random() * 100000) + 10000,
                confidence: Math.floor(Math.random() * 30) + 70,
                trend: Math.random() > 0.5 ? 'up' : 'stable',
                category: 'Entertainment',
            });
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
            {/* Header */}
            <header className="border-b border-border/40 backdrop-blur-sm bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Youtube className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">
                            ViewTrendsSL
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/auth">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                        <Link to="/auth">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-foreground/80">AI-Powered YouTube Analytics</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                        Predict Your Video's Success
                        <span className="block bg-gradient-to-r from-primary via-chart-5 to-chart-2 bg-clip-text text-transparent">
              Before You Hit Publish
            </span>
                    </h2>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Leverage machine learning to forecast YouTube views, optimize your content strategy,
                        and stay ahead of trends in the Sri Lankan YouTube ecosystem.
                    </p>

                    {/* Demo Prediction */}
                    <Card className="p-8 bg-card/50 backdrop-blur border-border/50 shadow-xl">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-left">Try It Now - Free Demo</h3>
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Paste a YouTube video URL..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={handlePredict} disabled={loading || !videoUrl} size="lg">
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
                                            Analyzing...
                                        </div>
                                    ) : (
                                        <>
                                            <TrendingUp className="h-4 w-4 mr-2" />
                                            Predict
                                        </>
                                    )}
                                </Button>
                            </div>

                            {prediction && (
                                <div className="mt-6 p-6 rounded-lg bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                        Prediction Results
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Estimated Views</p>
                                            <p className="text-2xl font-bold text-primary">
                                                {prediction.estimatedViews.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Confidence</p>
                                            <p className="text-2xl font-bold text-success">{prediction.confidence}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Trend</p>
                                            <p className="text-2xl font-bold capitalize">{prediction.trend}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Category</p>
                                            <p className="text-2xl font-bold">{prediction.category}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-border/50">
                                        <p className="text-sm text-muted-foreground text-center">
                                            Sign up to unlock detailed analytics, track accuracy, and get recommendations
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <h3 className="text-3xl font-bold text-center mb-12">Powerful Features</h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <Card className="p-6 bg-card/30 backdrop-blur border-border/50">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Accurate Predictions</h4>
                        <p className="text-muted-foreground">
                            ML-powered forecasts that analyze title, category, publish time, and historical trends
                        </p>
                    </Card>

                    <Card className="p-6 bg-card/30 backdrop-blur border-border/50">
                        <div className="h-12 w-12 rounded-lg bg-chart-5/10 flex items-center justify-center mb-4">
                            <PlayCircle className="h-6 w-6 text-chart-5" />
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Channel Insights</h4>
                        <p className="text-muted-foreground">
                            Track multiple channels, compare performance, and identify winning strategies
                        </p>
                    </Card>

                    <Card className="p-6 bg-card/30 backdrop-blur border-border/50">
                        <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                            <BarChart3 className="h-6 w-6 text-chart-2" />
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Deep Analytics</h4>
                        <p className="text-muted-foreground">
                            Comprehensive dashboards showing accuracy trends, model performance, and more
                        </p>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20">
                <Card className="p-12 bg-gradient-to-r from-primary/10 via-chart-5/10 to-chart-2/10 border-primary/20">
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                        <h3 className="text-3xl font-bold">Ready to Optimize Your Content?</h3>
                        <p className="text-lg text-muted-foreground">
                            Join content creators who are already using ViewTrendsSL to boost their YouTube success
                        </p>
                        <Link to="/auth">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Start Predicting Now
                            </Button>
                        </Link>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 py-8">
                <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
                    <p>&copy; 2025 ViewTrendsSL. Built for the Sri Lankan YouTube ecosystem.</p>
                </div>
            </footer>
        </div>
    );
}
