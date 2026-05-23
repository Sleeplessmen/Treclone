import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-gap-md">
      <div className="w-full max-w-md space-y-gap-lg text-center">
        <div className="space-y-gap-sm">
          <p className="text-label-sm font-semibold uppercase tracking-wide text-primary">
            404
          </p>
          <h1 className="text-headline-lg font-heading text-ink">
            Page not found
          </h1>
          <p className="text-body text-ink-muted">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-sm bg-gradient-to-br from-primary to-primary-container px-6 text-xs font-semibold uppercase tracking-widest text-on-primary transition-all hover:from-primary/90 hover:to-primary-container/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
