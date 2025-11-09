
import React, { useState, useEffect, useMemo } from 'react';
import type { Sanction, Team, Player } from '../types.ts';
import Button from './ui/Button.tsx';
import { useCompetitions } from '../context/CompetitionContext.tsx';

interface SanctionFormProps {
  competitionId: string;
  sanction?: Sanction | null;
  onSave: (data: Omit<Sanction, 'id' | 'competitionId'>) => void;
  onClose: () => void;
}

const SanctionForm: React.FC<SanctionFormProps> = ({ competitionId, sanction, onSave, onClose }) => {
  const { teams, players, getCompetitionById } = useCompetitions();

  const [targetType, setTargetType] = useState<'team' | 'player'>('player');
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const competition = getCompetitionById(competitionId);
  
  /**
   * Memoized list of teams participating in the current competition.
   */
  const competitionTeams = useMemo(() => {
    if (!competition) return [];
    return teams.filter(t => competition.teamIds.includes(t.id));
  }, [competition, teams]);

  /**
   * Memoized list of players belonging to the currently selected team.
   */
  const teamPlayers = useMemo(() => {
    if (!teamId) return [];
    return players.filter(p => p.teamId === teamId);
  }, [teamId, players]);

  /**
   * Effect to populate the form with existing sanction data when editing,
   * or to reset the form fields when creating a new sanction.
   */
  useEffect(() => {
    if (sanction) {
      if (sanction.playerId) {
        const player = players.find(p => p.id === sanction.playerId);
        setTargetType('player');
        setTeamId(player?.teamId);
        setPlayerId(sanction.playerId);
      } else {
        setTargetType('team');
        setTeamId(sanction.teamId);
        setPlayerId(undefined);
      }
      setReason(sanction.reason);
      setDetails(sanction.details);
      setDate(new Date(sanction.date).toISOString().slice(0, 10));
    } else {
      // Reset form to default state for new sanction
      setTargetType('player');
      setTeamId(undefined);
      setPlayerId(undefined);
      setReason('');
      setDetails('');
      setDate(new Date().toISOString().slice(0, 10));
    }
    setError('');
  }, [sanction, players]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Form Validation
    if ((targetType === 'player' && !playerId) || (targetType === 'team' && !teamId)) {
      setError('Please select a sanctioned party.');
      return;
    }
    if (!reason.trim()) {
      setError('Reason for the sanction is required.');
      return;
    }

    const sanctionData: Omit<Sanction, 'id' | 'competitionId'> = {
      teamId: targetType === 'team' ? teamId : undefined,
      playerId: targetType === 'player' ? playerId : undefined,
      reason,
      details,
      date: new Date(date).toISOString(),
    };

    onSave(sanctionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sanction For</label>
          <div className="mt-1 flex space-x-4">
            <label className="flex items-center"><input type="radio" name="targetType" value="player" checked={targetType === 'player'} onChange={() => { setTargetType('player'); setTeamId(undefined); setPlayerId(undefined); }} className="h-4 w-4" /> <span className="ml-2">Player</span></label>
            <label className="flex items-center"><input type="radio" name="targetType" value="team" checked={targetType === 'team'} onChange={() => { setTargetType('team'); setPlayerId(undefined); }} className="h-4 w-4" /> <span className="ml-2">Team</span></label>
          </div>
        </div>

        <div>
          <label htmlFor="team" className="block text-sm font-medium">Team</label>
          <select id="team" value={teamId || ''} onChange={(e) => { setTeamId(e.target.value); setPlayerId(undefined); }} className="mt-1 block w-full border rounded-md p-2">
            <option value="">Select a team...</option>
            {competitionTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {targetType === 'player' && (
          <div>
            <label htmlFor="player" className="block text-sm font-medium">Player</label>
            <select id="player" value={playerId || ''} onChange={(e) => setPlayerId(e.target.value)} disabled={!teamId} className="mt-1 block w-full border rounded-md p-2 disabled:bg-gray-100">
              <option value="">Select a player...</option>
              {teamPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}
        
        <div><label htmlFor="reason" className="block text-sm font-medium">Reason</label><input type="text" id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 block w-full border rounded-md p-2" placeholder="e.g., Red Card, Unsportsmanlike Conduct" /></div>
        <div><label htmlFor="details" className="block text-sm font-medium">Details (Penalty)</label><textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} rows={3} className="mt-1 block w-full border rounded-md p-2" placeholder="e.g., 2 match suspension, $100 fine" /></div>
        <div><label htmlFor="date" className="block text-sm font-medium">Date of Sanction</label><input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save Sanction</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default SanctionForm;
