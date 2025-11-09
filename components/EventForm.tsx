

import React, { useState, useEffect } from 'react';
// FIX: Added .ts extension to module import.
import type { Match, MatchEvent } from '../types.ts';
// FIX: Added .ts extension to module import.
import { MatchEventType } from '../types.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from './ui/Button.tsx';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';

interface EventFormProps {
  event?: MatchEvent | null;
  eventDefaults?: { type: MatchEventType, teamId: string } | null;
  match: Match;
  onSave: (data: Omit<MatchEvent, 'id' | 'minute'>) => void;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, eventDefaults, match, onSave, onClose }) => {
  const { players } = useCompetitions();

  const [type, setType] = useState<MatchEventType>(MatchEventType.GOAL);
  const [teamId, setTeamId] = useState<string>('');
  const [primaryPlayerId, setPrimaryPlayerId] = useState<string>('');
  const [secondaryPlayerId, setSecondaryPlayerId] = useState<string>('');
  const [error, setError] = useState('');

  const teamPlayers = players.filter(p => p.teamId === teamId);

  useEffect(() => {
    if (event) {
      setType(event.type);
      setTeamId(event.teamId);
      setPrimaryPlayerId(event.primaryPlayerId);
      setSecondaryPlayerId(event.secondaryPlayerId || '');
    } else if (eventDefaults) {
      setType(eventDefaults.type);
      setTeamId(eventDefaults.teamId);
      setPrimaryPlayerId('');
      setSecondaryPlayerId('');
    }
  }, [event, eventDefaults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryPlayerId || (type === MatchEventType.SUBSTITUTION && !secondaryPlayerId)) {
        setError('Please select the player(s).');
        return;
    }
    if (type === MatchEventType.SUBSTITUTION && primaryPlayerId === secondaryPlayerId) {
        setError('Players cannot substitute themselves.');
        return;
    }

    onSave({ type, teamId, primaryPlayerId, secondaryPlayerId: type === MatchEventType.SUBSTITUTION ? secondaryPlayerId : undefined });
  };
  
  const teamName = teamId === match.homeTeam.id ? match.homeTeam.name : match.awayTeam.name;

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <p className="font-semibold text-lg">{type} for {teamName}</p>
        
        {type === MatchEventType.SUBSTITUTION ? (
          <>
            <div>
              <label htmlFor="primaryPlayer" className="block text-sm font-medium">Player Out</label>
              <select id="primaryPlayer" value={primaryPlayerId} onChange={(e) => setPrimaryPlayerId(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
                <option value="">Select player...</option>
                {teamPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="secondaryPlayer" className="block text-sm font-medium">Player In</label>
              <select id="secondaryPlayer" value={secondaryPlayerId} onChange={(e) => setSecondaryPlayerId(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
                <option value="">Select player...</option>
                {teamPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="primaryPlayer" className="block text-sm font-medium">Player</label>
            <select id="primaryPlayer" value={primaryPlayerId} onChange={(e) => setPrimaryPlayerId(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
              <option value="">Select player...</option>
              {teamPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save Event</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default EventForm;
