
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import JoinEventButton from "@/components/events/join-event-button";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  HandHeart,
} from "lucide-react";

import {
  fetchEventById,
  formatEventDate,
  formatEventTime,
} from "@/lib/events";

type EventDetailsPageProps = {
  params: Promise<{ id: string }>;
};

// Loading Skeleton
function EventDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#F8FAF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8 h-5 w-40 rounded bg-gray-200" />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="aspect-video rounded-2xl bg-gray-200" />

            <div className="rounded-2xl bg-white p-8">
              <div className="mb-5 h-6 w-28 rounded bg-gray-200" />
              <div className="mb-4 h-9 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="mt-3 h-4 w-2/3 rounded bg-gray-200" />
            </div>
          </div>

          <div className="h-64 rounded-2xl bg-gray-200" />
        </div>
      </div>
    </main>
  );
}

// Event Details Content
async function EventDetailsContent({
  params,
}: EventDetailsPageProps) {
  // Resolve dynamic route parameter inside Suspense
  const { id } = await params;

  let event;

  try {
    event = await fetchEventById(id);
  } catch (error) {
    console.error("Failed to fetch event:", error);

    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F8FAF7] px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#153F35]">
            Unable to Load Event
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Something went wrong while loading this event.
            Please try again later.
          </p>

          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#226B52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#153F35]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  if (!event) {
    notFound();
  }

  const location = [
    event.location?.area,
    event.location?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const eventType = event.eventType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-[#F8FAF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Navigation */}
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#226B52] hover:text-[#153F35]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Upcoming Events
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Main Event Information */}
          <div className="lg:col-span-2">

            {/* Event Image */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <img
                src={event.thumbnailUrl}
                alt={event.title}
                className="aspect-video w-full object-cover"
              />
            </div>

            {/* Event Details */}
            <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">

              <span className="inline-block rounded-full bg-[#226B52]/10 px-4 py-2 text-sm font-semibold text-[#226B52]">
                {eventType}
              </span>

              <h1 className="mt-5 text-2xl font-bold leading-tight text-[#153F35] sm:text-3xl lg:text-4xl">
                {event.title}
              </h1>

              {/* Date, Time and Location */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#226B52]/10 text-[#226B52]">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Event Date
                    </p>

                    <p className="text-sm font-semibold text-[#1E2E27]">
                      {formatEventDate(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#226B52]/10 text-[#226B52]">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Event Time
                    </p>

                    <p className="text-sm font-semibold text-[#1E2E27]">
                      {formatEventTime(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:col-span-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#226B52]/10 text-[#226B52]">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Event Location
                    </p>

                    <p className="text-sm font-semibold text-[#1E2E27]">
                      {location || "Location not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-border pt-7">
                <h2 className="text-xl font-bold text-[#153F35]">
                  About This Event
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Join Event Sidebar */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3B85D]/20 text-[#153F35]">
                <HandHeart className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#153F35]">
                Be Part of This Event
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Join hands with your community and help create
                a positive impact through this event.
              </p>

             <JoinEventButton eventId={event._id} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Page Component
export default function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  return (
    <Suspense fallback={<EventDetailsSkeleton />}>
      <EventDetailsContent params={params} />
    </Suspense>
  );
}
