import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import { ShieldCheckIcon, ChevronLeftIcon } from '../components/icons/Icons.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import CommentsSection from '../components/public/CommentsSection.tsx';

interface PublicArticleDetailProps {
  competitionId: string;
  articleId: string;
}

const PublicArticleDetail: React.FC<PublicArticleDetailProps> = ({ competitionId, articleId }) => {
  const { getCompetitionById, getArticleById } = useCompetitions();
  const competition = getCompetitionById(competitionId);
  const article = getArticleById(articleId);

  if (!competition || !article || !competition.publicConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700">Article Not Found</h1>
          <p className="text-gray-500 mt-2">The requested article is not available.</p>
        </div>
      </div>
    );
  }

  const { publicConfig } = competition;
  const backUrl = `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}`;

  return (
    <div style={{ backgroundColor: publicConfig.backgroundColor }} className="min-h-screen font-sans">
      <PublicHeader 
        logoUrl={publicConfig.logoUrl}
        title={publicConfig.title}
        primaryColor={publicConfig.primaryColor}
      />
      <main className="container mx-auto py-12 px-6">
        <a href={backUrl} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-8">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Site
        </a>
        <article className="max-w-4xl mx-auto">
            <img src={article.featuredImageUrl} alt={article.title} className="w-full h-96 object-cover rounded-lg shadow-lg mb-8" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">{article.title}</h1>
            <p className="text-gray-500 mb-8">By {article.author} on {new Date(article.createdAt).toLocaleDateString()}</p>
            <div className="prose prose-lg max-w-none mb-16">
                {article.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
            
            {/* --- Comments Section --- */}
            <CommentsSection articleId={article.id} />
        </article>
      </main>
      <footer className="py-8 mt-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)'}}>
        <div className="container mx-auto text-center text-gray-500 flex items-center justify-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400"/>
            Powered by Futbalito
        </div>
      </footer>
    </div>
  );
};

export default PublicArticleDetail;