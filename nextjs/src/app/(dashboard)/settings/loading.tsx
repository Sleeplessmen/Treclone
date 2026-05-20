import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SettingsLoading() {
  return (
    <main className="max-w-4xl mx-auto space-y-gap-lg px-gap-md py-gap-lg">
      {/* Header Skeleton */}
      <div className="space-y-gap-sm">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Profile Settings Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-gap-sm" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-gap-md">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-gap-sm">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-sm" />
            </div>
          ))}
          <Skeleton className="h-10 w-32 mt-gap-md rounded-sm" />
        </CardContent>
      </Card>

      {/* Security Settings Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-gap-sm" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-gap-md">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-gap-sm">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-sm" />
            </div>
          ))}
          <Skeleton className="h-10 w-32 mt-gap-md rounded-sm" />
        </CardContent>
      </Card>

      {/* Preferences Settings Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-gap-sm" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-gap-md">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-gap-sm"
            >
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-gap-sm" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone Skeleton */}
      <Card className="border-destructive/20">
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-gap-sm" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="p-gap-md bg-destructive/5 rounded-sm space-y-gap-sm">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full mb-gap-sm" />
            <Skeleton className="h-3 w-full mb-gap-sm" />
            <Skeleton className="h-10 w-32 mt-gap-sm rounded-sm" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
