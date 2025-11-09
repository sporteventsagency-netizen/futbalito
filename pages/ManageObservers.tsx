import React, { useState } from 'react';
import type { Observer } from '../types.ts';
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import ObserverForm from '../components/ObserverForm.tsx';
import { PlusIcon } from '../components/icons/Icons.tsx';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import usePermissions from '../hooks/usePermissions.ts';

const ManageObservers: React.FC = () => {
  const { observers, addObserver, updateObserver, deleteObserver } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObserver, setEditingObserver] = useState<Observer | null>(null);

  const canManage = hasPermission('observers:manage');

  const openCreateModal = () => {
    setEditingObserver(null);
    setIsModalOpen(true);
  };

  const openEditModal = (observer: Observer) => {
    setEditingObserver(observer);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingObserver(null);
  };

  const handleSave = (data: Omit<Observer, 'id' | 'photoUrl'> & { photoFile?: File | null }) => {
    const { photoFile, ...observerData } = data;
    if (editingObserver) {
      const updatedObserverObject = { ...editingObserver, ...observerData };
      updateObserver(updatedObserverObject, photoFile);
    } else {
      addObserver(data);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this observer?')) {
      deleteObserver(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Observers</h1>
            <p className="mt-2 text-gray-600">Add and manage observers for your competitions.</p>
        </div>
        {canManage && <Button onClick={openCreateModal}><PlusIcon className="h-5 w-5 mr-2" />Add Observer</Button>}
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
              {observers.map((observer) => (
                <tr key={observer.id}>
                  <td className="px-6 py-4 font-medium">
                     <div className="flex items-center">
                        <img src={observer.photoUrl || `https://avatar.iran.liara.run/username?username=${observer.name.replace(/\s/g, '+')}`} alt={observer.name} className="h-10 w-10 rounded-full object-cover mr-4" />
                        {observer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{observer.county || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{observer.category || 'N/A'}</td>
                  {canManage && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                        <button onClick={() => openEditModal(observer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(observer.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canManage && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingObserver ? 'Edit Observer' : 'Add New Observer'}>
            <ObserverForm observer={editingObserver} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ManageObservers;