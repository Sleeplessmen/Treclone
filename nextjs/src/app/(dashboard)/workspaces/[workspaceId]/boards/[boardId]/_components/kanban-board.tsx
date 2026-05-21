'use client';

import { useState, useMemo, useEffect } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useLists, useCreateList } from '@/hooks/lists';
import { Plus } from 'lucide-react';
import { KanbanList } from './kanban-list';
import { AddListButton } from './add-list-button';
import { AddListModal } from './add-list-modal';
import { AddCardModal } from './add-card-modal';

interface CardItem {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  listId: string;
}

interface KanbanBoardProps {
  boardId: string;
  workspaceId: string;
}

export function KanbanBoard({
  boardId,
  workspaceId,
}: Readonly<KanbanBoardProps>) {
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [listToDelete, setListToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [cardToDelete, setCardToDelete] = useState<CardItem | null>(null);
  const [listCards, setListCards] = useState<Record<string, CardItem[]>>({});
  const [isDeletingList, setIsDeletingList] = useState(false);
  const [isDeletingCard, setIsDeletingCard] = useState(false);
  const queryClient = useQueryClient();

  // Queries & Mutations
  const { data: listsData, isLoading: listsLoading } = useLists(
    workspaceId,
    boardId
  );
  const createListMutation = useCreateList(workspaceId, boardId);

  const lists = useMemo(
    () => listsData?.data?.lists || [],
    [listsData?.data?.lists]
  );

  useEffect(() => {
    const cardsMap: Record<string, CardItem[]> = {};

    for (const list of lists) {
      cardsMap[list.id] = list.cards || [];
    }

    setListCards(cardsMap);
  }, [lists]);

  const handleCreateList = (data: { title: string }) => {
    createListMutation.mutate(data, {
      onSuccess: () => {
        setShowAddListModal(false);
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

    if (source.droppableId === destination.droppableId) {
      return {
        ...currentCards,
        [source.droppableId]: destinationCards.map((card, index) => ({
          ...card,
          position: index,
        })),
      };
    }

    return {
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
        throw new Error(error.message || 'Failed to move card');
      }
    } catch (error) {
      console.error('Failed to move card:', error);
      setListCards(previousCards);
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;

    const { id: listId } = listToDelete;
    const previousLists = queryClient.getQueryData([
      'lists',
      workspaceId,
      boardId,
    ]);
    const previousCards = listCards;

    setIsDeletingList(true);
    queryClient.setQueryData(
      ['lists', workspaceId, boardId],
      (current: any) =>
        current
          ? {
              ...current,
              data: {
                ...current.data,
                lists: (current.data?.lists || []).filter(
                  (list: { id: string }) => list.id !== listId
                ),
              },
            }
          : current
    );
    setListCards((current) => {
      const next = { ...current };
      delete next[listId];
      return next;
    });

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Failed to delete list');
      }

      queryClient.invalidateQueries({
        queryKey: ['lists', workspaceId, boardId],
      });
      queryClient.invalidateQueries({ queryKey: ['boards', workspaceId] });
      setListToDelete(null);
    } catch (error) {
      console.error('Failed to delete list:', error);
      queryClient.setQueryData(['lists', workspaceId, boardId], previousLists);
      setListCards(previousCards);
    } finally {
      setIsDeletingList(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!cardToDelete) return;

    const previousCards = listCards;
    setListCards((current) => ({
      ...current,
      [cardToDelete.listId]: (current[cardToDelete.listId] || []).filter(
        (item) => item.id !== cardToDelete.id
      ),
    }));

    setIsDeletingCard(true);
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/boards/${boardId}/lists/${cardToDelete.listId}/cards/${cardToDelete.id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Failed to delete card');
      }

      queryClient.invalidateQueries({
        queryKey: ['cards', workspaceId, boardId, cardToDelete.listId],
      });
      queryClient.invalidateQueries({
        queryKey: ['all-board-cards', workspaceId, boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ['lists', workspaceId, boardId],
      });
      queryClient.invalidateQueries({ queryKey: ['boards', workspaceId] });
      setCardToDelete(null);
    } catch (error) {
      console.error('Failed to delete card:', error);
      setListCards(previousCards);
    } finally {
      setIsDeletingCard(false);
    }
  };

  if (listsLoading) {
    return (
      <div className="space-y-gap-lg">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 gap-gap-lg md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[1, 2, 3].map((i) => (
            <div
              key={`skeleton-${i}`}
              className="space-y-gap-md"
            >
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-40 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-gap-lg md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {lists.map((list) => (
            <KanbanList
              key={list.id}
              listId={list.id}
              title={list.title}
              cards={listCards[list.id] || []}
              onAddCard={openAddCardModal}
              onDeleteList={(listId, title) =>
                setListToDelete({ id: listId, title })
              }
              onDeleteCard={setCardToDelete}
            />
          ))}

          <AddListButton
            onAdd={() => setShowAddListModal(true)}
            isLoading={createListMutation.isPending}
          />
        </div>
      </DragDropContext>

      {showAddListModal && (
        <AddListModal
          onClose={() => setShowAddListModal(false)}
          onCreate={handleCreateList}
          isLoading={createListMutation.isPending}
        />
      )}

      {showAddCardModal && selectedListId && (
        <AddCardModal
          listId={selectedListId}
          workspaceId={workspaceId}
          boardId={boardId}
          onClose={() => {
            setShowAddCardModal(false);
            setSelectedListId(null);
          }}
          onCardCreated={(response) => {
            setListCards((prev) => ({
              ...prev,
              [selectedListId]: [
                ...(prev[selectedListId] || []),
                response.card,
              ],
            }));
            setShowAddCardModal(false);
            setSelectedListId(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!listToDelete}
        title="Delete List"
        description={`Delete "${listToDelete?.title || ''}"? This will delete all cards in the list.`}
        isLoading={isDeletingList}
        onOpenChange={(open) => {
          if (!open && !isDeletingList) setListToDelete(null);
        }}
        onConfirm={handleDeleteList}
      />

      <ConfirmDialog
        open={!!cardToDelete}
        title="Delete Card"
        description={`Delete "${cardToDelete?.title || ''}"?`}
        isLoading={isDeletingCard}
        onOpenChange={(open) => {
          if (!open && !isDeletingCard) setCardToDelete(null);
        }}
        onConfirm={handleDeleteCard}
      />
    </>
  );
}
