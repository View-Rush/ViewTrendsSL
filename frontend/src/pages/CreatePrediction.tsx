import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { channelsService } from '@/services/channels.service';
import { videosService } from '@/services/videos.service';
import { predictionsService } from '@/services/predictions.service';
import { formatNumber } from '@/lib/utils';
import { ArrowRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type {PredictionResponse} from "@/api";

type Step = 'channel' | 'video' | 'review' | 'result';

export function CreatePrediction() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('channel');
    const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

    const { data: channelsData } = useQuery({
        queryKey: ['channels'],
        queryFn: () => channelsService.getChannels({ limit: 100 }),
    });

    const { data: videosData } = useQuery({
        queryKey: ['videos', selectedChannel],
        queryFn: () =>
            videosService.getVideos({
                channelId: selectedChannel || undefined,
                limit: 100,
            }),
        enabled: !!selectedChannel,
    });

    const createPredictionMutation = useMutation({
        mutationFn: (data: { video_id: number; channel_id: number; days_after_upload: number }) =>
            predictionsService.createPrediction(data),
        onSuccess: (result) => {
            setPrediction(result);
            setStep('result');
            toast.success('Prediction created successfully!');
        },
        onError: () => {
            toast.error('Failed to create prediction');
        },
    });

    const handleCreatePrediction = () => {
        if (selectedChannel && selectedVideo) {
            createPredictionMutation.mutate({
                video_id: selectedVideo,
                channel_id: selectedChannel,
                days_after_upload: 0,
            });
        }
    };

    const selectedChannelData = channelsData?.channels?.find((c) => c.id === selectedChannel);
    const selectedVideoData = videosData?.videos?.find((v) => v.id === selectedVideo);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Prediction</h1>
                    <p className="text-muted-foreground mt-2">
                        Generate a 30-day view count prediction for your video
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {['channel', 'video', 'review', 'result'].map((s) => (
                        <div key={s}>
                            <div
                                className={`p-4 rounded-lg border-2 text-center transition-all ${
                                    step === s
                                        ? 'border-lankan-saffron bg-lankan-saffron/10'
                                        : step > s
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                <div className="text-sm font-medium capitalize">{s}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Step 1: Select Channel */}
                {step === 'channel' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Channel</CardTitle>
                            <CardDescription>Choose the channel for this prediction</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {channelsData?.channels && channelsData.channels.length > 0 ? (
                                <>
                                    <div className="grid gap-4">
                                        {channelsData.channels.map((channel) => (
                                            <button
                                                key={channel.id}
                                                onClick={() => setSelectedChannel(channel.id)}
                                                className={`p-4 border rounded-lg text-left transition-all ${
                                                    selectedChannel === channel.id
                                                        ? 'border-lankan-saffron bg-lankan-saffron/10'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-lankan-saffron'
                                                }`}
                                            >
                                                <p className="font-semibold">{channel.channel_title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatNumber(channel.subscriber_count)} subscribers •{' '}
                                                    {channel.video_count} videos
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={() => setStep('video')}
                                        disabled={!selectedChannel}
                                        className="w-full"
                                        variant="lankan"
                                    >
                                        Next: Select Video
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <Zap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground">No channels connected yet</p>
                                    <Button
                                        onClick={() => navigate('/channels')}
                                        variant="lankan"
                                        className="mt-4"
                                    >
                                        Connect Channel
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Select Video */}
                {step === 'video' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Video</CardTitle>
                            <CardDescription>Choose the video to predict views for</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {videosData?.videos && videosData.videos.length > 0 ? (
                                <>
                                    <div className="grid gap-4">
                                        {videosData.videos.map((video) => (
                                            <button
                                                key={video.id}
                                                onClick={() => setSelectedVideo(video.id)}
                                                className={`p-4 border rounded-lg text-left transition-all ${
                                                    selectedVideo === video.id
                                                        ? 'border-lankan-saffron bg-lankan-saffron/10'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-lankan-saffron'
                                                }`}
                                            >
                                                <p className="font-semibold line-clamp-1">{video.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {video.is_draft ? 'Draft' : `${formatNumber(video.view_count)} views`}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <Button onClick={() => setStep('channel')} variant="outline" className="flex-1">
                                            Back
                                        </Button>
                                        <Button
                                            onClick={() => setStep('review')}
                                            disabled={!selectedVideo}
                                            className="flex-1"
                                            variant="lankan"
                                        >
                                            Next: Review
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <Zap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground">No videos in this channel yet</p>
                                    <Button
                                        onClick={() => navigate('/videos/create')}
                                        variant="lankan"
                                        className="mt-4"
                                    >
                                        Create Video
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Review */}
                {step === 'review' && selectedChannelData && selectedVideoData && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Review Prediction</CardTitle>
                            <CardDescription>
                                Verify the details before generating prediction
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-lankan-saffron/10 rounded-lg border border-lankan-saffron">
                                    <p className="text-sm text-muted-foreground">Channel</p>
                                    <p className="text-lg font-semibold">{selectedChannelData.channel_title}</p>
                                </div>
                                <div className="p-4 bg-lankan-gold/10 rounded-lg border border-lankan-gold">
                                    <p className="text-sm text-muted-foreground">Video</p>
                                    <p className="text-lg font-semibold line-clamp-2">{selectedVideoData.title}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={() => setStep('video')} variant="outline" className="flex-1">
                                    Back
                                </Button>
                                <Button
                                    onClick={handleCreatePrediction}
                                    disabled={createPredictionMutation.isPending}
                                    className="flex-1"
                                    variant="lankan"
                                >
                                    {createPredictionMutation.isPending ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>
                                            Generate Prediction
                                            <Zap className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Result */}
                {step === 'result' && prediction && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-600">Prediction Created!</CardTitle>
                            <CardDescription>Your AI-powered prediction is ready</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-900">
                                    <p className="text-sm text-muted-foreground">Predicted Views</p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {formatNumber(prediction.predicted_views)}
                                    </p>
                                </div>
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-900">
                                    <p className="text-sm text-muted-foreground">Confidence</p>
                                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                        {((prediction.confidence_score || 0.75) * 100).toFixed(0)}%
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-900">
                                    <p className="text-sm text-muted-foreground">Target Date</p>
                                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                        30 days
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={() => navigate(`/predictions/${prediction.id}`)}
                                    className="w-full"
                                    variant="lankan"
                                >
                                    View Prediction Details
                                </Button>
                                <Button
                                    onClick={() => navigate('/dashboard')}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Back to Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}