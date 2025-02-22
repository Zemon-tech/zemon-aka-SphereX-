"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Calendar, MapPin, Clock, Users, Image as ImageIcon, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventFormProps {
  initialData?: {
    title: string;
    description: string;
    type: string;
    date: string;
    time: string;
    location: string;
    mode: "online" | "in-person" | "hybrid";
    capacity?: number;
    image?: string;
    registrationUrl?: string;
    tags: string[];
  };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function EventForm({ initialData, onSubmit, onCancel, isEdit = false }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(initialData?.mode || "online");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
    >
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-card border rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">
                {isEdit ? "Edit Event" : "Create New Event"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in the details to {isEdit ? "update" : "create"} your event
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Event Title
                  </span>
                </label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={initialData?.title}
                  required
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Event Description
                  </span>
                </label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={initialData?.description}
                  required
                  rows={4}
                  placeholder="Describe your event"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Event Date
                  </span>
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={initialData?.date}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Event Time
                  </span>
                </label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  defaultValue={initialData?.time}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Type</label>
                <Select
                  name="type"
                  defaultValue={initialData?.type}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event Mode</label>
                <div className="flex gap-4">
                  {["online", "in-person", "hybrid"].map((modeOption) => (
                    <label
                      key={modeOption}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                        mode === modeOption
                          ? "border-primary bg-primary/10 text-primary"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={modeOption}
                        checked={mode === modeOption}
                        onChange={(e) => setMode(e.target.value as any)}
                        className="hidden"
                      />
                      {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {mode === "online" ? "Event Link" : "Location"}
                  </span>
                </label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={initialData?.location}
                  required
                  placeholder={
                    mode === "online"
                      ? "Enter meeting link"
                      : "Enter physical location"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Capacity (Optional)
                  </span>
                </label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  defaultValue={initialData?.capacity}
                  min="1"
                  placeholder="Maximum number of participants"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Image URL
                  </span>
                </label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  defaultValue={initialData?.image}
                  placeholder="Enter event image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    Rewards
                  </span>
                </label>
                <Input
                  id="rewards"
                  name="rewards"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    Tags
                  </span>
                </label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={initialData?.tags.join(", ")}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {isLoading && <Loader2 size={18} className="animate-spin" />}
                  {isEdit ? "Update Event" : "Create Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
} 