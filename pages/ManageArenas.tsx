

import React, { useState } from 'react';
// FIX: Added .ts extension to module import.
import type { Arena } from '../types.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import ArenaForm from '../components/ArenaForm.tsx';
// FIX: Added .tsx extension to module import.
import { PlusIcon } from '../components/icons/Icons.tsx';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .ts extension to module import.
import usePermissions from '../hooks/usePermissions.ts';

const ManageArenas: React.FC = () => {
  const { arenas, addArena, updateArena, deleteArena } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArena, setEditingArena] = useState<Arena | null>(null);

  const canManage = hasPermission('arenas:manage');

  const openCreateModal = () => {
    setEditingArena(null);
    setIsModalOpen(true);
  };

  const openEditModal = (arena: Arena) => {
    setEditingArena(arena);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArena(null);
  };

  const handleSave = (data: Omit<Arena, 'id'>) => {
    if (editingArena) {
      updateArena({ ...editingArena, ...data });
    } else {
      addArena(data);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this arena?')) {
      deleteArena(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Arenas</h1>
            <p className="mt-2 text-gray-600">Add and manage venues and playing fields.</p>
        </div>
        {canManage && <Button onClick={openCreateModal}><PlusIcon className="h-5 w-5 mr-2" />Create Arena</Button>}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">County</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                {canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {arenas.map((arena) => (
                <tr key={arena.id}>
                  <td className="px-6 py-4 font-medium">{arena.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{arena.county || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{arena.spectatorCapacity ? arena.spectatorCapacity.toLocaleString() : 'N/A'}</td>
                  {canManage && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                        <button onClick={() => openEditModal(arena)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(arena.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canManage && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingArena ? 'Edit Arena' : 'Create New Arena'}>
            <ArenaForm arena={editingArena} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ManageArenas;