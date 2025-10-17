import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { channelsService } from '@/services/channels.service';
import { formatNumber } from '@/lib/utils';
import { Users, Video, Eye, RefreshCw, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function Channels() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { data: channelsData, isLoading, refetch } = useQuery({
        queryKey: ['channels'],
        queryFn: () => channelsService.getChannels({ limit: 100 }),
    });

    const handleSync = async () => {
        setIsRefreshing(true);
        try {
            // TODO: Implement channel sync logic
            // await channelsService.syncChannel();
            // toast.success('Channel synced successfully!');
            // await refetch();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Failed to sync channel');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this channel?')) {
            try {
                await channelsService.deleteChannel(id);
                toast.success('Channel deleted');
                await refetch();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error('Failed to delete channel');
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Channels</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your connected YouTube channels
                        </p>
                    </div>
                    <Button variant="lankan" onClick={handleSync} disabled={isRefreshing}>
                        <Plus className="h-4 w-4 mr-2" />
                        {isRefreshing ? 'Syncing...' : 'Connect Channel'}
                    </Button>
                </div>

                {/* Channels Grid */}
                {isLoading ? (
                    <LoadingSpinner fullPage />
                ) : channelsData?.channels && channelsData.channels.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {channelsData.channels.map((channel) => (
                            <Card key={channel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Thumbnail */}
                                {channel.thumbnail_url && (
                                    <div className="h-32 bg-gradient-to-br from-lankan-saffron/20 to-lankan-gold/20 overflow-hidden">
                                        <img
                                            src={channel.thumbnail_url}
                                            alt={channel.channel_title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <CardContent className="p-6">
                                    {/* Title */}
                                    <h3 className="font-semibold text-lg truncate">{channel.channel_title}</h3>
                                    {channel.custom_url && (
                                        <p className="text-sm text-muted-foreground truncate">@{channel.custom_url}</p>
                                    )}

                                    {/* Stats */}
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-lankan-saffron" />
                                            <span>{formatNumber(channel.subscriber_count)} subscribers</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Video className="h-4 w-4 text-lankan-gold" />
                                            <span>{channel.video_count} videos</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Eye className="h-4 w-4 text-blue-500" />
                                            <span>{formatNumber(channel.view_count)} total views</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleSync()}
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Sync
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(channel.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium mb-2">No channels connected yet</p>
                            <p className="text-muted-foreground text-center mb-6">
                                Connect your YouTube channel to start making predictions
                            </p>
                            <Button variant="lankan" onClick={handleSync}>
                                <Plus className="h-4 w-4 mr-2" />
                                Connect Your First Channel
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}