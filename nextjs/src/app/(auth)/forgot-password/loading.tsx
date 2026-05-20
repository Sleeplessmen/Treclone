import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ForgotPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-gap-md">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-gap-sm">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-gap-md">
          <div className="space-y-gap-sm">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-gap-lg" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
