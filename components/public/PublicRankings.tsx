
import React, { useMemo } from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../../context/CompetitionContext.tsx';

interface PublicRankingsProps {
  competitionId: string;
}

const PublicRankings: React.FC<PublicRankingsProps> = ({ competitionId }) => {
  const { calculateStandings } = useCompetitions();
  
  const standings = useMemo(() => calculateStandings(competitionId, 'Group Stage'), [calculateStandings, competitionId]);

  if (standings.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Rankings</h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Team</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase">P</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase">W</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase">D</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase">L</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase hidden sm:table-cell">GF</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase hidden sm:table-cell">GA</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase">GD</th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600 uppercase">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {standings.map((s, index) => (
                <tr key={s.teamId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium flex items-center text-gray-900">
                    <span className="w-6 text-center mr-2 text-gray-500">{index + 1}</span>
                    <img src={s.logoUrl} className="h-8 w-8 rounded-full mr-3 object-cover" alt={s.teamName}/>
                    <a href={`/?teamId=${s.teamId}`} className="truncate hover:underline">{s.teamName}</a>
                  </td>
                  <td className="px-3 py-3 text-center text-gray-700">{s.played}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{s.wins}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{s.draws}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{s.losses}</td>
                  <td className="px-3 py-3 text-center text-gray-700 hidden sm:table-cell">{s.goalsFor}</td>
                  <td className="px-3 py-3 text-center text-gray-700 hidden sm:table-cell">{s.goalsAgainst}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{s.goalDifference}</td>
                  <td className="px-3 py-3 text-center font-bold text-gray-800">{s.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PublicRankings;
