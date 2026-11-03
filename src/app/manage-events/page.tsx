
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPin,
  PlusCircle,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  formatEventDate,
  formatEventTime,
} from "@/lib/events";


type EduChildEvent = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  eventDate: string;
  location?: {
    area?: string;
    city?: string;
  };
};

// API Configuration
const EVENTS_API_URL =
  process.env.NEXT_PUBLIC_EVENTS_API_URL ||
  "http://localhost:3000/upcomming-events";

const API_BASE_URL = new URL(EVENTS_API_URL).origin;
const MY_EVENTS_API_URL = `${API_BASE_URL}/my-events`;

interface EventFormValues {
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  area: string;
  city: string;
  eventDate: string;
}

type ManagedEvent = EduChildEvent & {
  creatorEmail?: string;
  creatorId?: string;
  createdAt?: string;
};

// Initial edit form values
const initialFormValues: EventFormValues = {
  title: "",
  description: "",
  eventType: "",
  thumbnailUrl: "",
  area: "",
  city: "",
  eventDate: "",
};

// Convert UTC date into local datetime input format
function toLocalDateTimeValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return date.toISOString().slice(0, 16);
}

// Minimum selectable datetime (now, in local input format)
function getMinDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  return now.toISOString().slice(0, 16);
}

export default function ManageEventsPage() {
  const router = useRouter();

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  // Page states
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Edit states
  const [editingEventId, setEditingEventId] = useState<string | null>(
    null
  );

  const [editForm, setEditForm] =
    useState<EventFormValues>(initialFormValues);

  const [isUpdating, setIsUpdating] = useState(false);
  const [minimumEventDate, setMinimumEventDate] = useState("");

  // Delete states
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(
    null
  );

  const [isDeleting, setIsDeleting] = useState(false);

  // Get Better Auth JWT
  const getAccessToken = useCallback(async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        error?.message || "Unable to get authentication token."
      );
    }

    return data.token;
  }, []);

  // Fetch user's own events
  const loadMyEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = await getAccessToken();

      const response = await fetch(MY_EVENTS_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load your events."
        );
      }

      setEvents(result.data ?? []);
    } catch (error) {
      console.error("Manage events fetch error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load your events.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  // Protect page and fetch events
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      // Login redirect renders before any loading screen (see render order below),
      // so no setState is needed here.
      router.replace("/login?callbackUrl=%2Fmanage-events");
      return;
    }

    // Defer loading so no setState runs synchronously inside the effect
    void Promise.resolve().then(loadMyEvents);
  }, [isPending, session, router, loadMyEvents]);

  // Open edit form
  const handleEditClick = (event: ManagedEvent) => {
    setEditingEventId(event._id);

    setEditForm({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnailUrl: event.thumbnailUrl,
      area: event.location?.area ?? "",
      city: event.location?.city ?? "",
      eventDate: toLocalDateTimeValue(event.eventDate),
    });

    setMinimumEventDate(getMinDateTime());

    setErrorMessage("");
    setSuccessMessage("");
  };

  // Handle edit form changes
  const handleEditChange = (
    field: keyof EventFormValues,
    value: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update event
  const handleUpdateEvent = async (
    eventId: string,
    formEvent: React.FormEvent<HTMLFormElement>
  ) => {
    formEvent.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const selectedDate = new Date(editForm.eventDate);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() <= Date.now()
    ) {
      setErrorMessage("Please select a future event date and time.");
      return;
    }

    try {
      setIsUpdating(true);

      const token = await getAccessToken();

      const payload = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        eventType: editForm.eventType,
        thumbnailUrl: editForm.thumbnailUrl.trim(),

        location: {
          area: editForm.area.trim(),
          city: editForm.city.trim(),
        },

        eventDate: selectedDate.toISOString(),
      };

      const response = await fetch(
        `${EVENTS_API_URL}/${encodeURIComponent(eventId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update event."
        );
      }

      // Update event in local state
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId ? result.data : event
        )
      );

      setEditingEventId(null);
      setEditForm(initialFormValues);
      setSuccessMessage("Event updated successfully!");

      toast.success("Event updated successfully!");
    } catch (error) {
      console.error("Update event error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to update event.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsDeleting(true);

      const token = await getAccessToken();

      const response = await fetch(
        `${EVENTS_API_URL}/${encodeURIComponent(eventId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete event."
        );
      }

      // Remove deleted event from local state
      setEvents((prev) =>
        prev.filter((event) => event._id !== eventId)
      );

      setConfirmDeleteId(null);
      setSuccessMessage("Event deleted successfully!");

      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Delete event error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete event.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Redirecting guest users (checked before the loading state so guests
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
      <main className="flex min-h-[60vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-brand-text" />
          <p className="text-sm text-muted-foreground">
            Loading your events...
          </p>
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
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:text-brand-text-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-brand-text">
              Your Dashboard
            </span>

            <h1 className="mt-4 text-3xl font-bold text-heading sm:text-4xl">
              Manage Your Events
            </h1>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              View, update, and manage the community events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Event
          </Link>
        </div>

        {/* Event Count */}
        <div className="mb-7 rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Events Created by You
          </p>

          <p className="mt-1 text-3xl font-bold text-brand-text">
            {events.length}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300"
          >
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          >
            {errorMessage}
          </div>
        )}

        {/* Empty State */}
        {events.length === 0 && !errorMessage ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-brand-text" />

            <h2 className="text-xl font-bold text-heading">
              You Havenot Created Any Events Yet
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              Start an initiative and bring your community together.
            </p>

            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              <PlusCircle className="h-4 w-4" />
              Create Your First Event
            </Link>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    loading="lazy"
                    className="aspect-16/10 w-full object-cover"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1.5 text-xs font-semibold text-brand-text shadow-sm backdrop-blur-sm">
                    {event.eventType
                      .split("-")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                </div>

                {/* Event Information */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-2 text-lg font-bold text-heading">
                    {event.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-brand-text" />
                      {formatEventDate(event.eventDate)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4 text-brand-text" />
                      {formatEventTime(event.eventDate)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-brand-text" />
                      <span className="line-clamp-1">
                        {event.location?.area}, {event.location?.city}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => handleEditClick(event)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-primary px-3 py-2.5 text-sm font-semibold text-brand-text transition hover:bg-primary/10"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(event._id);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {confirmDeleteId === event._id && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                      <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                        Delete this event?
                      </p>

                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        This action cannot be undone.
                      </p>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event._id)}
                          disabled={isDeleting}
                          className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          {isDeleting ? "Deleting..." : "Yes, Delete"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={isDeleting}
                          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted dark:border-border dark:bg-card dark:text-foreground dark:hover:bg-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      {editingEventId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-event-title"
            className="my-8 w-full max-w-2xl rounded-2xl bg-card p-6 shadow-xl sm:p-8"
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="edit-event-title"
                  className="text-2xl font-bold text-heading"
                >
                  Update Event
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Edit your event information below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingEventId(null)}
                disabled={isUpdating}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form
              onSubmit={(event) =>
                handleUpdateEvent(editingEventId, event)
              }
              className="max-h-[70vh] space-y-5 overflow-y-auto pr-1"
            >
              <div>
                <label
                  htmlFor="edit-title"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Event Title
                </label>

                <input
                  id="edit-title"
                  type="text"
                  required
                  maxLength={100}
                  value={editForm.title}
                  onChange={(e) =>
                    handleEditChange("title", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Description
                </label>

                <textarea
                  id="edit-description"
                  rows={4}
                  required
                  maxLength={2000}
                  value={editForm.description}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-event-type"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Event Type
                </label>

                <select
                  id="edit-event-type"
                  required
                  value={editForm.eventType}
                  onChange={(e) =>
                    handleEditChange("eventType", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="cleanup">Community Cleanup</option>
                  <option value="plantation">Tree Plantation</option>
                  <option value="donation">Donation Drive</option>
                  <option value="career-guidance">Career Guidance</option>
                  <option value="education">Education Support</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-thumbnail"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Thumbnail URL
                </label>

                <input
                  id="edit-thumbnail"
                  type="url"
                  required
                  value={editForm.thumbnailUrl}
                  onChange={(e) =>
                    handleEditChange("thumbnailUrl", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-area"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Area
                  </label>

                  <input
                    id="edit-area"
                    type="text"
                    required
                    value={editForm.area}
                    onChange={(e) =>
                      handleEditChange("area", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-city"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    City
                  </label>

                  <input
                    id="edit-city"
                    type="text"
                    required
                    value={editForm.city}
                    onChange={(e) =>
                      handleEditChange("city", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-date"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Event Date & Time
                </label>

                <input
                  id="edit-date"
                  type="datetime-local"
                  min={minimumEventDate}
                  required
                  value={editForm.eventDate}
                  onChange={(e) =>
                    handleEditChange("eventDate", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                >
                  {errorMessage}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingEventId(null)}
                  disabled={isUpdating}
                  className="rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
