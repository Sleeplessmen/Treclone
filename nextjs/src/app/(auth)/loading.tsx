export default function Loading() {
  return (
    <div className="bg-canvas min-h-screen flex items-center justify-center p-gap-md">
      <div className="w-full max-w-md rounded-sm border border-hairline-ghost bg-surface-2 p-gap-lg shadow-sm">
        <div className="space-y-gap-md">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-surface-3" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-surface-3" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-surface-3" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-surface-3" />
          </div>

          <div className="flex items-center gap-3 pt-gap-sm">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary/70" />
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary/40" />
            <span className="ml-2 text-sm text-ink-muted">
              Loading your session...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
