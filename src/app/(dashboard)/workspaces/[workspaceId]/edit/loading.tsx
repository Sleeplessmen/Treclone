import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function WorkspaceEditLoading() {
  return (
    <main className="max-w-2xl mx-auto space-y-gap-lg px-gap-md py-gap-lg">
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-gap-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="flex gap-gap-md pt-gap-md">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
