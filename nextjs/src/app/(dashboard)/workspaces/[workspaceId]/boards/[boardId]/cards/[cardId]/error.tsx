'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function CardDetailError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error('Card detail error:', error);
  }, [error]);

  return (
    <main className="space-y-gap-lg px-gap-md py-gap-lg">
      <div className="flex items-center gap-gap-md p-gap-md bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div className="flex-1">
          <h2 className="text-body-bold text-red-900">Failed to load card</h2>
          <p className="text-body text-red-700 mt-gap-sm">
            {error.message || 'An error occurred while loading this card'}
          </p>
        </div>
        <Button onClick={() => reset()} size="sm" variant="default">
          Retry
        </Button>
      </div>
    </main>
  );
}
