import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';

const PublicNationalTeam: React.FC = () => {
    const { portalConfig, nationalTeam, nationalSquad, players, matches } = useCompetitions();

    // Full player objects for those in the squad
    const squadPlayers = nationalSquad.map(squadPlayer => {
        const playerDetails = players.find(p => p.id === squadPlayer.playerId);
        return { ...squadPlayer, ...playerDetails };
    });

    const internationalMatches = matches.filter(m => m.isInternational);
    
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
                activePage="National Team"
            />
            <main className="container mx-auto py-12 px-6">
                <div className="flex items-center space-x-4 mb-12">
                    <img src={nationalTeam.logoUrl} alt={nationalTeam.name} className="h-20 w-20" />
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800">{nationalTeam.name}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Squad List */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Current Squad</h2>
                        <ul className="divide-y divide-gray-200">
                            {squadPlayers.map(player => (
                                <li key={player.playerId} className="py-3">
                                    <a href={`/?playerId=${player.playerId}`} className="font-semibold text-gray-800 hover:underline">{player.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Matches */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                         <h2 className="text-2xl font-bold mb-4">Matches</h2>
                         <ul className="divide-y divide-gray-200">
                            {internationalMatches.map(match => (
                                <li key={match.id} className="p-4 grid grid-cols-3 items-center gap-4">
                                    <div className="flex items-center justify-end text-right">
                                        <span className="font-semibold text-gray-800 hidden sm:inline">{match.homeTeam.name}</span>
                                        <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="h-10 w-10 ml-3 object-contain"/>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500">{new Date(match.date).toLocaleDateString()}</div>
                                        <div className="text-xl font-bold">vs</div>
                                    </div>
                                    <div className="flex items-center justify-start">
                                        <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="h-10 w-10 mr-3 object-contain"/>
                                        <span className="font-semibold text-gray-800 hidden sm:inline">{match.awayTeam.name}</span>
                                    </div>
                                </li>
                            ))}
                         </ul>
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

export default PublicNationalTeam;