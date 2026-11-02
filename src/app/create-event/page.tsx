
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

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Protect the page from guest users (client-side navigation guard)
  useEffect(() => {
    if (!isPending && !session) {
      router.replace(
        "/login?callbackUrl=%2Fcreate-event"
      );
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

  // Handle form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

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

    // Form validation completed.
    // Backend API integration will be added in the next step.
    setSuccessMessage(
      "Your event information passed validation. It is ready for submission."
    );
  };

  // Loading state
  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8FAF7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#226B52] border-t-transparent" />
      </div>
    );
  }

  // Redirecting guest users
  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8FAF7]">
        <p className="text-sm text-gray-500">
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back Navigation */}
        <Link
          href="/events"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#226B52] hover:text-[#153F35]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        {/* Page Heading */}
        <div className="mb-8">
          <span className="inline-block rounded-full bg-[#226B52]/10 px-4 py-2 text-sm font-semibold text-[#226B52]">
            Share an Opportunity
          </span>

          <h1 className="mt-4 text-3xl font-bold text-[#153F35] sm:text-4xl">
            Create a Community Event
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Bring people together, create meaningful experiences,
            and make a positive difference in your community.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Event Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-[#1E2E27]"
              >
                Event Title <span className="text-red-500">*</span>
              </label>

              <input
                id="title"
                type="text"
                placeholder="Example: Winter Clothes Donation Drive"
                value={formData.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                required
                maxLength={100}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
              />
            </div>

            {/* Event Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-[#1E2E27]"
              >
                Event Description <span className="text-red-500">*</span>
              </label>

              <textarea
                id="description"
                rows={5}
                placeholder="Describe your event, its purpose, and how volunteers can participate..."
                value={formData.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                required
                maxLength={2000}
                className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
              />
            </div>

            {/* Event Type */}
            <div>
              <label
                htmlFor="eventType"
                className="mb-2 block text-sm font-semibold text-[#1E2E27]"
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
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
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
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1E2E27]"
              >
                <ImagePlus className="h-4 w-4 text-[#226B52]" />
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
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
              />
            </div>

            {/* Event Location */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E2E27]">
                <MapPin className="h-4 w-4 text-[#226B52]" />
                Event Location
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Area */}
                <div>
                  <label
                    htmlFor="area"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    Area <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="area"
                    type="text"
                    placeholder="Example: Shyamnagar"
                    value={formData.area}
                    onChange={(e) =>
                      handleChange("area", e.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-600"
                  >
                    City <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="city"
                    type="text"
                    placeholder="Example: Satkhira"
                    value={formData.city}
                    onChange={(e) =>
                      handleChange("city", e.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
                  />
                </div>
              </div>
            </div>

            {/* Event Date */}
            <div>
              <label
                htmlFor="eventDate"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1E2E27]"
              >
                <CalendarDays className="h-4 w-4 text-[#226B52]" />
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
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#226B52] focus:ring-2 focus:ring-[#226B52]/10"
              />

              <p className="mt-2 text-xs text-gray-500">
                Only future dates and times are allowed.
              </p>
            </div>

            {/* Creator Information */}
            <div className="rounded-xl bg-[#226B52]/5 p-4">
              <p className="text-xs font-medium text-gray-500">
                Event Created By
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-[#153F35]">
                {session.user.email}
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#226B52] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#153F35]"
            >
              <Send className="h-4 w-4" />
              Create Event
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
