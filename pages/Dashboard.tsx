

import React from 'react';
// FIX: Added .ts extension to module import.
import type { Page } from '../types.ts';
import Card from '../components/ui/Card.tsx';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
// FIX: Added .tsx extension to module import.
import { EyeIcon, WrenchScrewdriverIcon, PencilSquareIcon, ArrowRightIcon } from '../components/icons/Icons.tsx';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';

interface DashboardProps {
    setPage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setPage }) => {
    const { competitions, matches } = useCompetitions();
    const ongoingCompetitions = competitions.filter(c => c.status === 'Ongoing');
    
    const recentMatches = matches
        .filter(m => m.status === 'Finished')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, Super Admin!</h1>
            <p className="mt-2 text-gray-600">Here's a quick overview of your organization.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <EyeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="ml-4 text-xl font-semibold text-gray-800">Browse</h2>
                    </div>
                    <p className="mt-4 text-gray-600">Visualize and export data for teams, players, matches, and transfers.</p>
                    <Button onClick={() => setPage('BROWSE')} className="mt-6 w-full" variant="secondary">
                        Go to Browse <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <WrenchScrewdriverIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="ml-4 text-xl font-semibold text-gray-800">Manage</h2>
                    </div>
                    <p className="mt-4 text-gray-600">Administer seasons, competitions, teams, players, referees, and grounds.</p>
                    <Button onClick={() => setPage('MANAGE_COMPETITIONS')} className="mt-6 w-full">
                        Go to Manage <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <PencilSquareIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <h2 className="ml-4 text-xl font-semibold text-gray-800">Publish</h2>
                    </div>
                    <p className="mt-4 text-gray-600">Create news, web pages, manage media, documents, and sponsors.</p>
                    <Button onClick={() => setPage('PUBLISH')} className="mt-6 w-full" variant="outline">
                        Go to Publish <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                </Card>
            </div>
             <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Ongoing Competitions</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competition</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                               {ongoingCompetitions.length > 0 ? (
                                    ongoingCompetitions.map(comp => (
                                        <tr key={comp.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comp.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.season}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ongoing</span>
                                            </td>
                                        </tr>
                                    ))
                               ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No ongoing competitions.</td>
                                    </tr>
                               )}
                            </tbody>
                        </table>
                    </div>
                </div>
                 <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Matches</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                       <ul className="divide-y divide-gray-200">
                           {recentMatches.length > 0 ? recentMatches.map(match => (
                                <li key={match.id} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-600">{match.homeTeam.name}</div>
                                        <div className="text-lg font-bold">{match.homeScore} - {match.awayScore}</div>
                                        <div className="text-sm font-medium text-gray-600 text-right">{match.awayTeam.name}</div>
                                    </div>
                                    <div className="text-xs text-center text-gray-400 mt-1">
                                       {competitions.find(c => c.id === match.competitionId)?.name}
                                    </div>
                                </li>
                           )) : (
                                <p className="text-center text-gray-500 py-8">No finished matches yet.</p>
                           )}
                       </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
