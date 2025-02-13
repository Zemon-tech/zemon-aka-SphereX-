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

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    title: "Global Hackathon 2024",
    description:
      "Join developers worldwide for a 48-hour hackathon focused on AI and sustainability...",
    date: "2024-03-15",
    time: "09:00 AM",
    location: "Virtual",
    attendees: 1200,
    price: "Free",
    rewards: "$10,000 in prizes",
    image: "https://picsum.photos/400/300",
    tags: ["hackathon", "ai", "sustainability"],
  },
  {
    id: 2,
    title: "Web Development Summit",
    description:
      "Learn about the latest web technologies and best practices from industry experts...",
    date: "2024-04-20",
    time: "10:00 AM",
    location: "New York, USA",
    attendees: 500,
    price: "$299",
    rewards: "Certification",
    image: "https://picsum.photos/400/301",
    tags: ["conference", "web-dev", "networking"],
  },
  // Add more mock events as needed
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<typeof mockEvents[0] | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<typeof mockEvents[0] | null>(null);

  const handleAddEvent = async (formData: FormData) => {
    // TODO: Implement event creation
    console.log("Creating event:", Object.fromEntries(formData));
    setShowAddForm(false);
  };

  const handleEditEvent = async (formData: FormData) => {
    // TODO: Implement event update
    console.log("Updating event:", Object.fromEntries(formData));
    setEditingEvent(null);
  };

  const handleDeleteEvent = async () => {
    // TODO: Implement event deletion
    console.log("Deleting event:", deletingEvent?.id);
    setDeletingEvent(null);
  };

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" ||
      (selectedType === "free" && event.price === "Free") ||
      (selectedType === "paid" && event.price !== "Free");
    return matchesSearch && matchesType;
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.date) >= new Date()
  );
  
  const pastEvents = sortedEvents.filter(
    (event) => new Date(event.date) < new Date()
  );

  const filterOptions = [
    { label: "All Events", value: "all" },
    { label: "Free Events", value: "free" },
    { label: "Paid Events", value: "paid" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Tech Events"
        description="Join exciting hackathons, conferences, and workshops."
        action={
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus size={20} />
            Create Event
          </button>
        }
      />

      <SearchAndFilter
        searchPlaceholder="Search events..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterValue={selectedType}
        onFilterChange={setSelectedType}
        filterOptions={filterOptions}
        extraActions={
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border hover:bg-accent">
            <Calendar size={20} />
            Calendar View
          </button>
        }
      />

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
          <GridLayout columns={3}>
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => setEditingEvent(event)}
                onDelete={() => setDeletingEvent(event)}
              />
            ))}
          </GridLayout>
        </section>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
          <GridLayout columns={3}>
            {pastEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => setEditingEvent(event)}
                onDelete={() => setDeletingEvent(event)}
              />
            ))}
          </GridLayout>
        </section>
      )}

      {/* Forms and Dialogs */}
      {(showAddForm || editingEvent) && (
        <EventForm
          initialData={editingEvent || undefined}
          onSubmit={editingEvent ? handleEditEvent : handleAddEvent}
          onCancel={() => {
            setShowAddForm(false);
            setEditingEvent(null);
          }}
          isEdit={!!editingEvent}
        />
      )}

      {deletingEvent && (
        <ConfirmDialog
          title="Delete Event"
          message="Are you sure you want to delete this event? This action cannot be undone."
          onConfirm={handleDeleteEvent}
          onCancel={() => setDeletingEvent(null)}
        />
      )}
    </PageContainer>
  );
} 