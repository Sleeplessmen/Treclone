'use client';

import { useState } from 'react';
import { useCreateList } from '@/hooks/lists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateListModalProps {
  boardId: string;
  position: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateListModal({
  boardId,
  position,
  isOpen,
  onClose,
}: CreateListModalProps) {
  const [title, setTitle] = useState('');
  const createList = useCreateList(boardId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createList.mutateAsync({ title, position });
      setTitle('');
      onClose();
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-2 rounded-md p-6 w-full max-w-md">
        <h2 className="text-headline-sm mb-4">Create List</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">List Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter list title"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createList.isPending || !title}>
              {createList.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
