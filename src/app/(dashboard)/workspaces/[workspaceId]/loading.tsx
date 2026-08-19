import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function WorkspaceDetailLoading() {
  return (
    <main className="space-y-gap-lg px-gap-md py-gap-lg">
      {/* Header */}
      <div className="space-y-gap-sm">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-3 gap-gap-lg">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-gap-lg text-center space-y-gap-sm">
              <Skeleton className="h-12 w-16 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-gap-md">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
