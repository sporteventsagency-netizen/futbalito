
import React from 'react';
import { VideoCameraIcon } from '../icons/Icons.tsx';
import type { Match } from '../../types.ts';

interface PublicLiveStreamProps {
  match: Match;
  isFeatured?: boolean;
}

const PublicLiveStream: React.FC<PublicLiveStreamProps> = ({ match }) => {
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

  const embedUrl = getEmbedUrl(match.liveStreamUrl);

  if (!embedUrl) {
    return null; // Or a placeholder indicating stream issue
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
        <iframe
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
        ></iframe>
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <VideoCameraIcon className="h-6 w-6 mr-3 text-red-500 animate-pulse" />
                Live: {match.homeTeam.name} vs {match.awayTeam.name}
            </h3>
        </div>
    </div>
  );
};

export default PublicLiveStream;
