
import React, { useState } from 'react';
import type { Transfer, PlayerRegistration } from '../types.ts';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import usePermissions from '../hooks/usePermissions.ts';
import Button from '../components/ui/Button.tsx';
import Modal from '../components/ui/Modal.tsx';
import Tabs from '../components/ui/Tabs.tsx';
import TransferForm from '../components/TransferForm.tsx';
import PlayerRegistrationForm from '../components/PlayerRegistrationForm.tsx';
import { PlusIcon } from '../components/icons/Icons.tsx';

const Reports: React.FC = () => {
    const { 
        transfers, players, teams, addTransfer, updateTransfer, deleteTransfer,
        playerRegistrations, addPlayerRegistration, updatePlayerRegistration, deletePlayerRegistration
    } = useCompetitions();
    const { hasPermission } = usePermissions();
    const [activeTab, setActiveTab] = useState('Transfers');
    
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);

    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [editingRegistration, setEditingRegistration] = useState<PlayerRegistration | null>(null);

    const canManageTransfers = hasPermission('transfers:manage');
    const canManagePlayers = hasPermission('players:manage'); // Registrations fall under player management

    // Transfer Modal Handlers
    const openCreateTransferModal = () => {
        setEditingTransfer(null);
        setIsTransferModalOpen(true);
    };
    const openEditTransferModal = (transfer: Transfer) => {
        setEditingTransfer(transfer);
        setIsTransferModalOpen(true);
    };
    const closeTransferModal = () => {
        setIsTransferModalOpen(false);
        setEditingTransfer(null);
    };
    const handleSaveTransfer = (data: Omit<Transfer, 'id'>) => {
        if (editingTransfer) {
            updateTransfer({ ...editingTransfer, ...data });
        } else {
            addTransfer(data);
        }
        closeTransferModal();
    };
    const handleDeleteTransfer = (id: string) => {
        if (window.confirm('Are you sure you want to delete this transfer record? This action cannot be undone.')) {
            deleteTransfer(id);
        }
    };

    // Registration Modal Handlers
    const openCreateRegistrationModal = () => {
        setEditingRegistration(null);
        setIsRegistrationModalOpen(true);
    };
    const openEditRegistrationModal = (reg: PlayerRegistration) => {
        setEditingRegistration(reg);
        setIsRegistrationModalOpen(true);
    };
    const closeRegistrationModal = () => {
        setIsRegistrationModalOpen(false);
        setEditingRegistration(null);
    };
    const handleSaveRegistration = (data: Omit<PlayerRegistration, 'id'>) => {
        if (editingRegistration) {
            updatePlayerRegistration({ ...editingRegistration, ...data });
        } else {
            addPlayerRegistration(data);
        }
        closeRegistrationModal();
    };
    const handleDeleteRegistration = (id: string) => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
            deletePlayerRegistration(id);
        }
    };

    const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown Player';
    const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown Team';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
                    <p className="mt-2 text-gray-600">View and manage player transfers and registrations.</p>
                </div>
                {activeTab === 'Transfers' && canManageTransfers && (
                    <Button onClick={openCreateTransferModal}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Record Transfer
                    </Button>
                )}
                {activeTab === 'Player Registrations' && canManagePlayers && (
                    <Button onClick={openCreateRegistrationModal}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Registration
                    </Button>
                )}
            </div>

            <Tabs tabs={['Transfers', 'Player Registrations']} activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="mt-8">
                {activeTab === 'Transfers' && (
                     <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Player</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">From</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">To</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fee</th>
                                    {canManageTransfers && <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transfers.map(transfer => (
                                    <tr key={transfer.id}>
                                        <td className="px-6 py-4 text-sm">{new Date(transfer.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium">{getPlayerName(transfer.playerId)}</td>
                                        <td className="px-6 py-4 text-sm">{getTeamName(transfer.fromTeamId)}</td>
                                        <td className="px-6 py-4 text-sm">{getTeamName(transfer.toTeamId)}</td>
                                        <td className="px-6 py-4 text-sm">{transfer.fee > 0 ? `$${transfer.fee.toLocaleString()}`: 'Free'}</td>
                                        {canManageTransfers && (
                                            <td className="px-6 py-4 text-right text-sm space-x-4">
                                                <button onClick={() => openEditTransferModal(transfer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                <button onClick={() => handleDeleteTransfer(transfer.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {transfers.length === 0 && <p className="text-center text-gray-500 py-12">No transfers recorded.</p>}
                    </div>
                )}
                {activeTab === 'Player Registrations' && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Player</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Registration #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Valid From</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Valid Until</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                                    {canManagePlayers && <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {playerRegistrations.map(reg => (
                                    <tr key={reg.id}>
                                        <td className="px-6 py-4 font-medium">{getPlayerName(reg.playerId)}</td>
                                        <td className="px-6 py-4 text-sm font-mono">{reg.registrationNumber}</td>
                                        <td className="px-6 py-4 text-sm">{new Date(reg.validFrom).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm">{new Date(reg.validUntil).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {reg.status}
                                            </span>
                                        </td>
                                        {canManagePlayers && (
                                            <td className="px-6 py-4 text-right text-sm space-x-4">
                                                <button onClick={() => openEditRegistrationModal(reg)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                <button onClick={() => handleDeleteRegistration(reg.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {playerRegistrations.length === 0 && <p className="text-center text-gray-500 py-12">No player registrations recorded.</p>}
                    </div>
                )}
            </div>

            <Modal isOpen={isTransferModalOpen} onClose={closeTransferModal} title={editingTransfer ? 'Edit Transfer' : 'Record New Transfer'}>
                <TransferForm
                    transfer={editingTransfer}
                    onSave={handleSaveTransfer}
                    onClose={closeTransferModal}
                />
            </Modal>
            
            <Modal isOpen={isRegistrationModalOpen} onClose={closeRegistrationModal} title={editingRegistration ? 'Edit Registration' : 'New Player Registration'}>
                <PlayerRegistrationForm
                    registration={editingRegistration}
                    onSave={handleSaveRegistration}
                    onClose={closeRegistrationModal}
                />
            </Modal>

        </div>
    );
};

export default Reports;
