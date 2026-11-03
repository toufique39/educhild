
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
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#294739] dark:bg-[#142820] sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, location or keyword..."
              aria-label="Search events"
              className="w-full rounded-xl border border-gray-200 bg-[#F8FAF7] py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10 dark:border-gray-700 dark:bg-[#0D1D16] dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#226B52]" />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter events by category"
              className="w-full appearance-none rounded-xl border border-gray-200 bg-[#F8FAF7] py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10 dark:border-gray-700 dark:bg-[#0D1D16] dark:text-gray-100"
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-[#226B52]">
              {filteredEvents.length}
            </span>{" "}
            of {events.length} events
          </p>

          {(searchQuery || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[#226B52] transition hover:text-[#153F35] dark:hover:text-[#8BD5B4]"
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
        /* No Results */
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-[#142820]">
          <CalendarX className="mx-auto mb-4 h-12 w-12 text-[#226B52]" />

          <h3 className="text-xl font-bold text-[#153F35] dark:text-[#E5F2EA]">
            No Events Found
          </h3>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            We couldnot find any events matching your search.
            Try another keyword or category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-lg bg-[#226B52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#153F35]"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
