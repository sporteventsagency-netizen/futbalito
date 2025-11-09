
import React, { useState, useEffect, useMemo } from 'react';
// FIX: Added .ts extension to module import.
import type { Competition, Team } from '../types.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from './ui/Button.tsx';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { PlusIcon, XMarkIcon } from './icons/Icons.tsx';

interface CompetitionFormProps {
  competition?: Competition | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const romanianCounties = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila",
  "București", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița",
  "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov",
  "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu",
  "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"
];

const CompetitionForm: React.FC<CompetitionFormProps> = ({ competition, onSave, onClose }) => {
  const { arenas, users, sports, teams } = useCompetitions();
  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [format, setFormat] = useState<'league' | 'cup' | 'mixed'>('league');
  const [twoLegged, setTwoLegged] = useState(false);
  const [teamsPerGroup, setTeamsPerGroup] = useState(4);
  const [defaultArenaId, setDefaultArenaId] = useState<string | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(false);
  const [county, setCounty] = useState<string | undefined>(undefined);
  const [organizerId, setOrganizerId] = useState<string | undefined>(undefined);
  const [sportId, setSportId] = useState<string | undefined>(undefined);
  const [pointsForWin, setPointsForWin] = useState<number>(3);
  const [pointsForTieBreakWin, setPointsForTieBreakWin] = useState<number>(2);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);


  useEffect(() => {
    if (competition) {
      setName(competition.name);
      setSeason(competition.season);
      setPreviewUrl(competition.logoUrl);
      setFormat(competition.format);
      setTwoLegged(competition.twoLegged ?? false);
      setTeamsPerGroup(competition.teamsPerGroup ?? 4);
      setDefaultArenaId(competition.defaultArenaId);
      setIsPublic(competition.isPublic ?? false);
      setCounty(competition.county);
      setOrganizerId(competition.organizerId);
      setSportId(competition.sportId);
      setPointsForWin(competition.pointsForWin ?? 3);
      setPointsForTieBreakWin(competition.pointsForTieBreakWin ?? 2);
      setSelectedTeamIds(competition.teamIds || []);
    } else {
      setName(''); setSeason(''); setPreviewUrl(null); setFormat('league'); setTwoLegged(false); setTeamsPerGroup(4); setDefaultArenaId(undefined); setIsPublic(false); setCounty(undefined); setOrganizerId(undefined); setSportId(undefined); setPointsForWin(3); setPointsForTieBreakWin(2);
      setSelectedTeamIds([]);
    }
    setLogoFile(null); setError('');
  }, [competition]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const availableTeams = useMemo(() => {
    const teamsInCounty = county ? teams.filter(t => t.county === county) : teams;
    return teamsInCounty.filter(t => !selectedTeamIds.includes(t.id));
  }, [teams, county, selectedTeamIds]);

  const selectedTeams = useMemo(() => {
    return selectedTeamIds.map(id => teams.find(t => t.id === id)).filter((t): t is Team => !!t);
  }, [selectedTeamIds, teams]);
  
  const handleAddTeam = (teamId: string) => {
    setSelectedTeamIds(prev => [...prev, teamId]);
  };
  
  const handleRemoveTeam = (teamId: string) => {
    setSelectedTeamIds(prev => prev.filter(id => id !== teamId));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !season.trim()) {
      setError('Name and season are required.');
      return;
    }
    onSave({ name, season, logoFile, format, twoLegged, teamsPerGroup, defaultArenaId, isPublic, county, organizerId, sportId, pointsForWin, pointsForTieBreakWin, teamIds: selectedTeamIds });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="mt-1 flex items-center space-x-4">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">{previewUrl ? <img src={previewUrl} alt="Logo" className="h-full w-full object-cover" /> : <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.993A1 1 0 001 18h22a1 1 0 001 2.993zM10.771 5.223c-.486-.486-1.278-.486-1.764 0l-4.5 4.5a.5.5 0 00.353.854h9.282a.5.5 0 00.353-.854l-4.5-4.5z" /></svg>}</span>
            <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"><span>{competition ? 'Change' : 'Upload'}</span><input id="logo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" /></label>
          </div>
        </div>
        <div><label htmlFor="name" className="block text-sm font-medium">Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        <div><label htmlFor="season" className="block text-sm font-medium">Season</label><input type="text" id="season" value={season} onChange={(e) => setSeason(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="county" className="block text-sm font-medium text-gray-700">County / Region</label>
              <select id="county" value={county || ''} onChange={e => setCounty(e.target.value || undefined)} className="mt-1 block w-full border rounded-md p-2">
                  <option value="">None (Show all teams)</option>
                  {romanianCounties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer</label>
              <select id="organizer" value={organizerId || ''} onChange={e => setOrganizerId(e.target.value || undefined)} className="mt-1 block w-full border rounded-md p-2">
                  <option value="">None</option>
                  {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
            </div>
        </div>

         <div>
          <label htmlFor="sport" className="block text-sm font-medium text-gray-700">Sport</label>
          <select id="sport" value={sportId || ''} onChange={e => setSportId(e.target.value || undefined)} className="mt-1 block w-full border rounded-md p-2">
              <option value="">Select a sport</option>
              {sports.map(sport => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
          </select>
        </div>
        
        <div>
          <label htmlFor="defaultArena" className="block text-sm font-medium text-gray-700">Default Arena</label>
          <select id="defaultArena" value={defaultArenaId || ''} onChange={e => setDefaultArenaId(e.target.value || undefined)} className="mt-1 block w-full border rounded-md p-2">
              <option value="">None (assign per match)</option>
              {arenas.map(arena => <option key={arena.id} value={arena.id}>{arena.name}</option>)}
          </select>
        </div>
        <hr/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pointsForWin" className="block text-sm font-medium">Puncte victorie</label>
            <input type="number" id="pointsForWin" value={pointsForWin} onChange={(e) => setPointsForWin(Number(e.target.value))} className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label htmlFor="pointsForTieBreakWin" className="block text-sm font-medium">Puncte departajare</label>
            <input type="number" id="pointsForTieBreakWin" value={pointsForTieBreakWin} onChange={(e) => setPointsForTieBreakWin(Number(e.target.value))} className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>
        <div><label className="block text-sm font-medium">Format</label><select value={format} onChange={(e) => setFormat(e.target.value as any)} className="mt-1 block w-full border rounded-md p-2"><option value="league">League</option><option value="cup">Cup</option><option value="mixed">Mixed</option></select></div>
        {format === 'league' && <div className="flex items-center"><input id="twoLegged" type="checkbox" checked={twoLegged} onChange={(e) => setTwoLegged(e.target.checked)} className="h-4 w-4 rounded" /><label htmlFor="twoLegged" className="ml-2">Two-legged matches</label></div>}
        {format === 'mixed' && (<div className="space-y-4 p-4 bg-gray-50 rounded-md"><div><label htmlFor="teamsPerGroup" className="block text-sm font-medium">Teams per group</label><input type="number" id="teamsPerGroup" value={teamsPerGroup} onChange={(e) => setTeamsPerGroup(parseInt(e.target.value, 10) || 0)} className="mt-1 w-full border rounded-md p-2" min="2"/></div><div className="flex items-center"><input id="twoLeggedGroups" type="checkbox" checked={twoLegged} onChange={(e) => setTwoLegged(e.target.checked)} className="h-4 w-4 rounded" /><label htmlFor="twoLeggedGroups" className="ml-2">Two-legged matches in groups</label></div></div>)}
        <hr />
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Manage Teams</h3>
          <p className="text-sm text-gray-500 mb-4">
            Available teams are filtered by the selected county. If no county is selected, all teams are shown.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Available Teams ({availableTeams.length})</label>
              <div className="mt-1 border rounded-md p-2 h-64 overflow-y-auto bg-gray-50">
                {availableTeams.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {availableTeams.map(team => (
                      <li key={team.id} className="py-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <img src={team.logoUrl} alt={team.name} className="h-8 w-8 rounded-full object-cover mr-3" />
                          <span className="text-sm font-medium">{team.name}</span>
                        </div>
                        <Button type="button" size="sm" variant="outline" onClick={() => handleAddTeam(team.id)}>
                           <PlusIcon className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-sm text-gray-500 pt-8">No available teams match the criteria.</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selected Teams ({selectedTeams.length})</label>
              <div className="mt-1 border rounded-md p-2 h-64 overflow-y-auto">
                {selectedTeams.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {selectedTeams.map(team => (
                      <li key={team.id} className="py-2 flex items-center justify-between">
                         <div className="flex items-center">
                          <img src={team.logoUrl} alt={team.name} className="h-8 w-8 rounded-full object-cover mr-3" />
                          <span className="text-sm font-medium">{team.name}</span>
                        </div>
                        <Button type="button" size="sm" variant="danger" onClick={() => handleRemoveTeam(team.id)}>
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                    <p className="text-center text-sm text-gray-500 pt-8">No teams selected.</p>
                )}
              </div>
            </div>
          </div>
        </div>

         <div className="flex items-center">
            <input id="isPublic" type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="h-4 w-4 rounded" />
            <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-gray-700">Make this competition public on the main portal</label>
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

export default CompetitionForm;
