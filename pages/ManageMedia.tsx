
import React, { useState } from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
import usePermissions from '../hooks/usePermissions.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
import Tabs from '../components/ui/Tabs.tsx';
import { ChevronLeftIcon, PlusIcon, XMarkIcon } from '../components/icons/Icons.tsx';

interface ManageMediaProps {
  competitionId: string;
  onBack: () => void;
  onCreateGallery: (competitionId: string) => void;
  onEditGallery: (galleryId: string) => void;
}

const ManageMedia: React.FC<ManageMediaProps> = ({ competitionId, onBack, onCreateGallery, onEditGallery }) => {
  const { getCompetitionById, mediaImages, galleries, uploadImage, deleteImage, deleteGallery } = useCompetitions();
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState('Media Library');
  const competition = getCompetitionById(competitionId);
  
  const competitionImages = mediaImages.filter(img => img.competitionId === competitionId);
  const competitionGalleries = galleries.filter(g => g.competitionId === competitionId);
  const canManageMedia = hasPermission('publish:manage_media');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // FIX: Replaced `Array.from().forEach()` with a `for...of` loop. This avoids potential
      // type inference issues with `FileList` in some TypeScript configurations, ensuring
      // that `file` is correctly typed as `File` before being passed to `uploadImage`.
      for (const file of files) {
        uploadImage(competitionId, file);
      }
    }
  };
  
  const handleDeleteImage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this image? It will be removed from all galleries.')) {
        deleteImage(id);
    }
  };
  
  const handleDeleteGallery = (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery?')) {
        deleteGallery(id);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
          <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Publish
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Manage Media: {competition?.name}</h1>
        <p className="mt-2 text-gray-600">Upload images and create photo galleries for your competition.</p>
      </div>
      
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={['Media Library', 'Galleries']} />

      <div className="mt-6">
        {activeTab === 'Media Library' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold">Media Library ({competitionImages.length})</h2>
              {canManageMedia && (
                <label htmlFor="image-upload" className="cursor-pointer">
                    <Button as="span"><PlusIcon className="h-5 w-5 mr-2" />Upload Images</Button>
                    <input id="image-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileUpload} />
                </label>
              )}
            </div>
            {competitionImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {competitionImages.map(image => (
                        <div key={image.id} className="relative group aspect-w-1 aspect-h-1">
                            <img src={image.url} alt="media" className="w-full h-full object-cover rounded-md" />
                            {canManageMedia && (
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                    <button onClick={() => handleDeleteImage(image.id)} className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-12">Your media library is empty. Upload some images to get started.</p>
            )}
          </div>
        )}
        
        {activeTab === 'Galleries' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold">Photo Galleries ({competitionGalleries.length})</h2>
                    {canManageMedia && <Button onClick={() => onCreateGallery(competitionId)}><PlusIcon className="h-5 w-5 mr-2" />Create Gallery</Button>}
                </div>
                {competitionGalleries.length > 0 ? (
                    <div className="space-y-3">
                        {competitionGalleries.map(gallery => (
                            <div key={gallery.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-semibold">{gallery.title}</p>
                                    <p className="text-sm text-gray-500">{gallery.imageIds.length} photos</p>
                                </div>
                                {canManageMedia && (
                                    <div className="space-x-3">
                                        <button onClick={() => onEditGallery(gallery.id)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                        <button onClick={() => handleDeleteGallery(gallery.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-12">No galleries created yet.</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ManageMedia;
