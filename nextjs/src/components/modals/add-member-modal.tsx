'use client';

import { useState } from 'react';
import { useAddMember } from '@/hooks/members';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddMemberModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddMemberModal({
  workspaceId,
  isOpen,
  onClose,
}: AddMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('editor');
  const addMember = useAddMember(workspaceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMember.mutateAsync({ email, role });
      setEmail('');
      setRole('editor');
      onClose();
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-2 rounded-md p-6 w-full max-w-md">
        <h2 className="text-headline-sm mb-4">Add Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member email"
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as 'viewer' | 'editor' | 'admin')
              }
              className="w-full px-3 py-2 border rounded-sm bg-surface-2 text-ink"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMember.isPending || !email}>
              {addMember.isPending ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
