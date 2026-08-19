import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function BoardsLoading() {
  return (
    <main className="space-y-gap-lg px-gap-md py-gap-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-gap-sm flex-1">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap-lg">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="pt-gap-lg space-y-gap-md">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-gap-sm pt-gap-md border-t border-hairline-ghost">
                <Skeleton className="flex-1 h-9" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
