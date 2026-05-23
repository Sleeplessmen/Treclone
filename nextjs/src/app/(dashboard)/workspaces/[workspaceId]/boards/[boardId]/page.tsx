'use client';

import { useParams } from 'next/navigation';
import { KanbanBoard } from './_components/kanban-board';

export default function BoardPage() {
  const params = useParams();
  const workspaceId =
    typeof params?.workspaceId === 'string' ? params.workspaceId : '';
  const boardId = typeof params?.boardId === 'string' ? params.boardId : '';

  return (
    <main className="space-y-gap-lg">
      <KanbanBoard boardId={boardId} workspaceId={workspaceId} />
    </main>
  );
}
