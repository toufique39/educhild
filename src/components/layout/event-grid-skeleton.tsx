interface EventGridSkeletonProps {
  count?: number;
}

export function EventGridSkeleton({
  count = 6,
}: EventGridSkeletonProps) {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading events"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        >
          {/* Image Skeleton */}
          <div className="aspect-[16/10] w-full animate-pulse bg-muted" />

          {/* Content Skeleton */}
          <div className="flex flex-1 flex-col p-5">
            {/* Title */}
            <div className="mb-4 space-y-2">
              <div className="h-5 w-full animate-pulse rounded bg-muted" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            </div>

            {/* Date */}
            <div className="mb-3 flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            </div>

            {/* Time */}
            <div className="mb-3 flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </div>

            {/* Location */}
            <div className="mb-5 flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            </div>

            {/* Button */}
            <div className="mt-auto h-11 w-full animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      ))}

      <span className="sr-only">Loading upcoming events...</span>
    </div>
  );
}