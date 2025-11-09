import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import HeroSection from '../components/public/HeroSection.tsx';
import CompetitionList from '../components/public/CompetitionList.tsx';
import MatchTicker from '../components/public/MatchTicker.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';

const PublicPortalSite: React.FC = () => {
  const { portalConfig, competitions, articles } = useCompetitions();
  const publicCompetitions = competitions.filter(c => c.isPublic);

  // Find the most recent article from any public competition to feature in the hero
  const heroArticle = [...articles]
    .filter(a => a.status === 'published' && publicCompetitions.some(c => c.id === a.competitionId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
    
  // Main navigation items for the portal
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
        activePage="Home"
      />
      <main className="container mx-auto py-12 px-6">
        <HeroSection heroArticle={heroArticle} />
        <MatchTicker />
        <CompetitionList competitions={publicCompetitions} />
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

export default PublicPortalSite;