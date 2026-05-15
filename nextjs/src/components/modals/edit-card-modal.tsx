'use client';

import { useState, useEffect } from 'react';
import { useUpdateCard } from '@/hooks/cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Card {
  id: string;
  title: string;
  description?: string;
  assigneeUserId?: string;
}

interface EditCardModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCardModal({ card, isOpen, onClose }: EditCardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const updateCard = useUpdateCard(card.id);

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
  }, [card]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCard.mutateAsync({
        title: title !== card.title ? title : undefined,
        description:
          description !== (card.description || '') ? description : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-2 rounded-md p-6 w-full max-w-md">
        <h2 className="text-headline-sm mb-4">Edit Card</h2>
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
            <Label htmlFor="description">Description</Label>
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
            <Button type="submit" disabled={updateCard.isPending}>
              {updateCard.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
