'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspaceActivities } from '@/hooks/workspace-activity';
import { AlertCircle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';

export default function ActivityPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { data, isLoading, error } = useWorkspaceActivities(workspaceId);
  const activities = data?.activities || [];

  const groupedActivities = useMemo(() => {
    return activities.reduce<Record<string, typeof activities>>(
      (groups, activity) => {
        const key = format(new Date(activity.occurredAt), 'PP');
        groups[key] ||= [];
        groups[key].push(activity);
        return groups;
      },
      {}
    );
  }, [activities]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl space-y-gap-lg px-gap-md py-gap-lg">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-gap-md">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-gap-sm">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl space-y-gap-lg px-gap-md py-gap-lg">
        <DashboardPageHeader title="Activity Log" />
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-gap-lg">
            <div className="flex items-start gap-gap-md">
              <AlertCircle className="mt-gap-sm h-5 w-5 flex-shrink-0 text-destructive" />
              <div>
                <p className="text-body font-medium text-destructive">
                  Failed to load activities
                </p>
                <p className="text-label-sm text-destructive">
                  {error.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-gap-lg px-gap-md py-gap-lg">
      <DashboardPageHeader
        title="Activity Log"
        description="Recent workspace activity with clear timestamps and grouped context."
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-gap-lg">
          {Object.keys(groupedActivities).length > 0 ? (
            Object.entries(groupedActivities).map(([day, dayActivities]) => (
              <section key={day} className="space-y-gap-md">
                <p className="text-label-sm font-semibold uppercase tracking-wide text-ink-muted">
                  {day}
                </p>

                <div className="space-y-gap-md">
                  {dayActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-sm bg-surface-1 p-gap-md"
                    >
                      <p className="text-body text-ink">
                        <span className="font-semibold">{activity.user}</span>{' '}
                        {activity.summary}{' '}
                        <span className="text-primary">{activity.target}</span>
                      </p>
                      <div className="mt-gap-xs flex flex-wrap gap-gap-sm text-label-sm text-ink-muted">
                        <span>{activity.absoluteTime}</span>
                        <span>
                          {formatDistanceToNow(new Date(activity.occurredAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="py-gap-lg text-center text-body text-ink-muted">
              No activities yet
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
