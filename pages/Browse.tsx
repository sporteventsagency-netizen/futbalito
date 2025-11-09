

import React from 'react';
import Card from '../components/ui/Card.tsx';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';

const Browse: React.FC = () => {
    const { teams, matches, competitions } = useCompetitions();

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Finished': return 'bg-gray-100 text-gray-800';
            case 'Not Started':
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Browse Data</h1>
            <p className="mt-2 text-gray-600">View all registered teams and match results across all competitions.</p>
            
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Teams</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {teams.map((team) => (
                                <tr key={team.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={team.logoUrl} alt={team.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{team.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.country}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Matches</h2>
                 <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competition</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                             {matches.map((match) => (
                                <tr key={match.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{competitions.find(c => c.id === match.competitionId)?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{match.homeTeam.name} vs {match.awayTeam.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">{match.homeScore} - {match.awayScore}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(match.status)}`}>
                                            {match.status}
                                        </span>
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Browse;
