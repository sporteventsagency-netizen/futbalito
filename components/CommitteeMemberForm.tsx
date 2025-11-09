
import React, { useState, useEffect } from 'react';
import type { CommitteeMember } from '../types.ts';
import Button from './ui/Button.tsx';

interface CommitteeMemberFormProps {
  member?: CommitteeMember | null;
  onSave: (data: { name: string; role: string }) => void;
  onClose: () => void;
}

const CommitteeMemberForm: React.FC<CommitteeMemberFormProps> = ({ member, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
    } else {
      setName('');
      setRole('');
    }
    setError('');
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError('Name and role are required.');
      return;
    }
    onSave({ name, role });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Member Name</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="mt-1 block w-full border rounded-md p-2" 
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <input 
            type="text" 
            id="role" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="mt-1 block w-full border rounded-md p-2" 
            placeholder="e.g., President, Secretary"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save Member</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default CommitteeMemberForm;
