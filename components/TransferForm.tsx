import React, { useState, useEffect, useMemo } from 'react';
import type { Transfer, Player } from '../types.ts';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import Button from './ui/Button.tsx';

interface TransferFormProps {
  transfer?: Transfer | null;
  onSave: (data: Omit<Transfer, 'id'>) => void;
  onClose: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ transfer, onSave, onClose }) => {
  const { players, teams } = useCompetitions();
  
  const [playerId, setPlayerId] = useState('');
  const [fromTeamId, setFromTeamId] = useState('');
  const [toTeamId, setToTeamId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [fee, setFee] = useState(0);
  const [error, setError] = useState('');

  const availableTeams = useMemo(() => teams.filter(t => t.id !== fromTeamId), [teams, fromTeamId]);

  useEffect(() => {
    if (transfer) {
      setPlayerId(transfer.playerId);
      setFromTeamId(transfer.fromTeamId);
      setToTeamId(transfer.toTeamId);
      setDate(new Date(transfer.date).toISOString().slice(0, 10));
      setFee(transfer.fee);
    } else {
      // Reset form
      setPlayerId('');
      setFromTeamId('');
      setToTeamId('');
      setDate(new Date().toISOString().slice(0, 10));
      setFee(0);
    }
    setError('');
  }, [transfer]);
  
  useEffect(() => {
    if (playerId) {
      const player = players.find(p => p.id === playerId);
      if (player) {
        setFromTeamId(player.teamId);
        // Ensure 'to team' is not the same as 'from team'
        if (toTeamId === player.teamId) {
            setToTeamId('');
        }
      }
    } else {
      setFromTeamId('');
    }
  }, [playerId, players, toTeamId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId || !fromTeamId || !toTeamId) {
      setError('Player, from team, and to team are required.');
      return;
    }
    onSave({ playerId, fromTeamId, toTeamId, date, fee });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Player</label>
          <select value={playerId} onChange={e => setPlayerId(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
            <option value="">Select Player...</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium">From Team</label>
                <input type="text" value={teams.find(t => t.id === fromTeamId)?.name || ''} disabled className="mt-1 block w-full border rounded-md p-2 bg-gray-100" />
            </div>
            <div>
                <label className="block text-sm font-medium">To Team</label>
                <select value={toTeamId} onChange={e => setToTeamId(e.target.value)} className="mt-1 block w-full border rounded-md p-2" disabled={!fromTeamId}>
                    <option value="">Select Team...</option>
                    {availableTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
            </div>
             <div>
                <label className="block text-sm font-medium">Transfer Fee ($)</label>
                <input type="number" value={fee} onChange={e => setFee(Number(e.target.value))} min="0" className="mt-1 block w-full border rounded-md p-2" />
            </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save Transfer</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default TransferForm;