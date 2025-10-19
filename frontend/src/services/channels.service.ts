import {
    ChannelsService,
    type ChannelResponse,
    type ChannelListResponse,
    type ChannelUpdate,
    type Body_create_channel_api_v1_channels__post,
} from '@/api';

export const channelsService = {
    async getChannels(params?: {
        skip?: number;
        limit?: number;
        connected_only?: boolean;
        type_filter?: string | null;
    }): Promise<ChannelListResponse> {
        return ChannelsService.listChannelsApiV1ChannelsGet(
            params?.skip,
            params?.limit ?? 100,
            params?.connected_only ?? false,
            params?.type_filter
        );
    },

    async getChannel(id: number): Promise<ChannelResponse> {
        return ChannelsService.getChannelApiV1ChannelsChannelIdGet(id);
    },

    async createChannel(formData: Body_create_channel_api_v1_channels__post): Promise<ChannelResponse> {
        // The generated client expects a FormData object
        return ChannelsService.createChannelApiV1ChannelsPost(formData);
    },

    async updateChannel(id: number, data: ChannelUpdate): Promise<ChannelResponse> {
        return ChannelsService.updateChannelApiV1ChannelsChannelIdPatch(id, data);
    },

    async deleteChannel(id: number): Promise<void> {
        return ChannelsService.deleteChannelApiV1ChannelsChannelIdDelete(id);
    },
};
