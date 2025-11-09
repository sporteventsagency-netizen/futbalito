

import React, { useState, useEffect } from 'react';
// FIX: Added .ts extension to module import.
import type { Team } from '../types.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from './ui/Button.tsx';
import { useCompetitions } from '../context/CompetitionContext.tsx';

// Copied from CompetitionForm.tsx, should be moved to a shared file in a real app
const romanianCounties = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila",
  "București", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița",
  "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov",
  "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu",
  "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"
];

interface TeamFormProps {
  team?: Team | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, onSave, onClose }) => {
  const { users } = useCompetitions();

  const [name, setName] = useState('');
  const [country, setCountry] = useState('Romania');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  // New fields state
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [foundedYear, setFoundedYear] = useState<string>('');
  const [clubColors, setClubColors] = useState({ primary: '#000000', secondary: '#FFFFFF' });
  const [president, setPresident] = useState('');
  const [competitionOrganizer, setCompetitionOrganizer] = useState('');
  const [coach, setCoach] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    if (team) {
      setName(team.name);
      setCountry(team.country);
      setPreviewUrl(team.logoUrl);
      // Set new fields
      setCounty(team.county || '');
      setCity(team.city || '');
      setAddress(team.address || '');
      setFoundedYear(team.foundedYear?.toString() || '');
      setClubColors(team.clubColors || { primary: '#000000', secondary: '#FFFFFF' });
      setPresident(team.president || '');
      setCompetitionOrganizer(team.competitionOrganizer || '');
      setCoach(team.coach || '');
      setStatus(team.status || 'active');
    } else {
        setName('');
        setCountry('Romania');
        setPreviewUrl(null);
        // Reset new fields
        setCounty('');
        setCity('');
        setAddress('');
        setFoundedYear('');
        setClubColors({ primary: '#000000', secondary: '#FFFFFF' });
        setPresident('');
        setCompetitionOrganizer('');
        setCoach('');
        setStatus('active');
    }
    setLogoFile(null);
    setError('');
  }, [team]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !country.trim()) {
      setError('Name and country are required.');
      return;
    }
    onSave({ 
      name, 
      country, 
      logoFile,
      county,
      city,
      address,
      foundedYear: foundedYear ? parseInt(foundedYear, 10) : undefined,
      clubColors,
      president,
      competitionOrganizer,
      coach,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="mt-1 flex items-center space-x-4">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              {previewUrl ? (
                <img src={previewUrl} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.993A1 1 0 001 18h22a1 1 0 001 2.993zM10.771 5.223c-.486-.486-1.278-.486-1.764 0l-4.5 4.5a.5.5 0 00.353.854h9.282a.5.5 0 00.353-.854l-4.5-4.5z" />
                </svg>
              )}
            </span>
            <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span>{team ? 'Change' : 'Upload'}</span>
              <input id="logo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium">Country</label>
          <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="county" className="block text-sm font-medium text-gray-700">Județ</label>
              <select id="county" value={county} onChange={e => setCounty(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
                  <option value="">Selectează...</option>
                  {romanianCounties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Localitate</label>
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
            </div>
        </div>

        <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresă</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">Anul înființării</label>
                <input type="number" id="foundedYear" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                 <select id="status" value={status} onChange={e => setStatus(e.target.value as any)} className="mt-1 block w-full border rounded-md p-2">
                    <option value="active">Activ</option>
                    <option value="inactive">Inactiv</option>
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Culorile clubului</label>
            <div className="mt-1 flex items-center space-x-4">
                <div className="flex items-center">
                    <input type="color" value={clubColors.primary} onChange={e => setClubColors(c => ({...c, primary: e.target.value}))} className="h-8 w-10 border-none rounded"/>
                    <span className="ml-2 text-sm">Primară</span>
                </div>
                 <div className="flex items-center">
                    <input type="color" value={clubColors.secondary} onChange={e => setClubColors(c => ({...c, secondary: e.target.value}))} className="h-8 w-10 border-none rounded"/>
                    <span className="ml-2 text-sm">Secundară</span>
                </div>
            </div>
        </div>

         <div>
            <label htmlFor="president" className="block text-sm font-medium text-gray-700">Președinte club</label>
            <input type="text" id="president" value={president} onChange={(e) => setPresident(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>
        
        <div>
            <label htmlFor="competitionOrganizer" className="block text-sm font-medium text-gray-700">Organizator competiții</label>
            <select id="competitionOrganizer" value={competitionOrganizer} onChange={e => setCompetitionOrganizer(e.target.value)} className="mt-1 block w-full border rounded-md p-2">
              <option value="">Selectează utilizator...</option>
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
        </div>

        <div>
            <label htmlFor="coach" className="block text-sm font-medium text-gray-700">Antrenor</label>
            <input type="text" id="coach" value={coach} onChange={(e) => setCoach(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
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

export default TeamForm;