'use client';

import { useState } from 'react';
import { useCreateBoard } from '@/hooks/boards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateBoardModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBoardModal({
  workspaceId,
  isOpen,
  onClose,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createBoard = useCreateBoard(workspaceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBoard.mutateAsync({ title, description });
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-2 rounded-md p-6 w-full max-w-md">
        <h2 className="text-headline-sm mb-4">Create Board</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Board Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board title"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter board description"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createBoard.isPending || !title}>
              {createBoard.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
