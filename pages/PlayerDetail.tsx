import React, { useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { ChevronLeftIcon } from '../components/icons/Icons.tsx';
import Card from '../components/ui/Card.tsx';

interface PlayerDetailProps {
  playerId: string;
  onBack: () => void;
}

const PlayerDetail: React.FC<PlayerDetailProps> = ({ playerId, onBack }) => {
  const { players, teams, getTransfersByPlayerId, getPlayerRegistrationsByPlayerId } = useCompetitions();

  const player = useMemo(() => players.find(p => p.id === playerId), [playerId, players]);
  const team = useMemo(() => teams.find(t => t.id === player?.teamId), [player, teams]);
  const transfers = useMemo(() => getTransfersByPlayerId(playerId), [playerId, getTransfersByPlayerId]);
  const registrations = useMemo(() => getPlayerRegistrationsByPlayerId(playerId), [playerId, getPlayerRegistrationsByPlayerId]);

  if (!player) {
    return (
        <div>
            <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"><ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Players</button>
            <Card><p>Player not found.</p></Card>
        </div>
    );
  }

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown Team';

  return (
    <div>
        <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Players
        </button>
        <div className="flex items-center gap-6 mb-6">
            <img src={player.photoUrl || `https://avatar.iran.liara.run/username?username=${player.name.replace(/\s/g, '+')}`} alt={player.name} className="h-24 w-24 rounded-full object-cover" />
            <div>
                <h1 className="text-4xl font-bold text-gray-800">{player.name}</h1>
                <div className="flex items-center mt-1">
                    {team && <img src={team.logoUrl} alt={team.name} className="h-6 w-6 rounded-full mr-2"/>}
                    <p className="text-lg text-gray-600">{team?.name || 'Unassigned'}</p>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <h3 className="font-bold mb-3 text-lg">Personal Info</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span>CNP:</span> <span className="font-medium text-gray-700">{player.cnp || 'N/A'}</span></li>
                        <li className="flex justify-between"><span>Date of Birth:</span> <span className="font-medium text-gray-700">{player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'}</span></li>
                        <li className="flex justify-between"><span>Status:</span> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${player.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{player.status === 'active' ? 'Active' : 'Inactive'}</span></li>
                    </ul>
                </Card>
                 <Card>
                    <h3 className="font-bold mb-3 text-lg">Contact Info</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span>Phone:</span> <a href={`tel:${player.phone}`} className="font-medium text-blue-600 hover:underline">{player.phone || 'N/A'}</a></li>
                        <li className="flex justify-between"><span>Email:</span> <a href={`mailto:${player.email}`} className="font-medium text-blue-600 hover:underline">{player.email || 'N/A'}</a></li>
                    </ul>
                </Card>
            </div>
             <div className="lg:col-span-2 space-y-8">
                <Card>
                    <h3 className="font-bold mb-3 text-lg">Registration Details</h3>
                     <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span>Registration #:</span> <span className="font-medium text-gray-700">{player.registrationNumber || 'N/A'}</span></li>
                        <li className="flex justify-between"><span>Registration Date:</span> <span className="font-medium text-gray-700">{player.registrationDate ? new Date(player.registrationDate).toLocaleDateString() : 'N/A'}</span></li>
                    </ul>
                    <h4 className="font-semibold mt-4 mb-2 text-md">Annual Visas</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {player.annualVisas && player.annualVisas.length > 0 ? player.annualVisas.map((visa, index) => (
                            <li key={index}>{new Date(visa).toLocaleDateString()}</li>
                        )) : (
                            <li>No visa history.</li>
                        )}
                    </ul>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Transfer History</h2>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left font-medium">Date</th><th className="px-4 py-2 text-left font-medium">From</th><th className="px-4 py-2 text-left font-medium">To</th><th className="px-4 py-2 text-left font-medium">Fee</th></tr></thead>
                        <tbody>
                            {transfers.length > 0 ? transfers.map(t => (
                                <tr key={t.id}><td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td><td className="px-4 py-2">{getTeamName(t.fromTeamId)}</td><td className="px-4 py-2">{getTeamName(t.toTeamId)}</td><td className="px-4 py-2">{t.fee > 0 ? `$${t.fee.toLocaleString()}` : 'Free'}</td></tr>
                            )) : (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No transfer history for this player.</td></tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default PlayerDetail;