'use client';

import { useDeleteBoard } from '@/hooks/boards';
import { Button } from '@/components/ui/button';

interface DeleteBoardModalProps {
  workspaceId: string;
  boardId: string;
  boardTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteBoardModal({
  workspaceId,
  boardId,
  boardTitle,
  isOpen,
  onClose,
}: DeleteBoardModalProps) {
  const deleteBoard = useDeleteBoard(workspaceId, boardId);

  const handleDelete = async () => {
    try {
      await deleteBoard.mutateAsync();
      onClose();
    } catch (error) {
      console.error('Failed to delete board:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-2 rounded-md p-6 w-full max-w-md">
        <h2 className="text-headline-sm mb-2">Delete Board</h2>
        <p className="text-body text-ink-muted mb-4">
          Are you sure you want to delete <strong>{boardTitle}</strong>? This
          action cannot be undone and will delete all lists and cards.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteBoard.isPending}
          >
            {deleteBoard.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
