
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

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load your joined events."
      );
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  // Authentication check and data loading
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login?callbackUrl=%2Fjoined-events");
      setIsLoading(false);
      return;
    }

    loadJoinedEvents();
  }, [isPending, session, router, loadJoinedEvents]);

  // Loading state
  if (isPending || isLoading) {
    return (
      <main className="min-h-screen bg-[#F8FAF7] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#226B52]" />

            <p className="text-sm text-gray-500">
              Loading your joined events...
            </p>
          </div>

          <EventGridSkeleton count={6} />
        </div>
      </main>
    );
  }

  // Guest user redirecting
  if (!session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F8FAF7]">
        <p className="text-sm text-gray-500">
          Redirecting to login...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Navigation */}
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#226B52] transition hover:text-[#153F35]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#226B52]/10 px-4 py-2 text-sm font-semibold text-[#226B52]">
            <CalendarCheck className="h-4 w-4" />
            Your Participation
          </span>

          <h1 className="mt-4 text-3xl font-bold text-[#153F35] sm:text-4xl">
            My Joined Events
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
            Keep track of the community events you have joined.
            Your participation helps create a better future.
          </p>
        </div>

        {/* Event Count */}
        <div className="mb-8 rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-gray-500">
            Total Events Joined
          </p>

          <p className="mt-1 text-3xl font-bold text-[#226B52]">
            {events.length}
          </p>
        </div>

        {/* Error State */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-7 flex flex-col justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center"
          >
            <p className="text-sm text-red-700">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={loadJoinedEvents}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!errorMessage && events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#226B52]/10 text-[#226B52]">
              <CalendarCheck className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#153F35]">
              No Joined Events Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
              You havenot joined any community events yet.
              Explore upcoming events and become part of
              something meaningful.
            </p>

            <Link
              href="/events"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#226B52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#153F35]"
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
                <h2 className="text-xl font-bold text-[#153F35]">
                  Events You are Participating In
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Your joined community activities.
                </p>
              </div>

              <Link
                href="/events"
                className="hidden items-center gap-2 text-sm font-semibold text-[#226B52] hover:text-[#153F35] sm:inline-flex"
              >
                Explore More
                <PlusCircle className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event._id} className="flex flex-col">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#226B52]">
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
                className="inline-flex items-center gap-2 rounded-lg bg-[#226B52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#153F35]"
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
