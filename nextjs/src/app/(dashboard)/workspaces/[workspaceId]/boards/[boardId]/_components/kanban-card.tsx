'use client';

import { Draggable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils/cn';
import { Trash2, UserRound } from 'lucide-react';

interface Card {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  listId: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

interface KanbanCardProps {
  card: Card;
  index: number;
  onOpen: (card: Card) => void;
  onDelete: (card: Card) => void;
}

export function KanbanCard({
  card,
  index,
  onOpen,
  onDelete,
}: Readonly<KanbanCardProps>) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            'relative bg-surface-2 p-gap-md rounded-sm hover:shadow-sm transition-shadow',
            snapshot.isDragging && 'shadow-lg ring-1 ring-hairline-ghost'
          )}
        >
          <div
            role="button"
            tabIndex={0}
            {...provided.dragHandleProps}
            onClick={() => onOpen(card)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen(card);
              }
            }}
            className="flex w-full cursor-grab items-start justify-between gap-gap-sm text-left active:cursor-grabbing"
          >
            <p className="min-w-0 break-words text-body text-ink">
              {card.title}
            </p>
          </div>
          <div className="absolute right-gap-sm top-gap-sm">
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(card);
              }}
              className="rounded-sm p-gap-xs text-destructive transition-colors hover:bg-destructive/10"
              aria-label={`Delete card ${card.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {card.description && (
            <p className="text-label-sm text-ink-muted mt-gap-sm break-words">
              {card.description}
            </p>
          )}
          {card.assignee && (
            <div className="mt-gap-md flex items-center gap-gap-xs text-label-sm text-ink-muted">
              <UserRound className="h-3.5 w-3.5" />
              <span className="truncate">{card.assignee.fullName}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
