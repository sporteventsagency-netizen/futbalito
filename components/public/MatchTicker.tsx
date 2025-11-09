import React, { useState, useMemo } from 'react';
import type { Match, Competition } from '../../types.ts';
import { useCompetitions } from '../../context/CompetitionContext.tsx';

interface MatchItemProps {
  match: Match;
  competitions: Competition[];
}

const MatchItem: React.FC<MatchItemProps> = ({ match, competitions }) => {
    const competition = competitions.find(c => c.id === match.competitionId);
    return (
        <li className="p-4">
            <div className="flex items-center justify-between text-sm">
                <a href={`/?teamId=${match.homeTeam.id}`} className="flex items-center gap-2 hover:underline w-2/5 justify-end">
                    <span className="font-medium text-gray-800 truncate text-right">{match.homeTeam.name}</span>
                    <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="h-6 w-6 rounded-full" />
                </a>
                <div className="font-bold text-center w-1/5">
                    {match.status === 'Finished' ? `${match.homeScore} - ${match.awayScore}` : 'vs'}
                </div>
                <a href={`/?teamId=${match.awayTeam.id}`} className="flex items-center gap-2 hover:underline w-2/5 justify-start">
                    <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="h-6 w-6 rounded-full" />
                    <span className="font-medium text-gray-800 truncate text-left">{match.awayTeam.name}</span>
                </a>
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
                {competition?.name} - {new Date(match.date).toLocaleDateString()}
            </div>
        </li>
    );
};


const MatchTicker: React.FC = () => {
    const { matches, competitions } = useCompetitions();
    const [activeTab, setActiveTab] = useState<'results' | 'fixtures'>('results');

    const publicCompetitions = competitions.filter(c => c.isPublic);
    const publicCompetitionIds = publicCompetitions.map(c => c.id);

    const { results, fixtures } = useMemo(() => {
        const now = new Date();
        const publicMatches = matches.filter(m => publicCompetitionIds.includes(m.competitionId));

        const results = publicMatches
            .filter(m => m.status === 'Finished' && new Date(m.date) <= now)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
            
        const fixtures = publicMatches
            .filter(m => m.status === 'Not Started' && new Date(m.date) > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3);

        return { results, fixtures };
    }, [matches, publicCompetitionIds]);

    const activeMatches = activeTab === 'results' ? results : fixtures;

    return (
        <section className="mt-16">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
                <div className="flex border-b">
                    <button 
                        onClick={() => setActiveTab('results')}
                        className={`flex-1 p-3 font-semibold text-center ${activeTab === 'results' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        Recent Results
                    </button>
                    <button 
                        onClick={() => setActiveTab('fixtures')}
                        className={`flex-1 p-3 font-semibold text-center ${activeTab === 'fixtures' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        Upcoming Fixtures
                    </button>
                </div>
                <ul className="divide-y divide-gray-200">
                    {activeMatches.length > 0 ? (
                        activeMatches.map(match => <MatchItem key={match.id} match={match} competitions={publicCompetitions} />)
                    ) : (
                        <p className="text-center text-gray-500 py-8">No {activeTab} available.</p>
                    )}
                </ul>
            </div>
        </section>
    );
};

export default MatchTicker;