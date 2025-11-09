
import React, { useState, useEffect } from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
import { ChevronLeftIcon } from '../components/icons/Icons.tsx';
// FIX: Added .ts extension to module import.
import type { Gallery } from '../types.ts';

interface EditGalleryProps {
  competitionId: string;
  galleryId: string | null;
  onBack: () => void;
}

const EditGallery: React.FC<EditGalleryProps> = ({ competitionId, galleryId, onBack }) => {
  const { getGalleryById, mediaImages, addGallery, updateGallery } = useCompetitions();
  
  const [title, setTitle] = useState('');
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<Gallery | null>(null);

  const competitionImages = mediaImages.filter(img => img.competitionId === competitionId);

  useEffect(() => {
    if (galleryId) {
      const gallery = getGalleryById(galleryId);
      if (gallery) {
        setExistingGallery(gallery);
        setTitle(gallery.title);
        setSelectedImageIds(gallery.imageIds);
      }
    }
  }, [galleryId, getGalleryById]);

  const handleImageToggle = (imageId: string) => {
    setSelectedImageIds(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Gallery title is required.');
      return;
    }
    
    if (existingGallery) {
      updateGallery({ ...existingGallery, title, imageIds: selectedImageIds });
    } else {
      addGallery({ competitionId, title, imageIds: selectedImageIds });
    }
    onBack();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Media
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{galleryId ? 'Edit Gallery' : 'Create New Gallery'}</h1>
        </div>
        <Button onClick={handleSave}>Save Gallery</Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Gallery Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
            <h3 className="block text-sm font-medium text-gray-700 mb-2">Select Images ({selectedImageIds.length} selected)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-md">
                {competitionImages.map(image => (
                    <div 
                        key={image.id} 
                        onClick={() => handleImageToggle(image.id)}
                        className={`relative aspect-w-1 aspect-h-1 cursor-pointer group rounded-md overflow-hidden ${selectedImageIds.includes(image.id) ? 'ring-4 ring-blue-500' : ''}`}
                    >
                        <img src={image.url} alt="media" className="w-full h-full object-cover"/>
                        <div 
                            className={`absolute inset-0 transition-all ${selectedImageIds.includes(image.id) ? 'bg-black bg-opacity-40' : 'bg-black bg-opacity-0 group-hover:bg-opacity-20'}`}
                        >
                          {selectedImageIds.includes(image.id) && (
                            <div className="absolute top-2 right-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                          )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditGallery;
