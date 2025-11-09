import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { ShieldCheckIcon, ChevronLeftIcon, TvIcon } from '../components/icons/Icons.tsx';
import PublicLiveStream from '../components/public/PublicLiveStream.tsx';
import type { Match } from '../types.ts';
// Import new shared components
import PublicHeader from '../components/public/PublicHeader.tsx';

interface PublicAllLiveStreamsProps {
  competitionId: string;
}

const PublicAllLiveStreams: React.FC<PublicAllLiveStreamsProps> = ({ competitionId }) => {
  const { getCompetitionById, matches } = useCompetitions();
  const competition = getCompetitionById(competitionId);

  if (!competition || !competition.publicConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700">Page Not Found</h1>
          <p className="text-gray-500 mt-2">The requested page is not available.</p>
        </div>
      </div>
    );
  }
  
  const featuredLiveMatchIds = competition.publicConfig.featuredLiveMatchIds || [];
  const featuredMatches = featuredLiveMatchIds.map(id => matches.find(m => m.id === id)).filter((m): m is Match => !!m);

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
            <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12 flex items-center justify-center">
                <TvIcon className="h-10 w-10 mr-4"/>
                All Live Streams
            </h1>
            {featuredMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredMatches.map(match => (
                        <PublicLiveStream key={match.id} match={match} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-20">There are no active live streams at the moment.</p>
            )}
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

export default PublicAllLiveStreams;