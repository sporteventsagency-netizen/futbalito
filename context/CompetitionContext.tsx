import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { 
    Team, Competition, Match, Player, OrganizationSettings, User, Role,
    Invoice, AuditLog, County, Arena, Sanction, Referee, Observer, Sport,
    Article, MediaImage, Gallery, Sponsor, Transfer, PlayerRegistration,
    Standing, PortalConfig, PublicConfig, NationalTeam, NationalSquadPlayer, Comment
} from '../types.ts';
import { 
    mockOrganizationSettings,
    mockUsers, mockRoles, mockInvoices, mockAuditLog, 
    mockCounties,
    mockPortalConfig,
    MOCK_NATIONAL_TEAM, MOCK_NATIONAL_SQUAD, MOCK_INTERNATIONAL_MATCHES
} from './mock_data.ts';
import { generateBergerTable } from '../utils/bergerTable.ts';
import { getSupabase } from '../src/supabaseClient.ts';

const isUuid = (v: any) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);


// Define the shape of the context value
interface CompetitionContextType {
    teams: Team[];
    addTeam: (data: Omit<Team, 'id' | 'logoUrl'> & { logoFile?: File | null }) => void;
    updateTeam: (team: Team, logoFile?: File | null) => void;
    deleteTeam: (id: string) => void;
    competitions: Competition[];
    getCompetitionById: (id: string) => Competition | undefined;
    addCompetition: (data: Omit<Competition, 'id' | 'logoUrl' | 'status'> & { logoFile?: File | null }) => void;
    updateCompetition: (competition: Competition) => void;
    deleteCompetition: (id: string) => void;
    addTeamToCompetition: (competitionId: string, teamId: string) => void;
    matches: Match[];
    getMatchById: (id: string) => Match | undefined;
    updateMatch: (match: Match) => void;
    generateBergerSchedule: (competitionId: string) => void;
    players: Player[];
    addPlayer: (data: Omit<Player, 'id' | 'stats' | 'photoUrl'> & { photoFile?: File | null }) => void;
    updatePlayer: (player: Player, photoFile?: File | null) => void;
    deletePlayer: (id: string) => void;
    getTransfersByPlayerId: (playerId: string) => Transfer[];
    getPlayerRegistrationsByPlayerId: (playerId: string) => PlayerRegistration[];
    organizationSettings: OrganizationSettings;
    updateOrganizationSettings: (settings: OrganizationSettings, logoFile?: File | null) => void;
    currentUser: User | null;
    users: User[];
    setCurrentUser: (id: string) => void;
    inviteUser: (email: string, roleId: string) => void;
    updateUser: (user: User) => void;
    deleteUser: (id: string) => void;
    roles: Role[];
    addRole: (data: Omit<Role, 'id'>) => void;
    updateRole: (role: Role) => void;
    deleteRole: (id: string) => void;
    invoices: Invoice[];
    auditLog: AuditLog[];
    counties: County[];
    arenas: Arena[];
    addArena: (data: Omit<Arena, 'id'>) => void;
    updateArena: (arena: Arena) => void;
    deleteArena: (id: string) => void;
    sports: Sport[];
    addSport: (data: { name: string; description: string }) => void;
    updateSport: (sport: Sport) => void;
    deleteSport: (id: string) => void;
    sanctions: Sanction[];
    addSanction: (data: Omit<Sanction, 'id'>) => void;
    updateSanction: (sanction: Sanction) => void;
    deleteSanction: (id: string) => void;
    referees: Referee[];
    addReferee: (data: Omit<Referee, 'id' | 'photoUrl'> & { photoFile?: File | null }) => void;
    updateReferee: (referee: Referee, photoFile?: File | null) => void;
    deleteReferee: (id: string) => void;
    observers: Observer[];
    addObserver: (data: Omit<Observer, 'id' | 'photoUrl'> & { photoFile?: File | null }) => void;
    updateObserver: (observer: Observer, photoFile?: File | null) => void;
    deleteObserver: (id: string) => void;
    calculateStandings: (competitionId: string) => Standing[];
    articles: Article[];
    getArticleById: (id: string) => Article | undefined;
    addArticle: (data: Omit<Article, 'id' | 'featuredImageUrl' | 'author' | 'createdAt'>, imageFile: File | null) => void;
    updateArticle: (article: Article, imageFile: File | null) => void;
    deleteArticle: (id: string) => void;
    mediaImages: MediaImage[];
    uploadImage: (competitionId: string, file: File) => void;
    deleteImage: (id: string) => void;
    galleries: Gallery[];
    getGalleryById: (id: string) => Gallery | undefined;
    addGallery: (data: Omit<Gallery, 'id'>) => void;
    updateGallery: (gallery: Gallery) => void;
    deleteGallery: (id: string) => void;
    sponsors: Sponsor[];
    addSponsor: (data: Omit<Sponsor, 'id' | 'logoUrl'>, logoFile?: File | null) => void;
    updateSponsor: (sponsor: Sponsor, logoFile?: File | null) => void;
    deleteSponsor: (id: string) => void;
    updateCompetitionPublicConfig: (competitionId: string, config: PublicConfig, logoFile?: File | null) => void;
    updateCompetitionRegulation: (competitionId: string, regulation: any) => void;
    portalConfig: PortalConfig;
    updatePortalConfig: (config: PortalConfig, logoFile?: File | null) => void;
    transfers: Transfer[];
    addTransfer: (data: Omit<Transfer, 'id'>) => void;
    updateTransfer: (transfer: Transfer) => void;
    deleteTransfer: (id: string) => void;
    playerRegistrations: PlayerRegistration[];
    addPlayerRegistration: (data: Omit<PlayerRegistration, 'id'>) => void;
    updatePlayerRegistration: (reg: PlayerRegistration) => void;
    deletePlayerRegistration: (id: string) => void;
    // National Team
    nationalTeam: NationalTeam;
    nationalSquad: NationalSquadPlayer[];
    addPlayerToSquad: (playerId: string) => void;
    removePlayerFromSquad: (playerId: string) => void;
    // Comments
    comments: Comment[];
    addComment: (data: { articleId: string, author: string, content: string }) => void;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

// Helper function for optimistic updates
const createOptimisticUpdater = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, entityName: string) => {
    return {
        add: (item: T) => setter(prev => [...prev, item]),
        update: (item: T) => setter(prev => prev.map(i => i.id === item.id ? item : i)),
        delete: (id: string) => setter(prev => prev.filter(i => i.id !== id)),
        handleError: (originalState: T[], error: any, action: 'add' | 'update' | 'delete') => {
            console.error(`[Supabase] Error ${action}ing ${entityName}:`, error);
            alert(`Failed to ${action} ${entityName}: ${error.message}\n\nHint: Check if the '${entityName}s' table has the correct RLS policy enabled.`);
            setter(originalState);
        }
    };
};


export const CompetitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(mockOrganizationSettings);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [currentUser, setCurrentUserState] = useState<User | null>(mockUsers[0]);
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [invoices] = useState<Invoice[]>(mockInvoices);
    const [auditLog, setAuditLog] = useState<AuditLog[]>(mockAuditLog);
    const [counties, setCounties] = useState<County[]>(mockCounties);
    const [arenas, setArenas] = useState<Arena[]>([]);
    const [sports, setSports] = useState<Sport[]>([]);
    const [sanctions, setSanctions] = useState<Sanction[]>([]);
    const [referees, setReferees] = useState<Referee[]>([]);
    const [observers, setObservers] = useState<Observer[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [mediaImages, setMediaImages] = useState<MediaImage[]>([]);
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [portalConfig, setPortalConfig] = useState<PortalConfig>(mockPortalConfig);
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [playerRegistrations, setPlayerRegistrations] = useState<PlayerRegistration[]>([]);
    const [nationalTeam] = useState<NationalTeam>(MOCK_NATIONAL_TEAM);
    const [nationalSquad, setNationalSquad] = useState<NationalSquadPlayer[]>(MOCK_NATIONAL_SQUAD);
    const [comments, setComments] = useState<Comment[]>([]);

    // Updaters for optimistic UI
    const teamUpdater = createOptimisticUpdater(setTeams, 'team');
    const playerUpdater = createOptimisticUpdater(setPlayers, 'player');
    const arenaUpdater = createOptimisticUpdater(setArenas, 'arena');
    const sportUpdater = createOptimisticUpdater(setSports, 'sport');
    const refereeUpdater = createOptimisticUpdater(setReferees, 'referee');
    const observerUpdater = createOptimisticUpdater(setObservers, 'observer');
    const sanctionUpdater = createOptimisticUpdater(setSanctions, 'sanction');
    const transferUpdater = createOptimisticUpdater(setTransfers, 'transfer');
    const registrationUpdater = createOptimisticUpdater(setPlayerRegistrations, 'player registration');
    const articleUpdater = createOptimisticUpdater(setArticles, 'article');
    const galleryUpdater = createOptimisticUpdater(setGalleries, 'gallery');
    const sponsorUpdater = createOptimisticUpdater(setSponsors, 'sponsor');


    useEffect(() => {
        let isMounted = true;
    
        const fetchInitialData = async () => {
            const supabase = getSupabase();
            
            const fetchTable = async (tableName: string, setter: (data: any) => void, select = '*') => {
                const { data, error } = await supabase.from(tableName).select(select).order( 'created_at' as any, { ascending: false });
                if (error) console.error(`[Supabase] Error fetching ${tableName}:`, error);
                else if (isMounted) setter(data);
            };

            // Fetch all data in parallel
            await Promise.all([
                fetchTable('competitions', (data) => {
                    const normalized = (data ?? []).map((row: any) => ({
                        id: row.id, name: row.name, season: row.season, logoUrl: row.logo_url ?? '', status: row.status ?? 'Upcoming',
                        format: row.format ?? 'league', twoLegged: row.two_legged ?? false, teamsPerGroup: row.teams_per_group ?? 4,
                        defaultArenaId: row.default_arena_id, isPublic: row.is_public ?? false, county: row.county, sportId: row.sport_id,
                        pointsForWin: row.points_for_win ?? 3, pointsForTieBreakWin: row.points_for_tie_break_win, publicConfig: row.public_config ?? {},
                        teamIds: row.competition_teams ? row.competition_teams.map((ct: { team_id: string }) => ct.team_id) : [],
                    }));
                    setCompetitions(normalized as Competition[]);
                }, '*, competition_teams(team_id)'),
                
                fetchTable('teams', (data) => setTeams( (data as any[] ?? []).map(t => ({...t, logoUrl: t.logo_url, foundedYear: t.founded_year, clubColors: t.club_colors, competitionOrganizer: t.competition_organizer})) as Team[])),
                fetchTable('players', (data) => setPlayers( (data as any[] ?? []).map(p => ({...p, teamId: p.team_id, photoUrl: p.photo_url, dateOfBirth: p.date_of_birth, registrationNumber: p.registration_number, registrationDate: p.registration_date, annualVisas: p.annual_visas || []})) as Player[])),
                fetchTable('matches', (data) => {
                     const realMatches = (data as any[] ?? []).map(m => ({
                        ...m, 
                        homeTeam: teams.find(t => t.id === m.home_team_id)!, 
                        awayTeam: teams.find(t => t.id === m.away_team_id)!,
                        homeScore: m.home_score,
                        awayScore: m.away_score,
                        liveStreamUrl: m.live_stream_url,
                        isInternational: m.is_international,
                        elapsedSeconds: m.elapsed_seconds,
                        events: [], // TODO: Fetch events
                     }));
                     setMatches([...realMatches, ...MOCK_INTERNATIONAL_MATCHES]);
                }),
                fetchTable('sports', setSports),
                fetchTable('arenas', setArenas),
                fetchTable('referees', (data) => setReferees((data as any[] ?? []).map(r => ({...r, dateOfBirth: r.date_of_birth, photoUrl: r.photo_url})) as Referee[])),
                fetchTable('observers', (data) => setObservers((data as any[] ?? []).map(o => ({...o, dateOfBirth: o.date_of_birth, photoUrl: o.photo_url})) as Observer[])),
                fetchTable('sanctions', (data) => setSanctions((data as any[] ?? []).map(s => ({...s, teamId: s.team_id, playerId: s.player_id})) as Sanction[])),
                fetchTable('transfers', (data) => setTransfers((data as any[] ?? []).map(t => ({...t, playerId: t.player_id, fromTeamId: t.from_team_id, toTeamId: t.to_team_id})) as Transfer[])),
                fetchTable('player_registrations', (data) => setPlayerRegistrations((data as any[] ?? []).map(pr => ({...pr, playerId: pr.player_id, registrationNumber: pr.registration_number, validFrom: pr.valid_from, validUntil: pr.valid_until})) as PlayerRegistration[])),
                fetchTable('articles', (data) => setArticles((data as any[] ?? []).map(a => ({...a, competitionId: a.competition_id, featuredImageUrl: a.featured_image_url, createdAt: a.created_at})) as Article[])),
                fetchTable('galleries', (data) => setGalleries((data as any[] ?? []).map(g => ({...g, competitionId: g.competition_id, imageIds: g.image_ids || []})) as Gallery[])),
                fetchTable('sponsors', (data) => setSponsors((data as any[] ?? []).map(s => ({...s, competitionId: s.competition_id, websiteUrl: s.website_url, logoUrl: s.logo_url})) as Sponsor[])),
                fetchTable('media_images', (data) => setMediaImages((data as any[] ?? []).map(mi => ({...mi, competitionId: mi.competition_id})) as MediaImage[]))
            ]);
        };
    
        fetchInitialData();
        return () => { isMounted = false; };
    }, []);


    // Effect to load comments from localStorage on initial render
    useEffect(() => {
        try {
            const storedComments = localStorage.getItem('futbalito_comments');
            if (storedComments) {
                setComments(JSON.parse(storedComments));
            }
        } catch (error) {
            console.error("Failed to load comments from localStorage", error);
        }
    }, []);

    const logAction = (action: string, details: string) => {
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            userId: currentUser!.id,
            userName: currentUser!.name,
            action,
            details,
            timestamp: new Date().toISOString()
        };
        setAuditLog(prev => [newLog, ...prev]);
    }
    
    // --- TEAMS ---
    const addTeam = async (data: Omit<Team, 'id' | 'logoUrl'> & { logoFile?: File | null }) => {
        const { logoFile, ...rest } = data;
        const tempId = `team-${Date.now()}`;
        const newTeam: Team = {
            id: tempId,
            logoUrl: logoFile ? URL.createObjectURL(logoFile) : `https://picsum.photos/seed/${Date.now()}/200`,
            ...rest
        };
        const originalState = teams;
        teamUpdater.add(newTeam);
        logAction('Create Team', `Created team: ${data.name}`);

        try {
            const { error, data: inserted } = await getSupabase().from('teams').insert({
                name: rest.name, country: rest.country, county: rest.county, city: rest.city, address: rest.address,
                founded_year: rest.foundedYear, club_colors: rest.clubColors, president: rest.president,
                coach: rest.coach, status: rest.status, logo_url: newTeam.logoUrl
            }).select().single();
            if (error) throw error;
            setTeams(prev => prev.map(t => t.id === tempId ? { ...t, id: inserted.id } : t));
        } catch (error) {
            teamUpdater.handleError(originalState, error, 'add');
        }
    };

    const updateTeam = async (updatedTeam: Team, logoFile?: File | null) => {
        let finalTeam = { ...updatedTeam };
        if (logoFile) finalTeam.logoUrl = URL.createObjectURL(logoFile);
        const originalState = teams;
        teamUpdater.update(finalTeam);
        logAction('Update Team', `Updated team: ${finalTeam.name}`);

        try {
            const { data, error } = await getSupabase().from('teams').update({
                name: finalTeam.name, country: finalTeam.country, county: finalTeam.county, city: finalTeam.city, address: finalTeam.address,
                founded_year: finalTeam.foundedYear, club_colors: finalTeam.clubColors, president: finalTeam.president,
                coach: finalTeam.coach, status: finalTeam.status, logo_url: finalTeam.logoUrl
            }).eq('id', finalTeam.id).select();

            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");

        } catch(error) {
            teamUpdater.handleError(originalState, error, 'update');
        }
    };

    const deleteTeam = async (id: string) => {
        const originalState = teams;
        teamUpdater.delete(id);
        logAction('Delete Team', `Deleted team ID: ${id}`);
        try {
            const { data, error } = await getSupabase().from('teams').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch (error) {
            teamUpdater.handleError(originalState, error, 'delete');
        }
    };

    // --- COMPETITIONS ---
    const addCompetition = (data: Omit<Competition, 'id' | 'logoUrl' | 'status'> & { logoFile?: File | null }) => {
        (async () => {
            const supabase = getSupabase();
            const { logoFile, teamIds: initialTeamIds, ...rest } = data;
            const tempId = `temp-${Date.now()}`;
    
            const newCompUI: Competition = {
                id: tempId,
                logoUrl: logoFile ? URL.createObjectURL(logoFile) : `https://picsum.photos/seed/${data.name}/200`,
                status: 'Upcoming',
                ...rest,
                teamIds: initialTeamIds || [],
            };
    
            setCompetitions(prev => [...prev, newCompUI]);
            logAction('Create Competition', `Created competition: ${data.name}`);
    
            try {
                const insertPayload = {
                    name: newCompUI.name, season: (newCompUI as any).season ?? String(new Date().getFullYear()),
                    logo_url: newCompUI.logoUrl, status: newCompUI.status, format: (newCompUI as any).format,
                    two_legged: (newCompUI as any).twoLegged, teams_per_group: (newCompUI as any).teamsPerGroup,
                    default_arena_id: isUuid((newCompUI as any).defaultArenaId) ? (newCompUI as any).defaultArenaId : null,
                    is_public: (newCompUI as any).isPublic, county: (newCompUI as any).county,
                    sport_id: isUuid((newCompUI as any).sportId) ? (newCompUI as any).sportId : null,
                    points_for_win: (newCompUI as any).pointsForWin, points_for_tie_break_win: (newCompUI as any).pointsForTieBreakWin, public_config: {},
                };
    
                const { data: inserted, error: insertError } = await supabase.from('competitions').insert(insertPayload).select('*').single();
    
                if (insertError) {
                    throw insertError;
                }
    
                if (inserted && initialTeamIds && initialTeamIds.length > 0) {
                    const competitionTeamsPayload = initialTeamIds.map(teamId => ({ competition_id: inserted.id, team_id: teamId }));
                    const { error: joinError } = await supabase.from('competition_teams').insert(competitionTeamsPayload);
                    if (joinError) {
                        alert(`Competition was created, but failed to add teams: ${joinError.message}\n\nHint: Check if the 'competition_teams' table has an INSERT policy enabled in Supabase for all users.`);
                    }
                }
    
                setCompetitions(prev => prev.map(c => c.id === tempId ? { ...c, id: inserted.id, logoUrl: inserted.logo_url ?? c.logoUrl } : c));
            } catch (e: any) {
                console.error('[Supabase] unexpected insert error:', e);
                alert(`An unexpected error occurred: ${e.message}`);
                setCompetitions(prev => prev.filter(c => c.id !== tempId));
            }
        })();
    };
    
    const updateCompetition = (updatedComp: Competition) => {
        const originalState = competitions;
        setCompetitions(prev => prev.map(c => c.id === updatedComp.id ? updatedComp : c));
        logAction('Update Competition', `Updated competition: ${updatedComp.name}`);
    
        (async () => {
            try {
                const supabase = getSupabase();
                const { teamIds, ...compData } = updatedComp;
                const updatePayload = {
                    name: compData.name, season: compData.season, logo_url: compData.logoUrl, status: compData.status,
                    format: compData.format, two_legged: compData.twoLegged, teams_per_group: compData.teamsPerGroup,
                    default_arena_id: isUuid(compData.defaultArenaId) ? compData.defaultArenaId : null, 
                    is_public: compData.isPublic, county: compData.county,
                    sport_id: isUuid(compData.sportId) ? compData.sportId : null, 
                    points_for_win: compData.pointsForWin,
                    points_for_tie_break_win: compData.pointsForTieBreakWin, public_config: compData.publicConfig
                };
        
                const { data: updatedData, error: updateError } = await supabase.from('competitions').update(updatePayload).eq('id', updatedComp.id).select();
                if (updateError) throw updateError;
                if (!updatedData || updatedData.length === 0) {
                    throw new Error("Update failed. This might be due to database permissions (RLS).");
                }
        
                const { data: currentTeamsInDB, error: fetchError } = await supabase.from('competition_teams').select('team_id').eq('competition_id', updatedComp.id);
                if(fetchError) throw fetchError;
                
                const currentTeamIdsInDB = currentTeamsInDB?.map(t => t.team_id) || [];
                const teamsToAdd = teamIds.filter(id => !currentTeamIdsInDB.includes(id));
                const teamsToRemove = currentTeamIdsInDB.filter(id => !teamIds.includes(id));
        
                if (teamsToAdd.length > 0) {
                    const { error } = await supabase.from('competition_teams').insert(teamsToAdd.map(team_id => ({ competition_id: updatedComp.id, team_id })));
                    if(error) console.error('[Supabase] Error adding teams to competition:', error);
                }
                if (teamsToRemove.length > 0) {
                    const { error } = await supabase.from('competition_teams').delete().in('team_id', teamsToRemove).eq('competition_id', updatedComp.id);
                    if(error) console.error('[Supabase] Error removing teams from competition:', error);
                }
            } catch(error) {
                 console.error('[Supabase] update competition error:', error);
                 alert(`Failed to update competition: ${(error as Error).message}`);
                 setCompetitions(originalState);
            }
        })();
    };

    const deleteCompetition = (id: string) => {
        const originalState = competitions;
        setCompetitions(prev => prev.filter(c => c.id !== id));
        logAction('Delete Competition', `Deleted competition ID: ${id}`);
    
        (async () => {
            try {
                const supabase = getSupabase();
                const { data, error } = await supabase.from('competitions').delete().match({ id }).select();
                if (error) throw error;
                if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
            } catch(error) {
                console.error('[Supabase] Error deleting competition:', error);
                alert(`Failed to delete competition: ${(error as Error).message}`);
                setCompetitions(originalState);
            }
        })();
    };
    
    // --- PLAYERS ---
    const addPlayer = async (data: Omit<Player, 'id' | 'stats' | 'photoUrl'> & { photoFile?: File | null }) => {
        const { photoFile, ...playerData } = data;
        const tempId = `player-${Date.now()}`;
        const newPlayerUI: Player = {
            id: tempId, stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
            photoUrl: photoFile ? URL.createObjectURL(photoFile) : `https://avatar.iran.liara.run/username?username=${playerData.name.replace(/\s/g, '+')}`,
            ...playerData
        };
        const originalState = players;
        playerUpdater.add(newPlayerUI);
        logAction('Add Player', `Added player: ${data.name}`);

        try {
            const { data: inserted, error } = await getSupabase().from('players').insert({
                name: newPlayerUI.name, team_id: newPlayerUI.teamId, cnp: newPlayerUI.cnp, 
                date_of_birth: newPlayerUI.dateOfBirth || null,
                registration_number: newPlayerUI.registrationNumber, 
                registration_date: newPlayerUI.registrationDate || null, 
                phone: newPlayerUI.phone,
                email: newPlayerUI.email, status: newPlayerUI.status, annual_visas: newPlayerUI.annualVisas,
                photo_url: newPlayerUI.photoUrl, stats: newPlayerUI.stats,
            }).select().single();
            if (error) throw error;
            setPlayers(prev => prev.map(p => p.id === tempId ? { ...p, id: inserted.id } : p));
        } catch (error) {
            playerUpdater.handleError(originalState, error, 'add');
        }
    };

    const updatePlayer = async (updatedPlayer: Player, photoFile?: File | null) => {
        let finalPlayer = { ...updatedPlayer };
        if (photoFile) finalPlayer.photoUrl = URL.createObjectURL(photoFile);
        const originalState = players;
        playerUpdater.update(finalPlayer);
        logAction('Update Player', `Updated player: ${finalPlayer.name}`);

        try {
            const { data, error } = await getSupabase().from('players').update({
                name: finalPlayer.name, team_id: finalPlayer.teamId, cnp: finalPlayer.cnp, 
                date_of_birth: finalPlayer.dateOfBirth || null,
                registration_number: finalPlayer.registrationNumber, 
                registration_date: finalPlayer.registrationDate || null,
                phone: finalPlayer.phone, email: finalPlayer.email, status: finalPlayer.status, annual_visas: finalPlayer.annualVisas,
                photo_url: finalPlayer.photoUrl, stats: finalPlayer.stats,
            }).eq('id', finalPlayer.id).select();

            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");

        } catch (error) {
            playerUpdater.handleError(originalState, error, 'update');
        }
    };

    const deletePlayer = async (id: string) => {
        const originalState = players;
        playerUpdater.delete(id);
        logAction('Delete Player', `Deleted player ID: ${id}`);
        try {
            const { data, error } = await getSupabase().from('players').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch (error) {
            playerUpdater.handleError(originalState, error, 'delete');
        }
    };
    
    // --- ARENAS ---
    const addArena = async (data: Omit<Arena, 'id'>) => {
        const tempId = `arena-${Date.now()}`;
        const newArena = { id: tempId, ...data };
        const originalState = arenas;
        arenaUpdater.add(newArena);
        try {
            const payload = {
                name: data.name, location: data.location, county: data.county,
                field_dimensions: data.fieldDimensions, goal_dimensions: data.goalDimensions,
                has_floodlights: data.hasFloodlights, spectator_capacity: data.spectatorCapacity,
                homologation_date: data.homologationDate || null, homologation_expiration: data.homologationExpiration || null
            };
            const { data: inserted, error } = await getSupabase().from('arenas').insert(payload).select().single();
            if (error) throw error;
            setArenas(prev => prev.map(a => a.id === tempId ? { ...a, id: inserted.id } : a));
        } catch (error) {
            arenaUpdater.handleError(originalState, error, 'add');
        }
    };
    const updateArena = async (arena: Arena) => {
        const originalState = arenas;
        arenaUpdater.update(arena);
        try {
            const payload = {
                name: arena.name, location: arena.location, county: arena.county,
                field_dimensions: arena.fieldDimensions, goal_dimensions: arena.goalDimensions,
                has_floodlights: arena.hasFloodlights, spectator_capacity: arena.spectatorCapacity,
                homologation_date: arena.homologationDate || null, homologation_expiration: arena.homologationExpiration || null
            };
            const { data, error } = await getSupabase().from('arenas').update(payload).eq('id', arena.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch (error) {
            arenaUpdater.handleError(originalState, error, 'update');
        }
    };
    const deleteArena = async (id: string) => {
        const originalState = arenas;
        arenaUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('arenas').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch (error) {
            arenaUpdater.handleError(originalState, error, 'delete');
        }
    };

    // --- SPORTS ---
    const addSport = async (data: { name: string; description: string; }) => {
        const tempId = `sport-${Date.now()}`;
        const newSport = { id: tempId, ...data };
        const originalState = sports;
        sportUpdater.add(newSport);
        try {
            const { data: inserted, error } = await getSupabase().from('sports').insert(data).select().single();
            if (error) throw error;
            setSports(prev => prev.map(s => s.id === tempId ? { ...s, id: inserted.id } : s));
        } catch (error) {
            sportUpdater.handleError(originalState, error, 'add');
        }
    };
    const updateSport = async (sport: Sport) => {
        const originalState = sports;
        sportUpdater.update(sport);
        try {
            const { data, error } = await getSupabase().from('sports').update({ name: sport.name, description: sport.description }).eq('id', sport.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch (error) {
            sportUpdater.handleError(originalState, error, 'update');
        }
    };
    const deleteSport = async (id: string) => {
        const originalState = sports;
        sportUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('sports').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch (error) {
            sportUpdater.handleError(originalState, error, 'delete');
        }
    };
    
    // --- REFEREES ---
    const addReferee = async (data: Omit<Referee, 'id' | 'photoUrl'> & { photoFile?: File | null }) => {
        const { photoFile, ...refereeData } = data;
        const tempId = `ref-${Date.now()}`;
        const newReferee: Referee = {
            id: tempId,
            photoUrl: photoFile ? URL.createObjectURL(photoFile) : `https://avatar.iran.liara.run/username?username=${refereeData.name.replace(/\s/g, '+')}`,
            ...refereeData
        };
        const originalState = referees;
        refereeUpdater.add(newReferee);
        try {
            const payload = {
                name: refereeData.name, county: refereeData.county, city: refereeData.city,
                phone: refereeData.phone, email: refereeData.email, category: refereeData.category,
                date_of_birth: refereeData.dateOfBirth || null, photo_url: newReferee.photoUrl
            };
            const { data: inserted, error } = await getSupabase().from('referees').insert(payload).select().single();
            if (error) throw error;
            setReferees(prev => prev.map(r => r.id === tempId ? { ...r, id: inserted.id } : r));
        } catch (error) {
            refereeUpdater.handleError(originalState, error, 'add');
        }
    };
    const updateReferee = async (referee: Referee, photoFile?: File | null) => {
        let finalReferee = { ...referee };
        if (photoFile) finalReferee.photoUrl = URL.createObjectURL(photoFile);
        const originalState = referees;
        refereeUpdater.update(finalReferee);
        try {
            const payload = {
                name: finalReferee.name, county: finalReferee.county, city: finalReferee.city,
                phone: finalReferee.phone, email: finalReferee.email, category: finalReferee.category,
                date_of_birth: finalReferee.dateOfBirth || null, photo_url: finalReferee.photoUrl
            };
            const { data, error } = await getSupabase().from('referees').update(payload).eq('id', finalReferee.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch (error) {
            refereeUpdater.handleError(originalState, error, 'update');
        }
    };
    const deleteReferee = async (id: string) => {
        const originalState = referees;
        refereeUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('referees').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch (error) {
            refereeUpdater.handleError(originalState, error, 'delete');
        }
    };
    
    // --- OBSERVERS ---
    const addObserver = async (data: Omit<Observer, 'id' | 'photoUrl'> & { photoFile?: File | null }) => {
        const { photoFile, ...observerData } = data;
        const tempId = `obs-${Date.now()}`;
        const newObserver: Observer = {
            id: tempId,
            photoUrl: photoFile ? URL.createObjectURL(photoFile) : `https://avatar.iran.liara.run/username?username=${observerData.name.replace(/\s/g, '+')}`,
            ...observerData
        };
        const originalState = observers;
        observerUpdater.add(newObserver);
        try {
            const payload = {
                name: observerData.name, county: observerData.county, city: observerData.city,
                phone: observerData.phone, email: observerData.email, category: observerData.category,
                date_of_birth: observerData.dateOfBirth || null, photo_url: newObserver.photoUrl
            };
            const { data: inserted, error } = await getSupabase().from('observers').insert(payload).select().single();
            if (error) throw error;
            setObservers(prev => prev.map(o => o.id === tempId ? { ...o, id: inserted.id } : o));
        } catch (error) {
            observerUpdater.handleError(originalState, error, 'add');
        }
    };
    const updateObserver = async (observer: Observer, photoFile?: File | null) => {
        let finalObserver = { ...observer };
        if (photoFile) finalObserver.photoUrl = URL.createObjectURL(photoFile);
        const originalState = observers;
        observerUpdater.update(finalObserver);
        try {
            const payload = {
                name: finalObserver.name, county: finalObserver.county, city: finalObserver.city,
                phone: finalObserver.phone, email: finalObserver.email, category: finalObserver.category,
                date_of_birth: finalObserver.dateOfBirth || null, photo_url: finalObserver.photoUrl
            };
            const { data, error } = await getSupabase().from('observers').update(payload).eq('id', finalObserver.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch (error) {
            observerUpdater.handleError(originalState, error, 'update');
        }
    };
    const deleteObserver = async (id: string) => {
        const originalState = observers;
        observerUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('observers').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch (error) {
            observerUpdater.handleError(originalState, error, 'delete');
        }
    };

    // --- SANCTIONS ---
    const addSanction = async (data: Omit<Sanction, 'id'>) => {
        const tempId = `sanction-${Date.now()}`;
        const newSanction = { id: tempId, ...data };
        const originalState = sanctions;
        sanctionUpdater.add(newSanction);
        try {
            const { data: inserted, error } = await getSupabase().from('sanctions').insert({ ...data, team_id: data.teamId, player_id: data.playerId }).select().single();
            if (error) throw error;
            setSanctions(prev => prev.map(s => s.id === tempId ? { ...s, id: inserted.id } : s));
        } catch (error) {
            sanctionUpdater.handleError(originalState, error, 'add');
        }
    };
    const updateSanction = async (sanction: Sanction) => {
        const originalState = sanctions;
        sanctionUpdater.update(sanction);
        try {
            const { data, error } = await getSupabase().from('sanctions').update({ ...sanction, team_id: sanction.teamId, player_id: sanction.playerId }).eq('id', sanction.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch(error) {
            sanctionUpdater.handleError(originalState, error, 'update');
        }
    };
    const deleteSanction = async (id: string) => {
        const originalState = sanctions;
        sanctionUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('sanctions').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch(error) {
            sanctionUpdater.handleError(originalState, error, 'delete');
        }
    };

    // --- TRANSFERS ---
    const addTransfer = async (data: Omit<Transfer, 'id'>) => {
        const tempId = `transfer-${Date.now()}`;
        const newTransfer = { id: tempId, ...data };
        const originalState = transfers;
        transferUpdater.add(newTransfer);
        setPlayers(prev => prev.map(p => p.id === data.playerId ? {...p, teamId: data.toTeamId} : p)); // Optimistic player team update
        try {
            const { data: inserted, error } = await getSupabase().from('transfers').insert({ ...data, player_id: data.playerId, from_team_id: data.fromTeamId, to_team_id: data.toTeamId }).select().single();
            if (error) throw error;
            setTransfers(prev => prev.map(t => t.id === tempId ? { ...t, id: inserted.id } : t));
            // Also update the player's team in the DB
            await getSupabase().from('players').update({ team_id: data.toTeamId }).eq('id', data.playerId);
        } catch (error) {
            transferUpdater.handleError(originalState, error, 'add');
            // Revert player team update on error
            setPlayers(prev => prev.map(p => p.id === data.playerId ? {...p, teamId: data.fromTeamId} : p));
        }
    };
    const updateTransfer = async (transfer: Transfer) => {
        // This is complex because it might involve changing a player's team. For now, a simple update.
        const originalState = transfers;
        transferUpdater.update(transfer);
        try {
            const { data, error } = await getSupabase().from('transfers').update({ ...transfer, player_id: transfer.playerId, from_team_id: transfer.fromTeamId, to_team_id: transfer.toTeamId }).eq('id', transfer.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch(error) {
            transferUpdater.handleError(originalState, error, 'update');
        }
    };
    const deleteTransfer = async (id: string) => {
        const originalState = transfers;
        transferUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('transfers').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch(error) {
            transferUpdater.handleError(originalState, error, 'delete');
        }
    };

    // --- PLAYER REGISTRATIONS ---
    const addPlayerRegistration = async (data: Omit<PlayerRegistration, 'id'>) => {
        const tempId = `reg-${Date.now()}`;
        const newReg = { id: tempId, ...data };
        const originalState = playerRegistrations;
        registrationUpdater.add(newReg);
        try {
            const { data: inserted, error } = await getSupabase().from('player_registrations').insert({ ...data, player_id: data.playerId, registration_number: data.registrationNumber, valid_from: data.validFrom, valid_until: data.validUntil }).select().single();
            if (error) throw error;
            setPlayerRegistrations(prev => prev.map(r => r.id === tempId ? { ...r, id: inserted.id } : r));
        } catch(error) {
            registrationUpdater.handleError(originalState, error, 'add');
        }
    };
    const updatePlayerRegistration = async (reg: PlayerRegistration) => {
        const originalState = playerRegistrations;
        registrationUpdater.update(reg);
        try {
            const { data, error } = await getSupabase().from('player_registrations').update({ ...reg, player_id: reg.playerId, registration_number: reg.registrationNumber, valid_from: reg.validFrom, valid_until: reg.validUntil }).eq('id', reg.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch(error) {
            registrationUpdater.handleError(originalState, error, 'update');
        }
    };
    const deletePlayerRegistration = async (id: string) => {
        const originalState = playerRegistrations;
        registrationUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('player_registrations').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch(error) {
            registrationUpdater.handleError(originalState, error, 'delete');
        }
    };

    // --- ARTICLES ---
    const addArticle = async (data: Omit<Article, 'id' | 'featuredImageUrl' | 'author' | 'createdAt'>, imageFile: File | null) => {
        const tempId = `art-${Date.now()}`;
        const newArticle: Article = {
            id: tempId,
            featuredImageUrl: imageFile ? URL.createObjectURL(imageFile) : 'https://picsum.photos/seed/article/800/400',
            author: currentUser?.name || 'Admin',
            createdAt: new Date().toISOString(),
            ...data
        };
        const originalState = articles;
        articleUpdater.add(newArticle);
        try {
            const { error, data: inserted } = await getSupabase().from('articles').insert({ 
                competition_id: newArticle.competitionId, title: newArticle.title, content: newArticle.content,
                featured_image_url: newArticle.featuredImageUrl, author: newArticle.author, status: newArticle.status
            }).select().single();
            if (error) throw error;
            setArticles(prev => prev.map(a => a.id === tempId ? { ...a, id: inserted.id } : a));
        } catch (error) {
            articleUpdater.handleError(originalState, error, 'add');
        }
    };
    const updateArticle = async (article: Article, imageFile: File | null) => {
        let finalArticle = { ...article };
        if (imageFile) finalArticle.featuredImageUrl = URL.createObjectURL(imageFile);
        const originalState = articles;
        articleUpdater.update(finalArticle);
        try {
            const { data, error } = await getSupabase().from('articles').update({ 
                title: finalArticle.title, content: finalArticle.content,
                featured_image_url: finalArticle.featuredImageUrl, status: finalArticle.status
            }).eq('id', finalArticle.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch (error) {
            articleUpdater.handleError(originalState, error, 'update');
        }
    };
    const deleteArticle = async (id: string) => {
        const originalState = articles;
        articleUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('articles').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch (error) {
            articleUpdater.handleError(originalState, error, 'delete');
        }
    };

    // --- GALLERIES ---
    const addGallery = async (data: Omit<Gallery, 'id'>) => {
        const tempId = `gal-${Date.now()}`;
        const newGallery = { id: tempId, ...data };
        const originalState = galleries;
        galleryUpdater.add(newGallery);
        try {
            const { data: inserted, error } = await getSupabase().from('galleries').insert({ 
                competition_id: newGallery.competitionId, title: newGallery.title, image_ids: newGallery.imageIds 
            }).select().single();
            if (error) throw error;
            setGalleries(prev => prev.map(g => g.id === tempId ? { ...g, id: inserted.id } : g));
        } catch (error) {
            galleryUpdater.handleError(originalState, error, 'add');
        }
    };
    const updateGallery = async (gallery: Gallery) => {
        const originalState = galleries;
        galleryUpdater.update(gallery);
        try {
            const { data, error } = await getSupabase().from('galleries').update({ 
                title: gallery.title, image_ids: gallery.imageIds 
            }).eq('id', gallery.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch (error) {
            galleryUpdater.handleError(originalState, error, 'update');
        }
    };
    const deleteGallery = async (id: string) => {
        const originalState = galleries;
        galleryUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('galleries').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch (error) {
            galleryUpdater.handleError(originalState, error, 'delete');
        }
    };

    // --- SPONSORS ---
    const addSponsor = async (data: Omit<Sponsor, 'id'|'logoUrl'>, logoFile?: File | null) => {
        const tempId = `spn-${Date.now()}`;
        const newSponsor: Sponsor = {
            id: tempId,
            logoUrl: logoFile ? URL.createObjectURL(logoFile) : 'https://picsum.photos/seed/sponsor/200/100',
            ...data
        };
        const originalState = sponsors;
        sponsorUpdater.add(newSponsor);
        try {
            const { data: inserted, error } = await getSupabase().from('sponsors').insert({ 
                competition_id: newSponsor.competitionId, name: newSponsor.name, 
                website_url: newSponsor.websiteUrl, logo_url: newSponsor.logoUrl
            }).select().single();
            if (error) throw error;
            setSponsors(prev => prev.map(s => s.id === tempId ? { ...s, id: inserted.id } : s));
        } catch (error) {
            sponsorUpdater.handleError(originalState, error, 'add');
        }
    };
    const updateSponsor = async (sponsor: Sponsor, logoFile?: File | null) => {
        let finalSponsor = { ...sponsor };
        if (logoFile) finalSponsor.logoUrl = URL.createObjectURL(logoFile);
        const originalState = sponsors;
        sponsorUpdater.update(finalSponsor);
        try {
            const { data, error } = await getSupabase().from('sponsors').update({ 
                name: finalSponsor.name, website_url: finalSponsor.websiteUrl, logo_url: finalSponsor.logoUrl
            }).eq('id', finalSponsor.id).select();
            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed. This might be due to database permissions (RLS).");
        } catch (error) {
            sponsorUpdater.handleError(originalState, error, 'update');
        }
    };
    const deleteSponsor = async (id: string) => {
        const originalState = sponsors;
        sponsorUpdater.delete(id);
        try {
            const { data, error } = await getSupabase().from('sponsors').delete().eq('id', id).select();
            if (error) throw error;
            if (data.length === 0) throw new Error("Delete failed. This might be due to database permissions (RLS).");
        } catch (error) {
            sponsorUpdater.handleError(originalState, error, 'delete');
        }
    };

    // --- OTHER ---
    const uploadImage = (competitionId: string, file: File) => {
        const newImage: MediaImage = { id: `img-${Date.now()}`, competitionId, url: URL.createObjectURL(file) };
        setMediaImages(prev => [newImage, ...prev]);
    };
    const deleteImage = (id: string) => {
        setMediaImages(prev => prev.filter(img => img.id !== id));
        setGalleries(prev => prev.map(g => ({...g, imageIds: g.imageIds.filter(imgId => imgId !== id) })));
    };
    

    const getCompetitionById = useCallback((id: string) => competitions.find(c => c.id === id), [competitions]);
    const getMatchById = useCallback((id: string) => matches.find(m => m.id === id), [matches]);
    const getArticleById = useCallback((id: string) => articles.find(a => a.id === id), [articles]);
    const getGalleryById = useCallback((id: string) => galleries.find(g => g.id === id), [galleries]);

    const updateMatch = (updatedMatch: Match) => {
        setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
        if (updatedMatch.events.length > (matches.find(m=>m.id === updatedMatch.id)?.events.length ?? 0)) {
            logAction('Update Match', `Event added to ${updatedMatch.homeTeam.name} vs ${updatedMatch.awayTeam.name}`);
        }
    };
    
    const addTeamToCompetition = (competitionId: string, teamId: string) => {
        const originalCompetitions = competitions;
        setCompetitions(prev => prev.map(c => c.id === competitionId ? { ...c, teamIds: [...c.teamIds, teamId] } : c));
        (async () => {
            const supabase = getSupabase();
            const { error } = await supabase.from('competition_teams').insert({ competition_id: competitionId, team_id: teamId });
            if (error) {
                console.error('[Supabase] Error adding team to competition:', error);
                setCompetitions(originalCompetitions);
            }
        })();
    };

    const updateOrganizationSettings = (settings: OrganizationSettings, logoFile?: File | null) => {
        if (logoFile) {
            settings.logoUrl = URL.createObjectURL(logoFile);
        }
        setOrganizationSettings(settings);
        logAction('Update Settings', 'Updated organization settings');
    };
    
    const setCurrentUser = (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) setCurrentUserState(user);
    };

    const inviteUser = (email: string, roleId: string) => {
        const newUser: User = { id: `user-${Date.now()}`, name: email.split('@')[0], email, roleId, status: 'PENDING' };
        setUsers(prev => [...prev, newUser]);
        logAction('Invite User', `Invited user: ${email}`);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        logAction('Update User', `Updated user: ${updatedUser.name}`);
    };
    
    const deleteUser = (id: string) => {
        const userName = users.find(u => u.id === id)?.name || 'Unknown';
        setUsers(prev => prev.filter(u => u.id !== id));
        logAction('Delete User', `Deleted user: ${userName}`);
    };
    
    const addRole = (data: Omit<Role, 'id'>) => {
        const newRole: Role = { id: `role-${Date.now()}`, ...data };
        setRoles(prev => [...prev, newRole]);
        logAction('Create Role', `Created role: ${data.name}`);
    };

    const updateRole = (updatedRole: Role) => {
        setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
        logAction('Update Role', `Updated role: ${updatedRole.name}`);
    };

    const deleteRole = (id: string) => {
        const roleName = roles.find(r => r.id === id)?.name || 'Unknown';
        setRoles(prev => prev.filter(r => r.id !== id));
        logAction('Delete Role', `Deleted role: ${roleName}`);
    };
    
    const getTransfersByPlayerId = (playerId: string) => transfers.filter(t => t.playerId === playerId);
    const getPlayerRegistrationsByPlayerId = (playerId: string) => playerRegistrations.filter(pr => pr.playerId === playerId);

    const calculateStandings = (competitionId: string): Standing[] => {
        const competition = competitions.find(c => c.id === competitionId);
        if (!competition) return [];
        const competitionMatches = matches.filter(m => m.competitionId === competitionId && m.status === 'Finished');
        const standingsMap: { [teamId: string]: Standing } = {};

        competition.teamIds.forEach(teamId => {
            const team = teams.find(t => t.id === teamId);
            if (team) {
                standingsMap[teamId] = {
                    teamId, teamName: team.name, logoUrl: team.logoUrl, played: 0, wins: 0, losses: 0, draws: 0,
                    goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0
                };
            }
        });

        competitionMatches.forEach(match => {
            const home = standingsMap[match.homeTeam.id];
            const away = standingsMap[match.awayTeam.id];
            if (!home || !away) return;

            home.played++; away.played++;
            home.goalsFor += match.homeScore; away.goalsFor += match.awayScore;
            home.goalsAgainst += match.awayScore; away.goalsAgainst += match.homeScore;

            if (match.homeScore > match.awayScore) {
                home.wins++; away.losses++; home.points += competition.pointsForWin || 3;
            } else if (match.awayScore > match.homeScore) {
                away.wins++; home.losses++; away.points += competition.pointsForWin || 3;
            } else {
                home.draws++; away.draws++; home.points++; away.points++;
            }
        });

        return Object.values(standingsMap).map(s => ({...s, goalDifference: s.goalsFor - s.goalsAgainst}))
            .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
    };
    
    const generateBergerSchedule = (competitionId: string) => {
        const competition = competitions.find(c => c.id === competitionId);
        if (!competition) return;
        
        const competitionTeams = teams.filter(t => competition.teamIds.includes(t.id));
        const schedule = generateBergerTable(competitionTeams);
        
        const newMatches: Match[] = [];
        let date = new Date();
        
        schedule.forEach((round, roundIndex) => {
            date.setDate(date.getDate() + 7);
            round.forEach(pairing => {
                if (pairing.home.id !== 'bye' && pairing.away.id !== 'bye') {
                    newMatches.push({
                        id: `match-${competitionId}-${pairing.home.id}-${pairing.away.id}`,
                        competitionId, homeTeam: pairing.home as Team, awayTeam: pairing.away as Team,
                        homeScore: 0, awayScore: 0, date: new Date(date).toISOString(), status: 'Not Started',
                        events: [], stage: `Round ${roundIndex + 1}`
                    });
                }
            });
        });
        setMatches(prev => [...prev.filter(m => m.competitionId !== competitionId), ...newMatches]);
        logAction('Generate Schedule', `Generated schedule for ${competition.name}`);
    };

    const updateCompetitionPublicConfig = (competitionId: string, config: PublicConfig, logoFile?: File | null) => {
        if (logoFile) config.logoUrl = URL.createObjectURL(logoFile);
        setCompetitions(prev => prev.map(c => c.id === competitionId ? {...c, publicConfig: config} : c));
    };
    
    const updateCompetitionRegulation = (competitionId: string, regulation: any) => {
        setCompetitions(prev => prev.map(c => {
            if (c.id === competitionId && c.publicConfig) {
                const regs = c.publicConfig.regulations;
                const regIndex = regs.findIndex(r => r.id === regulation.id);
                if (regIndex > -1) regs[regIndex] = regulation;
                else regs.push(regulation);
                return {...c, publicConfig: {...c.publicConfig, regulations: regs }};
            }
            return c;
        }));
    };

    const updatePortalConfig = (config: PortalConfig, logoFile?: File | null) => {
        if (logoFile) config.logoUrl = URL.createObjectURL(logoFile);
        setPortalConfig(config);
    };
    
    const addPlayerToSquad = (playerId: string) => {
        if (!nationalSquad.some(p => p.playerId === playerId)) {
            const newSquadPlayer: NationalSquadPlayer = { playerId, caps: 0, goals: 0 };
            setNationalSquad(prev => [...prev, newSquadPlayer]);
            logAction('National Team', `Added player ${players.find(p=>p.id === playerId)?.name} to squad.`);
        }
    };
    
    const removePlayerFromSquad = (playerId: string) => {
        setNationalSquad(prev => prev.filter(p => p.playerId !== playerId));
        logAction('National Team', `Removed player ${players.find(p=>p.id === playerId)?.name} from squad.`);
    };
    
    const addComment = (data: { articleId: string, author: string, content: string }) => {
        const newComment: Comment = { id: `comment-${Date.now()}`, createdAt: new Date().toISOString(), ...data };
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        try {
            localStorage.setItem('futbalito_comments', JSON.stringify(updatedComments));
        } catch (error) {
            console.error("Failed to save comments to localStorage", error);
        }
    };

    const value = {
        teams, addTeam, updateTeam, deleteTeam,
        competitions, getCompetitionById, addCompetition, updateCompetition, deleteCompetition, addTeamToCompetition,
        matches, getMatchById, updateMatch, generateBergerSchedule,
        players, addPlayer, updatePlayer, deletePlayer, getTransfersByPlayerId, getPlayerRegistrationsByPlayerId,
        organizationSettings, updateOrganizationSettings,
        currentUser, users, setCurrentUser, inviteUser, updateUser, deleteUser,
        roles, addRole, updateRole, deleteRole,
        invoices, auditLog,
        counties,
        arenas, addArena, updateArena, deleteArena,
        sports, addSport, updateSport, deleteSport,
        sanctions, addSanction, updateSanction, deleteSanction,
        referees, addReferee, updateReferee, deleteReferee,
        observers, addObserver, updateObserver, deleteObserver,
        calculateStandings,
        articles, getArticleById, addArticle, updateArticle, deleteArticle,
        mediaImages, uploadImage, deleteImage,
        galleries, getGalleryById, addGallery, updateGallery, deleteGallery,
        sponsors, addSponsor, updateSponsor, deleteSponsor,
        updateCompetitionPublicConfig, updateCompetitionRegulation,
        portalConfig, updatePortalConfig,
        transfers, addTransfer, updateTransfer, deleteTransfer,
        playerRegistrations, addPlayerRegistration, updatePlayerRegistration, deletePlayerRegistration,
        nationalTeam, nationalSquad, addPlayerToSquad, removePlayerFromSquad,
        comments, addComment,
    };

    return (
        <CompetitionContext.Provider value={value}>
            {children}
        </CompetitionContext.Provider>
    );
};

export const useCompetitions = (): CompetitionContextType => {
    const context = useContext(CompetitionContext);
    if (context === undefined) {
        throw new Error('useCompetitions must be used within a CompetitionProvider');
    }
    return context;
};