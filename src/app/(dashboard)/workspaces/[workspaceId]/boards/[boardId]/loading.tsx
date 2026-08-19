import { Skeleton } from '@/components/ui/skeleton';

export default function BoardDetailLoading() {
  return (
    <main className="space-y-gap-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-gap-md py-gap-lg">
        <div className="space-y-gap-sm">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-gap-md">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Kanban Board Skeleton */}
      <div className="flex gap-gap-lg px-gap-md overflow-x-auto pb-gap-md">
        {[1, 2, 3, 4].map((listId) => (
          <div
            key={listId}
            className="flex-shrink-0 w-72 bg-surface-1 rounded-lg p-gap-md space-y-gap-md"
          >
            <Skeleton className="h-6 w-40" />
            <div className="space-y-gap-md">
              {[1, 2, 3].map((cardId) => (
                <Skeleton key={cardId} className="h-20 w-full rounded-sm" />
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
