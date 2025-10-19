import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, X, ChevronDown, Save } from "lucide-react";
import { toast } from "sonner";
import type { Channel } from "./types";
import { channelsService } from "@/services/channels.service";
import type { Body_create_channel_api_v1_channels__post } from "@/api";

interface Props {
    value: Channel | null;
    onChange: (channel: Channel | null) => void;
}

interface LocalChannelForm {
    channel_title: string;
    subscriber_count: number;
    view_count: number;
    video_count: number;
    type: "dummy" | "real";
}

export default function ChannelSelector({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<"idle" | "adding" | "editing">("idle");
    const [localEdit, setLocalEdit] = useState<LocalChannelForm | null>(null);
    const [selectedDetails, setSelectedDetails] = useState<Channel | null>(null);
    const [saving, setSaving] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        loadChannels();
        function onDoc(e: MouseEvent) {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    useEffect(() => {
        if (!value) {
            setSelectedDetails(null);
            setMode("idle");
            return;
        }
        fetchDetails(value.id);
    }, [value?.id]);

    const loadChannels = async () => {
        setLoading(true);
        try {
            const data = await channelsService.getChannels();
            setChannels(data.channels);
        } catch {
            toast.error("Failed to load channels");
        } finally {
            setLoading(false);
        }
    };

    const fetchDetails = async (id: string | number) => {
        try {
            const details = await channelsService.getChannel(Number(id));
            setSelectedDetails(details);
            setMode("idle");
        } catch {
            toast.error("Failed to fetch channel details");
        }
    };

    const filtered = useMemo(() => {
        if (!query) return channels;
        return channels.filter((c) =>
            c.channel_title.toLowerCase().includes(query.toLowerCase())
        );
    }, [channels, query]);

    const handleSelect = (c: Channel) => {
        onChange(c);
        setOpen(false);
        fetchDetails(c.id);
    };

    const startAddNew = () => {
        setOpen(false);
        setMode("adding");
        setLocalEdit({
            channel_title: "",
            type: "dummy",
            subscriber_count: 0,
            view_count: 0,
            video_count: 0,
        });
        setSelectedDetails(null);
    };

    const startEdit = () => {
        if (!selectedDetails) return;
        setMode("editing");
        setLocalEdit({
            channel_title: selectedDetails.channel_title,
            subscriber_count: selectedDetails.subscriber_count ?? 0,
            view_count: selectedDetails.view_count ?? 0,
            video_count: selectedDetails.video_count ?? 0,
            type: selectedDetails.type,
        });
    };

    const cancelEditOrAdd = () => {
        setMode("idle");
        setLocalEdit(null);
        if (value) fetchDetails(value.id);
    };

    const handleSave = async () => {
        if (!localEdit?.channel_title?.trim()) {
            toast.error("Channel name is required");
            return;
        }

        setSaving(true);
        try {
            if (mode === "adding") {
                const payload: Body_create_channel_api_v1_channels__post = {
                    type: localEdit.type,
                    channel_title: localEdit.channel_title.trim(),
                    subscriber_count: localEdit.subscriber_count,
                    video_count: localEdit.video_count,
                    view_count: localEdit.view_count,
                };

                const saved = await channelsService.createChannel(payload);
                toast.success("Channel created");
                setChannels((prev) => [saved, ...prev]);
                onChange(saved);
                setSelectedDetails(saved);
            } else if (mode === "editing" && selectedDetails) {
                const updateData = {
                    channel_title: localEdit.channel_title.trim(),
                    subscriber_count: localEdit.subscriber_count,
                    video_count: localEdit.video_count,
                    view_count: localEdit.view_count,
                };

                const updated = await channelsService.updateChannel(
                    selectedDetails.id,
                    updateData
                );
                toast.success("Channel updated");
                setChannels((prev) =>
                    prev.map((p) => (p.id === updated.id ? updated : p))
                );
                onChange(updated);
                setSelectedDetails(updated);
            }

            setMode("idle");
            setLocalEdit(null);
        } catch (error) {
            console.error(error);
            toast.error(
                mode === "adding" ? "Failed to save channel" : "Failed to update channel"
            );
        } finally {
            setSaving(false);
        }
    };

    const NumericField = ({
                              label,
                              value,
                              editable,
                              onChange,
                          }: {
        label: string;
        value?: number;
        editable?: boolean;
        onChange?: (v: number) => void;
    }) => (
        <div>
            <Label className="text-xs">{label}</Label>
            {editable ? (
                <input
                    type="number"
                    className="w-full rounded-md border border-border p-2 bg-secondary"
                    value={value ?? 0}
                    onChange={(e) => onChange?.(Number(e.target.value))}
                />
            ) : (
                <div className="mt-1 text-foreground font-medium">
                    {(value ?? 0).toLocaleString()}
                </div>
            )}
        </div>
    );

    return (
        <div ref={containerRef} className="space-y-3 relative">
            {/* Search / dropdown */}
            <div className="relative">
                <Input
                    placeholder="Search or select channel"
                    value={query || value?.channel_title || ""}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className="pr-10"
                />
                <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer transition-transform ${
                        open ? "rotate-180" : "rotate-0"
                    }`}
                    onClick={() => setOpen((s) => !s)}
                />

                {open && (
                    <div className="absolute left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-30 max-h-64 overflow-auto">
                        <div className="p-2 border-b border-border bg-muted/50 sticky top-0">
                            <Button
                                variant="ghost"
                                className="w-full justify-start hover:bg-primary/10"
                                onClick={startAddNew}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add new channel
                            </Button>
                        </div>
                        {loading ? (
                            <div className="p-3 text-sm text-muted-foreground">
                                Loading...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="p-3 text-sm text-muted-foreground">
                                No channels found
                            </div>
                        ) : (
                            filtered.map((c) => (
                                <div
                                    key={c.id}
                                    onClick={() => handleSelect(c)}
                                    className={`p-3 cursor-pointer flex items-center justify-between transition-colors ${
                                        value?.id === c.id
                                            ? "bg-primary/10 border-l-2 border-primary"
                                            : "hover:bg-muted/50"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="font-medium">{c.channel_title}</div>
                                        <Badge
                                            variant={c.type === "real" ? "secondary" : "outline"}
                                        >
                                            {c.type}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {c.subscriber_count?.toLocaleString() || "-"} subs
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Add or edit section */}
            {mode === "adding" && localEdit ? (
                <div className="p-4 border border-border rounded-md bg-muted/5 space-y-3">
                    <div className="font-semibold">Add New Channel</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3">
                            <Label>Name</Label>
                            <Input
                                value={localEdit.channel_title}
                                onChange={(e) =>
                                    setLocalEdit({ ...localEdit, channel_title: e.target.value })
                                }
                            />
                        </div>
                        <NumericField
                            label="Subscribers"
                            editable
                            value={localEdit.subscriber_count}
                            onChange={(v) =>
                                setLocalEdit({ ...localEdit, subscriber_count: v })
                            }
                        />
                        <NumericField
                            label="Total Views"
                            editable
                            value={localEdit.view_count}
                            onChange={(v) => setLocalEdit({ ...localEdit, view_count: v })}
                        />
                        <NumericField
                            label="Video Count"
                            editable
                            value={localEdit.video_count}
                            onChange={(v) => setLocalEdit({ ...localEdit, video_count: v })}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={cancelEditOrAdd}>
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            ) : selectedDetails ? (
                <div className="p-4 border border-border rounded-md bg-card/50 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="font-semibold">{selectedDetails.channel_title}</div>
                            <div className="text-xs text-muted-foreground">
                                {selectedDetails.type === "real"
                                    ? "Real Channel"
                                    : "Dummy Channel"}
                            </div>
                        </div>
                        {selectedDetails.type === "dummy" && mode !== "editing" && (
                            <Button variant="outline" onClick={startEdit}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <NumericField
                            label="Subscribers"
                            value={
                                mode === "editing"
                                    ? localEdit?.subscriber_count
                                    : selectedDetails.subscriber_count
                            }
                            editable={mode === "editing"}
                            onChange={(v) =>
                                setLocalEdit({
                                    ...localEdit!,
                                    subscriber_count: v,
                                })
                            }
                        />
                        <NumericField
                            label="Total Views"
                            value={
                                mode === "editing"
                                    ? localEdit?.view_count
                                    : selectedDetails.view_count
                            }
                            editable={mode === "editing"}
                            onChange={(v) =>
                                setLocalEdit({
                                    ...localEdit!,
                                    view_count: v,
                                })
                            }
                        />
                        <NumericField
                            label="Video Count"
                            value={
                                mode === "editing"
                                    ? localEdit?.video_count
                                    : selectedDetails.video_count
                            }
                            editable={mode === "editing"}
                            onChange={(v) =>
                                setLocalEdit({
                                    ...localEdit!,
                                    video_count: v,
                                })
                            }
                        />
                    </div>

                    {mode === "editing" && (
                        <div className="flex justify-end gap-2 mt-3">
                            <Button variant="ghost" onClick={cancelEditOrAdd}>
                                <X className="h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-4 border border-dashed border-border rounded-md text-sm text-muted-foreground">
                    Select a channel to view details or create a new one.
                </div>
            )}
        </div>
    );
}
