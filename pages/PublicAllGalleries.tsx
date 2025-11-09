import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';

const PublicAllGalleries: React.FC = () => {
    const { portalConfig, galleries, mediaImages, competitions } = useCompetitions();
    
    const publicCompetitions = competitions.filter(c => c.isPublic);
    const publicCompetitionIds = publicCompetitions.map(c => c.id);
    const allPublicGalleries = galleries.filter(g => publicCompetitionIds.includes(g.competitionId));

    const getFirstImage = (imageIds: string[]) => {
        if (imageIds.length === 0) return 'https://picsum.photos/seed/placeholder/600/400';
        const image = mediaImages.find(img => img.id === imageIds[0]);
        return image ? image.url : 'https://picsum.photos/seed/placeholder/600/400';
    };

    const publicUrl = (galleryId: string, competitionId: string) => `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}&galleryId=${galleryId}`;

    const mainNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal_page=news' },
        { name: 'Matches', href: '/?portal_page=matches' },
        { name: 'Stats', href: '/?portal_page=stats' },
        { name: 'Galleries', href: '/?portal_page=galleries' },
        { name: 'Live', href: '/?portal_page=live' },
        { name: 'National Team', href: '/?national_team=true' },
    ];

    return (
        <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={portalConfig.logoUrl}
                title={portalConfig.title}
                primaryColor={portalConfig.primaryColor}
                navItems={mainNavItems}
                activePage="Galleries"
            />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">All Photo Galleries</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allPublicGalleries.map(gallery => (
                        <a href={publicUrl(gallery.id, gallery.competitionId)} key={gallery.id} className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                            <img src={getFirstImage(gallery.imageIds)} alt={gallery.title} className="h-48 w-full object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900">{gallery.title}</h3>
                                <p className="text-sm text-gray-500 mt-2">{gallery.imageIds.length} photos</p>
                            </div>
                        </a>
                    ))}
                </div>
                 {allPublicGalleries.length === 0 && <p className="text-center text-gray-500 py-16">No photo galleries have been published yet.</p>}
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

export default PublicAllGalleries;