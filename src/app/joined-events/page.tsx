
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  Loader2,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { EventCard } from "@/components/layout/event-card";
import { EventGridSkeleton } from "@/components/layout/event-grid-skeleton";

// API Configuration
const EVENTS_API_URL =
  process.env.NEXT_PUBLIC_EVENTS_API_URL ||
  "http://localhost:3000/upcomming-events";

const API_BASE_URL = new URL(EVENTS_API_URL).origin;
const JOINED_EVENTS_API_URL = `${API_BASE_URL}/joined-events`;

// Joined Event Type
type EduChildEvent = Parameters<typeof EventCard>[0]["event"];

type JoinedEvent = EduChildEvent & {
  joinedAt?: string;
};

export default function JoinedEventsPage() {
  const router = useRouter();

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  // Page states
  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Get JWT token
  const getAccessToken = useCallback(async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        error?.message || "Unable to get authentication token."
      );
    }

    return data.token;
  }, []);

  // Fetch joined events
  const loadJoinedEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Get authenticated user token
      const token = await getAccessToken();

      // Request joined events from backend
     const response = await fetch(JOINED_EVENTS_API_URL, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  cache: "no-store",
});

// Check response content type
const contentType = response.headers.get("content-type") || "";

if (!contentType.includes("application/json")) {
  const responseText = await response.text();

  throw new Error(
    `Expected JSON but received HTML or another response. Status: ${
      response.status
    }. Response: ${responseText.slice(0, 150)}`
  );
}

const result = await response.json();

if (!response.ok || !result.success) {
  throw new Error(
    result.message || "Failed to load joined events."
  );
}

setEvents(result.data ?? []);
    } catch (error) {
      console.error("Joined events fetch error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load your joined events.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  // Authentication check and data loading
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      // Login redirect renders before any loading screen (see render order below),
      // so no setState is needed here.
      router.replace("/login?callbackUrl=%2Fjoined-events");
      return;
    }

    loadJoinedEvents();
  }, [isPending, session, router, loadJoinedEvents]);

  // Guest user redirecting (checked before the loading state so guests
  // always see the redirect, even while isLoading is still true)
  if (!isPending && !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Redirecting to login...
        </p>
      </main>
    );
  }

  // Loading state
  if (isPending || isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-brand-text" />

            <p className="text-sm text-muted-foreground">
              Loading your joined events...
            </p>
          </div>

          <EventGridSkeleton count={6} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Navigation */}
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-text transition hover:text-brand-text-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-brand-text">
            <CalendarCheck className="h-4 w-4" />
            Your Participation
          </span>

          <h1 className="mt-4 text-3xl font-bold text-heading sm:text-4xl">
            My Joined Events
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Keep track of the community events you have joined.
            Your participation helps create a better future.
          </p>
        </div>

        {/* Event Count */}
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Events Joined
          </p>

          <p className="mt-1 text-3xl font-bold text-brand-text">
            {events.length}
          </p>
        </div>

        {/* Error State */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-7 flex flex-col justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center dark:border-red-900/50 dark:bg-red-950/30"
          >
            <p className="text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={loadJoinedEvents}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-card px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/50"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!errorMessage && events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-brand-text">
              <CalendarCheck className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-heading">
              No Joined Events Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              You havenot joined any community events yet.
              Explore upcoming events and become part of
              something meaningful.
            </p>

            <Link
              href="/events"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              <PlusCircle className="h-4 w-4" />
              Explore Events
            </Link>
          </div>
        )}

        {/* Joined Events Grid */}
        {!errorMessage && events.length > 0 && (
          <>
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-heading">
                  Events You are Participating In
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Your joined community activities.
                </p>
              </div>

              <Link
                href="/events"
                className="hidden items-center gap-2 text-sm font-semibold text-brand-text hover:text-brand-text-hover sm:inline-flex"
              >
                Explore More
                <PlusCircle className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event._id} className="flex flex-col">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-brand-text">
                    <CalendarCheck className="h-4 w-4" />
                    Successfully Joined
                  </div>

                  <EventCard event={event} />
                </div>
              ))}
            </div>

            {/* Mobile Explore Link */}
            <div className="mt-9 text-center sm:hidden">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                <PlusCircle className="h-4 w-4" />
                Explore More Events
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
