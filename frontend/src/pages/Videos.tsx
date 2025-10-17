import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { videosService } from '@/services/videos.service';
import { formatNumber, formatDate } from '@/lib/utils';
import { Video, Eye, ThumbsUp, MessageCircle, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function Videos() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'uploaded'>('all');

    const { data: videosData, isLoading, refetch } = useQuery({
        queryKey: ['videos', statusFilter],
        queryFn: () =>
            videosService.getVideos({
                isDraft: statusFilter === 'draft' ? true : statusFilter === 'uploaded' ? false : undefined,
                limit: 100,
            }),
    });

    const filteredVideos = videosData?.videos?.filter((v) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                await videosService.deleteVideo(id);
                toast.success('Video deleted');
                refetch();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error('Failed to delete video');
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
                        <p className="text-muted-foreground mt-2">
                            Your video library and uploaded videos
                        </p>
                    </div>
                    <Button variant="lankan" onClick={() => navigate('/videos/create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Video
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search videos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'draft', 'uploaded'].map((filter) => (
                            <Button
                                key={filter}
                                variant={statusFilter === filter ? 'lankan' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter(filter as 'all' | 'draft' | 'uploaded')}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}as 'all' | 'draft' | 'uploaded')
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Videos Grid */}
                {isLoading ? (
                    <LoadingSpinner fullPage />
                ) : filteredVideos && filteredVideos.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredVideos.map((video) => (
                            <Card
                                key={video.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate(`/videos/${video.id}`)}
                            >
                                {/* Thumbnail */}
                                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden relative group">
                                    {video.thumbnail_url ? (
                                        <img
                                            src={video.thumbnail_url}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Video className="h-12 w-12 text-muted-foreground/50" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                            video.is_draft
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                    >
                      {video.is_draft ? 'Draft' : 'Uploaded'}
                    </span>
                                    </div>
                                </div>

                                <CardContent className="p-4 space-y-3">
                                    {/* Title */}
                                    <div>
                                        <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                                        {video.published_at && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDate(video.published_at)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    {video.is_uploaded && (
                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center gap-2">
                                                <Eye className="h-3 w-3 text-blue-500" />
                                                <span>{formatNumber(video.view_count)} views</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ThumbsUp className="h-3 w-3 text-red-500" />
                                                <span>{formatNumber(video.like_count)} likes</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageCircle className="h-3 w-3 text-green-500" />
                                                <span>{formatNumber(video.comment_count)} comments</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/videos/${video.id}`);
                                            }}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(video.id);
                                            }}
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
                            <Video className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium mb-2">No videos yet</p>
                            <p className="text-muted-foreground text-center mb-6">
                                {searchTerm
                                    ? 'No videos match your search'
                                    : 'Create a draft or upload a video to get started'}
                            </p>
                            <Button variant="lankan" onClick={() => navigate('/videos/create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Video
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}