import { create } from "zustand";
import { videosService } from "@/services/videos.service";
import type { VideoResponse } from "@/api";

interface VideoState {
    videos: VideoResponse[];
    loading: boolean;
    error: string | null;
    loadVideos: (force?: boolean) => Promise<void>;
}

export const useVideoStore = create<VideoState>((set, get) => ({
    videos: [],
    loading: false,
    error: null,

    loadVideos: async (force = false) => {
        const { videos } = get();
        if (videos.length > 0 && !force) return; // ✅ Prevent duplicate fetches

        set({ loading: true, error: null });

        try {
            const data = await videosService.getVideos({ limit: 100 });
            set({ videos: data.videos || [] });
        } catch (err: any) {
            console.error("Failed to load videos:", err);
            set({ error: err?.message || "Failed to load videos" });
        } finally {
            set({ loading: false });
        }
    },
}));
