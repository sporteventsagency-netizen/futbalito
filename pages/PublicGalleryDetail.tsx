
import React from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { ShieldCheckIcon, ChevronLeftIcon } from '../components/icons/Icons.tsx';
// Import new shared components
import PublicHeader from '../components/public/PublicHeader.tsx';

interface PublicGalleryDetailProps {
  competitionId: string;
  galleryId: string;
}

const PublicGalleryDetail: React.FC<PublicGalleryDetailProps> = ({ competitionId, galleryId }) => {
  const { getCompetitionById, getGalleryById, mediaImages } = useCompetitions();
  const competition = getCompetitionById(competitionId);
  const gallery = getGalleryById(galleryId);

  if (!competition || !gallery || !competition.publicConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700">Gallery Not Found</h1>
          <p className="text-gray-500 mt-2">The requested photo gallery is not available.</p>
        </div>
      </div>
    );
  }

  const galleryImages = mediaImages.filter(img => gallery.imageIds.includes(img.id));
  const { publicConfig } = competition;
  const backUrl = `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}`;

  return (
    <div style={{ backgroundColor: publicConfig.backgroundColor }} className="min-h-screen font-sans">
      <PublicHeader 
        logoUrl={publicConfig.logoUrl}
        title={publicConfig.title}
        primaryColor={publicConfig.primaryColor}
      />
      <main className="container mx-auto py-12 px-6">
        <a href={backUrl} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-8">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Site
        </a>
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">{gallery.title}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map(image => (
                    <div key={image.id} className="aspect-w-1 aspect-h-1">
                        <img src={image.url} alt="Gallery image" className="w-full h-full object-cover rounded-lg shadow-md" />
                    </div>
                ))}
            </div>
        </div>
      </main>
      <footer className="py-8 mt-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)'}}>
        <div className="container mx-auto text-center text-gray-500 flex items-center justify-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400"/>
            Powered by Futbalito
        </div>
      </footer>
    </div>
  );
};

export default PublicGalleryDetail;
