import { Skeleton } from '@/components/ui/skeleton';

export default function RedirectLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="space-y-gap-md text-center">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </div>
  );
}
