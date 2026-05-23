'use client';

import { use, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspace, useUpdateWorkspace } from '@/hooks/workspace';
import {
  updateWorkspaceSchema,
  type UpdateWorkspaceInput,
} from '@/lib/validation/workspace';
import { AlertCircle, CalendarDays, Pencil } from 'lucide-react';
import Link from 'next/link';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';

export default function EditWorkspacePage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = use(params);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(updateWorkspaceSchema),
  });

  const {
    data: workspace,
    isLoading,
    isError,
    error,
  } = useWorkspace(workspaceId);
  const updateMutation = useUpdateWorkspace(workspaceId);

  // Prefill form when workspace loads
  useEffect(() => {
    if (workspace) {
      setValue('name', workspace.name);
      setValue('description', workspace.description ?? '');
    }
  }, [workspace, setValue]);

  const onSubmit = async (formData: UpdateWorkspaceInput) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <EditWorkspaceSkeleton />;
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-6xl space-y-gap-lg px-gap-md py-gap-lg">
        <DashboardPageHeader
          title="Edit Workspace"
          description="Update the workspace name and description."
          backHref="/workspaces"
        />
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-gap-lg">
            <div className="flex items-start gap-gap-md">
              <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
              <div className="space-y-gap-sm">
                <p className="text-body font-medium text-destructive">
                  Failed to load workspace
                </p>
                <p className="text-label-sm text-destructive">
                  {error?.message || 'Unable to retrieve workspace data.'}
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
        title="Edit Workspace"
        description="Update the workspace name and description."
        backHref="/workspaces"
      />

      <section className="grid gap-gap-lg lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Workspace details</CardTitle>
            <CardDescription>
              These details appear throughout the workspace and on the boards
              index.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-gap-md">
              <div className="space-y-gap-sm">
                <Label htmlFor="name">Workspace Name *</Label>
                <Input
                  id="name"
                  placeholder="Workspace name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-destructive text-label-sm mt-gap-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-gap-sm">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Optional description"
                  rows={5}
                  className="w-full rounded-sm border border-hairline-ghost bg-surface-2 px-gap-md py-gap-sm text-body outline-none transition-colors placeholder:text-ink-muted focus:border-primary"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-destructive text-label-sm mt-gap-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex gap-gap-md pt-gap-md">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  asChild
                >
                  <Link href="/workspaces">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateMutation.isPending}
                >
                  <Pencil className="mr-gap-sm h-4 w-4" />
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Workspace snapshot</CardTitle>
            <CardDescription>
              Quick reference information for this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-gap-md">
            <div className="rounded-sm bg-surface-1 p-gap-md">
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Workspace ID
              </p>
              <p className="mt-gap-xs text-body font-medium text-ink">
                {workspace?.id}
              </p>
            </div>
            <div className="rounded-sm bg-surface-1 p-gap-md">
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Current name
              </p>
              <p className="mt-gap-xs text-body font-medium text-ink">
                {workspace?.name}
              </p>
            </div>
            <div className="rounded-sm bg-surface-1 p-gap-md">
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Last updated
              </p>
              <p className="mt-gap-xs flex items-center gap-gap-sm text-body font-medium text-ink">
                <CalendarDays className="h-4 w-4 text-primary" />
                {workspace?.updatedAt
                  ? new Date(workspace.updatedAt).toLocaleString()
                  : 'Unavailable'}
              </p>
            </div>
            <div className="rounded-sm bg-primary/5 p-gap-md text-label-sm text-ink-muted">
              Keep names short and descriptive so they fit well across sidebar,
              header, and board cards.
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function EditWorkspaceSkeleton() {
  return (
    <main className="mx-auto max-w-6xl space-y-gap-lg px-gap-md py-gap-lg">
      <div className="space-y-gap-sm">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid gap-gap-lg lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="space-y-gap-md">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-gap-md">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
