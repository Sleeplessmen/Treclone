'use client';

import { Draggable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface Card {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  listId: string;
}

interface KanbanCardProps {
  card: Card;
  index: number;
  onDelete: (card: Card) => void;
}

export function KanbanCard({ card, index, onDelete }: KanbanCardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'bg-surface-2 p-gap-md rounded-sm cursor-grab hover:shadow-sm transition-shadow active:cursor-grabbing',
            snapshot.isDragging && 'shadow-lg ring-1 ring-hairline-ghost'
          )}
        >
          <div className="flex items-start justify-between gap-gap-sm">
            <p className="min-w-0 break-words text-body text-ink">
              {card.title}
            </p>
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
        </div>
      )}
    </Draggable>
  );
}
