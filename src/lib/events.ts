
export type EduChildEvent = {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  eventType: string;
  eventDate: string;
  location?: {
    area?: string;
    city?: string;
  };
};

const EVENTS_API_URL =
  process.env.NEXT_PUBLIC_EVENTS_API_URL ??
  "http://localhost:3000/upcomming-events";

/**
 * Fetch all upcoming events.
 * Optional limit can be used for the homepage.
 */
export async function fetchUpcomingEvents(
  limit?: number
): Promise<EduChildEvent[]> {
  const url = new URL(EVENTS_API_URL);

  if (limit !== undefined) {
    url.searchParams.set("limit", String(limit));
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch upcoming events: ${response.status}`
    );
  }

  const result: {
    success: boolean;
    count: number;
    data: EduChildEvent[];
  } = await response.json();

  if (!result.success) {
    throw new Error("Unable to retrieve upcoming events");
  }

  return result.data;
}


/**
 * Fetch a single event by MongoDB ObjectId.
 */
export async function fetchEventById(
  id: string
): Promise<EduChildEvent | null> {
  const url = `${EVENTS_API_URL.replace(/\/$/, "")}/${encodeURIComponent(id)}`;

  const response = await fetch(url, {
    cache: "no-store",
  }

  )
       

  if (response.status === 404) {
    return null;
  }

 
  if (!response.ok) {
    throw new Error(
      `Failed to fetch event by ID: ${response.status}`
    );
  }
  const result: {
    success: boolean;
    data: EduChildEvent;
  } = await response.json();

  if (!result.success) {
    return null;
  }

  return result.data;
}


/**
 * Format event date.
 */
export function formatEventDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}


/**
 * Format event time.
 */
export function formatEventTime(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
