
import { Suspense } from "react";
import { CalendarDays } from "lucide-react";

import { fetchUpcomingEvents } from "@/lib/events";
import EventExplorer from "@/components/events/event-explorer";
import { EventGridSkeleton } from "@/components/layout/event-grid-skeleton";

// Fetch real events from backend
async function UpcomingEventsContent() {
  const events = await fetchUpcomingEvents();

  return <EventExplorer events={events} />;
}

export default function UpcomingEventsPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Page Header */}
      <section className="bg-[#153F35] px-4 py-16 text-center sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[#F3B85D]">
            Discover & Participate
          </span>

          <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Upcoming Community Events
          </h1>

          <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base">
            Discover meaningful opportunities, connect with volunteers,
            and become a part of positive change in your community.
          </p>
        </div>
      </section>

      {/* Events Listing */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Section Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-brand-text" />

              <h2 className="text-2xl font-bold text-heading">
                Explore Events
              </h2>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Find an opportunity and make a difference.
            </p>
          </div>

          {/* Search and Filter */}
          <Suspense fallback={<EventGridSkeleton count={6} />}>
            <UpcomingEventsContent />
          </Suspense>

        </div>
      </section>
    </main>
  );
}
