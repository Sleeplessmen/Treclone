'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  description: string;
}

export default function EditWorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockWorkspace = {
        id: '1',
        name: 'Design Team',
        description: 'All design projects and tasks',
      };
      setWorkspace(mockWorkspace);
      setFormData({
        name: mockWorkspace.name,
        description: mockWorkspace.description,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log('Workspace updated:', formData);
  };

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
            Edit Workspace
          </h1>
          <p className="text-body text-ink-muted">
            Update your workspace details
          </p>
        </div>
      </div>

      {/* Workspace Information */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-gap-md">
          <div className="space-y-gap-sm">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Design Team"
            />
          </div>

          <div className="space-y-gap-sm">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What's this workspace for?"
              className="w-full px-gap-md py-gap-sm border border-hairline-ghost rounded-sm bg-surface-2 text-body"
              rows={4}
            />
          </div>

          <div className="flex gap-gap-md pt-gap-md">
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" asChild>
              <a href="/workspaces">Cancel</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-title-md">Workspace ID</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-ink-muted font-mono">{workspace.id}</p>
        </CardContent>
      </Card>
    </main>
  );
}
