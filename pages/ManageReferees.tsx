import React, { useState } from 'react';
import type { Referee } from '../types.ts';
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import RefereeForm from '../components/RefereeForm.tsx';
import { PlusIcon } from '../components/icons/Icons.tsx';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import usePermissions from '../hooks/usePermissions.ts';

const ManageReferees: React.FC = () => {
  const { referees, addReferee, updateReferee, deleteReferee } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReferee, setEditingReferee] = useState<Referee | null>(null);

  const canManage = hasPermission('referees:manage');

  const openCreateModal = () => {
    setEditingReferee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (referee: Referee) => {
    setEditingReferee(referee);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReferee(null);
  };

  const handleSave = (data: Omit<Referee, 'id' | 'photoUrl'> & { photoFile?: File | null }) => {
    const { photoFile, ...refereeData } = data;
    if (editingReferee) {
      const updatedRefereeObject = { ...editingReferee, ...refereeData };
      updateReferee(updatedRefereeObject, photoFile);
    } else {
      addReferee(data);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this referee?')) {
      deleteReferee(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Referees</h1>
            <p className="mt-2 text-gray-600">Add and manage referees for your competitions.</p>
        </div>
        {canManage && <Button onClick={openCreateModal}><PlusIcon className="h-5 w-5 mr-2" />Add Referee</Button>}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">County</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    {canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referees.map((referee) => (
                <tr key={referee.id}>
                    <td className="px-6 py-4 font-medium">
                        <div className="flex items-center">
                            <img src={referee.photoUrl || `https://avatar.iran.liara.run/username?username=${referee.name.replace(/\s/g, '+')}`} alt={referee.name} className="h-10 w-10 rounded-full object-cover mr-4" />
                            {referee.name}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{referee.county || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{referee.category || 'N/A'}</td>
                  {canManage && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                        <button onClick={() => openEditModal(referee)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(referee.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canManage && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingReferee ? 'Edit Referee' : 'Add New Referee'}>
            <RefereeForm referee={editingReferee} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ManageReferees;