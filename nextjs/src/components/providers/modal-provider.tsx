'use client';

import { useEffect, useState } from 'react';
import { CreateBoardModal } from '@/components/modals/create-board-modal';
import { DeleteBoardModal } from '@/components/modals/delete-board-modal';
import { CreateCardModal } from '@/components/modals/create-card-modal';
import { EditCardModal } from '@/components/modals/edit-card-modal';
import { CreateListModal } from '@/components/modals/create-list-modal';
import { AddMemberModal } from '@/components/modals/add-member-modal';
import { EditProfileModal } from '@/components/modals/edit-profile-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Modal states - in production, move to Zustand or Redux
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [deleteBoardOpen, setDeleteBoardOpen] = useState(false);
  const [createCardOpen, setCreateCardOpen] = useState(false);
  const [editCardOpen, setEditCardOpen] = useState(false);
  const [createListOpen, setCreateListOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // TODO: Update these with actual context/store values
  return (
    <>
      <CreateBoardModal
        workspaceId="1"
        isOpen={createBoardOpen}
        onClose={() => setCreateBoardOpen(false)}
      />
      <DeleteBoardModal
        workspaceId="1"
        boardId="1"
        boardTitle="Example Board"
        isOpen={deleteBoardOpen}
        onClose={() => setDeleteBoardOpen(false)}
      />
      <CreateCardModal
        listId="1"
        position={0}
        isOpen={createCardOpen}
        onClose={() => setCreateCardOpen(false)}
      />
      <EditCardModal
        card={{ id: '1', title: 'Example', description: 'Example card' }}
        isOpen={editCardOpen}
        onClose={() => setEditCardOpen(false)}
      />
      <CreateListModal
        boardId="1"
        position={0}
        isOpen={createListOpen}
        onClose={() => setCreateListOpen(false)}
      />
      <AddMemberModal
        workspaceId="1"
        isOpen={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
      />
      <EditProfileModal
        user={{ fullName: 'User', email: 'user@example.com' }}
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </>
  );
};
