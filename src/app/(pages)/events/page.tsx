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
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === "all" || event.location === selectedLocation;
    const matchesMonth =
      selectedMonth === "all" ||
      new Date(event.date).getMonth() === parseInt(selectedMonth);
    return matchesSearch && matchesLocation && matchesMonth;
  });

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Tech Events & Hackathons</h1>
        <p className="text-muted-foreground">
          Discover and participate in exciting tech events worldwide.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-background"
          >
            <option value="all">All Locations</option>
            <option value="Virtual">Virtual</option>
            <option value="New York, USA">New York, USA</option>
            <option value="London, UK">London, UK</option>
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-background"
          >
            <option value="all">All Months</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            {/* Add more months */}
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus size={20} />
            Host Event
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-card overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground">
                {event.price}
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-muted-foreground text-sm mb-4">
                {event.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  {event.attendees} attendees
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Trophy className="w-4 h-4" />
                  {event.rewards}
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="px-3 py-1 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Host Event CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 p-8 rounded-lg bg-primary/5 text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">
          Want to Host Your Own Event?
        </h2>
        <p className="text-muted-foreground mb-6">
          Create and manage your tech events, hackathons, or workshops on our
          platform.
        </p>
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus size={20} />
          Host an Event
        </button>
      </motion.div>
    </div>
  );
} 