
import React, { useState, useEffect } from 'react';
import type { Sponsor } from '../types.ts';
import Button from './ui/Button.tsx';

interface SponsorFormProps {
  sponsor?: Sponsor | null;
  onSave: (data: { name: string; websiteUrl: string; logoFile?: File | null; }) => void;
  onClose: () => void;
}

const SponsorForm: React.FC<SponsorFormProps> = ({ sponsor, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sponsor) {
      setName(sponsor.name);
      setWebsiteUrl(sponsor.websiteUrl);
      setPreviewUrl(sponsor.logoUrl);
    } else {
      setName('');
      setWebsiteUrl('');
      setPreviewUrl(null);
    }
    setLogoFile(null);
    setError('');
  }, [sponsor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !websiteUrl.trim()) {
      setError('Name and website URL are required.');
      return;
    }
    onSave({ name, websiteUrl, logoFile });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="mt-1 flex items-center space-x-4">
            <span className="inline-block h-12 w-24 bg-gray-100 flex items-center justify-center">
              {previewUrl ? <img src={previewUrl} alt="Logo" className="h-full w-full object-contain" /> : <span className="text-xs text-gray-400">No Logo</span>}
            </span>
            <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span>{sponsor ? 'Change' : 'Upload'}</span>
              <input id="logo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
        </div>
        <div><label htmlFor="name" className="block text-sm font-medium">Sponsor Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        <div><label htmlFor="websiteUrl" className="block text-sm font-medium">Website URL</label><input type="url" id="websiteUrl" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="mt-1 block w-full border rounded-md p-2" /></div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save Sponsor</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default SponsorForm;
