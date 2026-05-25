'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils/cn';
import { KanbanCard } from './kanban-card';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';

interface Card {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  listId: string;
  assigneeId?: string;
  assigneeUserId?: string | null;
  assignee?: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

interface KanbanListProps {
  listId: string;
  title: string;
  index: number;
  cards: Card[];
  onAddCard: (listId: string) => void;
  onEditList: (listId: string, title: string) => void;
  onDeleteList: (listId: string, title: string) => void;
  onDeleteCard: (card: Card) => void;
  onOpenCard: (card: Card) => void;
}

export function KanbanList({
  listId,
  title,
  index,
  cards,
  onAddCard,
  onEditList,
  onDeleteList,
  onDeleteCard,
  onOpenCard,
}: Readonly<KanbanListProps>) {
  return (
    <Draggable draggableId={`list-${listId}`} index={index}>
      {(dragProvided, dragSnapshot) => (
        <div
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          className={cn(
            'w-80 flex-none bg-surface-1 rounded-sm p-gap-md',
            dragSnapshot.isDragging && 'shadow-lg ring-1 ring-hairline-ghost'
          )}
        >
          <div className="mb-gap-md flex items-center justify-between gap-gap-sm">
            <div
              {...dragProvided.dragHandleProps}
              className="flex min-w-0 flex-1 cursor-grab items-center gap-gap-xs active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 flex-none text-ink-muted" />
              <h2 className="truncate text-title-md font-heading text-ink">
                {title}
              </h2>
            </div>
            <div className="flex items-center gap-gap-xs">
              <button
                type="button"
                onClick={() => onEditList(listId, title)}
                className="rounded-sm p-gap-xs text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                aria-label={`Edit list ${title}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteList(listId, title)}
                className="rounded-sm p-gap-xs text-destructive transition-colors hover:bg-destructive/10"
                aria-label={`Delete list ${title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Droppable droppableId={listId} type="CARD">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  'min-h-28 space-y-gap-sm rounded-sm transition-colors',
                  snapshot.isDraggingOver && 'bg-surface-2/40'
                )}
              >
                {cards.map((card, cardIndex) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    index={cardIndex}
                    onOpen={onOpenCard}
                    onDelete={onDeleteCard}
                  />
                ))}
                {provided.placeholder}
                <button
                  onClick={() => onAddCard(listId)}
                  className="w-full text-ink-muted hover:text-ink text-body py-gap-md transition-colors"
                >
                  + Add Card
                </button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
