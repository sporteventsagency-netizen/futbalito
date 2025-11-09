import React, { useState, useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
import type { Match } from '../types.ts';

const PublicAllMatches: React.FC = () => {
    const { portalConfig, matches, competitions, teams } = useCompetitions();
    const [competitionFilter, setCompetitionFilter] = useState<string>('all');
    const [teamFilter, setTeamFilter] = useState<string>('all');

    const publicCompetitions = competitions.filter(c => c.isPublic);
    const publicCompetitionIds = publicCompetitions.map(c => c.id);

    const filteredMatches = useMemo(() => {
        return matches
            .filter(m => publicCompetitionIds.includes(m.competitionId))
            .filter(m => competitionFilter === 'all' || m.competitionId === competitionFilter)
            .filter(m => teamFilter === 'all' || m.homeTeam.id === teamFilter || m.awayTeam.id === teamFilter)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [matches, publicCompetitionIds, competitionFilter, teamFilter]);

    const mainNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal_page=news' },
        { name: 'Matches', href: '/?portal_page=matches' },
        { name: 'Stats', href: '/?portal_page=stats' },
        { name: 'Galleries', href: '/?portal_page=galleries' },
        { name: 'Live', href: '/?portal_page=live' },
        { name: 'National Team', href: '/?national_team=true' },
    ];
    
    const getStatusChip = (status: string) => {
        switch (status) {
            case 'In Progress': return 'bg-blue-100 text-blue-800 ring-blue-600/20';
            case 'Finished': return 'bg-gray-100 text-gray-800 ring-gray-600/20';
            default: return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
        }
    };

    return (
        <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={portalConfig.logoUrl}
                title={portalConfig.title}
                primaryColor={portalConfig.primaryColor}
                navItems={mainNavItems}
                activePage="Matches"
            />
            <main className="container mx-auto py-12 px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl font-extrabold text-gray-800">All Matches</h1>
                    <div className="flex gap-4">
                        <select value={competitionFilter} onChange={e => setCompetitionFilter(e.target.value)} className="border-gray-300 rounded-md shadow-sm">
                            <option value="all">All Competitions</option>
                            {publicCompetitions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} className="border-gray-300 rounded-md shadow-sm">
                            <option value="all">All Teams</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {filteredMatches.map(match => (
                        <li key={match.id} className="p-4 grid grid-cols-3 items-center gap-4">
                            <a href={`/?teamId=${match.homeTeam.id}`} className="flex items-center justify-end text-right group">
                                <span className="font-semibold text-gray-800 hidden sm:inline group-hover:underline">{match.homeTeam.name}</span>
                                <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="h-10 w-10 rounded-full ml-3 object-cover"/>
                            </a>
                            <div className="text-center">
                                {match.status === 'Finished' ? (
                                   <div className="text-2xl font-bold text-gray-900">{match.homeScore} - {match.awayScore}</div>
                                ) : (
                                   <div className="text-sm text-gray-500">{new Date(match.date).toLocaleDateString()}</div>
                                )}
                                 <span className={`mt-1 inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ring-1 ring-inset ${getStatusChip(match.status)}`}>
                                    {match.status}
                                </span>
                            </div>
                            <a href={`/?teamId=${match.awayTeam.id}`} className="flex items-center justify-start group">
                                <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="h-10 w-10 rounded-full mr-3 object-cover"/>
                                <span className="font-semibold text-gray-800 hidden sm:inline group-hover:underline">{match.awayTeam.name}</span>
                            </a>
                        </li>
                      ))}
                    </ul>
                    {filteredMatches.length === 0 && <p className="text-center text-gray-500 py-16">No matches found for the selected filters.</p>}
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

export default PublicAllMatches;