import { create } from "zustand";
import { predictionsService } from "@/services/predictions.service";
import type { PredictionResponse } from "@/api";

interface PredictionState {
    predictions: PredictionResponse[];
    loading: boolean;
    error: string | null;
    loadPredictions: (force?: boolean) => Promise<void>;
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
    predictions: [],
    loading: false,
    error: null,

    loadPredictions: async (force = false) => {
        const { predictions } = get();
        if (predictions.length > 0 && !force) return; // prevent redundant calls

        set({ loading: true, error: null });

        try {
            const data = await predictionsService.getPredictions({ limit: 100 });
            set({ predictions: data.predictions });
        } catch (err: any) {
            console.error("Failed to load predictions:", err);
            set({ error: err?.message || "Failed to load predictions" });
        } finally {
            set({ loading: false });
        }
    },
}));
