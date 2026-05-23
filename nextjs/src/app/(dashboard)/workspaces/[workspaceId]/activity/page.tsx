'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspaceActivities } from '@/hooks/workspace-activity';
import {
  Activity,
  AlertCircle,
  CalendarDays,
  Clock3,
  Users,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ActivityPage() {
  const params = useParams();
  const workspaceId =
    typeof params?.workspaceId === 'string' ? params.workspaceId : '';

  const { data, isLoading, error } = useWorkspaceActivities(workspaceId);
  const activities = data?.activities || [];
  const totalActivities = activities.length;
  const uniqueActors = new Set(activities.map((activity) => activity.user))
    .size;
  const latestActivity = activities[0];

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
      <main className="mx-auto max-w-6xl space-y-gap-lg px-gap-md py-gap-lg">
        <div className="space-y-gap-sm">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid gap-gap-md md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-gap-md pt-gap-lg">
                <Skeleton className="h-10 w-10 rounded-sm" />
                <div className="space-y-gap-sm">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-gap-md">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="space-y-gap-sm rounded-sm bg-surface-1 p-gap-md"
              >
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
      <main className="mx-auto max-w-6xl space-y-gap-lg px-gap-md py-gap-lg">
        <DashboardPageHeader
          title="Activity Log"
          description="Recent actions in this workspace."
          backHref="/workspaces"
        />
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
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-gap-md"
                >
                  <Link href="/workspaces">Back to workspaces</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-gap-lg px-gap-md py-gap-lg">
      <DashboardPageHeader
        title="Activity Log"
        description="Recent workspace activity with clear timestamps and grouped context."
        backHref="/workspaces"
      />

      <section className="grid gap-gap-md md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Events
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {totalActivities}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Contributors
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {uniqueActors}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Latest
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {latestActivity
                  ? formatDistanceToNow(new Date(latestActivity.occurredAt), {
                      addSuffix: true,
                    })
                  : 'No activity'}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Showing the latest changes across boards, lists, cards, and members.
          </CardDescription>
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
                      className="flex gap-gap-md rounded-sm bg-surface-1 p-gap-md"
                    >
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                        <CalendarDays className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-body text-ink">
                          <span className="font-semibold">{activity.user}</span>{' '}
                          {activity.summary}{' '}
                          <span className="text-primary">
                            {activity.target}
                          </span>
                        </p>
                        <div className="mt-gap-xs flex flex-wrap gap-gap-sm text-label-sm text-ink-muted">
                          <span>{activity.absoluteTime}</span>
                          <span>
                            {formatDistanceToNow(
                              new Date(activity.occurredAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="py-gap-xl text-center space-y-gap-sm">
              <p className="text-headline-sm font-heading text-ink">
                No activities yet
              </p>
              <p className="text-body text-ink-muted">
                Actions from boards, lists, cards, and members will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
