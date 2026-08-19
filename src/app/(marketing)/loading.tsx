import { Skeleton } from '@/components/ui/skeleton';

export default function MarketingLoading() {
  return (
    <main className="space-y-gap-xl">
      {/* Hero Section */}
      <section className="bg-surface-1 py-gap-xl px-gap-md">
        <div className="max-w-4xl mx-auto text-center space-y-gap-md">
          <Skeleton className="h-12 w-96 mx-auto" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          <div className="flex gap-gap-md justify-center pt-gap-md">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-canvas py-gap-xl px-gap-md">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64 mx-auto mb-gap-xl" />
          <div className="grid md:grid-cols-3 gap-gap-lg">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface-2 rounded-sm p-gap-md space-y-gap-sm"
              >
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-light py-gap-xl px-gap-md">
        <div className="max-w-2xl mx-auto text-center space-y-gap-md">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-10 w-40 mx-auto mt-gap-md" />
        </div>
      </section>
    </main>
  );
}
