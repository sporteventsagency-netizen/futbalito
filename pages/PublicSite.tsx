
import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
// Re-usable public components
import PublicHeader from '../components/public/PublicHeader.tsx';
// Page-specific components
import PublicRankings from '../components/public/PublicRankings.tsx';
import PublicSchedule from '../components/public/PublicSchedule.tsx';
import PublicArticlesList from '../components/public/PublicArticlesList.tsx';
import PublicGalleriesList from '../components/public/PublicGalleriesList.tsx';
import PublicSponsors from '../components/public/PublicSponsors.tsx';
import PublicPlayerStats from '../components/public/PublicPlayerStats.tsx';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import PublicSanctions from '../components/public/PublicSanctions.tsx';
import PublicRegulations from '../components/public/PublicRegulations.tsx';
import PublicAnnouncements from '../components/public/PublicAnnouncements.tsx';

interface PublicSiteProps {
  competitionId: string;
}

const PublicSite: React.FC<PublicSiteProps> = ({ competitionId }) => {
  const { getCompetitionById } = useCompetitions();
  const competition = getCompetitionById(competitionId);

  if (!competition || !competition.publicConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700">Competition Not Found</h1>
          <p className="text-gray-500 mt-2">The requested competition is not available for public view.</p>
        </div>
      </div>
    );
  }

  const { publicConfig } = competition;
  // Navigation items specific to this competition's site
  const navItems = [
    { name: 'News', href: '#news', show: publicConfig.showArticles },
    { name: 'Rankings', href: '#rankings', show: publicConfig.showRankings && (competition.format === 'league' || competition.format === 'mixed') },
    { name: 'Schedule', href: '#schedule', show: publicConfig.showSchedule },
    { name: 'Stats', href: '#stats', show: publicConfig.showPlayerStats },
    { name: 'Galleries', href: '#galleries', show: publicConfig.showGalleries },
    { name: 'Regulations', href: '#regulations', show: publicConfig.showRegulations },
  ].filter(item => item.show);

  return (
    <div style={{ backgroundColor: publicConfig.backgroundColor }} className="min-h-screen font-sans">
      <PublicHeader 
        logoUrl={publicConfig.logoUrl}
        title={publicConfig.title}
        primaryColor={publicConfig.primaryColor}
        navItems={navItems}
      />
      <main>
        <div className="container mx-auto py-12 px-6 space-y-20">
            <PublicAnnouncements competitionId={competitionId} />
            {publicConfig.showArticles && <div id="news"><PublicArticlesList competitionId={competitionId} /></div>}
            {publicConfig.showGalleries && <div id="galleries"><PublicGalleriesList competitionId={competitionId} /></div>}
            {publicConfig.showRankings && (competition.format === 'league' || competition.format === 'mixed') && <div id="rankings"><PublicRankings competitionId={competitionId} /></div>}
            {publicConfig.showSchedule && <div id="schedule"><PublicSchedule competitionId={competitionId} /></div>}
            {publicConfig.showPlayerStats && <div id="stats"><PublicPlayerStats competitionId={competitionId} /></div>}
            <PublicSanctions competitionId={competitionId} />
            {publicConfig.showRegulations && <div id="regulations"><PublicRegulations competitionId={competitionId} /></div>}
            {publicConfig.showSponsors && <div id="sponsors"><PublicSponsors competitionId={competitionId} /></div>}
        </div>
      </main>
       <footer className="py-8 mt-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)'}}>
        <div className="container mx-auto text-center text-gray-500 flex flex-col items-center justify-center space-y-6">
            {publicConfig.showSponsors && <PublicSponsors competitionId={competitionId} isFooter />}
            <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400"/>
                Powered by Futbalito
            </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicSite;
