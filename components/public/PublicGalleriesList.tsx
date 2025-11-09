

import React from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../../context/CompetitionContext.tsx';

interface PublicGalleriesListProps {
  competitionId: string;
}

const PublicGalleriesList: React.FC<PublicGalleriesListProps> = ({ competitionId }) => {
  const { galleries, mediaImages } = useCompetitions();
  const publicGalleries = galleries.filter(g => g.competitionId === competitionId);

  if (publicGalleries.length === 0) {
    return null;
  }

  const getFirstImage = (imageIds: string[]) => {
    if (imageIds.length === 0) return 'https://picsum.photos/seed/placeholder/600/400';
    const image = mediaImages.find(img => img.id === imageIds[0]);
    return image ? image.url : 'https://picsum.photos/seed/placeholder/600/400';
  };

  const publicUrl = (galleryId: string) => `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}&galleryId=${galleryId}`;

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Photo Galleries</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publicGalleries.map(gallery => (
          <a href={publicUrl(gallery.id)} key={gallery.id} className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <img src={getFirstImage(gallery.imageIds)} alt={gallery.title} className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{gallery.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{gallery.imageIds.length} photos</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PublicGalleriesList;
