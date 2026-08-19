import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function WorkspaceSettingsLoading() {
  return (
    <main className="max-w-4xl mx-auto space-y-gap-lg px-gap-md py-gap-lg">
      <div className="space-y-gap-sm">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid md:grid-cols-2 gap-gap-lg">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-gap-sm" />
            </CardHeader>
            <CardContent className="space-y-gap-md">
              {[1, 2].map((j) => (
                <div key={j} className="space-y-gap-sm">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
