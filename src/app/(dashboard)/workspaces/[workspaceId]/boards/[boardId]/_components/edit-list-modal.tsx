'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteList, useUpdateList } from '@/hooks/lists';
import { X, Trash2 } from 'lucide-react';

interface ListItem {
  id: string;
  title: string;
  position: number;
  boardId: string;
}

interface EditListModalProps {
  workspaceId: string;
  boardId: string;
  list: ListItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditListModal({
  workspaceId,
  boardId,
  list,
  isOpen,
  onClose,
  onSuccess,
}: Readonly<EditListModalProps>) {
  const [title, setTitle] = useState(list.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setTitle(list.title);
    setShowDeleteConfirm(false);
  }, [list.id, list.title]);

  const updateMutation = useUpdateList(workspaceId, boardId, list.id);
  const deleteMutation = useDeleteList(workspaceId, boardId, list.id);

  const handleSave = () => {
    if (!title.trim()) return;

    updateMutation.mutate(
      { title: title.trim() },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onSuccess?.();
        setShowDeleteConfirm(false);
        onClose();
      },
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 items-center justify-center bg-black/50 ${
          isOpen ? 'flex' : 'hidden'
        }`}
      >
        <Card className="w-full max-w-md">
          <div className="flex items-center justify-between gap-gap-md border-b border-hairline-ghost p-gap-lg">
            <div>
              <h2 className="text-headline-sm font-heading text-ink">
                Edit List
              </h2>
              <p className="text-label-sm text-ink-muted">
                Rename the list or delete it from the board.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-ink-muted hover:text-ink"
              disabled={updateMutation.isPending || deleteMutation.isPending}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-gap-md p-gap-lg">
            <div className="space-y-gap-sm">
              <Label htmlFor="list-title">List Title</Label>
              <Input
                id="list-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={updateMutation.isPending || deleteMutation.isPending}
                autoFocus
              />
            </div>

            <div className="flex gap-gap-md pt-gap-sm">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={updateMutation.isPending || deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleSave}
                disabled={updateMutation.isPending || !title.trim()}
              >
                Save
              </Button>
            </div>

            <div className="border-t border-hairline-ghost pt-gap-md">
              <p className="text-label-sm text-ink-muted">
                Deleting the list will remove its cards too.
              </p>
              <Button
                variant="destructive"
                className="mt-gap-md"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={updateMutation.isPending || deleteMutation.isPending}
              >
                <Trash2 className="mr-gap-sm h-4 w-4" />
                Delete List
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete List"
        description={`Delete "${list.title}"? This will delete all cards in the list.`}
        confirmLabel="Delete List"
        isLoading={deleteMutation.isPending}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
      />
    </>
  );
}
