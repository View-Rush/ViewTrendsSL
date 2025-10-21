// src/stores/channelStore.ts
import { create } from "zustand";
import { channelsService } from "@/services/channels.service";
import type { ChannelResponse } from "@/api";

interface ChannelState {
    channels: ChannelResponse[];
    loading: boolean;
    error: string | null;
    loadChannels: (force?: boolean) => Promise<void>;
}

export const useChannelStore = create<ChannelState>((set, get) => ({
    channels: [],
    loading: false,
    error: null,

    loadChannels: async (force = false) => {
        const { channels, loading } = get();
        if (channels.length > 0 && !force) return;

        set({ loading: true, error: null });

        try {
            const data = await channelsService.getChannels({ limit: 100 });
            set({ channels: data.channels });
        } catch (err: any) {
            set({ error: err?.message || "Failed to load channels" });
        } finally {
            set({ loading: false });
        }
    },
}));
