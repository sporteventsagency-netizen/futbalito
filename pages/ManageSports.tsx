import React, { useState } from 'react';
import type { Sport } from '../types.ts';
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import SportForm from '../components/SportForm.tsx';
import { PlusIcon } from '../components/icons/Icons.tsx';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import usePermissions from '../hooks/usePermissions.ts';

const ManageSports: React.FC = () => {
  const { sports, addSport, updateSport, deleteSport } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<Sport | null>(null);

  const canManage = hasPermission('sports:manage');

  const openCreateModal = () => {
    setEditingSport(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sport: Sport) => {
    setEditingSport(sport);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSport(null);
  };

  const handleSave = (data: { name: string; description: string; }) => {
    if (editingSport) {
      updateSport({ ...editingSport, ...data });
    } else {
      addSport(data);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sport?')) {
      deleteSport(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Sports</h1>
            <p className="mt-2 text-gray-600">Define the sports available in your platform.</p>
        </div>
        {canManage && <Button onClick={openCreateModal}><PlusIcon className="h-5 w-5 mr-2" />Add Sport</Button>}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>{canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}</tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sports.map((sport) => (
                <tr key={sport.id}>
                  <td className="px-6 py-4 font-medium">{sport.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sport.description}</td>
                  {canManage && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                        <button onClick={() => openEditModal(sport)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(sport.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canManage && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingSport ? 'Edit Sport' : 'Add New Sport'}>
            <SportForm sport={editingSport} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ManageSports;
