'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
}

export default function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [visibility, setVisibility] = useState('private');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWorkspace({ id: '1', name: 'Design Team' });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!workspace) return <div>Loading...</div>;

  return (
    <main className="max-w-2xl mx-auto space-y-gap-lg">
      {/* Header */}
      <div className="flex items-center gap-gap-md">
        <Button variant="ghost" size="icon-sm" asChild>
          <a href="/workspaces">
            <ArrowLeft className="w-4 h-4" />
          </a>
        </Button>
        <div>
          <h1 className="text-headline-lg font-heading text-ink">
            Workspace Settings
          </h1>
          <p className="text-body text-ink-muted">
            Manage {workspace.name} settings
          </p>
        </div>
      </div>

      {/* Visibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
          <CardDescription>
            Control who can see and access this workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-gap-md">
          <label className="flex items-center gap-gap-md cursor-pointer p-gap-md hover:bg-surface-1 rounded-sm">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === 'private'}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <div>
              <p className="text-body text-ink font-medium">Private</p>
              <p className="text-label-sm text-ink-muted">
                Only members you invite can access
              </p>
            </div>
          </label>

          <label className="flex items-center gap-gap-md cursor-pointer p-gap-md hover:bg-surface-1 rounded-sm">
            <input
              type="radio"
              name="visibility"
              value="team"
              checked={visibility === 'team'}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <div>
              <p className="text-body text-ink font-medium">Team</p>
              <p className="text-label-sm text-ink-muted">
                Anyone in your organization can join
              </p>
            </div>
          </label>

          <label className="flex items-center gap-gap-md cursor-pointer p-gap-md hover:bg-surface-1 rounded-sm">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === 'public'}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <div>
              <p className="text-body text-ink font-medium">Public</p>
              <p className="text-label-sm text-ink-muted">
                Anyone with the link can access
              </p>
            </div>
          </label>

          <Button variant="default" className="mt-gap-md">
            Save Visibility
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Email notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-gap-md">
          <div className="flex items-center justify-between p-gap-md">
            <div>
              <p className="text-body text-ink font-medium">Daily Summary</p>
              <p className="text-label-sm text-ink-muted">
                Get daily activity summary
              </p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-gap-md border-t border-hairline-ghost pt-gap-md">
            <div>
              <p className="text-body text-ink font-medium">Mention Alerts</p>
              <p className="text-label-sm text-ink-muted">
                Notify when mentioned in cards
              </p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-gap-md bg-destructive/5 rounded-sm space-y-gap-sm">
            <p className="text-body text-ink font-medium">Delete Workspace</p>
            <p className="text-label-sm text-ink-muted">
              Once you delete this workspace, there is no going back. All boards
              and cards will be permanently deleted.
            </p>
            <Button
              variant="destructive"
              className="mt-gap-md"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-gap-sm" />
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">
                Delete Workspace?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-gap-lg">
              <p className="text-body text-ink">
                Are you absolutely sure? This action cannot be undone. All
                boards, lists, and cards will be permanently deleted.
              </p>

              <div className="flex gap-gap-md">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    console.log('Deleting workspace:', workspace.id);
                    setShowDeleteConfirm(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
