import React, { useState, useEffect, useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import PublicHeader from '../components/public/PublicHeader.tsx';
import { ShieldCheckIcon, ChevronLeftIcon } from '../components/icons/Icons.tsx';
import LiveMatchScoreboard from '../components/public/LiveMatchScoreboard.tsx';
import LiveCommentaryFeed from '../components/public/LiveCommentaryFeed.tsx';
import Toast from '../components/ui/Toast.tsx';

interface PublicLiveMatchDetailProps {
  matchId: string;
}

const PublicLiveMatchDetail: React.FC<PublicLiveMatchDetailProps> = ({ matchId }) => {
    const { portalConfig, getMatchById } = useCompetitions();
    
    // The match data from context will be updated in real-time
    const match = getMatchById(matchId);
    
    const [goalNotification, setGoalNotification] = useState<string | null>(null);
    const [prevScore, setPrevScore] = useState({ home: match?.homeScore || 0, away: match?.awayScore || 0 });

    // Effect to detect a score change and trigger a goal notification
    useEffect(() => {
        if (match) {
            if (match.homeScore > prevScore.home || match.awayScore > prevScore.away) {
                const lastEvent = match.events[match.events.length - 1];
                if (lastEvent && lastEvent.type === 'GOAL') {
                    setGoalNotification(`GOAL! Score is now ${match.homeScore} - ${match.awayScore}`);
                }
            }
            setPrevScore({ home: match.homeScore, away: match.awayScore });
        }
    }, [match]);


    const mainNavItems = [
        { name: 'Home', href: '/?portal=true' },
        { name: 'News', href: '/?portal_page=news' },
        { name: 'Matches', href: '/?portal_page=matches' },
        { name: 'Stats', href: '/?portal_page=stats' },
        { name: 'Galleries', href: '/?portal_page=galleries' },
        { name: 'Live', href: '/?portal_page=live' },
        { name: 'National Team', href: '/?national_team=true' },
    ];
    
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
        } catch (e) { return null; }
        return null;
    };
    
    const embedUrl = getEmbedUrl(match?.liveStreamUrl);
    
    const formatTime = (seconds: number = 0) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    if (!match) {
        return <div>Match not found.</div>;
    }

    return (
        <div style={{ backgroundColor: portalConfig.backgroundColor }} className="min-h-screen font-sans">
            <PublicHeader 
                logoUrl={portalConfig.logoUrl}
                title={portalConfig.title}
                primaryColor={portalConfig.primaryColor}
                navItems={mainNavItems}
                activePage="Live"
            />
            <main className="container mx-auto py-12 px-6">
                <a href="/?portal_page=live" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-8">
                    <ChevronLeftIcon className="h-5 w-5 mr-1" />
                    Back to Live Center
                </a>
                
                <LiveMatchScoreboard match={match} time={formatTime(match.elapsedSeconds)} />

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {embedUrl ? (
                            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg shadow-lg overflow-hidden">
                                <iframe src={embedUrl} title="Live Stream" frameBorder="0" allow="autoplay; fullscreen" className="w-full h-full"></iframe>
                            </div>
                        ) : (
                            <div className="aspect-w-16 aspect-h-9 bg-gray-800 text-white flex items-center justify-center rounded-lg shadow-lg">
                                <p>Live stream is not available for this match.</p>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        <LiveCommentaryFeed events={[...match.events].sort((a,b) => b.minute - a.minute)} />
                    </div>
                </div>
            </main>
            <footer className="py-8 mt-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)'}}>
                <div className="container mx-auto text-center text-gray-500 flex items-center justify-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400"/>
                    Powered by Futbalito
                </div>
            </footer>
            
            {goalNotification && (
                <Toast message={goalNotification} onClose={() => setGoalNotification(null)} />
            )}
        </div>
    );
};

export default PublicLiveMatchDetail;