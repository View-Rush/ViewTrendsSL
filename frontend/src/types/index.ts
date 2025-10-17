// Import from your OpenAPI generated models
export type {
    ChannelResponse as Channel,
    ChannelCreate,
    ChannelUpdate,
    ChannelListResponse,
    VideoResponse as Video,
    VideoCreate,
    VideoUpdate,
    VideoListResponse,
    PredictionResponse as Prediction,
    PredictionCreate,
    PredictionStatus,
    PredictionListResponse,
    PredictionPerformanceResponse as PredictionPerformance,
    UserResponse as User,
    UserCreate,
    UserUpdate,
    Token,
    ThumbnailAnalysisRequest,
    ThumbnailAnalysisResponse,
    UpdateActualViews,
} from '@/api';

// Re-export for convenience
export type {
    UserCreate as RegisterRequest,
    Token as LoginResponse,
} from '@/api';

// Custom types for API requests
export interface LoginRequest {
    username: string;
    password: string;
}

// API Error type
export interface APIError {
    detail: string;
}

// Dashboard stats (computed locally)
export interface DashboardStats {
    total_channels: number;
    total_videos: number;
    total_predictions: number;
    average_accuracy?: number;
    pending_predictions: number;
    completed_predictions: number;
}