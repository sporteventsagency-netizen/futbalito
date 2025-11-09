import React, { useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon, VideoCameraIcon } from '../components/icons/Icons.tsx';

const PublicAllLive: React.FC = () => {
    const { portalConfig, matches, competitions } = useCompetitions();

    const publicCompetitions = competitions.filter(c => c.isPublic);
    const publicCompetitionIds = publicCompetitions.map(c => c.id);

    const liveMatches = useMemo(() => {
        return matches
            .filter(m => publicCompetitionIds.includes(m.competitionId) && m.status === 'In Progress')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [matches, publicCompetitionIds]);

    const mainNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal_page=news' },
        { name: 'Matches', href: '/?portal_page=matches' },
        { name: 'Stats', href: '/?portal_page=stats' },
        { name: 'Galleries', href: '/?portal_page=galleries' },
        { name: 'Live', href: '/?portal_page=live' },
        { name: 'National Team', href: '/?national_team=true' },
    ];
    
    const liveMatchUrl = (matchId: string) => `/?liveMatchId=${matchId}`;

    return (
        <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={portalConfig.logoUrl}
                title={portalConfig.title}
                primaryColor={portalConfig.primaryColor}
                navItems={mainNavItems}
                activePage="Live"
            />
            <main className="container mx-auto py-12 px-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">Live Center</h1>
                    <p className="mt-2 text-gray-600">All matches currently in progress.</p>
                </div>
                
                {liveMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {liveMatches.map(match => (
                            <a href={liveMatchUrl(match.id)} key={match.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-center text-center mb-4">
                                        <div className="w-2/5 flex flex-col items-center">
                                            <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="h-12 w-12" />
                                            <span className="font-bold mt-2">{match.homeTeam.name}</span>
                                        </div>
                                        <div className="w-1/5 text-2xl font-bold">{match.homeScore} - {match.awayScore}</div>
                                        <div className="w-2/5 flex flex-col items-center">
                                            <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="h-12 w-12" />
                                            <span className="font-bold mt-2">{match.awayTeam.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center mt-4 pt-4 border-t">
                                        <VideoCameraIcon className="h-5 w-5 mr-2 text-red-500 animate-pulse" />
                                        <span className="font-semibold text-red-600">Watch Live</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">There are no matches currently in progress.</p>
                    </div>
                )}
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

export default PublicAllLive;