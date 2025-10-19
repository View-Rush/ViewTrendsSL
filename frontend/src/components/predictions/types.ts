import type { ChannelResponse } from "@/api";

export type Channel = ChannelResponse; // Use generated type
export type ChannelType = Channel["type"]; // "real" | "dummy"
