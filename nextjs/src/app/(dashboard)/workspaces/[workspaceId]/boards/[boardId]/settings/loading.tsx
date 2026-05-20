import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function BoardSettingsLoading() {
  return (
    <main className="max-w-4xl mx-auto space-y-gap-lg px-gap-md py-gap-lg">
      <div className="space-y-gap-sm">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-gap-sm" />
        </CardHeader>
        <CardContent className="space-y-gap-md">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-gap-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-20 w-full mt-gap-md" />
        </CardContent>
      </Card>
    </main>
  );
}
