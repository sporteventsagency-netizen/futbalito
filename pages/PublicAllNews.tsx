import React, { useState, useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon } from '../components/icons/Icons.tsx';

const PublicAllNews: React.FC = () => {
    const { portalConfig, articles, competitions } = useCompetitions();
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    const publicCompetitions = competitions.filter(c => c.isPublic);
    const publicCompetitionIds = publicCompetitions.map(c => c.id);

    const allPublicArticles = useMemo(() => {
        return articles
            .filter(a => a.status === 'published' && publicCompetitionIds.includes(a.competitionId))
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [articles, publicCompetitionIds, sortBy]);

    const mainNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal_page=news' },
        { name: 'Matches', href: '/?portal_page=matches' },
        { name: 'Stats', href: '/?portal_page=stats' },
        { name: 'Galleries', href: '/?portal_page=galleries' },
        { name: 'Live', href: '/?portal_page=live' },
        { name: 'National Team', href: '/?national_team=true' },
    ];
    
    const publicArticleUrl = (articleId: string, competitionId: string) => `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}&articleId=${articleId}`;

    return (
        <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={portalConfig.logoUrl}
                title={portalConfig.title}
                primaryColor={portalConfig.primaryColor}
                navItems={mainNavItems}
                activePage="News"
            />
            <main className="container mx-auto py-12 px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">All News</h1>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="border-gray-300 rounded-md shadow-sm">
                        <option value="newest">Sort by Newest</option>
                        <option value="oldest">Sort by Oldest</option>
                    </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allPublicArticles.map(article => (
                        <a href={publicArticleUrl(article.id, article.competitionId)} key={article.id} className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                            <img src={article.featuredImageUrl} alt={article.title} className="h-48 w-full object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{article.title}</h3>
                                <p className="text-sm text-gray-500 mt-2">By {article.author} on {new Date(article.createdAt).toLocaleDateString()}</p>
                            </div>
                        </a>
                    ))}
                </div>
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

export default PublicAllNews;