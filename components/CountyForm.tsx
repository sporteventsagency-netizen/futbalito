
import React, { useState, useEffect } from 'react';
import type { County } from '../types.ts';
import Button from './ui/Button.tsx';

interface CountyFormProps {
  county?: County | null;
  onSave: (data: { name: string }) => void;
  onClose: () => void;
}

const CountyForm: React.FC<CountyFormProps> = ({ county, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  /**
   * Effect to populate the form field when editing an existing county
   * or reset it for a new one.
   */
  useEffect(() => {
    if (county) {
      setName(county.name);
    } else {
      setName('');
    }
    setError('');
  }, [county]);
  
  /**
   * Handles form submission, performs validation, and calls the onSave callback.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('County name is required.');
      return;
    }
    onSave({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">County Name</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="mt-1 block w-full border rounded-md p-2" 
          />
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

export default CountyForm;
