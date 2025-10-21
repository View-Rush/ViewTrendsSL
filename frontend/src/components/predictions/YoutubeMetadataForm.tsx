import {useEffect, useState} from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import ThumbnailUploader from "../forms/ThumbnailUploader.tsx";
import ChannelSelector from "./ChannelSelector";
import TagInput from "./TagInput";
import type { Channel } from "./types";
import { format } from "date-fns";

interface Props {
    onCreate: (payload: any) => void;
    creating: boolean;
    selectedChannel: Channel | null;
    setSelectedChannel: (c: Channel | null) => void;
    thumbnailFile: File | null;
    setThumbnailFile: (file: File | null) => void;
    prefill?: any;
}

export default function YoutubeMetadataForm({
                                               onCreate,
                                               creating,
                                               selectedChannel,
                                               setSelectedChannel,
                                               thumbnailFile,
                                               setThumbnailFile,
                                               prefill,
                                           }: Props) {
    const [form, setForm] = useState({
        title: prefill?.title || "",
        description: prefill?.description || "",
        useDayOfWeek: false,
        publishDate: prefill?.published_at ? new Date(prefill.published_at) : new Date(),
        dayOfWeek: "",
        publishTime: prefill?.published_at
            ? new Date(prefill.published_at)
            : new Date(),
        durationMinutes: 0,
        durationSeconds: 0,
        category: prefill?.category_id || "",
        language: prefill?.default_language || "",
    });

    const [tags, setTags] = useState<string[]>(prefill?.tags || []);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(prefill?.thumbnail_url || null);

    /** Convert duration to PT#M#S */
    const formatDuration = (m: number, s: number) => `PT${m}M${s}S`;

    const handleCreate = () => {
        if (!form.title.trim()) {
            toast.error("Title is required");
            return;
        }

        const datePart = !form.useDayOfWeek
            ? format(form.publishDate, "yyyy-MM-dd")
            : null;
        const timePart = format(form.publishTime, "HH:mm");

        const published_at = datePart ? `${datePart}T${timePart}:00Z` : null;

        onCreate({
            channel_id: selectedChannel?.id,
            title: form.title,
            description: form.description,
            published_at,
            day_of_week: form.useDayOfWeek ? form.dayOfWeek : null,
            duration: formatDuration(form.durationMinutes, form.durationSeconds),
            category: form.category,
            language: form.language,
            tags,
            thumbnail_url: thumbnailUrl || prefill?.thumbnail_url || null,
        });
    };

    useEffect(() => {
        if (prefill) {
            setForm({
                title: prefill.title || "",
                description: prefill.description || "",
                useDayOfWeek: false,
                publishDate: prefill.published_at ? new Date(prefill.published_at) : new Date(),
                dayOfWeek: "",
                publishTime: prefill.published_at ? new Date(prefill.published_at) : new Date(),
                durationMinutes: prefill.duration
                    ? parseInt(prefill.duration.match(/PT(\d+)M/)?.[1] || "0")
                    : 0,
                durationSeconds: prefill.duration
                    ? parseInt(prefill.duration.match(/PT\d+M(\d+)S/)?.[1] || "0")
                    : 0,
                category: prefill.category_id || "",
                language: prefill.default_language || "",
            });
            setTags(prefill.tags || []);
            setSelectedChannel(prefill.channel_id || "");
        }
    }, [prefill]);


    return (
        <div className="space-y-6">
            <ChannelSelector
                value={prefill?.channel_id || selectedChannel}
                onChange={setSelectedChannel}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                    <Label>Title</Label>
                    <Input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Enter video title"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <Label>Description</Label>
                    <textarea
                        className="w-full rounded-md border border-border p-2 bg-secondary resize-none"
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Write a short description about this video"
                    />
                </div>

                {/* Date vs Day Mode */}
                <div className="md:col-span-2 flex items-center justify-between border border-border rounded-lg p-3">
                    <div className="flex flex-col">
                        <Label>Scheduling Mode</Label>
                        <p className="text-sm text-muted-foreground">
                            Switch between selecting an exact date or a day of the week
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Date</span>
                        <Switch
                            checked={form.useDayOfWeek}
                            onCheckedChange={(checked) =>
                                setForm({ ...form, useDayOfWeek: checked })
                            }
                        />
                        <span className="text-sm">Day</span>
                    </div>
                </div>

                {/* Publish Date or Day */}
                {!form.useDayOfWeek ? (
                    <div>
                        <Label>Publish Date</Label>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                >
                                    {format(form.publishDate, "PPP")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                                <Calendar
                                    mode="single"
                                    selected={form.publishDate}
                                    onSelect={(date) => {
                                        if (date) setForm({ ...form, publishDate: date });
                                        setCalendarOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <div>
                        <Label>Day of the Week</Label>
                        <Select
                            value={form.dayOfWeek}
                            onValueChange={(value) => setForm({ ...form, dayOfWeek: value })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a day" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monday">Monday</SelectItem>
                                <SelectItem value="tuesday">Tuesday</SelectItem>
                                <SelectItem value="wednesday">Wednesday</SelectItem>
                                <SelectItem value="thursday">Thursday</SelectItem>
                                <SelectItem value="friday">Friday</SelectItem>
                                <SelectItem value="saturday">Saturday</SelectItem>
                                <SelectItem value="sunday">Sunday</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Time Picker (Always Present) */}
                <div>
                    <Label>Publish Time</Label>
                    <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                <span>{format(form.publishTime, "HH:mm")}</span>
                                <Clock className="h-4 w-4 opacity-70" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                            <div className="flex flex-col gap-2 p-2">
                                <Input
                                    type="time"
                                    value={format(form.publishTime, "HH:mm")}
                                    onChange={(e) => {
                                        const [hours, minutes] = e.target.value.split(":");
                                        const updated = new Date(form.publishTime);
                                        updated.setHours(parseInt(hours));
                                        updated.setMinutes(parseInt(minutes));
                                        setForm({ ...form, publishTime: updated });
                                    }}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTimeOpen(false)}
                                >
                                    Set Time
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Duration */}
                <div className="flex gap-3 md:col-span-2">
                    <div className="flex-1">
                        <Label>Duration (minutes)</Label>
                        <Input
                            type="number"
                            min={0}
                            value={form.durationMinutes}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    durationMinutes: parseInt(e.target.value || "0"),
                                })
                            }
                        />
                    </div>
                    <div className="flex-1">
                        <Label>Duration (seconds)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={59}
                            value={form.durationSeconds}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    durationSeconds: parseInt(e.target.value || "0"),
                                })
                            }
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <Label>Category</Label>
                    <Select
                        value={form.category}
                        onValueChange={(value) => setForm({ ...form, category: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="music">🎵 Music</SelectItem>
                            <SelectItem value="gaming">🎮 Gaming</SelectItem>
                            <SelectItem value="education">📚 Education</SelectItem>
                            <SelectItem value="comedy">😂 Comedy</SelectItem>
                            <SelectItem value="news">📰 News</SelectItem>
                            <SelectItem value="sports">🏅 Sports</SelectItem>
                            <SelectItem value="other">📦 Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Language */}
                <div>
                    <Label>Language</Label>
                    <Select
                        value={form.language}
                        onValueChange={(value) => setForm({ ...form, language: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="si">Sinhala</SelectItem>
                            <SelectItem value="ta">Tamil</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Thumbnail */}
                <ThumbnailUploader
                    userId="demo-user"
                    file={thumbnailFile}
                    onChange={(file, data) => {
                        setThumbnailFile(file);
                        setThumbnailUrl(data?.public_url || null);
                    }}
                />

                {/* Tags */}
                <div className="md:col-span-2 space-y-3">
                    <TagInput tags={tags} onChange={setTags} />
                </div>

            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleCreate}
                    disabled={creating}
                >
                    {creating ? "Creating..." : "Create Prediction"}
                </Button>
            </div>
        </div>
    );
}
