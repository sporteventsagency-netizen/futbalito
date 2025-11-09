import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import Button from '../components/ui/Button.tsx';
import { PlusIcon, XMarkIcon } from '../components/icons/Icons.tsx';

const ManageNationalTeam: React.FC = () => {
  const { nationalTeam, nationalSquad, players, addPlayerToSquad, removePlayerFromSquad } = useCompetitions();

  const squadPlayerIds = nationalSquad.map(p => p.playerId);
  
  // Players who are not already in the squad
  const availablePlayers = players.filter(p => !squadPlayerIds.includes(p.id));
  
  // Full player objects for those in the squad
  const squadPlayers = nationalSquad.map(squadPlayer => {
    const playerDetails = players.find(p => p.id === squadPlayer.playerId);
    return { ...squadPlayer, ...playerDetails };
  });

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <img src={nationalTeam.logoUrl} alt={nationalTeam.name} className="h-16 w-16" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{nationalTeam.name}</h1>
          <p className="mt-1 text-gray-600">Manage the national team squad by selecting from the list of available players.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Available Players Column */}
        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold p-4 border-b">Available Players ({availablePlayers.length})</h2>
          <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
            {availablePlayers.map(player => (
              <li key={player.id} className="p-3 flex justify-between items-center">
                <span>{player.name}</span>
                <Button onClick={() => addPlayerToSquad(player.id)} size="sm" variant="outline">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add to Squad
                </Button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Current Squad Column */}
        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold p-4 border-b">Current Squad ({squadPlayers.length})</h2>
          <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
            {squadPlayers.map(player => (
              <li key={player.playerId} className="p-3 flex justify-between items-center">
                <span>{player.name}</span>
                 <Button onClick={() => removePlayerFromSquad(player.playerId)} size="sm" variant="danger">
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageNationalTeam;