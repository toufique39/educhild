
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HandHeart,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface JoinEventButtonProps {
  eventId: string;
}

const EVENTS_API_URL =
  process.env.NEXT_PUBLIC_EVENTS_API_URL ||
  "http://localhost:3000/upcomming-events";

const API_BASE_URL = new URL(EVENTS_API_URL).origin;

const JOINED_EVENTS_API_URL = `${API_BASE_URL}/joined-events`;

export default function JoinEventButton({
  eventId,
}: JoinEventButtonProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isChecking, setIsChecking] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Check whether the current user has already joined
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      // Avoid synchronous setState in effect 
      Promise.resolve().then(() => {
        setIsJoined(false);
        setIsChecking(false);
      });
      return;
    }

    let isActive = true;

    const checkJoinedStatus = async () => {
      setIsChecking(true);

      try {
        // Get authenticated JWT
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error("Unable to verify your join status.");
        }

        // Fetch current user's joined events
        const response = await fetch(JOINED_EVENTS_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to check joined event status.");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid joined events response.");
        }

        // Check whether this event already exists in user's joined list
        const alreadyJoined = result.data.some(
          (event: { _id: string }) => event._id === eventId
        );

        if (isActive) {
          setIsJoined(alreadyJoined);
        }
      } catch (error) {
        console.error("Join status check error:", error);

        if (isActive) {
          setMessage("Unable to verify your participation status.");
          setIsError(true);

          toast.error("Unable to verify your participation status.");
        }
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    checkJoinedStatus();

    return () => {
      isActive = false;
    };
  }, [session, isPending, eventId]);

  // Handle Join Event
  const handleJoinEvent = async () => {
    setMessage("");
    setIsError(false);

    // Guest user redirect
    if (!session) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(
          `/event-details/${eventId}`
        )}`
      );
      return;
    }

    if (isJoined) return;

    try {
      setIsJoining(true);

      // Get Better Auth JWT
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error(
          error?.message || "Unable to get authentication token."
        );
      }

      // Send Join Event Request
      const response = await fetch(
        `${EVENTS_API_URL}/${encodeURIComponent(eventId)}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (response.status === 409) {
        setIsJoined(true);
        setMessage("You have already joined this event.");

        toast.info("You have already joined this event.");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to join this event."
        );
      }

      setIsJoined(true);
      setMessage("You have successfully joined this event!");

      toast.success("You have successfully joined this event!");
    } catch (error) {
      console.error("Join event error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setIsError(true);
      setMessage(message);

      toast.error(message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleJoinEvent}
        disabled={
          isPending ||
          isChecking ||
          isJoining ||
          isJoined
        }
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending || isChecking || isJoining ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isJoining ? "Joining Event..." : "Checking..."}
          </>
        ) : isJoined ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Already Joined
          </>
        ) : (
          <>
            <HandHeart className="h-4 w-4" />
            {session ? "Join Event" : "Login to Join"}
          </>
        )}
      </button>

      {message && (
        <div
          role={isError ? "alert" : "status"}
          className={`mt-4 rounded-lg border px-3 py-3 text-center text-sm ${
            isError
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
              : "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
