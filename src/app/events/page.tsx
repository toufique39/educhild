
import { Suspense } from "react";
import { CalendarDays } from "lucide-react";

import { fetchUpcomingEvents } from "@/lib/events";
import { EventCard } from "@/components/layout/event-card";
import { EventGridSkeleton } from "@/components/layout/event-grid-skeleton";


async function UpcomingEventsList() {
    const events = await fetchUpcomingEvents();
    if (events.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          <CalendarDays className="mx-auto mb-4 h-8 w-8" />
          <p>No upcoming events found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    );
  }



export default function UpcomingEventsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF7]">
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#153F35]">
              Explore Events
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Find an opportunity and make a difference.
            </p>
          </div>

          <Suspense fallback={<EventGridSkeleton count={6} />}>
            <UpcomingEventsList />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
