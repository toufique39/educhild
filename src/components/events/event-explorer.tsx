
"use client";

import { useMemo, useState, type ComponentProps } from "react";
import { Search, SlidersHorizontal, CalendarX } from "lucide-react";

import { EventCard } from "@/components/layout/event-card";

type EduChildEvent = ComponentProps<typeof EventCard>["event"];

interface EventExplorerProps {
  events: EduChildEvent[];
}

const eventCategories = [
  { value: "all", label: "All Categories" },
  { value: "cleanup", label: "Community Cleanup" },
  { value: "plantation", label: "Tree Plantation" },
  { value: "donation", label: "Donation Drive" },
  { value: "career-guidance", label: "Career Guidance" },
  { value: "education", label: "Education Support" },
  { value: "healthcare", label: "Healthcare" },
  { value: "other", label: "Other" },
];

export default function EventExplorer({
  events,
}: EventExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter events based on search and category
  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return events.filter((event) => {
      const location = [
        event.location?.area,
        event.location?.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        location.includes(query) ||
        event.eventType.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        event.eventType === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, location or keyword..."
              aria-label="Search events"
              className="w-full rounded-xl border border-border bg-field py-3.5 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text" />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter events by category"
              className={`w-full appearance-none rounded-xl border border-border bg-field py-3.5 pl-11 pr-4 text-sm outline-none transition ${
                selectedCategory === "all" ? "text-muted-foreground" : ""
              } focus:border-primary focus:ring-2 focus:ring-primary/20`}
            >
              {eventCategories.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Information */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-brand-text">
              {filteredEvents.length}
            </span>{" "}
            of {events.length} events
          </p>

          {(searchQuery || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-brand-text transition hover:text-brand-text-hover"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Filtered Event Cards */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        {/* No Results */}
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <CalendarX className="mx-auto mb-4 h-12 w-12 text-brand-text" />

          <h3 className="text-xl font-bold text-heading">
            No Events Found
          </h3>

          <p className="mt-3 text-sm text-muted-foreground">
            We couldnot find any events matching your search.
            Try another keyword or category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
