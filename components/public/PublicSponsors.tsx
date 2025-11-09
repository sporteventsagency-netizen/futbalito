

import React from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../../context/CompetitionContext.tsx';

interface PublicSponsorsProps {
  competitionId: string;
  isFooter?: boolean;
}

const PublicSponsors: React.FC<PublicSponsorsProps> = ({ competitionId, isFooter = false }) => {
  const { sponsors } = useCompetitions();
  const competitionSponsors = sponsors.filter(s => s.competitionId === competitionId);

  if (competitionSponsors.length === 0) {
    return null;
  }

  if (isFooter) {
    return (
        <div className="flex justify-center items-center gap-x-8 gap-y-4 flex-wrap">
            {competitionSponsors.map(sponsor => (
                <a key={sponsor.id} href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" title={sponsor.name}>
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="h-10 object-contain" />
                </a>
            ))}
        </div>
    );
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Sponsors</h2>
      <div className="max-w-4xl mx-auto flex justify-center items-center gap-x-12 gap-y-8 flex-wrap">
        {competitionSponsors.map(sponsor => (
          <a key={sponsor.id} href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="transform hover:scale-105 transition-transform" title={sponsor.name}>
            <img src={sponsor.logoUrl} alt={sponsor.name} className="h-16 object-contain" />
          </a>
        ))}
      </div>
    </section>
  );
};

export default PublicSponsors;
