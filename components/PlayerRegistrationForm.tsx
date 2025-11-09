
import React, { useState, useEffect } from 'react';
import type { PlayerRegistration, PlayerRegistrationStatus } from '../types.ts';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import Button from './ui/Button.tsx';

interface PlayerRegistrationFormProps {
  registration?: PlayerRegistration | null;
  onSave: (data: Omit<PlayerRegistration, 'id'>) => void;
  onClose: () => void;
}

const PlayerRegistrationForm: React.FC<PlayerRegistrationFormProps> = ({ registration, onSave, onClose }) => {
  const { players } = useCompetitions();
  
  const [playerId, setPlayerId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10));
  const [status, setStatus] = useState<PlayerRegistrationStatus>('ACTIVE');
  const [error, setError] = useState('');

  /**
   * Effect to populate form fields when editing an existing registration
   * or reset them for a new one.
   */
  useEffect(() => {
    if (registration) {
      setPlayerId(registration.playerId);
      setRegistrationNumber(registration.registrationNumber);
      setValidFrom(new Date(registration.validFrom).toISOString().slice(0, 10));
      setValidUntil(new Date(registration.validUntil).toISOString().slice(0, 10));
      setStatus(registration.status);
    } else {
      // Reset form fields to default for a new registration
      setPlayerId('');
      setRegistrationNumber('');
      setValidFrom(new Date().toISOString().slice(0, 10));
      setValidUntil(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10));
      setStatus('ACTIVE');
    }
    setError('');
  }, [registration]);

  /**
   * Handles form submission, performs validation, and calls the onSave callback.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId || !registrationNumber.trim()) {
      setError('Player and Registration Number are required.');
      return;
    }
    onSave({ playerId, registrationNumber, validFrom, validUntil, status });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="playerId" className="block text-sm font-medium text-gray-700">Player</label>
          <select 
            id="playerId" 
            value={playerId} 
            onChange={(e) => setPlayerId(e.target.value)} 
            className="mt-1 block w-full border rounded-md p-2"
            disabled={!!registration} // Prevent changing player when editing
          >
            <option value="">Select Player...</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
          <input type="text" id="registrationNumber" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="validFrom" className="block text-sm font-medium text-gray-700">Valid From</label>
            <input type="date" id="validFrom" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700">Valid Until</label>
            <input type="date" id="validUntil" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as PlayerRegistrationStatus)} className="mt-1 block w-full border rounded-md p-2">
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save Registration</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default PlayerRegistrationForm;
