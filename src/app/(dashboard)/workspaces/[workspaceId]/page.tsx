'use client';

import { useParams } from 'next/navigation';
import { useWorkspace } from '@/hooks/workspace';
import { useBoards, useCreateBoard, useDeleteBoard } from '@/hooks/boards';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight,
  BarChart3,
  ListTodo,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';

export default function WorkspaceDetailPage() {
  const params = useParams();
  const workspaceId =
    typeof params?.workspaceId === 'string' ? params.workspaceId : '';
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);

  // Queries
  const { data: workspace, isLoading: workspaceLoading } =
    useWorkspace(workspaceId);
  const { data: boardsData, isLoading: boardsLoading } = useBoards(workspaceId);
  const createBoardMutation = useCreateBoard(workspaceId);

  const boards = boardsData?.boards || [];
  const hasBoards = boards.length > 0;
  const boardCount = boards.length;
  const listCount = boards.reduce(
    (total, board) => total + (board._count?.lists || 0),
    0
  );
  const cardCount = boards.reduce(
    (total, board) => total + (board._count?.cards || 0),
    0
  );

  // Handle create board
  const handleCreateBoard = (data: { title: string; description: string }) => {
    createBoardMutation.mutate(data, {
      onSuccess: () => {
        setShowCreateBoardModal(false);
      },
    });
  };

  if (workspaceLoading) {
    return (
      <main className="space-y-gap-lg">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap-lg">
          {[
            'workspace-skeleton-1',
            'workspace-skeleton-2',
            'workspace-skeleton-3',
          ].map((id) => (
            <Card key={id}>
              <CardContent className="pt-gap-lg space-y-gap-md">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  const boardsContent =
    boards.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap-lg">
        {boards.map((board) => (
          <Card
            key={board.id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
          >
            <CardContent className="pt-gap-lg space-y-gap-md">
              <a href={`/workspaces/${workspaceId}/boards/${board.id}`}>
                <h3 className="text-title-md font-heading text-ink hover:text-primary transition-colors">
                  {board.title}
                </h3>
              </a>
              <p className="text-body text-ink-muted line-clamp-2">
                {board.description}
              </p>
              <div className="flex gap-gap-md text-label-sm text-ink-muted">
                <span>{board._count?.lists || 0} lists</span>
                <span>{board._count?.cards || 0} cards</span>
              </div>
              <div className="flex gap-gap-sm">
                <Button asChild variant="ghost" size="sm" className="flex-1">
                  <a href={`/workspaces/${workspaceId}/boards/${board.id}`}>
                    Open
                  </a>
                </Button>
                <DeleteBoardButton
                  workspaceId={workspaceId}
                  boardId={board.id}
                  boardTitle={board.title}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <Card>
        <CardContent className="py-gap-xl text-center space-y-gap-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary">
            <ListTodo className="h-6 w-6" />
          </div>
          <div className="space-y-gap-sm">
            <p className="text-headline-sm font-heading text-ink">
              No boards yet
            </p>
            <p className="text-body text-ink-muted">
              Create the first board to start organizing this workspace.
            </p>
          </div>
          <Button
            variant="default"
            onClick={() => setShowCreateBoardModal(true)}
          >
            <Plus className="h-4 w-4 mr-gap-sm" />
            Create Your First Board
          </Button>
        </CardContent>
      </Card>
    );

  const boardsSkeletons = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap-lg">
      {['board-skeleton-1', 'board-skeleton-2', 'board-skeleton-3'].map(
        (id) => (
          <Card key={id}>
            <CardContent className="pt-gap-lg space-y-gap-md">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        )
      )}
    </div>
  );

  const boardsSection = boardsLoading ? boardsSkeletons : boardsContent;

  return (
    <main className="space-y-gap-lg">
      <DashboardPageHeader
        title={workspace?.name || 'Workspace'}
        description={workspace?.description || 'Manage your boards and tasks'}
        actions={
          hasBoards ? (
            <div className="flex w-full flex-col gap-gap-sm sm:flex-row sm:w-auto sm:flex-wrap sm:items-center">
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <a href={`/workspaces/${workspaceId}/activity`}>
                  Activity
                  <ArrowRight className="ml-gap-sm h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="default"
                className="w-full sm:w-auto"
                onClick={() => setShowCreateBoardModal(true)}
              >
                <Plus className="h-4 w-4 mr-gap-sm" />
                New Board
              </Button>
            </div>
          ) : undefined
        }
      />

      <section className="grid gap-gap-md md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Boards
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {boardCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Lists
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {listCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-gap-md pt-gap-lg">
            <div className="rounded-sm bg-primary/10 p-gap-sm text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-label-sm uppercase tracking-wide text-ink-muted">
                Cards
              </p>
              <p className="text-headline-sm font-heading text-ink">
                {cardCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {hasBoards ? (
        <section className="grid gap-gap-lg lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <div className="space-y-gap-md">
            <div className="flex items-end justify-between gap-gap-md">
              <div>
                <h2 className="text-headline-sm font-heading text-ink">
                  Boards
                </h2>
                <p className="text-body text-ink-muted">
                  Open a board to manage its lists and cards.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <a href={`/workspaces/${workspaceId}/boards`}>
                  View all
                  <ArrowRight className="ml-gap-sm h-4 w-4" />
                </a>
              </Button>
            </div>

            {boardsSection}
          </div>

          <Card className="h-fit">
            <CardContent className="space-y-gap-md pt-gap-lg">
              <div>
                <h3 className="text-title-md font-heading text-ink">
                  Workspace shortcuts
                </h3>
                <p className="text-body text-ink-muted">
                  Common actions for this workspace.
                </p>
              </div>
              <div className="grid gap-gap-sm">
                <Button asChild variant="outline" className="justify-start">
                  <a href={`/workspaces/${workspaceId}/members`}>
                    Manage members
                  </a>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <a href={`/workspaces/${workspaceId}/settings`}>
                    Workspace settings
                  </a>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <a href={`/workspaces/${workspaceId}/edit`}>Edit workspace</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : (
        boardsSection
      )}
      {/* Create Board Modal */}
      {showCreateBoardModal && (
        <CreateBoardModal
          onClose={() => setShowCreateBoardModal(false)}
          onCreate={handleCreateBoard}
          isLoading={createBoardMutation.isPending}
        />
      )}
    </main>
  );
}

function DeleteBoardButton({
  workspaceId,
  boardId,
  boardTitle,
}: Readonly<{
  workspaceId: string;
  boardId: string;
  boardTitle: string;
}>) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteBoardMutation = useDeleteBoard(workspaceId, boardId);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:bg-destructive/10"
        type="button"
        disabled={deleteBoardMutation.isPending}
        onClick={() => setShowConfirm(true)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <ConfirmDialog
        open={showConfirm}
        title="Delete Board"
        description={`Delete "${boardTitle}"? This will delete its lists and cards.`}
        isLoading={deleteBoardMutation.isPending}
        onOpenChange={setShowConfirm}
        onConfirm={() => {
          deleteBoardMutation.mutate(undefined, {
            onSuccess: () => setShowConfirm(false),
          });
        }}
      />
    </>
  );
}

function CreateBoardModal({
  onClose,
  onCreate,
  isLoading,
}: Readonly<{
  onClose: () => void;
  onCreate: (data: { title: string; description: string }) => void;
  isLoading?: boolean;
}>) {
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    onCreate(formData);
    setFormData({ title: '', description: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <div className="p-gap-lg space-y-gap-lg border-b border-hairline-ghost">
          <h2 className="text-headline-sm font-heading text-ink">
            Create Board
          </h2>
        </div>

        <div className="p-gap-lg space-y-gap-md">
          <div className="space-y-gap-sm">
            <Label className="text-label-sm font-medium text-ink">
              Board Title
            </Label>
            <Input
              type="text"
              placeholder="e.g., Q2 Planning"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-gap-sm">
            <Label className="text-label-sm font-medium text-ink">
              Description (Optional)
            </Label>
            <textarea
              placeholder="Describe this board..."
              className="w-full px-gap-md py-gap-sm border border-hairline-ghost rounded-sm bg-surface-2 text-body"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-gap-md pt-gap-md">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
