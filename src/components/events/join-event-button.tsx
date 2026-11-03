
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HandHeart, CheckCircle2, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface JoinEventButtonProps {
  eventId: string;
}

const EVENTS_API_URL =
  process.env.NEXT_PUBLIC_EVENTS_API_URL ||
  "http://localhost:3000/upcomming-events";

export default function JoinEventButton({
  eventId,
}: JoinEventButtonProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleJoinEvent = async () => {
    setMessage("");
    setIsError(false);

    // Redirect guest users to login
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
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error(
          tokenError?.message || "Unable to get authentication token."
        );
      }

      // Send authenticated join request
      const response = await fetch(
        `${EVENTS_API_URL}/${encodeURIComponent(eventId)}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const result = await response.json();

      if (response.status === 409) {
        setIsJoined(true);
        setMessage("You have already joined this event.");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to join this event."
        );
      }

      setIsJoined(true);
      setMessage("You have successfully joined this event!");
    } catch (error) {
      console.error("Join event error:", error);

      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleJoinEvent}
        disabled={isPending || isJoining || isJoined}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#226B52] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#153F35] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending || isJoining ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isPending ? "Checking..." : "Joining Event..."}
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
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <p className="mt-4 text-center text-xs leading-5 text-gray-400">
        Join your community and help create a positive impact.
      </p>
    </div>
  );
}
