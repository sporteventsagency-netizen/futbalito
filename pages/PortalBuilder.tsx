
import React, { useState, useEffect } from 'react';
import type { PortalConfig } from '../types.ts';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import Button from '../components/ui/Button.tsx';
import { ChevronLeftIcon } from '../components/icons/Icons.tsx';

interface PortalBuilderProps {
  onBack: () => void;
}

const PortalBuilder: React.FC<PortalBuilderProps> = ({ onBack }) => {
  const { portalConfig, updatePortalConfig } = useCompetitions();
  
  const [config, setConfig] = useState<PortalConfig>(portalConfig);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    setConfig(portalConfig);
  }, [portalConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setConfig(prev => ({ ...prev, logoUrl: previewUrl }));
    }
  };

  const handleSave = () => {
    updatePortalConfig(config, logoFile);
    alert('Portal settings saved!');
  };

  const publicUrl = `${window.location.origin}${window.location.pathname}?portal=true`;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Publish
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Main Portal Builder</h1>
        </div>
        <div className="flex space-x-2">
            <Button onClick={() => window.open(publicUrl, '_blank')} variant="outline">View Public Portal</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-xl font-semibold border-b pb-3">Portal Settings</h2>
          <div><label className="block text-sm font-medium">Portal Title</label><input type="text" name="title" value={config.title} onChange={handleInputChange} className="mt-1 block w-full border rounded-md p-2"/></div>
          <div>
            <label className="block text-sm font-medium">Logo</label>
            <div className="mt-1 flex items-center space-x-4">
                <img src={config.logoUrl} alt="Logo Preview" className="h-12 w-12 rounded-full object-cover bg-gray-100" />
                <input type="file" onChange={handleFileChange} accept="image/*" className="text-sm" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold border-b pb-3 pt-4">Appearance</h2>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Primary Color</label>
            <input type="color" name="primaryColor" value={config.primaryColor} onChange={handleInputChange} className="h-8 w-14 border-none rounded"/>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Background Color</label>
            <input type="color" name="backgroundColor" value={config.backgroundColor} onChange={handleInputChange} className="h-8 w-14 border-none rounded"/>
          </div>
        </div>
    </div>
  );
};

export default PortalBuilder;
