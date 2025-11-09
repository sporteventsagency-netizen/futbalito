
import React from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
import usePermissions from '../hooks/usePermissions.ts';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
import { ChevronLeftIcon, PlusIcon } from '../components/icons/Icons.tsx';
// FIX: Added .ts extension to module import.
import type { Article } from '../types.ts';

interface ManageArticlesProps {
  competitionId: string;
  onBack: () => void;
  onCreateArticle: (competitionId: string) => void;
  onEditArticle: (articleId: string) => void;
}

const ManageArticles: React.FC<ManageArticlesProps> = ({ competitionId, onBack, onCreateArticle, onEditArticle }) => {
  const { getCompetitionById, articles, deleteArticle } = useCompetitions();
  const { hasPermission } = usePermissions();
  const competition = getCompetitionById(competitionId);
  const competitionArticles = articles.filter(a => a.competitionId === competitionId);
  
  const canManageArticles = hasPermission('publish:manage_articles');

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Publish
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Manage Articles: {competition?.name}</h1>
          <p className="mt-2 text-gray-600">Create, edit, and publish news for your competition.</p>
        </div>
        {canManageArticles && (
            <Button onClick={() => onCreateArticle(competitionId)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Article
            </Button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                {canManageArticles && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {competitionArticles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 font-medium">{article.title}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</td>
                  {canManageArticles && (
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-4">
                        <button onClick={() => onEditArticle(article.id)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageArticles;
