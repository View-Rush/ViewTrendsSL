import {type ChannelResponse, ChannelsService, type ChannelUpdate} from '@/api';
import type { ChannelListResponse, ChannelCreate } from '@/types';

export const channelsService = {
    async getChannels(params?: {
        skip?: number;
        limit?: number;
        connected_only?: boolean;
    }): Promise<ChannelListResponse> {
        return ChannelsService.listChannelsApiV1ChannelsGet({
            skip: params?.skip,
            limit: params?.limit,
            connectedOnly: params?.connected_only ?? false,
        });
    },

    async getChannel(id: number): Promise<ChannelResponse> {
        return  ChannelsService.getChannelApiV1ChannelsChannelIdGet({ channelId: id });
    },

    async createChannel(data: ChannelCreate): Promise<ChannelResponse> {
        return  ChannelsService.createChannelApiV1ChannelsPost({ requestBody: data });
    },

    async updateChannel(id: number, data: ChannelUpdate): Promise<ChannelResponse> {
        return ChannelsService.updateChannelApiV1ChannelsChannelIdPatch({
            channelId: id,
            requestBody: data,
        });
    },

    async deleteChannel(id: number): Promise<void> {
        await ChannelsService.deleteChannelApiV1ChannelsChannelIdDelete({ channelId: id });
    },
};
