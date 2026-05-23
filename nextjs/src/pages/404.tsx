import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Custom404() {
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
        <Button asChild variant="default">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
