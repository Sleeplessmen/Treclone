'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'next/navigation';
import {
  useWorkspaceMembers,
  useAddWorkspaceMember,
  useUpdateWorkspaceMember,
  useRemoveWorkspaceMember,
} from '@/hooks/workspace-members';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { AlertCircle, Shield, Trash2, UserPlus, Users } from 'lucide-react';

export default function MembersPage() {
  const params = useParams();
  const workspaceId =
    typeof params?.workspaceId === 'string' ? params.workspaceId : '';

  const { data, isLoading } = useWorkspaceMembers(workspaceId);
  const addMemberMutation = useAddWorkspaceMember(workspaceId);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [search, setSearch] = useState('');

  const members = data?.data ?? [];
  const totalMembers = members.length;
  const adminCount = members.filter((member) => member.role === 'admin').length;
  const ownerCount = members.filter((member) => member.role === 'owner').length;

  const visibleMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return members;

    return members.filter((member) => {
      return (
        member.user.name.toLowerCase().includes(query) ||
        member.user.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
      );
    });
  }, [members, search]);

  let memberListContent;

  if (isLoading) {
    memberListContent = <MemberListSkeleton />;
  } else if (visibleMembers.length > 0) {
    memberListContent = visibleMembers.map((member) => (
      <MemberRow key={member.id} workspaceId={workspaceId} member={member} />
    ));
  } else {
    memberListContent = (
      <div className="rounded-sm bg-surface-1 p-gap-xl text-center space-y-gap-sm">
        <p className="text-headline-sm font-heading text-ink">
          {search ? 'No members match your search' : 'No members yet'}
        </p>
        <p className="text-body text-ink-muted">
          {search
            ? 'Try a different name, email, or role filter.'
            : 'Invite the first teammate to start collaborating here.'}
        </p>
      </div>
    );
  }
  const handleAddMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    addMemberMutation.mutate(
      { email, role },
      {
        onSuccess: () => {
          setEmail('');
          setRole('member');
        },
      }
    );
  };

  return (
    <main className="mx-auto max-w-6xl space-y-gap-lg px-gap-md py-gap-lg">
      <DashboardPageHeader
        title="Team Members"
        description="Manage workspace membership, roles, and access"
      />

      <section className="grid gap-gap-md md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Members
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {isLoading ? '—' : totalMembers}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Admins
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {isLoading ? '—' : adminCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Owners
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {isLoading ? '—' : ownerCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-gap-lg lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
            <CardDescription>
              Add someone to this workspace and set their role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMember} className="space-y-gap-md">
              <div className="space-y-gap-sm">
                <label
                  htmlFor="invite-email"
                  className="text-label-sm font-medium text-ink"
                >
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="member@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={addMemberMutation.isPending}
                />
              </div>

              <div className="space-y-gap-sm">
                <label
                  htmlFor="invite-role"
                  className="text-label-sm font-medium text-ink"
                >
                  Role
                </label>
                <select
                  className="w-full rounded-sm border border-hairline-ghost bg-surface-2 px-gap-md py-gap-sm text-label-sm"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as 'member' | 'admin')
                  }
                  disabled={addMemberMutation.isPending}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full"
                disabled={addMemberMutation.isPending}
              >
                <UserPlus className="mr-gap-sm h-4 w-4" />
                {addMemberMutation.isPending ? 'Adding...' : 'Add Member'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-gap-md">
            <div className="flex flex-col gap-gap-sm md:flex-row md:items-end md:justify-between">
              <div>
                <CardTitle>
                  {isLoading ? 'Loading members...' : `${totalMembers} members`}
                </CardTitle>
                <CardDescription>
                  Active workspace members and role assignments.
                </CardDescription>
              </div>
              <Input
                className="md:max-w-xs"
                placeholder="Search members"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-gap-md">
            {memberListContent}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function MemberListSkeleton() {
  return (
    <div className="space-y-gap-md">
      {['member-skeleton-1', 'member-skeleton-2', 'member-skeleton-3'].map(
        (id) => (
          <div
            key={id}
            className="flex flex-col gap-gap-md rounded-sm bg-surface-1 p-gap-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-gap-sm">
              <div className="h-5 w-40 animate-pulse rounded-sm bg-canvas" />
              <div className="h-4 w-56 animate-pulse rounded-sm bg-canvas" />
              <div className="h-4 w-20 animate-pulse rounded-sm bg-canvas" />
            </div>
            <div className="flex gap-gap-sm">
              <div className="h-9 w-24 animate-pulse rounded-sm bg-canvas" />
              <div className="h-9 w-9 animate-pulse rounded-sm bg-canvas" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

function MemberRow({
  workspaceId,
  member,
}: Readonly<{
  workspaceId: string;
  member: {
    id: string;
    role: 'owner' | 'admin' | 'member';
    user: {
      id: string;
      email: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}>) {
  const [showConfirm, setShowConfirm] = useState(false);
  const updateMemberMutation = useUpdateWorkspaceMember(workspaceId, member.id);
  const removeMutation = useRemoveWorkspaceMember(workspaceId, member.id);

  return (
    <>
      <div className="flex flex-col gap-gap-md rounded-sm bg-surface-1 p-gap-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-gap-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-label-sm font-semibold text-primary">
            {member.user.name
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join('') || member.user.email.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-body font-medium text-ink">{member.user.name}</p>
            <p className="text-label-sm text-ink-muted">{member.user.email}</p>
            <div className="mt-gap-sm flex flex-wrap gap-gap-sm">
              <span className="rounded-full bg-canvas px-gap-sm py-1 text-label-sm text-ink-muted capitalize">
                {member.role}
              </span>
              <span className="rounded-full bg-primary/10 px-gap-sm py-1 text-label-sm text-primary">
                Joined {new Date(member.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-gap-sm sm:flex-row sm:items-center">
          {member.role === 'owner' ? (
            <div className="rounded-sm bg-canvas px-gap-md py-gap-sm text-label-sm text-ink-muted">
              Owner
            </div>
          ) : (
            <select
              className="w-full rounded-sm border border-hairline-ghost bg-surface-2 px-gap-md py-gap-sm text-label-sm sm:w-auto"
              value={member.role}
              disabled={updateMemberMutation.isPending}
              onChange={(e) => {
                updateMemberMutation.mutate({
                  role: e.target.value as 'member' | 'admin',
                });
              }}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button
            className="rounded-sm p-gap-sm text-destructive hover:bg-destructive/5"
            onClick={() => setShowConfirm(true)}
            disabled={removeMutation.isPending || member.role === 'owner'}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Remove Member"
        description={`Remove ${member.user.email} from this workspace?`}
        confirmLabel="Remove"
        loadingLabel="Removing..."
        isLoading={removeMutation.isPending}
        onOpenChange={setShowConfirm}
        onConfirm={() => {
          removeMutation.mutate(undefined, {
            onSuccess: () => setShowConfirm(false),
          });
        }}
      />
    </>
  );
}
