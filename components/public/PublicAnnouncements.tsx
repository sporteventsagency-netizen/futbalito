import React from 'react';
import { useCompetitions } from '../../context/CompetitionContext.tsx';

interface PublicAnnouncementsProps {
  competitionId: string;
}

const PublicAnnouncements: React.FC<PublicAnnouncementsProps> = ({ competitionId }) => {
  const { getCompetitionById } = useCompetitions();
  const competition = getCompetitionById(competitionId);
  const announcements = competition?.publicConfig?.announcements || [];

  if (announcements.length === 0) {
    return null;
  }

  return (
    <section>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Official Announcements</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
            {announcements.map(ann => (
                <div key={ann.id} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
                    <p className="text-xs text-blue-700 font-semibold">{new Date(ann.date).toLocaleDateString()}</p>
                    <h3 className="font-bold text-blue-900 mt-1">{ann.title}</h3>
                    {ann.content && <p className="text-sm text-blue-800 mt-2 whitespace-pre-wrap">{ann.content}</p>}
                </div>
            ))}
        </div>
    </section>
  );
};

export default PublicAnnouncements;