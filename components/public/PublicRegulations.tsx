import React from 'react';
import { useCompetitions } from '../../context/CompetitionContext';

interface PublicRegulationsProps {
  competitionId: string;
}

const PublicRegulations: React.FC<PublicRegulationsProps> = ({ competitionId }) => {
  const { getCompetitionById } = useCompetitions();
  const competition = getCompetitionById(competitionId);
  const regulations = competition?.publicConfig?.regulations || [];

  if (regulations.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Regulations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {regulations.map(reg => (
          <div key={reg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{reg.title}</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                {reg.content ? reg.content.split('\n').map((p, i) => <p key={i}>{p}</p>) : <p>No content available.</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PublicRegulations;
