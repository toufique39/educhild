"use client";

import Link from "next/link";
import { ArrowUpRight, Loader2, PlusCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function VolunteerCta() {
  const { data: session, isPending } = authClient.useSession();

  // Keep layout stable while the session resolves
  if (isPending) {
    return (
      <div
        role="status"
        aria-label="Loading volunteer button"
        className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 text-sm font-semibold text-foreground"
      >
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (session) {
    return (
      <Link
        href="/create-event"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-4 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-secondary hover:text-brand-text"
      >
        Create an Event
        <PlusCircle className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href="/register"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-4 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-secondary hover:text-brand-text"
    >
      Become a Volunteer
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}
