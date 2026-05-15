'use client';

import { useState } from 'react';
import { useCreateCard } from '@/hooks/cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateCardModalProps {
  listId: string;
  position: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCardModal({
  listId,
  position,
  isOpen,
  onClose,
}: CreateCardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createCard = useCreateCard(listId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCard.mutateAsync({ title, description, position });
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-2 rounded-md p-6 w-full max-w-md">
        <h2 className="text-headline-sm mb-4">Create Card</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Card Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter card description"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCard.isPending || !title}>
              {createCard.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
