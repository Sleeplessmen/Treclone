'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Settings, Trash2, Users } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  boardsCount: number;
  owner: string;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWorkspaces([
        {
          id: '1',
          name: 'Design Team',
          description: 'All design projects and tasks',
          membersCount: 5,
          boardsCount: 8,
          owner: 'You',
        },
        {
          id: '2',
          name: 'Product Sprint',
          description: 'Current product development',
          membersCount: 8,
          boardsCount: 12,
          owner: 'You',
        },
        {
          id: '3',
          name: 'Marketing Q2',
          description: 'Q2 marketing campaigns',
          membersCount: 3,
          boardsCount: 5,
          owner: 'Sarah Chen',
        },
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="space-y-gap-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-gap-sm">
          <h1 className="text-headline-lg font-heading text-ink">Workspaces</h1>
          <p className="text-body text-ink-muted">
            Manage your workspaces and teams
          </p>
        </div>
        <Button variant="default" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-gap-sm" />
          New Workspace
        </Button>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap-lg">
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="hover:shadow-md transition-shadow group"
            >
              <CardContent className="pt-gap-lg space-y-gap-md">
                {/* Workspace Name */}
                <a href={`/workspaces/${workspace.id}`}>
                  <h3 className="text-title-md font-heading text-ink hover:text-primary transition-colors">
                    {workspace.name}
                  </h3>
                </a>

                {/* Description */}
                <p className="text-body text-ink-muted line-clamp-2">
                  {workspace.description}
                </p>

                {/* Stats */}
                <div className="flex gap-gap-lg text-label-sm text-ink-muted">
                  <div className="flex items-center gap-gap-xs">
                    <Users className="w-4 h-4" />
                    <span>{workspace.membersCount}</span>
                  </div>
                  <div>
                    <span>{workspace.boardsCount} boards</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-gap-sm pt-gap-md border-t border-hairline-ghost">
                  <Button asChild variant="ghost" size="sm" className="flex-1">
                    <a href={`/workspaces/${workspace.id}`}>Open</a>
                  </Button>
                  <Button asChild variant="ghost" size="icon-sm">
                    <a href={`/workspaces/${workspace.id}/edit`}>
                      <Settings className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="py-gap-xl text-center">
              <p className="text-body text-ink-muted mb-gap-md">
                No workspaces yet. Create one to get started!
              </p>
              <Button
                variant="default"
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Workspace
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            console.log('Creating workspace:', data);
            setShowCreateModal(false);
          }}
        />
      )}
    </main>
  );
}

function CreateWorkspaceModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: { name: string; description: string }) => void;
}) {
  const [formData, setFormData] = useState({ name: '', description: '' });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <div className="p-gap-lg space-y-gap-lg border-b border-hairline-ghost">
          <h2 className="text-headline-sm font-heading text-ink">
            Create Workspace
          </h2>
        </div>

        <div className="p-gap-lg space-y-gap-md">
          <div className="space-y-gap-sm">
            <label className="text-label-sm font-medium text-ink">
              Workspace Name
            </label>
            <input
              type="text"
              placeholder="e.g., Design Team"
              className="w-full px-gap-md py-gap-sm border border-hairline-ghost rounded-sm bg-surface-2 text-body"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-gap-sm">
            <label className="text-label-sm font-medium text-ink">
              Description
            </label>
            <textarea
              placeholder="What's this workspace for?"
              className="w-full px-gap-md py-gap-sm border border-hairline-ghost rounded-sm bg-surface-2 text-body"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex gap-gap-md pt-gap-md">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => {
                onCreate(formData);
                setFormData({ name: '', description: '' });
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
