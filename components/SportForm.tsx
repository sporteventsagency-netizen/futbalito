import React, { useState, useEffect } from 'react';
import type { Sport } from '../types.ts';
import Button from './ui/Button.tsx';

interface SportFormProps {
  sport?: Sport | null;
  onSave: (data: { name: string; description: string; }) => void;
  onClose: () => void;
}

const SportForm: React.FC<SportFormProps> = ({ sport, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sport) {
      setName(sport.name);
      setDescription(sport.description);
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [sport]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Sport name is required.');
      return;
    }
    onSave({ name, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Sport Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border rounded-md p-2" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default SportForm;
