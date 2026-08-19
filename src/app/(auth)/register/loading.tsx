import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-gap-md">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-gap-sm">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-gap-md">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-gap-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-full mt-gap-lg" />
          <div className="flex gap-gap-sm">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
