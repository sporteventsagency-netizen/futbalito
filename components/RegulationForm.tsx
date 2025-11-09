
import React, { useState } from 'react';
import type { Regulation } from '../types.ts';
import Button from './ui/Button.tsx';

interface RegulationFormProps {
  regulation: Regulation;
  onSave: (content: string) => void;
  onClose: () => void;
}

const RegulationForm: React.FC<RegulationFormProps> = ({ regulation, onSave, onClose }) => {
  const [content, setContent] = useState(regulation.content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(content);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder={`Enter content for ${regulation.title}...`}
        ></textarea>
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default RegulationForm;
