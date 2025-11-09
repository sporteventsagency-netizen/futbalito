

import React, { useState, useEffect } from 'react';
// FIX: Added .ts extension to module import.
import type { Arena } from '../types.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from './ui/Button.tsx';

interface ArenaFormProps {
  arena?: Arena | null;
  onSave: (data: Omit<Arena, 'id'>) => void;
  onClose: () => void;
}

const romanianCounties = [
    "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila",
    "București", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița",
    "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov",
    "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu",
    "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"
];

const ArenaForm: React.FC<ArenaFormProps> = ({ arena, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [county, setCounty] = useState('');
  const [fieldDimensions, setFieldDimensions] = useState('');
  const [goalDimensions, setGoalDimensions] = useState('');
  const [hasFloodlights, setHasFloodlights] = useState(false);
  const [spectatorCapacity, setSpectatorCapacity] = useState('');
  const [homologationDate, setHomologationDate] = useState('');
  const [homologationExpiration, setHomologationExpiration] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (arena) {
      setName(arena.name);
      setLocation(arena.location);
      setCounty(arena.county || '');
      setFieldDimensions(arena.fieldDimensions || '');
      setGoalDimensions(arena.goalDimensions || '');
      setHasFloodlights(arena.hasFloodlights || false);
      setSpectatorCapacity(arena.spectatorCapacity?.toString() || '');
      setHomologationDate(arena.homologationDate ? new Date(arena.homologationDate).toISOString().slice(0, 10) : '');
      setHomologationExpiration(arena.homologationExpiration ? new Date(arena.homologationExpiration).toISOString().slice(0, 10) : '');
    } else {
      setName('');
      setLocation('');
      setCounty('');
      setFieldDimensions('');
      setGoalDimensions('');
      setHasFloodlights(false);
      setSpectatorCapacity('');
      setHomologationDate('');
      setHomologationExpiration('');
    }
    setError('');
  }, [arena]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Arena name is required.');
      return;
    }
    onSave({ 
        name, 
        location, 
        fields: arena?.fields || [],
        county: county || undefined,
        fieldDimensions: fieldDimensions || undefined,
        goalDimensions: goalDimensions || undefined,
        hasFloodlights,
        spectatorCapacity: spectatorCapacity ? parseInt(spectatorCapacity, 10) : undefined,
        homologationDate: homologationDate || undefined,
        homologationExpiration: homologationExpiration || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <div><label htmlFor="name" className="block text-sm font-medium">Arena Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="county" className="block text-sm font-medium">Județ</label>
                <select id="county" value={county} onChange={e => setCounty(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
                    <option value="">Selectează...</option>
                    {romanianCounties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium">Location (City)</label>
                <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="fieldDimensions" className="block text-sm font-medium">Dimensiune teren</label><input type="text" id="fieldDimensions" value={fieldDimensions} onChange={(e) => setFieldDimensions(e.target.value)} className="mt-1 block w-full border rounded-md p-2" placeholder="ex: 105 x 68 m"/></div>
            <div><label htmlFor="goalDimensions" className="block text-sm font-medium">Dimensiune porți</label><input type="text" id="goalDimensions" value={goalDimensions} onChange={(e) => setGoalDimensions(e.target.value)} className="mt-1 block w-full border rounded-md p-2" placeholder="ex: 7.32 x 2.44 m"/></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="hasFloodlights" className="block text-sm font-medium">Nocturnă</label>
                <select id="hasFloodlights" value={String(hasFloodlights)} onChange={e => setHasFloodlights(e.target.value === 'true')} className="mt-1 block w-full border rounded-md p-2">
                    <option value="true">Da</option>
                    <option value="false">Nu</option>
                </select>
            </div>
            <div><label htmlFor="spectatorCapacity" className="block text-sm font-medium">Număr locuri tribună</label><input type="number" id="spectatorCapacity" value={spectatorCapacity} onChange={(e) => setSpectatorCapacity(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="homologationDate" className="block text-sm font-medium">Data omologare</label><input type="date" id="homologationDate" value={homologationDate} onChange={(e) => setHomologationDate(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
            <div><label htmlFor="homologationExpiration" className="block text-sm font-medium">Data expirare omologare</label><input type="date" id="homologationExpiration" value={homologationExpiration} onChange={(e) => setHomologationExpiration(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={onClose}>Cancel</Button></div>
    </form>
  );
};

export default ArenaForm;