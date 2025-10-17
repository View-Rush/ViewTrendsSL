import {
    type VideoCreate,
    type VideoUpdate,
    type VideoResponse,
    type VideoListResponse,
    type ThumbnailAnalysisRequest,
    type ThumbnailAnalysisResponse,
    VideosService,
} from '@/api';

export const videosService = {
    async getVideos(params?: {
        skip?: number;
        limit?: number;
        channelId?: number;
        isDraft?: boolean;
        isUploaded?: boolean;
    }): Promise<VideoListResponse> {
        return VideosService.listVideosApiV1VideosGet({
            skip: params?.skip,
            limit: params?.limit ?? 100,
            channelId: params?.channelId ?? null,
            isDraft: params?.isDraft ?? null,
            isUploaded: params?.isUploaded ?? null,
        });
    },

    async getVideo(id: number): Promise<VideoResponse> {
        return VideosService.getVideoApiV1VideosVideoIdGet({ videoId: id });
    },

    async createVideo(data: VideoCreate): Promise<VideoResponse> {
        return VideosService.createVideoApiV1VideosPost({ requestBody: data });
    },

    async updateVideo(id: number, data: VideoUpdate): Promise<VideoResponse> {
        return VideosService.updateVideoApiV1VideosVideoIdPatch({
            videoId: id,
            requestBody: data,
        });
    },

    async deleteVideo(id: number): Promise<void> {
        await VideosService.deleteVideoApiV1VideosVideoIdDelete({ videoId: id });
    },

    async analyzeThumbnail(data: ThumbnailAnalysisRequest): Promise<ThumbnailAnalysisResponse> {
        return VideosService.analyzeThumbnailApiV1VideosAnalyzeThumbnailPost({
            requestBody: data,
        });
    },
};
