'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLists } from '@/hooks/lists';
import { useCreateCard } from '@/hooks/cards';
import { useCreateList } from '@/hooks/lists';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';

interface CardItem {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  listId: string;
}

export default function BoardPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const boardId = params.boardId as string;

  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Queries
  const { data: listsData, isLoading: listsLoading } = useLists(workspaceId, boardId);
  const createListMutation = useCreateList(workspaceId, boardId);
  const createCardMutation = useCreateCard(
    workspaceId,
    boardId,
    selectedListId || ''
  );

  // Get cards for each list
  const [listCards, setListCards] = useState<Record<string, CardItem[]>>({});
  const lists = Array.isArray(listsData?.data?.lists) ? listsData.data.lists : [];

  // Fetch cards for each list
  useEffect(() => {
    const fetchAllCards = async () => {
      const cardsMap: Record<string, CardItem[]> = {};
      for (const list of lists) {
        try {
          const response = await fetch(
            `/api/workspaces/${workspaceId}/boards/${boardId}/lists/${list.id}/cards`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            }
          );
          if (response.ok) {
            const data = await response.json();
            cardsMap[list.id] = Array.isArray(data?.data?.cards) ? data.data.cards : [];
          }
        } catch (error) {
          console.error(`Failed to fetch cards for list ${list.id}:`, error);
          cardsMap[list.id] = [];
        }
      }
      setListCards(cardsMap);
    };

    if (lists.length > 0) {
      fetchAllCards();
    }
  }, [lists, workspaceId, boardId]);

  const handleCreateList = (data: { title: string }) => {
    createListMutation.mutate(data, {
      onSuccess: () => {
        setShowAddListModal(false);
      },
    });
  };

  const handleCreateCard = (data: { title: string; description?: string }) => {
    if (!selectedListId) return;
    createCardMutation.mutate(data, {
      onSuccess: (response) => {
        const createdCard = response.data.card;
        setListCards((currentCards) => ({
          ...currentCards,
          [selectedListId]: [...(currentCards[selectedListId] || []), createdCard],
        }));
        setShowAddCardModal(false);
        setSelectedListId(null);
      },
    });
  };

  const openAddCardModal = (listId: string) => {
    setSelectedListId(listId);
    setShowAddCardModal(true);
  };

  const moveCardInState = (
    currentCards: Record<string, CardItem[]>,
    result: DropResult
  ) => {
    const { source, destination, draggableId } = result;
    if (!destination) return currentCards;

    const sourceCards = [...(currentCards[source.droppableId] || [])];
    const destinationCards =
      source.droppableId === destination.droppableId
        ? sourceCards
        : [...(currentCards[destination.droppableId] || [])];
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (!movedCard) return currentCards;

    destinationCards.splice(destination.index, 0, {
      ...movedCard,
      id: draggableId,
      listId: destination.droppableId,
    });

    const nextCards = {
      ...currentCards,
      [source.droppableId]: sourceCards.map((card, index) => ({
        ...card,
        position: index,
      })),
      [destination.droppableId]: destinationCards.map((card, index) => ({
        ...card,
        position: index,
      })),
    };

    if (source.droppableId === destination.droppableId) {
      nextCards[source.droppableId] = destinationCards.map((card, index) => ({
        ...card,
        position: index,
      }));
    }

    return nextCards;
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const previousCards = listCards;
    setListCards(moveCardInState(previousCards, result));

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/boards/${boardId}/lists/${source.droppableId}/cards/${draggableId}/move`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            listId: destination.droppableId,
            position: destination.index,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Failed to move card');
      }
    } catch (error) {
      console.error('Failed to move card:', error);
      setListCards(previousCards);
    }
  };

  if (listsLoading) {
    return (
      <main className="space-y-gap-lg">
        <Skeleton className="h-12 w-64" />
        <div className="flex gap-gap-lg overflow-x-auto pb-gap-md">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 space-y-gap-md">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-40 w-full" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-gap-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-heading text-ink">Board</h1>
        <Button
          variant="default"
          onClick={() => setShowAddListModal(true)}
          disabled={createListMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-gap-sm" />
          Add List
        </Button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-gap-lg overflow-x-auto pb-gap-md">
          {lists.map((list) => (
            <div
              key={list.id}
              className="flex-shrink-0 w-80 bg-surface-1 rounded-sm p-gap-md"
            >
              <h2 className="text-title-md font-heading text-ink mb-gap-md">
                {list.title}
              </h2>
              <Droppable droppableId={list.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'min-h-28 space-y-gap-sm rounded-sm transition-colors',
                      snapshot.isDraggingOver && 'bg-surface-2/40'
                    )}
                  >
                    {Array.isArray(listCards[list.id]) && listCards[list.id].map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={cn(
                              'bg-surface-2 p-gap-md rounded-sm cursor-grab hover:shadow-sm transition-shadow active:cursor-grabbing',
                              dragSnapshot.isDragging && 'shadow-lg ring-1 ring-hairline-ghost'
                            )}
                          >
                            <p className="text-body text-ink">{card.title}</p>
                            {card.description && (
                              <p className="text-label-sm text-ink-muted mt-gap-sm">
                                {card.description}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <button
                      onClick={() => openAddCardModal(list.id)}
                      className="w-full text-ink-muted hover:text-ink text-body py-gap-md transition-colors"
                    >
                      + Add Card
                    </button>
                  </div>
                )}
              </Droppable>
            </div>
          ))}

          {/* Add List Button Column */}
          <div className="flex-shrink-0 w-80 flex items-start">
            <Button
              variant="outline"
              onClick={() => setShowAddListModal(true)}
              className="w-full"
              disabled={createListMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-gap-sm" />
              Add List
            </Button>
          </div>
        </div>
      </DragDropContext>

      {/* Add List Modal */}
      {showAddListModal && (
        <AddListModal
          onClose={() => setShowAddListModal(false)}
          onCreate={handleCreateList}
          isLoading={createListMutation.isPending}
        />
      )}

      {/* Add Card Modal */}
      {showAddCardModal && selectedListId && (
        <AddCardModal
          onClose={() => {
            setShowAddCardModal(false);
            setSelectedListId(null);
          }}
          onCreate={handleCreateCard}
          isLoading={createCardMutation.isPending}
        />
      )}
    </main>
  );
}

function AddListModal({
  onClose,
  onCreate,
  isLoading,
}: Readonly<{
  onClose: () => void;
  onCreate: (data: { title: string }) => void;
  isLoading?: boolean;
}>) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({ title });
    setTitle('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <div className="p-gap-lg space-y-gap-lg border-b border-hairline-ghost flex items-center justify-between">
          <h2 className="text-headline-sm font-heading text-ink">Create List</h2>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-gap-lg space-y-gap-md">
          <div className="space-y-gap-sm">
            <Label className="text-label-sm font-medium text-ink">
              List Title
            </Label>
            <Input
              type="text"
              placeholder="e.g., To Do"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              autoFocus
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
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AddCardModal({
  onClose,
  onCreate,
  isLoading,
}: Readonly<{
  onClose: () => void;
  onCreate: (data: { title: string; description?: string }) => void;
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
        <div className="p-gap-lg space-y-gap-lg border-b border-hairline-ghost flex items-center justify-between">
          <h2 className="text-headline-sm font-heading text-ink">Create Card</h2>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-gap-lg space-y-gap-md">
          <div className="space-y-gap-sm">
            <Label className="text-label-sm font-medium text-ink">
              Card Title
            </Label>
            <Input
              type="text"
              placeholder="e.g., Design header"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-gap-sm">
            <Label className="text-label-sm font-medium text-ink">
              Description (Optional)
            </Label>
            <textarea
              placeholder="Add more details..."
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
