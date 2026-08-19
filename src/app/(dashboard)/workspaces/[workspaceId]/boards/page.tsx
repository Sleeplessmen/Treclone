'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useBoards } from '@/hooks/boards';
import { BoardCard } from './_components/board-card';
import { CreateBoardModal } from './_components/create-board-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  ListTodo,
  Plus,
} from 'lucide-react';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';

export default function BoardsPage() {
  const params = useParams();
  const workspaceId =
    typeof params?.workspaceId === 'string' ? params.workspaceId : '';

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Query
  const { data: boardsData, isLoading, error } = useBoards(workspaceId);

  const boards = boardsData?.boards || [];
  const boardCount = boards.length;
  const listCount = boards.reduce(
    (total, board) => total + (board._count?.lists || 0),
    0
  );
  const cardCount = boards.reduce(
    (total, board) => total + (board._count?.cards || 0),
    0
  );

  if (isLoading) {
    return (
      <main className="space-y-gap-lg">
        <div className="flex flex-col gap-gap-md md:flex-row md:items-start md:justify-between">
          <div className="space-y-gap-sm flex-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap-lg">
          {['board-skeleton-1', 'board-skeleton-2', 'board-skeleton-3'].map(
            (id) => (
              <Card key={id}>
                <CardContent className="pt-gap-lg space-y-gap-md">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-9" />
                </CardContent>
              </Card>
            )
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-gap-lg">
      <DashboardPageHeader
        title="My Boards"
        description="Manage and organize tasks across your workspace boards"
        actions={
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-gap-sm" />
            Create Board
          </Button>
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
              <ArrowRight className="h-5 w-5" />
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

      {/* Error State */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-gap-lg flex gap-gap-md">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <p className="text-destructive text-body font-medium">Error</p>
              <p className="text-destructive text-label-sm">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boards Grid */}
      {boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap-lg">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              workspaceId={workspaceId}
              board={board}
              onDeleteSuccess={() => {
                // Card will automatically update via query invalidation
              }}
            />
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
                Create the first board to start breaking work into lists and
                cards.
              </p>
            </div>
            <Button variant="default" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-gap-sm" />
              Create Board
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Board Modal */}
      {showCreateModal && (
        <CreateBoardModal
          workspaceId={workspaceId}
          onSuccess={() => setShowCreateModal(false)}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </main>
  );
}
