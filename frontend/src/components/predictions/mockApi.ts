import type { Channel } from "./types";

export const mockFetchChannels = async (): Promise<Channel[]> => {
    return new Promise((resolve) =>
        setTimeout(
            () =>
                resolve([
                    { id: "1", name: "Real Channel", type: "real", subscriber_count: 50000 },
                    { id: "2", name: "Dummy Channel A", type: "dummy", subscriber_count: 1200 },
                ]),
            400
        )
    );
};

export const mockFetchMetadataFromYoutube = async (url: string) => {
    return new Promise<any>((resolve, reject) => {
        setTimeout(() => {
            if (!url.includes("youtube")) reject(new Error("Invalid YouTube URL"));
            else
                resolve({
                    title: "Example YouTube Video",
                    description: "Fetched metadata description (mocked)",
                    thumbnailUrl: "https://picsum.photos/300/200",
                });
        }, 700);
    });
};

export const mockSaveDummyChannel = async (c: Channel): Promise<Channel> => {
    return new Promise((resolve) =>
        setTimeout(() => resolve({ ...c, id: c.id || Date.now().toString() }), 400)
    );
};

export const mockCreatePrediction = async (payload: any) => {
    return new Promise((resolve) => setTimeout(() => resolve(payload), 600));
};

// mockApi.ts (add this)
import type { Channel } from "./types";

export const mockFetchChannelDetails = async (id: string): Promise<Channel> => {
    // In a real app you'd fetch channel by id from DB
    return new Promise((resolve) =>
        setTimeout(() => {
            // fake sample data - in real use this must come from DB
            resolve({
                id,
                name: id === "1" ? "Real Channel" : `Channel ${id}`,
                type: id === "1" ? "real" : "dummy",
                subscriber_count: id === "1" ? 120000 : 1500,
                total_views: id === "1" ? 5000000 : 45000,
                video_count: id === "1" ? 200 : 12,
                likes: id === "1" ? 50000 : 1200,
            });
        }, 400)
    );
};
