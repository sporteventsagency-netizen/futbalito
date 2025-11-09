import React, { useState, useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';
import type { Player } from '../types.ts';

type SortKey = 'goals' | 'assists' | 'name';

const PublicGlobalStats: React.FC = () => {
    const { portalConfig, players, teams } = useCompetitions();
    const [sortKey, setSortKey] = useState<SortKey>('goals');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const sortedPlayers = useMemo(() => {
        return [...players].sort((a, b) => {
            if (sortKey === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            const aStat = a.stats[sortKey] || 0;
            const bStat = b.stats[sortKey] || 0;
            return sortOrder === 'asc' ? aStat - bStat : bStat - aStat;
        });
    }, [players, sortKey, sortOrder]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    const getSortIndicator = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortOrder === 'desc' ? ' ▼' : ' ▲';
    };

    const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

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
                activePage="Stats"
            />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">Global Player Statistics</h1>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase cursor-pointer" onClick={() => handleSort('name')}>Player {getSortIndicator('name')}</th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase cursor-pointer" onClick={() => handleSort('goals')}>Goals {getSortIndicator('goals')}</th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase cursor-pointer" onClick={() => handleSort('assists')}>Assists {getSortIndicator('assists')}</th>
                                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase">Y/R Cards</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedPlayers.map((player, index) => {
                                    const team = getTeam(player.teamId);
                                    return (
                                        <tr key={player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-3 font-medium flex items-center text-gray-900">
                                                {team && <a href={`/?teamId=${team.id}`}><img src={team.logoUrl} className="h-8 w-8 rounded-full mr-3 object-cover" alt={team.name}/></a>}
                                                <div>
                                                    <a href={`/?playerId=${player.id}`} className="hover:underline">{player.name}</a>
                                                    {team && <a href={`/?teamId=${team.id}`} className="block text-xs text-gray-500 hover:underline">{team.name}</a>}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-center font-bold text-gray-800">{player.stats.goals}</td>
                                            <td className="px-3 py-3 text-center text-gray-700">{player.stats.assists}</td>
                                            <td className="px-3 py-3 text-center text-gray-700">
                                                <span className="font-semibold text-yellow-600">{player.stats.yellowCards}</span> / <span className="font-semibold text-red-600">{player.stats.redCards}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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

export default PublicGlobalStats;