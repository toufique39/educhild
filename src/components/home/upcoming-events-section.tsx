
import Link from "next/link";
import { ArrowRight, CalendarX } from "lucide-react";

import { fetchUpcomingEvents } from "@/lib/events";
import { EventCard } from "../layout/event-card";


export default async function UpcomingEventsSection() {
  let events;

  try {
    // Fetch latest six upcoming events from MongoDB API
    events = await fetchUpcomingEvents(6);
  } catch (error) {
    console.error("Homepage events error:", error);

    return (
      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Upcoming Events
          </h2>

          <p className="mt-5 text-muted-foreground">
            Unable to load events right now. Please try again later.
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Try Again
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      id="upcoming-events"
      className="bg-background px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-2xl">
            <span className="text-sm font-bold tracking-widest text-primary uppercase">
              Discover & Participate
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Upcoming Events
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Explore meaningful educational activities and
              find opportunities to support children in your
              community.
            </p>
          </div>

          <p className="shrink-0 text-sm font-medium text-muted-foreground">
            {events.length} {events.length === 1 ? "Event" : "Events"} Available
          </p>

        </div>

        {/* Event Grid */}
        {events.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event as unknown as EduChildEvent}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">

            <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
              <CalendarX className="size-8 text-primary" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-foreground">
              No Upcoming Events
            </h3>

            <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              There are no upcoming educational events at the moment.
              Please check back soon for new opportunities.
            </p>

          </div>
        )}

        {/* View All Events */}
        {events.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Explore All Events
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
