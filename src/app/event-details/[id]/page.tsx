
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
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8 h-5 w-40 rounded bg-muted" />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="aspect-video rounded-2xl bg-muted" />

            <div className="rounded-2xl bg-card p-8">
              <div className="mb-5 h-6 w-28 rounded bg-muted" />
              <div className="mb-4 h-9 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="mt-3 h-4 w-2/3 rounded bg-muted" />
            </div>
          </div>

          <div className="h-64 rounded-2xl bg-muted" />
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
      <main className="flex min-h-[60vh] items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-heading">
            Unable to Load Event
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Something went wrong while loading this event.
            Please try again later.
          </p>

          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
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
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Navigation */}
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:text-brand-text-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Upcoming Events
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Main Event Information */}
          <div className="lg:col-span-2">

            {/* Event Image */}
            <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
              <img
                src={event.thumbnailUrl}
                alt={event.title}
                className="aspect-video w-full object-cover"
              />
            </div>

            {/* Event Details */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-brand-text">
                {eventType}
              </span>

              <h1 className="mt-5 text-2xl font-bold leading-tight text-heading sm:text-3xl lg:text-4xl">
                {event.title}
              </h1>

              {/* Date, Time and Location */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-brand-text">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Event Date
                    </p>

                    <p className="text-sm font-semibold text-foreground">
                      {formatEventDate(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-brand-text">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Event Time
                    </p>

                    <p className="text-sm font-semibold text-foreground">
                      {formatEventTime(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:col-span-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-brand-text">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Event Location
                    </p>

                    <p className="text-sm font-semibold text-foreground">
                      {location || "Location not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-border pt-7">
                <h2 className="text-xl font-bold text-heading">
                  About This Event
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Join Event Sidebar */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-heading">
                <HandHeart className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-heading">
                Be Part of This Event
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
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
