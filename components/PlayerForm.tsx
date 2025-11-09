import React, { useState, useEffect } from 'react';
import type { Player } from '../types.ts';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import Button from './ui/Button.tsx';
import { PlusIcon, XMarkIcon } from './icons/Icons.tsx';

interface PlayerFormProps {
  player?: Player | null;
  onSave: (data: Omit<Player, 'id' | 'stats' | 'photoUrl'> & { photoFile?: File | null }) => void;
  onClose: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSave, onClose }) => {
  const { teams } = useCompetitions();
  
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');

  // New fields state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cnp, setCnp] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [annualVisas, setAnnualVisas] = useState<string[]>(['']);

  useEffect(() => {
    if (player) {
      setName(player.name);
      setTeamId(player.teamId);
      setPreviewUrl(player.photoUrl || null);
      setCnp(player.cnp || '');
      setDateOfBirth(player.dateOfBirth ? player.dateOfBirth.slice(0, 10) : '');
      setRegistrationNumber(player.registrationNumber || '');
      setRegistrationDate(player.registrationDate ? player.registrationDate.slice(0, 10) : '');
      setPhone(player.phone || '');
      setEmail(player.email || '');
      setStatus(player.status || 'active');
      setAnnualVisas(player.annualVisas && player.annualVisas.length > 0 ? player.annualVisas : ['']);
    } else {
      setName('');
      setTeamId(teams.length > 0 ? teams[0].id : '');
      setPreviewUrl(null);
      setCnp('');
      setDateOfBirth('');
      setRegistrationNumber('');
      setRegistrationDate('');
      setPhone('');
      setEmail('');
      setStatus('active');
      setAnnualVisas(['']);
    }
    setError('');
  }, [player, teams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleVisaChange = (index: number, value: string) => {
    const newVisas = [...annualVisas];
    newVisas[index] = value;
    setAnnualVisas(newVisas);
  };

  const addVisa = () => setAnnualVisas([...annualVisas, '']);
  const removeVisa = (index: number) => {
    if (annualVisas.length > 1) {
      setAnnualVisas(annualVisas.filter((_, i) => i !== index));
    } else {
      setAnnualVisas(['']); // Keep at least one empty input
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !teamId) {
      setError('Player name and team selection are required.');
      return;
    }
    onSave({
      name,
      teamId,
      photoFile,
      cnp,
      dateOfBirth,
      registrationNumber,
      registrationDate,
      phone,
      email,
      status,
      annualVisas: annualVisas.filter(v => v), // Filter out empty strings
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Foto Jucător</label>
                 <img src={previewUrl || `https://avatar.iran.liara.run/username?username=${name.replace(/\s/g, '+')}`} alt="Player" className="mt-1 h-24 w-24 rounded-full object-cover bg-gray-100" />
                <input type="file" onChange={handleFileChange} accept="image/*" className="mt-2 block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <div className="md:col-span-2 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Player Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="teamId" className="block text-sm font-medium text-gray-700">Team</label>
                    <select id="teamId" value={teamId} onChange={(e) => setTeamId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        {teams.length === 0 ? <option disabled>No teams available</option> : teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                    </select>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="cnp" className="block text-sm font-medium">CNP</label><input type="text" id="cnp" value={cnp} onChange={e => setCnp(e.target.value)} className="mt-1 w-full border rounded-md p-2" /></div>
            <div><label htmlFor="dateOfBirth" className="block text-sm font-medium">Data Nașterii</label><input type="date" id="dateOfBirth" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="mt-1 w-full border rounded-md p-2" /></div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="registrationNumber" className="block text-sm font-medium">Număr Legitimație</label><input type="text" id="registrationNumber" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} className="mt-1 w-full border rounded-md p-2" /></div>
            <div><label htmlFor="registrationDate" className="block text-sm font-medium">Data Legitimării</label><input type="date" id="registrationDate" value={registrationDate} onChange={e => setRegistrationDate(e.target.value)} className="mt-1 w-full border rounded-md p-2" /></div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="phone" className="block text-sm font-medium">Telefon</label><input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full border rounded-md p-2" /></div>
            <div><label htmlFor="email" className="block text-sm font-medium">Email</label><input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full border rounded-md p-2" /></div>
        </div>
         <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select id="status" value={status} onChange={e => setStatus(e.target.value as 'active' | 'inactive')} className="mt-1 block w-full border rounded-md p-2">
                <option value="active">Activ</option>
                <option value="inactive">Inactiv</option>
            </select>
        </div>
         <div>
            <label className="block text-sm font-medium mb-1">Vize Anuale</label>
            {annualVisas.map((visaDate, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                    <input type="date" value={visaDate} onChange={e => handleVisaChange(index, e.target.value)} className="flex-grow border rounded-md p-2" />
                    <button type="button" onClick={() => removeVisa(index)} className="p-1 text-red-500 hover:text-red-700"><XMarkIcon className="h-5 w-5"/></button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addVisa}><PlusIcon className="h-4 w-4 mr-1"/> Adaugă viză</Button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse border-t">
        <Button type="submit">Save Player</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default PlayerForm;