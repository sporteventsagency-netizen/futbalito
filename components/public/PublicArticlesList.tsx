
import React from 'react';
import { useCompetitions } from '../../context/CompetitionContext.tsx';
import { VideoCameraIcon } from '../icons/Icons.tsx';

interface PublicArticlesListProps {
  competitionId: string;
}

const PublicArticlesList: React.FC<PublicArticlesListProps> = ({ competitionId }) => {
  const { articles, getCompetitionById, matches } = useCompetitions();
  const competition = getCompetitionById(competitionId);
  const publicArticles = articles.filter(a => a.competitionId === competitionId && a.status === 'published');
  
  const featuredLiveMatchIds = competition?.publicConfig?.featuredLiveMatchIds || [];
  const featuredMatches = featuredLiveMatchIds.map(id => matches.find(m => m.id === id)).filter(Boolean);
  
  const mainLiveMatch = featuredMatches.length > 0 ? featuredMatches[0] : null;
  const otherLiveMatches = featuredMatches.slice(1);

  const showLiveStream = competition?.publicConfig?.showLiveStream && mainLiveMatch;

  if (publicArticles.length === 0 && !showLiveStream) {
    return null;
  }

  const publicArticleUrl = (articleId: string) => `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}&articleId=${articleId}`;
  const allLiveStreamsUrl = `${window.location.origin}${window.location.pathname}?publicCompetitionId=${competitionId}&view=live`;

  const getEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
      }
      if (urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.pathname.slice(1);
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
      }
    } catch (error) {
      console.error("Invalid URL for live stream:", url);
      return null;
    }
    return null;
  };

  const mainEmbedUrl = getEmbedUrl(mainLiveMatch?.liveStreamUrl);

  return (
    <section>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Latest News & Live</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {showLiveStream && mainEmbedUrl && mainLiveMatch && (
          <div className="block bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={mainEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-6 bg-red-600 text-white min-h-[136px] flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold flex items-start">
                        <VideoCameraIcon className="h-6 w-6 mr-3 text-white animate-pulse flex-shrink-0 mt-1"/>
                        <span className="line-clamp-2">Live View: {mainLiveMatch.homeTeam.name} vs {mainLiveMatch.awayTeam.name}</span>
                    </h3>
                </div>
                {otherLiveMatches.length > 0 && (
                     <a href={allLiveStreamsUrl} className="text-sm font-semibold text-white underline mt-2 inline-block">View all streams ({otherLiveMatches.length} more)</a>
                )}
            </div>
          </div>
        )}
        {publicArticles.map(article => (
          <a href={publicArticleUrl(article.id)} key={article.id} className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <img src={article.featuredImageUrl} alt={article.title} className="h-48 w-full object-cover" />
            <div className="p-6 min-h-[136px] flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-500 mt-2">By {article.author} on {new Date(article.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 text-sm font-semibold text-blue-600">Read More &rarr;</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PublicArticlesList;
