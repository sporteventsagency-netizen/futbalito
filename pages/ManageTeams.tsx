

import React, { useState } from 'react';
// FIX: Added .ts extension to module import.
import type { Team } from '../types.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import TeamForm from '../components/TeamForm.tsx';
// FIX: Added .tsx extension to module import.
import { PlusIcon } from '../components/icons/Icons.tsx';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .ts extension to module import.
import usePermissions from '../hooks/usePermissions.ts';

const ManageTeams: React.FC = () => {
  const { teams, addTeam, updateTeam, deleteTeam } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const openCreateModal = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleSave = (data: Omit<Team, 'id' | 'logoUrl'> & { logoFile?: File | null }) => {
    const { logoFile, ...teamData } = data;
    if (editingTeam) {
      const updatedTeamObject = { ...editingTeam, ...teamData };
      updateTeam(updatedTeamObject, logoFile);
    } else {
      addTeam(data);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team? This will remove them from all competitions.')) {
      deleteTeam(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Teams</h1>
            <p className="mt-2 text-gray-600">Create, edit, and manage all teams in your organization.</p>
        </div>
        {hasPermission('teams:create') && (
            <Button onClick={openCreateModal}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Team
            </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">County</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {(hasPermission('teams:edit') || hasPermission('teams:delete')) && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team) => (
                <tr key={team.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={team.logoUrl} alt={team.name} />
                          </div>
                          <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{team.name}</div>
                          </div>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.county}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        team.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {team.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {(hasPermission('teams:edit') || hasPermission('teams:delete')) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        {hasPermission('teams:edit') && <button onClick={() => openEditModal(team)} className="text-indigo-600 hover:text-indigo-900">Edit</button>}
                        {hasPermission('teams:delete') && <button onClick={() => handleDelete(team.id)} className="text-red-600 hover:text-red-900">Delete</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTeam ? 'Edit Team' : 'Create New Team'}>
        <TeamForm 
          team={editingTeam}
          onSave={handleSave}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ManageTeams;