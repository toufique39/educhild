
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";

import { fetchUpcomingEvents } from "@/lib/events";
import { EventCard } from "@/components/layout/event-card";

export default async function UpcomingEventsSection() {
  // Fetch outside try/catch.
  // Suspense in page.tsx will handle the loading state.
  const events = await fetchUpcomingEvents(6);

  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-brand-text">
              Make an Impact
            </span>

            <h2 className="mt-4 text-3xl font-bold text-heading sm:text-4xl">
              Upcoming Community Events
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              Discover meaningful events and join hands with
              your community to create positive change.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:text-brand-text-hover"
          >
            View All Events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Event Listing */}
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-brand-text" />

            <h3 className="text-xl font-semibold text-heading">
              No Upcoming Events
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Check back later for new community events.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
