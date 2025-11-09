import React from 'react';
import type { Competition } from '../../types.ts';
import { ArrowTopRightOnSquareIcon } from '../icons/Icons.tsx';

interface CompetitionListProps {
  competitions: Competition[];
}

/**
 * Renders a list of public competitions as a grid of cards.
 * Each card links to the specific public site for that competition.
 * @param {CompetitionListProps} props The component props.
 * @returns {JSX.Element} The rendered list of competitions.
 */
const CompetitionList: React.FC<CompetitionListProps> = ({ competitions }) => {

  const getStatusChip = (status: 'Upcoming' | 'Ongoing' | 'Completed') => {
    switch (status) {
      case 'Ongoing': return 'bg-green-100 text-green-800 ring-green-600/20';
      case 'Completed': return 'bg-gray-100 text-gray-800 ring-gray-600/20';
      case 'Upcoming':
      default: return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
    }
  };

  const competitionUrl = (competitionId: string) => `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}`;

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Competitions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {competitions.map(comp => (
          <a key={comp.id} href={competitionUrl(comp.id)} className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
            <div className="p-6">
              <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <img src={comp.logoUrl} alt={comp.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{comp.name}</h3>
                      <p className="text-sm text-gray-500">{comp.season}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ring-1 ring-inset ${getStatusChip(comp.status)}`}>
                      {comp.status}
                  </span>
              </div>
              <div className="mt-6 text-sm font-semibold text-gray-600 group-hover:text-blue-600 flex items-center">
                View Competition <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1.5" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CompetitionList;
