

import React, { useState, useMemo } from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .ts extension to module import.
import type { Sanction } from '../types.ts';
import Card from '../components/ui/Card.tsx';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
import Tabs from '../components/ui/Tabs.tsx';
import Modal from '../components/ui/Modal.tsx';
import SanctionForm from '../components/SanctionForm.tsx';
// FIX: Added .ts extension to module import.
import usePermissions from '../hooks/usePermissions.ts';
// FIX: Added .tsx extension to module import.
import { PlusIcon } from '../components/icons/Icons.tsx';

interface CompetitionDetailProps {
    competitionId: string;
    onBack: () => void;
    onManageLiveMatch: (matchId: string) => void;
}

const CompetitionDetail: React.FC<CompetitionDetailProps> = ({ competitionId, onBack, onManageLiveMatch }) => {
    const { 
        getCompetitionById, teams, matches, 
        generateBergerSchedule, calculateStandings, sanctions, addSanction, 
        updateSanction, deleteSanction, players 
    } = useCompetitions();
    const { hasPermission } = usePermissions();
    const [activeTab, setActiveTab] = useState('Teams');
    const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
    const [editingSanction, setEditingSanction] = useState<Sanction | null>(null);

    const competition = useMemo(() => getCompetitionById(competitionId), [competitionId, getCompetitionById]);

    const competitionTeams = useMemo(() => {
        if (!competition) return [];
        return teams.filter(team => competition.teamIds.includes(team.id));
    }, [competition, teams]);

    const competitionMatches = useMemo(() => {
        return matches.filter(match => match.competitionId === competitionId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [matches, competitionId]);

    const standings = useMemo(() => {
        if (!competition || (competition.format !== 'league' && competition.format !== 'mixed')) return [];
        // Assuming 'Group Stage' for now. A more complex system might need dynamic stage names.
        return calculateStandings(competitionId, 'Group Stage'); 
    }, [competition, competitionId, calculateStandings]);
    
    const competitionSanctions = useMemo(() => sanctions.filter(s => s.competitionId === competitionId), [sanctions, competitionId]);

    const handleGenerateSchedule = () => {
        generateBergerSchedule(competitionId);
    };
    
    // Sanction Modal Handlers
    const openCreateSanctionModal = () => { setEditingSanction(null); setIsSanctionModalOpen(true); };
    const openEditSanctionModal = (sanction: Sanction) => { setEditingSanction(sanction); setIsSanctionModalOpen(true); };
    const closeSanctionModal = () => { setIsSanctionModalOpen(false); setEditingSanction(null); };
    const handleSaveSanction = (data: Omit<Sanction, 'id'>) => {
        if (editingSanction) { updateSanction({ ...editingSanction, ...data }); } else { addSanction({ ...data, competitionId }); }
        closeSanctionModal();
    };
    const handleDeleteSanction = (id: string) => { if (window.confirm('Are you sure?')) { deleteSanction(id); }};
    const getSanctionTargetName = (sanction: Sanction): string => {
        if (sanction.playerId) {
            const player = players.find(p => p.id === sanction.playerId);
            const team = teams.find(t => t.id === player?.teamId);
            return `${player?.name || 'Unknown Player'} (${team?.name || 'Unknown Team'})`;
        }
        if (sanction.teamId) { return teams.find(t => t.id === sanction.teamId)?.name || 'Unknown Team'; }
        return 'N/A';
    };

    if (!competition) {
        return <Card><p>Competition not found.</p><Button onClick={onBack} className="mt-4">Go Back</Button></Card>;
    }
    
    const tabs = ['Teams', 'Schedule', ...(competition.format === 'league' || competition.format === 'mixed' ? ['Standings'] : []), 'Sanctions', 'Settings'];

    return (
        <div>
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-4">&larr; Back to Competitions</button>
            <div className="flex items-center space-x-4 mb-6">
                <img src={competition.logoUrl} alt={competition.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{competition.name}</h1>
                    <p className="text-gray-500">{competition.season} &bull; {competition.status}</p>
                </div>
            </div>

            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="mt-6">
                {activeTab === 'Teams' && (
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Registered Teams ({competitionTeams.length})</h2>
                        <ul className="divide-y divide-gray-200">
                            {competitionTeams.map(team => (
                                <li key={team.id} className="py-3 flex items-center space-x-3">
                                    <img src={team.logoUrl} alt={team.name} className="h-8 w-8 rounded-full" />
                                    <span>{team.name}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
                {activeTab === 'Schedule' && (
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Match Schedule</h2>
                            {hasPermission('competitions:edit') && <Button onClick={handleGenerateSchedule}>Generate Schedule</Button>}
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {competitionMatches.map(match => (
                                <li key={match.id} className="py-3 flex items-center justify-between">
                                    <div className="flex-1 text-right pr-4">{match.homeTeam.name}</div>
                                    <div className="font-bold">{match.status === 'Finished' ? `${match.homeScore} - ${match.awayScore}` : 'vs'}</div>
                                    <div className="flex-1 text-left pl-4">{match.awayTeam.name}</div>
                                    <div className="text-sm text-gray-500">{new Date(match.date).toLocaleDateString()}</div>
                                    {hasPermission('matches:manage_live') && <Button onClick={() => onManageLiveMatch(match.id)} variant="outline" className="ml-4">Manage Live</Button>}
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
                {activeTab === 'Standings' && (
                     <Card>
                        <h2 className="text-xl font-bold mb-4">Standings</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead><tr><th className="px-4 py-2 text-left">Team</th><th className="px-4 py-2 text-center">P</th><th className="px-4 py-2 text-center">W</th><th className="px-4 py-2 text-center">D</th><th className="px-4 py-2 text-center">L</th><th className="px-4 py-2 text-center">GD</th><th className="px-4 py-2 text-center">Pts</th></tr></thead>
                                <tbody>
                                    {standings.map(s => (
                                        <tr key={s.teamId}>
                                            <td className="px-4 py-2 flex items-center"><img src={s.logoUrl} alt={s.teamName} className="h-6 w-6 mr-2 rounded-full"/>{s.teamName}</td>
                                            <td className="px-4 py-2 text-center">{s.played}</td><td className="px-4 py-2 text-center">{s.wins}</td><td className="px-4 py-2 text-center">{s.draws}</td><td className="px-4 py-2 text-center">{s.losses}</td><td className="px-4 py-2 text-center">{s.goalDifference}</td><td className="px-4 py-2 text-center font-bold">{s.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
                 {activeTab === 'Sanctions' && (
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Disciplinary Sanctions</h2>
                            {hasPermission('competitions:edit') && <Button onClick={openCreateSanctionModal}><PlusIcon className="h-5 w-5 mr-2" /> Add Sanction</Button>}
                        </div>
                         <table className="min-w-full">
                            <thead><tr><th className="px-4 py-2 text-left">Date</th><th className="px-4 py-2 text-left">Party</th><th className="px-4 py-2 text-left">Reason</th><th className="px-4 py-2 text-left">Decision</th><th className="px-4 py-2 text-right">Actions</th></tr></thead>
                            <tbody>
                                {competitionSanctions.map(s => (
                                    <tr key={s.id}>
                                        <td className="px-4 py-2">{new Date(s.date).toLocaleDateString()}</td><td className="px-4 py-2 font-medium">{getSanctionTargetName(s)}</td><td className="px-4 py-2">{s.reason}</td><td className="px-4 py-2">{s.details}</td>
                                        <td className="px-4 py-2 text-right space-x-2">
                                            <Button onClick={() => openEditSanctionModal(s)} variant="outline" className="text-xs">Edit</Button>
                                            <Button onClick={() => handleDeleteSanction(s.id)} variant="danger" className="text-xs">Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                 )}
                 {activeTab === 'Settings' && <Card><h2 className="text-xl font-bold">Competition Settings</h2><p className="mt-4 text-gray-500">Settings for this competition are managed from the main "Manage Competitions" screen.</p></Card>}
            </div>

             <Modal isOpen={isSanctionModalOpen} onClose={closeSanctionModal} title={editingSanction ? 'Edit Sanction' : 'Add New Sanction'}>
                <SanctionForm
                    competitionId={competitionId}
                    sanction={editingSanction}
                    onSave={handleSaveSanction}
                    onClose={closeSanctionModal}
                />
            </Modal>
        </div>
    );
};

export default CompetitionDetail;
