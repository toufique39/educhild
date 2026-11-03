
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  ImagePlus,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface EventFormData {
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  area: string;
  city: string;
  eventDate: string;
}

const initialFormData: EventFormData = {
  title: "",
  description: "",
  eventType: "",
  thumbnailUrl: "",
  area: "",
  city: "",
  eventDate: "",
};

const EVENTS_API_URL =
  process.env.NEXT_PUBLIC_EVENTS_API_URL ||
  "http://localhost:3000/upcomming-events";

function getMinDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  return now.toISOString().slice(0, 16);
}

export default function CreateEventPage() {
  const router = useRouter();

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] =
    useState<EventFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect guest users
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login?callbackUrl=%2Fcreate-event");
    }
  }, [isPending, session, router]);

  // Handle input changes
  const handleChange = (
    field: keyof EventFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  // Submit event
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!session) {
      setErrorMessage("Please login before creating an event.");
      return;
    }

    // Validate future event date
    const selectedDate = new Date(formData.eventDate);

    if (
      !formData.eventDate ||
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() <= Date.now()
    ) {
      setErrorMessage("Please select a future event date and time.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Step 1: Get JWT from Better Auth
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error(
          tokenError?.message || "Unable to get authentication token."
        );
      }

      // Step 2: Prepare event data
      const eventPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventType: formData.eventType,
        thumbnailUrl: formData.thumbnailUrl.trim(),

        location: {
          area: formData.area.trim(),
          city: formData.city.trim(),
        },

        // Convert local datetime to UTC ISO string
        eventDate: selectedDate.toISOString(),
      };

      // Step 3: Send authenticated request to Express
      const response = await fetch(EVENTS_API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },

        body: JSON.stringify(eventPayload),
      });

      // Step 4: Read backend response
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create event."
        );
      }

      // Step 5: Show success
      setSuccessMessage("Your event has been created successfully!");

      toast.success("Your event has been created successfully!");

      setFormData(initialFormData);

    } catch (error) {
      console.error("Create event error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back Navigation */}
        <Link
          href="/events"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:text-brand-text-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        {/* Page Heading */}
        <div className="mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-brand-text">
            Share an Opportunity
          </span>

          <h1 className="mt-4 text-3xl font-bold text-heading sm:text-4xl">
            Create a Community Event
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Bring people together, create meaningful experiences,
            and make a positive difference in your community.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Event Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Event Title <span className="text-red-500">*</span>
              </label>

              <input
                id="title"
                type="text"
                placeholder="Example: Winter Clothes Donation Drive"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                maxLength={100}
                className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Event Description <span className="text-red-500">*</span>
              </label>

              <textarea
                id="description"
                rows={5}
                placeholder="Describe your event and its purpose..."
                value={formData.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                required
                maxLength={2000}
                className="w-full resize-y rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Event Type */}
            <div>
              <label
                htmlFor="eventType"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Event Type <span className="text-red-500">*</span>
              </label>

              <select
                id="eventType"
                value={formData.eventType}
                onChange={(e) =>
                  handleChange("eventType", e.target.value)
                }
                required
                className={`w-full rounded-lg border border-border bg-field px-4 py-3 text-sm outline-none transition ${
                  formData.eventType === "" ? "text-muted-foreground" : ""
                } focus:border-primary focus:ring-2 focus:ring-primary/20`}
              >
                <option value="">Select an event type</option>
                <option value="cleanup">Community Cleanup</option>
                <option value="plantation">Tree Plantation</option>
                <option value="donation">Donation Drive</option>
                <option value="career-guidance">Career Guidance</option>
                <option value="education">Education Support</option>
                <option value="healthcare">Healthcare</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label
                htmlFor="thumbnailUrl"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <ImagePlus className="h-4 w-4 text-brand-text" />
                Event Thumbnail URL
                <span className="text-red-500">*</span>
              </label>

              <input
                id="thumbnailUrl"
                type="url"
                placeholder="https://example.com/event-image.jpg"
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  handleChange("thumbnailUrl", e.target.value)
                }
                required
                className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Location */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-brand-text" />
                Event Location
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="area"
                    className="mb-2 block text-sm font-medium text-muted-foreground"
                  >
                    Area <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="area"
                    type="text"
                    placeholder="Example: Shyamnagar"
                    value={formData.area}
                    onChange={(e) => handleChange("area", e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-muted-foreground"
                  >
                    City <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="city"
                    type="text"
                    placeholder="Example: Satkhira"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Event Date */}
            <div>
              <label
                htmlFor="eventDate"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <CalendarDays className="h-4 w-4 text-brand-text" />
                Event Date & Time
                <span className="text-red-500">*</span>
              </label>

              <input
                id="eventDate"
                type="datetime-local"
                min={getMinDateTime()}
                value={formData.eventDate}
                onChange={(e) =>
                  handleChange("eventDate", e.target.value)
                }
                required
                className="w-full rounded-lg border border-border bg-field px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Only future dates and times are allowed.
              </p>
            </div>

            {/* Creator Information */}
            <div className="rounded-xl bg-primary/5 p-4 dark:bg-primary/10">
              <p className="text-xs font-medium text-muted-foreground">
                Event Created By
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-heading">
                {session.user.email}
              </p>

            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
              >
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300"
              >
                <p className="font-semibold">{successMessage}</p>

                <Link
                  href="/events"
                  className="mt-2 inline-block font-semibold underline"
                >
                  View Upcoming Events
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
