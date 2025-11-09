import React from 'react';
import { useCompetitions } from '../../context/CompetitionContext.tsx';
import type { Sanction } from '../../types.ts';

interface PublicSanctionsProps {
  competitionId: string;
}

const PublicSanctions: React.FC<PublicSanctionsProps> = ({ competitionId }) => {
  const { sanctions, players, teams } = useCompetitions();
  const competitionSanctions = sanctions.filter(s => s.competitionId === competitionId);

  if (competitionSanctions.length === 0) {
    return null;
  }

  const getTargetName = (sanction: Sanction): string => {
    if (sanction.playerId) {
      const player = players.find(p => p.id === sanction.playerId);
      const team = teams.find(t => t.id === player?.teamId);
      return `${player?.name || 'Unknown Player'} (${team?.name || 'Unknown Team'})`;
    }
    if (sanction.teamId) {
      return teams.find(t => t.id === sanction.teamId)?.name || 'Unknown Team';
    }
    return 'N/A';
  };

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Disciplinary Sanctions</h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Party Sanctioned</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {competitionSanctions.map((s, index) => (
                <tr key={s.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-700">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{getTargetName(s)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.reason}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PublicSanctions;
