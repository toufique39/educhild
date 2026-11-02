import Link from "next/link";
import { CalendarDays, Clock3, MapPin, ArrowUpRight } from "lucide-react";

import { formatEventDate, formatEventTime, type EduChildEvent } from "@/lib/events";

interface EventCardProps {
  event: EduChildEvent;
}

export function EventCard({ event }: EventCardProps) {
  const location = [event.location?.area, event.location?.city]
    .filter(Boolean)
    .join(", ");

  const eventType = event.eventType
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Event Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={event.thumbnailUrl}
          alt={event.title}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Event Type Badge */}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#226B52] shadow-sm">
          {eventType}
        </span>
      </div>

      {/* Event Information */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 line-clamp-2 text-lg font-bold text-[#1E2E27] transition-colors group-hover:text-[#226B52]">
          {event.title}
        </h3>

        {/* Event Date */}
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0 text-[#226B52]" />
          <span>{formatEventDate(event.eventDate)}</span>
        </div>

        {/* Event Time */}
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="h-4 w-4 shrink-0 text-[#226B52]" />
          <span>{formatEventTime(event.eventDate)}</span>
        </div>

        {/* Event Location */}
        <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-[#226B52]" />
          <span className="line-clamp-1">
            {location || "Location not specified"}
          </span>
        </div>

        {/* View Details Button */}
        <div className="mt-auto">
          <Link
            href={`/event-details/${event._id}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#226B52] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#153F35]"
          >
            View Details
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}