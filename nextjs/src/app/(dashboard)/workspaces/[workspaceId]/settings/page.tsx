'use client';

import { useEffect, useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useWorkspaceSettings,
  useUpdateWorkspaceSettings,
} from '@/hooks/workspace-settings';
import { useDeleteWorkspace } from '@/hooks/workspace';
import {
  updateWorkspaceSettingsSchema,
  type UpdateWorkspaceSettingsInput,
} from '@/lib/validation/workspace-settings';
import { AlertTriangle, BellRing, Globe, Shield, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';

export default function WorkspaceSettingsPage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = use(params);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Queries
  const {
    data: settingsData,
    isLoading,
    error,
  } = useWorkspaceSettings(workspaceId);

  // Mutations
  const updateSettingsMutation = useUpdateWorkspaceSettings(workspaceId);
  const deleteMutation = useDeleteWorkspace(workspaceId);

  // React Hook Form
  const { register, handleSubmit, setValue, watch } =
    useForm<UpdateWorkspaceSettingsInput>({
      resolver: zodResolver(updateWorkspaceSettingsSchema),
      defaultValues: {
        visibility: 'private',
        notifications: {
          dailySummary: true,
          mentionAlerts: true,
        },
      },
    });

  const visibility = watch('visibility');
  const notifications = watch('notifications');

  const visibilityDescription = (option: 'private' | 'team' | 'public') => {
    if (option === 'private') return 'Only members you invite can access.';
    if (option === 'team') return 'Anyone in your organization can join.';
    return 'Anyone with the link can access.';
  };

  // Load initial data
  useEffect(() => {
    if (settingsData?.settings) {
      setValue('visibility', settingsData.settings.visibility);
      setValue(
        'notifications.dailySummary',
        Boolean(settingsData.settings.notifications?.dailySummary)
      );
      setValue(
        'notifications.mentionAlerts',
        Boolean(settingsData.settings.notifications?.mentionAlerts)
      );
    }
  }, [settingsData, setValue]);

  const onSubmit = async (formData: UpdateWorkspaceSettingsInput) => {
    updateSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return <WorkspaceSettingsSkeleton />;
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl space-y-gap-lg px-gap-md py-gap-lg">
        <DashboardPageHeader
          title="Workspace Settings"
          description="Configure visibility, notifications, and destructive actions."
          backHref="/workspaces"
        />
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-gap-lg">
            <div className="flex items-start gap-gap-md">
              <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
              <div className="space-y-gap-sm">
                <p className="text-body font-medium text-destructive">
                  Failed to load settings
                </p>
                <p className="text-label-sm text-destructive">
                  {error.message}
                </p>
                <Button asChild variant="outline" size="sm">
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
        title="Workspace Settings"
        description="Configure visibility, notifications, and destructive actions."
        backHref="/workspaces"
      />

      <section className="grid gap-gap-md md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Visibility
              </p>
              <p className="text-headline-sm font-heading text-ink capitalize">
                {visibility || 'private'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Daily summary
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {notifications?.dailySummary ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Mention alerts
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {notifications?.mentionAlerts ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-gap-lg lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Visibility & notifications</CardTitle>
            <CardDescription>
              Control who can see this workspace and how updates are delivered.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-gap-lg">
              <div className="space-y-gap-md">
                <p className="text-title-md font-heading text-ink">
                  Visibility
                </p>
                <div className="grid gap-gap-md">
                  {['private', 'team', 'public'].map((option) => {
                    return (
                      <label
                        key={option}
                        className="flex cursor-pointer items-start gap-gap-md rounded-sm bg-surface-1 p-gap-md hover:bg-surface-2"
                      >
                        <input
                          type="radio"
                          value={option}
                          {...register('visibility')}
                          className="mt-1"
                        />
                        <div className="min-w-0">
                          <p className="text-body font-medium text-ink capitalize">
                            {option}
                          </p>
                          <p className="text-label-sm text-ink-muted">
                            {visibilityDescription(
                              option as 'private' | 'team' | 'public'
                            )}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-gap-md">
                <p className="text-title-md font-heading text-ink">
                  Notifications
                </p>
                <div className="grid gap-gap-md">
                  <label className="flex items-center gap-gap-md rounded-sm bg-surface-1 p-gap-md hover:bg-surface-2">
                    <input
                      type="checkbox"
                      {...register('notifications.dailySummary')}
                    />
                    <div>
                      <p className="text-body font-medium text-ink">
                        Daily summary
                      </p>
                      <p className="text-label-sm text-ink-muted">
                        Receive a daily digest of activity in this workspace.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-gap-md rounded-sm bg-surface-1 p-gap-md hover:bg-surface-2">
                    <input
                      type="checkbox"
                      {...register('notifications.mentionAlerts')}
                    />
                    <div>
                      <p className="text-body font-medium text-ink">
                        Mention alerts
                      </p>
                      <p className="text-label-sm text-ink-muted">
                        Get notified when someone mentions you.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-gap-md pt-gap-md">
                <Button
                  type="submit"
                  variant="default"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/workspaces">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Permanent actions that affect all boards and cards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-gap-sm rounded-sm bg-destructive/5 p-gap-md">
              <p className="text-body font-medium text-ink">Delete workspace</p>
              <p className="text-label-sm text-ink-muted">
                This removes the workspace, all boards, lists, cards, and member
                access permanently.
              </p>
              <Button
                variant="destructive"
                className="mt-gap-md"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-gap-sm h-4 w-4" />
                Delete Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Workspace"
        description="Delete this workspace? This will permanently delete its boards, lists, and cards."
        isLoading={deleteMutation.isPending}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={() => {
          deleteMutation.mutate(undefined, {
            onSuccess: () => setShowDeleteConfirm(false),
          });
        }}
      />
    </main>
  );
}

function WorkspaceSettingsSkeleton() {
  return (
    <main className="mx-auto max-w-6xl space-y-gap-lg px-gap-md py-gap-lg">
      <div className="space-y-gap-sm">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid gap-gap-md md:grid-cols-3">
        {[
          'settings-skeleton-1',
          'settings-skeleton-2',
          'settings-skeleton-3',
        ].map((id) => (
          <Card key={id}>
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

      <div className="grid gap-gap-lg lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-gap-lg">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
