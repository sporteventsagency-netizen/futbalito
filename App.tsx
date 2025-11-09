import React from 'react';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Browse from './pages/Browse.tsx';
import ManageCompetitions from './pages/ManageCompetitions.tsx';
import CompetitionDetail from './pages/CompetitionDetail.tsx';
import LiveMatch from './pages/LiveMatch.tsx';
import ManageTeams from './pages/ManageTeams.tsx';
import ManagePlayers from './pages/ManagePlayers.tsx';
import ManageArenas from './pages/ManageArenas.tsx';
import ManageReferees from './pages/ManageReferees.tsx';
import ManageObservers from './pages/ManageObservers.tsx';
import ManageOrganizers from './pages/ManageOrganizers.tsx';
import ManageNationalTeam from './pages/ManageNationalTeam.tsx';
import ManageSports from './pages/ManageSports.tsx';
import Publish from './pages/Publish.tsx';
import Reports from './pages/Reports.tsx';
import Marketplace from './pages/Marketplace.tsx';
import Settings from './pages/Settings.tsx';
import WebBuilder from './pages/WebBuilder.tsx';
import PortalBuilder from './pages/PortalBuilder.tsx';
import ManageArticles from './pages/ManageArticles.tsx';
import EditArticle from './pages/EditArticle.tsx';
import ManageMedia from './pages/ManageMedia.tsx';
import EditGallery from './pages/EditGallery.tsx';
import ManageSponsors from './pages/ManageSponsors.tsx';
import ManageRegulations from './pages/ManageRegulations.tsx';
import PlayerDetail from './pages/PlayerDetail.tsx';
// Public Pages
import PublicSite from './pages/PublicSite.tsx';
import PublicPortalSite from './pages/PublicPortalSite.tsx';
import PublicArticleDetail from './pages/PublicArticleDetail.tsx';
import PublicGalleryDetail from './pages/PublicGalleryDetail.tsx';
import PublicAllLiveStreams from './pages/PublicAllLiveStreams.tsx';
import PublicAllNews from './pages/PublicAllNews.tsx';
import PublicAllMatches from './pages/PublicAllMatches.tsx';
import PublicGlobalStats from './pages/PublicGlobalStats.tsx';
import PublicAllGalleries from './pages/PublicAllGalleries.tsx';
import PublicTeamDetail from './pages/PublicTeamDetail.tsx';
import PublicPlayerDetail from './pages/PublicPlayerDetail.tsx';
import PublicAllLive from './pages/PublicAllLive.tsx';
import PublicLiveMatchDetail from './pages/PublicLiveMatchDetail.tsx';
import PublicNationalTeam from './pages/PublicNationalTeam.tsx';


import type { Page } from './types.ts';

const App: React.FC = () => {
    // State to manage the current view
    const [page, setPage] = React.useState<Page>('DASHBOARD');
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    
    // State for detail views
    const [viewingCompetitionId, setViewingCompetitionId] = React.useState<string | null>(null);
    const [liveMatchId, setLiveMatchId] = React.useState<string | null>(null);
    const [customizingSiteId, setCustomizingSiteId] = React.useState<string | null>(null);
    const [customizingPortal, setCustomizingPortal] = React.useState<boolean>(false);
    const [managingArticlesId, setManagingArticlesId] = React.useState<string | null>(null);
    const [editingArticle, setEditingArticle] = React.useState<{ competitionId: string; articleId: string | null } | null>(null);
    const [managingMediaId, setManagingMediaId] = React.useState<string | null>(null);
    const [editingGallery, setEditingGallery] = React.useState<{ competitionId: string; galleryId: string | null } | null>(null);
    const [managingSponsorsId, setManagingSponsorsId] = React.useState<string | null>(null);
    const [managingRegulationsId, setManagingRegulationsId] = React.useState<string | null>(null);
    const [viewingPlayerId, setViewingPlayerId] = React.useState<string | null>(null);

    // Check for public site query params
    const queryParams = new URLSearchParams(window.location.search);
    const publicCompetitionId = queryParams.get('publicCompetitionId');
    const articleId = queryParams.get('articleId');
    const galleryId = queryParams.get('galleryId');
    const isPortal = queryParams.get('portal');
    const portalPage = queryParams.get('portal_page');
    const teamId = queryParams.get('teamId');
    const publicPlayerId = queryParams.get('playerId');
    const publicLiveMatchId = queryParams.get('liveMatchId');
    const isNationalTeam = queryParams.get('national_team');
    const view = queryParams.get('view');

    if (isPortal === 'true' || portalPage) {
        switch (portalPage) {
            case 'news': return <PublicAllNews />;
            case 'matches': return <PublicAllMatches />;
            case 'stats': return <PublicGlobalStats />;
            case 'galleries': return <PublicAllGalleries />;
            case 'live': return <PublicAllLive />;
            default: return <PublicPortalSite />;
        }
    }
    
    if (teamId) {
        return <PublicTeamDetail teamId={teamId} />;
    }

    if (publicPlayerId) {
        return <PublicPlayerDetail playerId={publicPlayerId} />;
    }

    if (publicLiveMatchId) {
        return <PublicLiveMatchDetail matchId={publicLiveMatchId} />;
    }
    
    if (isNationalTeam) {
        return <PublicNationalTeam />;
    }

    if (publicCompetitionId) {
        if (articleId) {
            return <PublicArticleDetail competitionId={publicCompetitionId} articleId={articleId} />;
        }
        if (galleryId) {
            return <PublicGalleryDetail competitionId={publicCompetitionId} galleryId={galleryId} />;
        }
        if (view === 'live') {
            return <PublicAllLiveStreams competitionId={publicCompetitionId} />;
        }
        return <PublicSite competitionId={publicCompetitionId} />;
    }

    const resetViews = () => {
        setViewingCompetitionId(null);
        setLiveMatchId(null);
        setCustomizingSiteId(null);
        setCustomizingPortal(false);
        setManagingArticlesId(null);
        setEditingArticle(null);
        setManagingMediaId(null);
        setEditingGallery(null);
        setManagingSponsorsId(null);
        setManagingRegulationsId(null);
        setViewingPlayerId(null);
    }
    
    const navigateTo = (p: Page) => {
        resetViews();
        setPage(p);
    };

    const handleViewCompetition = (id: string) => {
        setViewingCompetitionId(id);
    };

    const handleManageLiveMatch = (id: string) => {
        setLiveMatchId(id);
    };
    
    const handleCustomizeSite = (id: string) => {
        setCustomizingSiteId(id);
    };

    const handleCustomizePortal = () => {
        setCustomizingPortal(true);
    }
    
    const handleManageArticles = (id: string) => {
        setManagingArticlesId(id);
    };
    
    const handleCreateArticle = (competitionId: string) => {
        setEditingArticle({ competitionId, articleId: null });
    };

    const handleEditArticle = (articleId: string) => {
        const compId = 'comp-1'; // This is a simplification. In a real app, you'd get this from the article object.
        setEditingArticle({ competitionId: compId, articleId });
    };
    
    const handleManageMedia = (id: string) => {
        setManagingMediaId(id);
    };
    
    const handleCreateGallery = (competitionId: string) => {
        setEditingGallery({ competitionId, galleryId: null });
    };

    const handleEditGallery = (galleryId: string) => {
        const compId = 'comp-1'; // Simplification
        setEditingGallery({ competitionId: compId, galleryId });
    };
    
    const handleManageSponsors = (id: string) => {
        setManagingSponsorsId(id);
    };

    const handleManageRegulations = (id: string) => {
        setManagingRegulationsId(id);
    };
    
    const handleViewPlayerDetail = (id: string) => {
        setViewingPlayerId(id);
    };

    const renderContent = () => {
        // More specific views must be checked before their parents to ensure correct navigation.
        if (liveMatchId) return <LiveMatch matchId={liveMatchId} onBack={resetViews} />;
        if (editingArticle) return <EditArticle competitionId={editingArticle.competitionId} articleId={editingArticle.articleId} onBack={resetViews} />;
        if (editingGallery) return <EditGallery competitionId={editingGallery.competitionId} galleryId={editingGallery.galleryId} onBack={resetViews} />;
        
        // Parent/main detail views
        if (viewingCompetitionId) return <CompetitionDetail competitionId={viewingCompetitionId} onBack={resetViews} onManageLiveMatch={handleManageLiveMatch} />;
        if (customizingSiteId) return <WebBuilder competitionId={customizingSiteId} onBack={resetViews} />;
        if (customizingPortal) return <PortalBuilder onBack={resetViews} />;
        if (managingArticlesId) return <ManageArticles competitionId={managingArticlesId} onBack={resetViews} onCreateArticle={handleCreateArticle} onEditArticle={handleEditArticle}/>;
        if (managingMediaId) return <ManageMedia competitionId={managingMediaId} onBack={resetViews} onCreateGallery={handleCreateGallery} onEditGallery={handleEditGallery} />;
        if (managingSponsorsId) return <ManageSponsors competitionId={managingSponsorsId} onBack={resetViews} />;
        if (managingRegulationsId) return <ManageRegulations competitionId={managingRegulationsId} onBack={resetViews} />;
        if (viewingPlayerId) return <PlayerDetail playerId={viewingPlayerId} onBack={resetViews} />;

        switch (page) {
            case 'DASHBOARD': return <Dashboard setPage={navigateTo} />;
            case 'BROWSE': return <Browse />;
            case 'MANAGE_COMPETITIONS': return <ManageCompetitions setPage={navigateTo} onViewCompetition={handleViewCompetition} />;
            case 'MANAGE_TEAMS': return <ManageTeams />;
            case 'MANAGE_PLAYERS': return <ManagePlayers onViewPlayerDetail={handleViewPlayerDetail} />;
            case 'MANAGE_ARENAS': return <ManageArenas />;
            case 'MANAGE_SPORTS': return <ManageSports />;
            case 'MANAGE_REFEREES': return <ManageReferees />;
            case 'MANAGE_OBSERVERS': return <ManageObservers />;
            case 'MANAGE_ORGANIZERS': return <ManageOrganizers />;
            case 'MANAGE_NATIONAL_TEAM': return <ManageNationalTeam />;
            case 'PUBLISH': return <Publish onCustomizeSite={handleCustomizeSite} onManageArticles={handleManageArticles} onManageMedia={handleManageMedia} onManageSponsors={handleManageSponsors} onManageRegulations={handleManageRegulations} onCustomizePortal={handleCustomizePortal} />;
            case 'REPORTS': return <Reports />;
            case 'MARKETPLACE': return <Marketplace />;
            case 'SETTINGS': return <Settings setPage={navigateTo} />;
            default: return <Dashboard setPage={navigateTo} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar page={page} setPage={navigateTo} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;