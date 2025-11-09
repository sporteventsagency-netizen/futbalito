
import React, { useState, useEffect } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .ts extension to module import to resolve module resolution error.
import type { PublicConfig, Announcement, CommitteeMember } from '../types.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
import { ChevronLeftIcon, PlusIcon } from '../components/icons/Icons.tsx';
import Modal from '../components/ui/Modal.tsx';
import AnnouncementForm from '../components/AnnouncementForm.tsx';
import CommitteeMemberForm from '../components/CommitteeMemberForm.tsx';

interface WebBuilderProps {
  competitionId: string;
  onBack: () => void;
}

const WebBuilder: React.FC<WebBuilderProps> = ({ competitionId, onBack }) => {
  const { getCompetitionById, updateCompetitionPublicConfig, matches } = useCompetitions();
  
  const [config, setConfig] = useState<PublicConfig | undefined>(getCompetitionById(competitionId)?.publicConfig);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isCommitteeModalOpen, setIsCommitteeModalOpen] = useState(false);
  const [editingCommitteeMember, setEditingCommitteeMember] = useState<CommitteeMember | null>(null);

  const competitionMatches = matches.filter(m => m.competitionId === competitionId && m.liveStreamUrl);

  useEffect(() => {
    const competition = getCompetitionById(competitionId);
    setConfig(competition?.publicConfig);
  }, [competitionId, getCompetitionById]);

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => prev ? ({ ...prev, [name]: type === 'checkbox' ? checked : value }) : undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setConfig(prev => prev ? ({ ...prev, logoUrl: previewUrl }) : undefined);
    }
  };

  const handleLiveMatchToggle = (matchId: string) => {
    setConfig(prev => {
        if (!prev) return undefined;
        const newIds = prev.featuredLiveMatchIds.includes(matchId)
            ? prev.featuredLiveMatchIds.filter(id => id !== matchId)
            : [...prev.featuredLiveMatchIds, matchId];
        return { ...prev, featuredLiveMatchIds: newIds };
    });
  };

  const handleSave = () => {
    if (config) {
      updateCompetitionPublicConfig(competitionId, config, logoFile);
      alert('Public site settings saved!');
    }
  };

  // Announcement Handlers
  const handleSaveAnnouncement = (data: { title: string, content: string, date: string }) => {
    const newAnnouncement: Announcement = { ...data, id: editingAnnouncement ? editingAnnouncement.id : `ann-${Date.now()}` };
    const updatedAnnouncements = editingAnnouncement
        ? config.announcements.map(a => a.id === newAnnouncement.id ? newAnnouncement : a)
        : [...config.announcements, newAnnouncement];
    setConfig(prev => prev ? ({ ...prev, announcements: updatedAnnouncements }) : undefined);
    setIsAnnouncementModalOpen(false);
    setEditingAnnouncement(null);
  };
  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm("Are you sure?")) {
        setConfig(prev => prev ? ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) }) : undefined);
    }
  };

  // Committee Handlers
  const handleSaveCommitteeMember = (data: { name: string, role: string }) => {
    const newMember: CommitteeMember = { ...data, id: editingCommitteeMember ? editingCommitteeMember.id : `cm-${Date.now()}` };
    const updatedCommittee = editingCommitteeMember
        ? config.committee.map(m => m.id === newMember.id ? newMember : m)
        : [...config.committee, newMember];
    setConfig(prev => prev ? ({ ...prev, committee: updatedCommittee }) : undefined);
    setIsCommitteeModalOpen(false);
    setEditingCommitteeMember(null);
  };
  const handleDeleteCommitteeMember = (id: string) => {
    if (window.confirm("Are you sure?")) {
        setConfig(prev => prev ? ({ ...prev, committee: prev.committee.filter(m => m.id !== id) }) : undefined);
    }
  };


  const publicUrl = `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}`;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Publish
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Web Builder: {getCompetitionById(competitionId)?.name}</h1>
        </div>
        <div className="flex space-x-2">
            <Button onClick={() => window.open(publicUrl, '_blank')} variant="outline">View Public Site</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold border-b pb-3">Basic Settings</h2>
                <div><label className="block text-sm font-medium">Site Title</label><input type="text" name="title" value={config.title} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2"/></div>
                <div>
                    <label className="block text-sm font-medium">Logo</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <img src={config.logoUrl} alt="Logo Preview" className="h-12 w-12 rounded-full object-cover bg-gray-100" />
                        <input type="file" onChange={handleFileChange} accept="image/*" className="text-sm" />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold border-b pb-3">Featured Live Streams</h2>
                <div className="flex items-center">
                    <input type="checkbox" id="showLiveStream" name="showLiveStream" checked={config.showLiveStream} onChange={handleInputChange} className="h-4 w-4 rounded" />
                    <label htmlFor="showLiveStream" className="ml-2">Show featured live stream on homepage</label>
                </div>
                {competitionMatches.length > 0 ? (
                    <div className="space-y-2 pt-2">
                        {competitionMatches.map(match => (
                            <label key={match.id} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                                <input type="checkbox" checked={config.featuredLiveMatchIds.includes(match.id)} onChange={() => handleLiveMatchToggle(match.id)} className="h-4 w-4 rounded"/>
                                <span className="ml-3 text-sm">{match.homeTeam.name} vs {match.awayTeam.name}</span>
                            </label>
                        ))}
                    </div>
                ) : <p className="text-sm text-gray-500 pt-2">No matches with stream URLs available in this competition.</p>}
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold">Announcements</h2>
                    <Button onClick={() => { setEditingAnnouncement(null); setIsAnnouncementModalOpen(true); }}><PlusIcon className="h-4 w-4 mr-2" />Add</Button>
                </div>
                 {config.announcements.map(ann => (
                    <div key={ann.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                        <p className="text-sm">{ann.title}</p>
                        <div>
                            <Button variant="outline" className="text-xs" onClick={() => { setEditingAnnouncement(ann); setIsAnnouncementModalOpen(true); }}>Edit</Button>
                            <Button variant="danger" className="text-xs ml-2" onClick={() => handleDeleteAnnouncement(ann.id)}>Delete</Button>
                        </div>
                    </div>
                 ))}
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold">Organizing Committee</h2>
                    <Button onClick={() => { setEditingCommitteeMember(null); setIsCommitteeModalOpen(true); }}><PlusIcon className="h-4 w-4 mr-2" />Add</Button>
                </div>
                 {config.committee.map(mem => (
                    <div key={mem.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                        <p className="text-sm font-medium">{mem.name} <span className="text-gray-500 font-normal">- {mem.role}</span></p>
                         <div>
                            <Button variant="outline" className="text-xs" onClick={() => { setEditingCommitteeMember(mem); setIsCommitteeModalOpen(true); }}>Edit</Button>
                            <Button variant="danger" className="text-xs ml-2" onClick={() => handleDeleteCommitteeMember(mem.id)}>Delete</Button>
                        </div>
                    </div>
                 ))}
            </div>
        </div>
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold border-b pb-3">Appearance</h2>
                <div className="flex justify-between items-center"><label className="text-sm font-medium">Primary Color</label><input type="color" name="primaryColor" value={config.primaryColor} onChange={handleInputChange} className="h-8 w-14 border-none rounded"/></div>
                <div className="flex justify-between items-center"><label className="text-sm font-medium">Background Color</label><input type="color" name="backgroundColor" value={config.backgroundColor} onChange={handleInputChange} className="h-8 w-14 border-none rounded"/></div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
                <h2 className="text-xl font-semibold border-b pb-3">Visible Sections</h2>
                <label className="flex items-center"><input type="checkbox" name="showRankings" checked={config.showRankings} onChange={handleInputChange} className="h-4 w-4 rounded"/> <span className="ml-2">Rankings / Standings</span></label>
                <label className="flex items-center"><input type="checkbox" name="showSchedule" checked={config.showSchedule} onChange={handleInputChange} className="h-4 w-4 rounded"/> <span className="ml-2">Match Schedule</span></label>
                <label className="flex items-center"><input type="checkbox" name="showPlayerStats" checked={config.showPlayerStats} onChange={handleInputChange} className="h-4 w-4 rounded"/> <span className="ml-2">Player Statistics</span></label>
                <label className="flex items-center"><input type="checkbox" name="showArticles" checked={config.showArticles} onChange={handleInputChange} className="h-4 w-4 rounded"/> <span className="ml-2">News / Articles</span></label>
                <label className="flex items-center"><input type="checkbox" name="showGalleries" checked={config.showGalleries} onChange={handleInputChange} className="h-4 w-4 rounded"/> <span className="ml-2">Photo Galleries</span></label>
                <label className="flex items-center"><input type="checkbox" name="showSponsors" checked={config.showSponsors} onChange={handleInputChange} className="h-4 w-4 rounded"/> <span className="ml-2">Sponsors</span></label>
                <label className="flex items-center"><input type="checkbox" name="showRegulations" checked={config.showRegulations} onChange={handleInputChange} className="h-4 w-4 rounded"/> <span className="ml-2">Regulations</span></label>
            </div>
        </div>
      </div>
      <Modal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} title={editingAnnouncement ? 'Edit Announcement' : 'Add Announcement'}>
        <AnnouncementForm announcement={editingAnnouncement} onSave={handleSaveAnnouncement} onClose={() => setIsAnnouncementModalOpen(false)} />
      </Modal>
      <Modal isOpen={isCommitteeModalOpen} onClose={() => setIsCommitteeModalOpen(false)} title={editingCommitteeMember ? 'Edit Member' : 'Add Committee Member'}>
        <CommitteeMemberForm member={editingCommitteeMember} onSave={handleSaveCommitteeMember} onClose={() => setIsCommitteeModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default WebBuilder;
