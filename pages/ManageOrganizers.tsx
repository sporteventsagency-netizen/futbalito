import React, { useState } from 'react';
import type { User } from '../types.ts';
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import UserForm from '../components/UserForm.tsx';
import { PlusIcon } from '../components/icons/Icons.tsx';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import usePermissions from '../hooks/usePermissions.ts';

const ManageOrganizers: React.FC = () => {
  const { users, roles, inviteUser, updateUser, deleteUser } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // An "Organizer" is a user. This page is a dedicated UI to manage users,
  // who can then be assigned as organizers to competitions.
  // We check for 'organizers:manage' permission for this specific management context.
  const canManage = hasPermission('organizers:manage');

  const openInviteModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = (data: { email: string; roleId: string; }) => {
    if (editingUser) {
      updateUser({ ...editingUser, ...data });
    } else {
      inviteUser(data.email, data.roleId);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    // Basic check to prevent deleting the main administrator account for safety
    if (id === 'user-1') {
        alert("You cannot delete the main administrator account.");
        return;
    }
    if (window.confirm('Are you sure you want to delete this user? This will remove them as an organizer from any competition they are assigned to.')) {
      deleteUser(id);
    }
  };

  const getRoleName = (roleId: string) => roles.find(r => r.id === roleId)?.name || 'Unknown Role';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Organizers</h1>
            <p className="mt-2 text-gray-600">Add, edit, and manage users who can act as competition organizers.</p>
        </div>
        {canManage && <Button onClick={openInviteModal}><PlusIcon className="h-5 w-5 mr-2" />Invite Organizer</Button>}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    {canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{getRoleName(user.roleId)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user.status}
                    </span>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                        <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canManage && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Edit Organizer' : 'Invite New Organizer'}>
            <UserForm user={editingUser} roles={roles} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ManageOrganizers;