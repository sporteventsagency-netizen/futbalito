import React, { useState, useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';

interface PublicTeamDetailProps {
    teamId: string;
}

const PublicTeamDetail: React.FC<PublicTeamDetailProps> = ({ teamId }) => {
    const { portalConfig, teams, players, competitions, matches, calculateStandings } = useCompetitions();
    const [activeTab, setActiveTab] = useState('Summary');

    const team = teams.find(t => t.id === teamId);
    
    // Find the primary competition this team belongs to (for standings)
    const primaryCompetition = competitions.find(c => c.teamIds.includes(teamId) && (c.format === 'league' || c.format === 'mixed'));
    
    const teamPlayers = players.filter(p => p.teamId === teamId);
    const teamMatches = matches.filter(m => (m.homeTeam.id === teamId || m.awayTeam.id === teamId) && !m.isInternational)
                             .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const standings = useMemo(() => {
        if (!primaryCompetition) return null;
        const allStandings = calculateStandings(primaryCompetition.id, 'Group Stage');
        return allStandings.find(s => s.teamId === teamId);
    }, [primaryCompetition, teamId, calculateStandings]);
    
    const mainNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal_page=news' },
        { name: 'Matches', href: '/?portal_page=matches' },
        { name: 'Stats', href: '/?portal_page=stats' },
        { name: 'Galleries', href: '/?portal_page=galleries' },
        { name: 'Live', href: '/?portal_page=live' },
        { name: 'National Team', href: '/?national_team=true' },
    ];

    if (!team) {
        return <div>Team not found.</div>;
    }

    const tabs = ['Summary', 'Squad', 'Matches'];

    return (
        <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={portalConfig.logoUrl}
                title={portalConfig.title}
                primaryColor={portalConfig.primaryColor}
                navItems={mainNavItems}
            />
            <main className="container mx-auto py-12 px-6">
                <div className="flex items-center space-x-4 mb-8">
                    <img src={team.logoUrl} alt={team.name} className="h-20 w-20 rounded-full" />
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800">{team.name}</h1>
                    </div>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-8">
                    {activeTab === 'Summary' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold mb-4">Club Details</h2>
                                <ul className="space-y-3 text-gray-700">
                                    {team.foundedYear && <li className="flex justify-between"><span>Founded:</span> <span className="font-semibold">{team.foundedYear}</span></li>}
                                    {team.address && <li className="flex justify-between"><span>Address:</span> <span className="font-semibold text-right">{team.address}</span></li>}
                                    {team.president && <li className="flex justify-between"><span>President:</span> <span className="font-semibold">{team.president}</span></li>}
                                    {team.coach && <li className="flex justify-between"><span>Coach:</span> <span className="font-semibold">{team.coach}</span></li>}
                                    {team.clubColors && (
                                        <li className="flex justify-between items-center">
                                            <span>Colors:</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: team.clubColors.primary }}></div>
                                                <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: team.clubColors.secondary }}></div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            {standings && primaryCompetition && (
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4">{primaryCompetition.name} Standings</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between p-3 bg-gray-100 rounded-md"><span>Points</span><span className="font-bold">{standings.points}</span></div>
                                        <div className="flex justify-between p-3"><span>Played</span><span>{standings.played}</span></div>
                                        <div className="flex justify-between p-3 bg-gray-50 rounded-md"><span>Wins</span><span>{standings.wins}</span></div>
                                        <div className="flex justify-between p-3"><span>Draws</span><span>{standings.draws}</span></div>
                                        <div className="flex justify-between p-3 bg-gray-50 rounded-md"><span>Losses</span><span>{standings.losses}</span></div>
                                    </div>
                                </div>
                            )}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold mb-4">Recent Matches</h2>
                                <ul className="divide-y divide-gray-200">
                                    {teamMatches.slice(0, 5).map(match => (
                                        <li key={match.id} className="py-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span>{match.homeTeam.name}</span>
                                                <span className="font-bold">{match.homeScore} - {match.awayScore}</span>
                                                <span>{match.awayTeam.name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Squad' && (
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Squad</h2>
                            <ul className="divide-y divide-gray-200">
                                {teamPlayers.map(player => (
                                    <li key={player.id} className="py-3">
                                        <a href={`/?playerId=${player.id}`} className="font-semibold text-gray-800 hover:underline">{player.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {activeTab === 'Matches' && (
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">All Matches</h2>
                            <ul className="divide-y divide-gray-200">
                                {teamMatches.map(match => (
                                    <li key={match.id} className="p-4 grid grid-cols-3 items-center gap-4">
                                        <div className="flex items-center justify-end text-right">
                                            <span className="font-semibold text-gray-800 hidden sm:inline">{match.homeTeam.name}</span>
                                            <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="h-8 w-8 rounded-full ml-3 object-cover"/>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold">{match.homeScore} - {match.awayScore}</div>
                                            <div className="text-xs text-gray-500">{new Date(match.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="h-8 w-8 rounded-full mr-3 object-cover"/>
                                            <span className="font-semibold text-gray-800 hidden sm:inline">{match.awayTeam.name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
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

export default PublicTeamDetail;