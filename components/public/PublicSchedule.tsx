

import React, { useMemo } from 'react';
// FIX: Added .ts extension to module import.
import type { Match } from '../../types.ts';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../../context/CompetitionContext.tsx';

interface PublicScheduleProps {
  competitionId: string;
}

const PublicSchedule: React.FC<PublicScheduleProps> = ({ competitionId }) => {
  const { matches } = useCompetitions();

  const competitionMatches = useMemo(() => {
    return matches
      .filter(m => m.competitionId === competitionId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [matches, competitionId]);

  const groupedMatches = useMemo(() => {
    return competitionMatches.reduce<Record<string, Match[]>>((acc, match) => {
      const stage = match.stage || 'Uncategorized';
      if (!acc[stage]) acc[stage] = [];
      acc[stage].push(match);
      return acc;
    }, {});
  }, [competitionMatches]);
  
  const getStatusChip = (status: string) => {
    switch (status) {
        case 'In Progress': return 'bg-blue-100 text-blue-800 ring-blue-600/20';
        case 'Finished': return 'bg-gray-100 text-gray-800 ring-gray-600/20';
        case 'Not Started':
        default: return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
    }
  };

  if (competitionMatches.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Match Schedule</h2>
      <div className="space-y-10">
        {/* FIX: Add explicit type to resolve 'unknown' type from Object.entries */}
        {Object.entries(groupedMatches).map(([stage, matchesInStage]: [string, Match[]]) => (
          <div key={stage} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <h3 className="text-xl font-semibold p-4 bg-gray-50 border-b">{stage}</h3>
            <ul className="divide-y divide-gray-200">
              {matchesInStage.map(match => (
                <li key={match.id} className="p-4 grid grid-cols-3 items-center gap-4">
                  <a href={`/?teamId=${match.homeTeam.id}`} className="flex items-center justify-end text-right group">
                    <span className="font-semibold text-gray-800 hidden sm:inline group-hover:underline">{match.homeTeam.name}</span>
                    <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="h-10 w-10 rounded-full ml-3 object-cover"/>
                  </a>
                  
                  <div className="text-center">
                    {match.status === 'Finished' ? (
                       <div className="text-2xl font-bold text-gray-900">
                           {match.homeScore} - {match.awayScore}
                       </div>
                    ) : (
                       <div className="text-sm text-gray-500">
                           {new Date(match.date).toLocaleDateString()}
                       </div>
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default PublicSchedule;
