"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Users,
  Download,
  Plus,
  Trophy,
} from "lucide-react";
import EventCard from "@/components/events/EventCard";
import EventForm from "@/components/events/EventForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import GridLayout from "@/components/layout/GridLayout";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const filterOptions = [
    { label: "All Events", value: "all" },
    { label: "Hackathons", value: "Hackathons" },
    { label: "Workshops", value: "Workshops" },
    { label: "Meetups", value: "Meetups" },
    { label: "Conferences", value: "Conferences" },
  ];

  const handleSubmitEvent = async (formData: FormData) => {
    try {
      // TODO: Implement API call to create event
      console.log("Creating event:", Object.fromEntries(formData));
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <PageContainer className="py-6">
      <PageHeader
        title="Tech Events"
        description="Discover and participate in exciting tech events"
        action={
          <Button className="gap-2" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        }
      />

      <SearchAndFilter
        searchPlaceholder="Search events..."
        searchValue=""
        onSearchChange={() => {}}
        filterValue="all"
        onFilterChange={() => {}}
        filterOptions={filterOptions}
        extraActions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              View Calendar
            </Button>
          </div>
        }
      />

      {/* Loading skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card overflow-hidden animate-pulse">
            <div className="h-48 bg-muted"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded-full w-16"></div>
                <div className="h-6 bg-muted rounded-full w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Form Modal */}
      {showAddForm && (
        <EventForm
          onSubmit={handleSubmitEvent}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </PageContainer>
  );
} 