import {
    type VideoCreate,
    type VideoUpdate,
    type VideoResponse,
    type VideoListResponse,
    type ThumbnailAnalysisRequest,
    type ThumbnailAnalysisResponse,
    type VideoSourceType,
    VideosService,
} from '@/api';

export const videosService = {
    async getVideos(params?: {
        skip?: number;
        limit?: number;
        channelId?: number | null;
        isDraft?: boolean | null;
        isUploaded?: boolean | null;
        sourceType?: VideoSourceType | null;
        isSynthetic?: boolean | null;
    }): Promise<VideoListResponse> {
        return VideosService.listVideosApiV1VideosGet(
            params?.skip,
            params?.limit ?? 100,
            params?.channelId ?? null,
            params?.isDraft ?? null,
            params?.isUploaded ?? null,
            params?.sourceType ?? null,
            params?.isSynthetic ?? null,
        );
    },

    async getVideo(id: number): Promise<VideoResponse> {
        return VideosService.getVideoApiV1VideosVideoIdGet(id);
    },

    async createVideo(data: VideoCreate): Promise<VideoResponse> {
        return VideosService.createVideoApiV1VideosPost(data);
    },

    async updateVideo(id: number, data: VideoUpdate): Promise<VideoResponse> {
        return VideosService.updateVideoApiV1VideosVideoIdPatch(id, data);
    },

    async deleteVideo(id: number): Promise<void> {
        return VideosService.deleteVideoApiV1VideosVideoIdDelete(id);
    },

    async analyzeThumbnail(data: ThumbnailAnalysisRequest): Promise<ThumbnailAnalysisResponse> {
        return VideosService.analyzeThumbnailApiV1VideosAnalyzeThumbnailPost(data);
    },

    async importYoutubeVideo(videoId: string): Promise<VideoResponse> {
        return VideosService.importYoutubeVideoApiV1VideosImportPost(videoId);
    },
};
