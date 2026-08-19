'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function RegisterError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error('Register error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-gap-md">
      <div className="max-w-md w-full space-y-gap-lg text-center">
        <div className="flex justify-center">
          <div className="p-gap-md bg-red-100 rounded-lg">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="space-y-gap-sm">
          <h1 className="text-headline-md font-heading text-ink">
            Registration failed
          </h1>
          <p className="text-body text-ink-muted">
            {error.message || 'Failed to load registration page'}
          </p>
        </div>
        <div className="flex gap-gap-md justify-center pt-gap-md">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button
            onClick={() => (globalThis.location.href = '/')}
            variant="outline"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
