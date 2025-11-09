

import React from 'react';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .ts extension to module import.
import usePermissions from '../hooks/usePermissions.ts';
// FIX: Added .tsx extension to module import.
import { GlobeAltIcon } from '../components/icons/Icons.tsx';

interface PublishProps {
    onCustomizeSite: (competitionId: string) => void;
    onManageArticles: (competitionId: string) => void;
    onManageMedia: (competitionId: string) => void;
    onManageSponsors: (competitionId: string) => void;
    onManageRegulations: (competitionId: string) => void;
    onCustomizePortal: () => void;
}

const Publish: React.FC<PublishProps> = ({ onCustomizeSite, onManageArticles, onManageMedia, onManageSponsors, onManageRegulations, onCustomizePortal }) => {
    const { competitions, articles } = useCompetitions();
    const { hasPermission } = usePermissions();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Publish Content</h1>
                <p className="mt-2 text-gray-600">Manage public-facing websites, articles, media, and sponsors.</p>
            </div>
            
            {hasPermission('publish:customize_sites') && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center"><GlobeAltIcon className="h-6 w-6 mr-3 text-blue-600"/> Main Portal Site</h2>
                            <p className="mt-1 text-gray-600">Customize the central website that can display multiple competitions.</p>
                        </div>
                        <Button onClick={onCustomizePortal} variant="primary">
                            Customize Portal
                        </Button>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Single Competition Sites</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competition</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published Articles</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {competitions.map((comp) => (
                                    <tr key={comp.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full object-cover" src={comp.logoUrl} alt={comp.name} />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{comp.name}</div>
                                                    <div className="text-sm text-gray-500">{comp.season}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {articles.filter(a => a.competitionId === comp.id && a.status === 'published').length}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {hasPermission('publish:manage_sponsors') && <Button onClick={() => onManageSponsors(comp.id)} variant="outline" className="text-xs">Sponsors</Button>}
                                            {hasPermission('publish:manage_media') && <Button onClick={() => onManageMedia(comp.id)} variant="outline" className="text-xs">Media</Button>}
                                            {hasPermission('publish:manage_articles') && <Button onClick={() => onManageArticles(comp.id)} variant="outline" className="text-xs">Articles</Button>}
                                            {hasPermission('publish:manage_regulations') && <Button onClick={() => onManageRegulations(comp.id)} variant="outline" className="text-xs">Regulations</Button>}
                                            {hasPermission('publish:customize_sites') && <Button onClick={() => onCustomizeSite(comp.id)} variant="secondary" className="text-xs">Customize Site</Button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Publish;
