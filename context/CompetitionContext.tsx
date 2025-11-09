import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { 
    Team, Competition, Match, Player, OrganizationSettings, User, Role,
    Invoice, AuditLog, County, Arena, Sanction, Referee, Observer, Sport,
    Article, MediaImage, Gallery, Sponsor, Transfer, PlayerRegistration,
    Standing, PortalConfig, PublicConfig, NationalTeam, NationalSquadPlayer, Comment
} from '../types.ts';
import { 
    mockMatches, mockPlayers, mockOrganizationSettings,
    mockUsers, mockRoles, mockInvoices, mockAuditLog, mockCounties, mockArenas,
    mockSanctions, mockReferees, mockObservers, mockSports, mockArticles, mockMediaImages,
    mockGalleries, mockSponsors, mockTransfers, mockPlayerRegistrations, mockPortalConfig,
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
    addCounty: (data: { name: string }) => void;
    updateCounty: (county: County) => void;
    deleteCounty: (id: string) => void;
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

export const CompetitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // All state managed here
    const [teams, setTeams] = useState<Team[]>([]);
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [matches, setMatches] = useState<Match[]>([...mockMatches, ...MOCK_INTERNATIONAL_MATCHES]);
    const [players, setPlayers] = useState<Player[]>(mockPlayers);
    const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(mockOrganizationSettings);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [currentUser, setCurrentUserState] = useState<User | null>(mockUsers[0]);
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [invoices] = useState<Invoice[]>(mockInvoices);
    const [auditLog, setAuditLog] = useState<AuditLog[]>(mockAuditLog);
    const [counties, setCounties] = useState<County[]>(mockCounties);
    const [arenas, setArenas] = useState<Arena[]>(mockArenas);
    const [sports, setSports] = useState<Sport[]>(mockSports);
    const [sanctions, setSanctions] = useState<Sanction[]>(mockSanctions);
    const [referees, setReferees] = useState<Referee[]>(mockReferees);
    const [observers, setObservers] = useState<Observer[]>(mockObservers);
    const [articles, setArticles] = useState<Article[]>(mockArticles);
    const [mediaImages, setMediaImages] = useState<MediaImage[]>(mockMediaImages);
    const [galleries, setGalleries] = useState<Gallery[]>(mockGalleries);
    const [sponsors, setSponsors] = useState<Sponsor[]>(mockSponsors);
    const [portalConfig, setPortalConfig] = useState<PortalConfig>(mockPortalConfig);
    const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
    const [playerRegistrations, setPlayerRegistrations] = useState<PlayerRegistration[]>(mockPlayerRegistrations);
    const [nationalTeam] = useState<NationalTeam>(MOCK_NATIONAL_TEAM);
    const [nationalSquad, setNationalSquad] = useState<NationalSquadPlayer[]>(MOCK_NATIONAL_SQUAD);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        let isMounted = true;
    
        const fetchInitialData = async () => {
            const supabase = getSupabase();
            
            // Fetch Competitions
            const { data: competitionsData, error: competitionsError } = await supabase
                .from('competitions')
                .select('*, competition_teams(team_id)')
                .order('created_at', { ascending: false });
    
            if (competitionsError) {
                console.error('[Supabase] Error fetching competitions:', competitionsError);
            } else if (isMounted) {
                const normalizedCompetitions = (competitionsData ?? []).map((row: any) => ({
                    id: row.id,
                    name: row.name,
                    season: row.season,
                    logoUrl: row.logo_url ?? '',
                    status: row.status ?? 'Upcoming',
                    format: row.format ?? 'league',
                    twoLegged: row.two_legged ?? false,
                    teamsPerGroup: row.teams_per_group ?? 4,
                    defaultArenaId: row.default_arena_id ?? undefined,
                    isPublic: row.is_public ?? false,
                    county: row.county ?? undefined,
                    sportId: row.sport_id ?? undefined,
                    pointsForWin: row.points_for_win ?? 3,
                    pointsForTieBreakWin: row.points_for_tie_break_win ?? 2,
                    publicConfig: row.public_config ?? {},
                    teamIds: row.competition_teams ? row.competition_teams.map((ct: { team_id: string }) => ct.team_id) : [],
                }));
                setCompetitions(normalizedCompetitions as Competition[]);
            }

            // Fetch Teams
            const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*').order('name');
            if(teamsError) {
                console.error('[Supabase] Error fetching teams:', teamsError);
            } else if (isMounted) {
                setTeams(teamsData as Team[]);
            }
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
    
    // Simple CRUD operations
    const addTeam = (data: Omit<Team, 'id' | 'logoUrl'> & { logoFile?: File | null }) => {
        const { logoFile, ...rest } = data;
        const newTeam: Team = {
            id: `team-${Date.now()}`,
            logoUrl: logoFile ? URL.createObjectURL(logoFile) : `https://picsum.photos/seed/${Date.now()}/200`,
            ...rest
        };
        setTeams(prev => [...prev, newTeam]);
        logAction('Create Team', `Created team: ${data.name}`);
    };

    const updateTeam = (updatedTeam: Team, logoFile?: File | null) => {
        let finalTeam = { ...updatedTeam };
        if (logoFile) {
            finalTeam.logoUrl = URL.createObjectURL(logoFile);
        }
        setTeams(prev => prev.map(t => t.id === finalTeam.id ? finalTeam : t));
        logAction('Update Team', `Updated team: ${finalTeam.name}`);
    };

    const deleteTeam = (id: string) => {
        const teamName = teams.find(t=> t.id === id)?.name || 'Unknown';
        setTeams(prev => prev.filter(t => t.id !== id));
        logAction('Delete Team', `Deleted team: ${teamName} (ID: ${id})`);
    };

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
                    name: newCompUI.name,
                    season: (newCompUI as any).season ?? String(new Date().getFullYear()),
                    logo_url: newCompUI.logoUrl,
                    status: newCompUI.status,
                    format: (newCompUI as any).format,
                    two_legged: (newCompUI as any).twoLegged,
                    teams_per_group: (newCompUI as any).teamsPerGroup,
                    default_arena_id: isUuid((newCompUI as any).defaultArenaId) ? (newCompUI as any).defaultArenaId : null,
                    is_public: (newCompUI as any).isPublic,
                    county: (newCompUI as any).county,
                    sport_id: isUuid((newCompUI as any).sportId) ? (newCompUI as any).sportId : null,
                    points_for_win: (newCompUI as any).pointsForWin,
                    points_for_tie_break_win: (newCompUI as any).pointsForTieBreakWin,
                    public_config: {},
                };
    
                const { data: inserted, error: insertError } = await supabase
                    .from('competitions')
                    .insert(insertPayload)
                    .select('*')
                    .single();
    
                if (insertError) {
                    console.error('[Supabase] insert competition error:', insertError);
                    alert(`Failed to save competition: ${insertError.message}\n\nHint: Check if the 'competitions' table has an INSERT policy enabled in Supabase for all users.`);
                    setCompetitions(prev => prev.filter(c => c.id !== tempId)); // Revert optimistic update
                    return;
                }
    
                if (inserted && initialTeamIds && initialTeamIds.length > 0) {
                    const competitionTeamsPayload = initialTeamIds.map(teamId => ({
                        competition_id: inserted.id,
                        team_id: teamId,
                    }));
                    const { error: joinError } = await supabase.from('competition_teams').insert(competitionTeamsPayload);
                    if (joinError) {
                        console.error('[Supabase] insert competition_teams error:', joinError);
                        alert(`Competition was created, but failed to add teams: ${joinError.message}\n\nHint: Check if the 'competition_teams' table has an INSERT policy enabled in Supabase for all users.`);
                    }
                }
    
                setCompetitions(prev => prev.map(c => c.id === tempId ? { ...c, id: inserted.id, logoUrl: inserted.logo_url ?? c.logoUrl } : c));
            } catch (e: any) {
                console.error('[Supabase] unexpected insert error:', e);
                alert(`An unexpected error occurred: ${e.message}`);
                setCompetitions(prev => prev.filter(c => c.id !== tempId)); // Revert optimistic update
            }
        })();
    };
    
    const updateCompetition = (updatedComp: Competition) => {
        setCompetitions(prev => prev.map(c => c.id === updatedComp.id ? updatedComp : c));
        logAction('Update Competition', `Updated competition: ${updatedComp.name}`);
    
        (async () => {
            const supabase = getSupabase();
            const { teamIds, ...compData } = updatedComp;
            const updatePayload = {
                name: compData.name, season: compData.season, logo_url: compData.logoUrl, status: compData.status,
                format: compData.format, two_legged: compData.twoLegged, teams_per_group: compData.teamsPerGroup,
                default_arena_id: compData.defaultArenaId, is_public: compData.isPublic, county: compData.county,
                sport_id: compData.sportId, points_for_win: compData.pointsForWin,
                points_for_tie_break_win: compData.pointsForTieBreakWin, public_config: compData.publicConfig
            };
    
            const { error: updateError } = await supabase.from('competitions').update(updatePayload).match({ id: updatedComp.id });
            if (updateError) { console.error('[Supabase] update competition error:', updateError); return; }
    
            const { data: currentTeamsInDB, error: fetchError } = await supabase.from('competition_teams').select('team_id').eq('competition_id', updatedComp.id);
            if(fetchError) { console.error('[Supabase] fetch competition_teams error:', fetchError); return; }
            
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
        })();
    };

    const deleteCompetition = (id: string) => {
        const compName = competitions.find(c => c.id === id)?.name || 'Unknown';
        setCompetitions(prev => prev.filter(c => c.id !== id));
        logAction('Delete Competition', `Deleted competition: ${compName} (ID: ${id})`);
    
        (async () => {
            const supabase = getSupabase();
            const { error } = await supabase.from('competitions').delete().match({ id });
            if (error) {
                console.error('[Supabase] Error deleting competition:', error);
                alert('Failed to delete competition from the database. Please refresh.');
            }
        })();
    };

    const addPlayer = (data: Omit<Player, 'id' | 'stats' | 'photoUrl'> & { photoFile?: File | null }) => {
        const { photoFile, ...playerData } = data;
        const newPlayer: Player = {
            id: `player-${Date.now()}`,
            stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
            photoUrl: photoFile ? URL.createObjectURL(photoFile) : `https://avatar.iran.liara.run/username?username=${playerData.name.replace(/\s/g, '+')}`,
            ...playerData
        };
        setPlayers(prev => [...prev, newPlayer]);
        logAction('Add Player', `Added player: ${data.name}`);
    };

    const updatePlayer = (updatedPlayer: Player, photoFile?: File | null) => {
        let finalPlayer = { ...updatedPlayer };
        if (photoFile) {
            finalPlayer.photoUrl = URL.createObjectURL(photoFile);
        }
        setPlayers(prev => prev.map(p => p.id === finalPlayer.id ? finalPlayer : p));
        logAction('Update Player', `Updated player: ${finalPlayer.name}`);
    };

    const deletePlayer = (id: string) => {
        const playerName = players.find(p => p.id === id)?.name || 'Unknown';
        setPlayers(prev => prev.filter(p => p.id !== id));
        logAction('Delete Player', `Deleted player: ${playerName} (ID: ${id})`);
    };
    
    const getCompetitionById = useCallback((id: string) => competitions.find(c => c.id === id), [competitions]);
    const getMatchById = useCallback((id: string) => matches.find(m => m.id === id), [matches]);

    const updateMatch = (updatedMatch: Match) => {
        setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
        if (updatedMatch.events.length > (matches.find(m=>m.id === updatedMatch.id)?.events.length ?? 0)) {
            logAction('Update Match', `Event added to ${updatedMatch.homeTeam.name} vs ${updatedMatch.awayTeam.name}`);
        }
    };
    
    const addTeamToCompetition = (competitionId: string, teamId: string) => {
        setCompetitions(prev => prev.map(c => c.id === competitionId ? { ...c, teamIds: [...c.teamIds, teamId] } : c));
        (async () => {
            const supabase = getSupabase();
            const { error } = await supabase.from('competition_teams').insert({ competition_id: competitionId, team_id: teamId });
            if (error) {
                console.error('[Supabase] Error adding team to competition:', error);
                setCompetitions(prev => prev.map(c => c.id === competitionId ? { ...c, teamIds: c.teamIds.filter(id => id !== teamId) } : c));
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
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: email.split('@')[0],
            email,
            roleId,
            status: 'PENDING'
        };
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
    
    const addCounty = (data: { name: string }) => {
        setCounties(prev => [...prev, { id: `county-${Date.now()}`, ...data }]);
    };
    const updateCounty = (county: County) => {
        setCounties(prev => prev.map(c => c.id === county.id ? county : c));
    };
    const deleteCounty = (id: string) => {
        setCounties(prev => prev.filter(c => c.id !== id));
    };
    
    const addArena = (data: Omit<Arena, 'id'>) => {
        setArenas(prev => [...prev, { id: `arena-${Date.now()}`, ...data }]);
    };
    const updateArena = (arena: Arena) => {
        setArenas(prev => prev.map(a => a.id === arena.id ? arena : a));
    };
    const deleteArena = (id: string) => {
        setArenas(prev => prev.filter(a => a.id !== id));
    };
    
    const addSport = (data: { name: string; description: string; }) => {
        setSports(prev => [...prev, { id: `sport-${Date.now()}`, ...data }]);
    };
    const updateSport = (sport: Sport) => {
        setSports(prev => prev.map(s => s.id === sport.id ? sport : s));
    };
    const deleteSport = (id: string) => {
        setSports(prev => prev.filter(s => s.id !== id));
    };

    const addSanction = (data: Omit<Sanction, 'id'>) => {
        setSanctions(prev => [...prev, { id: `sanction-${Date.now()}`, ...data }]);
    };
    const updateSanction = (sanction: Sanction) => {
        setSanctions(prev => prev.map(s => s.id === sanction.id ? sanction : s));
    };
    const deleteSanction = (id: string) => {
        setSanctions(prev => prev.filter(s => s.id !== id));
    };

    const addReferee = (data: Omit<Referee, 'id' | 'photoUrl'> & { photoFile?: File | null }) => {
        const { photoFile, ...refereeData } = data;
        const newReferee: Referee = {
            id: `ref-${Date.now()}`,
            photoUrl: photoFile ? URL.createObjectURL(photoFile) : `https://avatar.iran.liara.run/username?username=${refereeData.name.replace(/\s/g, '+')}`,
            ...refereeData
        };
        setReferees(prev => [...prev, newReferee]);
        logAction('Add Referee', `Added referee: ${data.name}`);
    };
    
    const updateReferee = (updatedReferee: Referee, photoFile?: File | null) => {
        let finalReferee = { ...updatedReferee };
        if (photoFile) {
            finalReferee.photoUrl = URL.createObjectURL(photoFile);
        }
        setReferees(prev => prev.map(r => r.id === finalReferee.id ? finalReferee : r));
        logAction('Update Referee', `Updated referee: ${finalReferee.name}`);
    };

    const deleteReferee = (id: string) => setReferees(prev => prev.filter(r => r.id !== id));

    const addObserver = (data: Omit<Observer, 'id' | 'photoUrl'> & { photoFile?: File | null }) => {
        const { photoFile, ...observerData } = data;
        const newObserver: Observer = {
            id: `obs-${Date.now()}`,
            photoUrl: photoFile ? URL.createObjectURL(photoFile) : `https://avatar.iran.liara.run/username?username=${observerData.name.replace(/\s/g, '+')}`,
            ...observerData
        };
        setObservers(prev => [...prev, newObserver]);
        logAction('Add Observer', `Added observer: ${data.name}`);
    };
    const updateObserver = (updatedObserver: Observer, photoFile?: File | null) => {
        let finalObserver = { ...updatedObserver };
        if (photoFile) {
            finalObserver.photoUrl = URL.createObjectURL(photoFile);
        }
        setObservers(prev => prev.map(o => o.id === finalObserver.id ? finalObserver : o));
        logAction('Update Observer', `Updated observer: ${finalObserver.name}`);
    };
    const deleteObserver = (id: string) => {
        const observerName = observers.find(o => o.id === id)?.name || 'Unknown';
        setObservers(prev => prev.filter(o => o.id !== id));
        logAction('Delete Observer', `Deleted observer: ${observerName}`);
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
                home.wins++; away.losses++; home.points += 3;
            } else if (match.awayScore > match.homeScore) {
                away.wins++; home.losses++; away.points += 3;
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
            date.setDate(date.getDate() + 7); // Advance by one week for each round
            round.forEach(pairing => {
                if (pairing.home.id !== 'bye' && pairing.away.id !== 'bye') {
                    newMatches.push({
                        id: `match-${competitionId}-${pairing.home.id}-${pairing.away.id}`,
                        competitionId,
                        homeTeam: pairing.home as Team,
                        awayTeam: pairing.away as Team,
                        homeScore: 0,
                        awayScore: 0,
                        date: new Date(date).toISOString(),
                        status: 'Not Started',
                        events: [],
                        stage: `Round ${roundIndex + 1}`
                    });
                }
            });
        });
        
        setMatches(prev => [...prev.filter(m => m.competitionId !== competitionId), ...newMatches]);
        logAction('Generate Schedule', `Generated schedule for ${competition.name}`);
    };

    const getArticleById = (id: string) => articles.find(a => a.id === id);
    const addArticle = (data: Omit<Article, 'id' | 'featuredImageUrl' | 'author' | 'createdAt'>, imageFile: File | null) => {
        const newArticle: Article = {
            id: `art-${Date.now()}`,
            featuredImageUrl: imageFile ? URL.createObjectURL(imageFile) : 'https://picsum.photos/seed/article/800/400',
            author: currentUser?.name || 'Admin',
            createdAt: new Date().toISOString(),
            ...data
        };
        setArticles(prev => [...prev, newArticle]);
    };
    const updateArticle = (article: Article, imageFile: File | null) => {
        if (imageFile) {
            article.featuredImageUrl = URL.createObjectURL(imageFile);
        }
        setArticles(prev => prev.map(a => a.id === article.id ? article : a));
    };
    const deleteArticle = (id: string) => setArticles(prev => prev.filter(a => a.id !== id));

    const uploadImage = (competitionId: string, file: File) => {
        const newImage: MediaImage = {
            id: `img-${Date.now()}`,
            competitionId,
            url: URL.createObjectURL(file)
        };
        setMediaImages(prev => [newImage, ...prev]);
    };
    const deleteImage = (id: string) => {
        setMediaImages(prev => prev.filter(img => img.id !== id));
        setGalleries(prev => prev.map(g => ({...g, imageIds: g.imageIds.filter(imgId => imgId !== id) })));
    };
    
    const getGalleryById = (id: string) => galleries.find(g => g.id === id);
    const addGallery = (data: Omit<Gallery, 'id'>) => {
        const newGallery: Gallery = { id: `gal-${Date.now()}`, ...data };
        setGalleries(prev => [...prev, newGallery]);
    };
    const updateGallery = (gallery: Gallery) => {
        setGalleries(prev => prev.map(g => g.id === gallery.id ? gallery : g));
    };
    const deleteGallery = (id: string) => setGalleries(prev => prev.filter(g => g.id !== id));
    
    const addSponsor = (data: Omit<Sponsor, 'id'|'logoUrl'>, logoFile?: File | null) => {
        const newSponsor: Sponsor = {
            id: `spn-${Date.now()}`,
            logoUrl: logoFile ? URL.createObjectURL(logoFile) : 'https://picsum.photos/seed/sponsor/200/100',
            ...data
        };
        setSponsors(prev => [...prev, newSponsor]);
    };
    const updateSponsor = (sponsor: Sponsor, logoFile?: File | null) => {
        if (logoFile) {
            sponsor.logoUrl = URL.createObjectURL(logoFile);
        }
        setSponsors(prev => prev.map(s => s.id === sponsor.id ? sponsor : s));
    };
    const deleteSponsor = (id: string) => setSponsors(prev => prev.filter(s => s.id !== id));

    const updateCompetitionPublicConfig = (competitionId: string, config: PublicConfig, logoFile?: File | null) => {
        if (logoFile) {
            config.logoUrl = URL.createObjectURL(logoFile);
        }
        setCompetitions(prev => prev.map(c => c.id === competitionId ? {...c, publicConfig: config} : c));
    };
    
    const updateCompetitionRegulation = (competitionId: string, regulation: any) => {
        setCompetitions(prev => prev.map(c => {
            if (c.id === competitionId && c.publicConfig) {
                const regs = c.publicConfig.regulations;
                const regIndex = regs.findIndex(r => r.id === regulation.id);
                if (regIndex > -1) {
                    regs[regIndex] = regulation;
                } else {
                    regs.push(regulation);
                }
                return {...c, publicConfig: {...c.publicConfig, regulations: regs }};
            }
            return c;
        }));
    };

    const updatePortalConfig = (config: PortalConfig, logoFile?: File | null) => {
        if (logoFile) {
            config.logoUrl = URL.createObjectURL(logoFile);
        }
        setPortalConfig(config);
    };
    
    const addTransfer = (data: Omit<Transfer, 'id'>) => {
        setTransfers(prev => [...prev, { id: `trn-${Date.now()}`, ...data }]);
        setPlayers(prev => prev.map(p => p.id === data.playerId ? {...p, teamId: data.toTeamId} : p));
    };
    const updateTransfer = (transfer: Transfer) => {
        setTransfers(prev => prev.map(t => t.id === transfer.id ? transfer : t));
    };
    const deleteTransfer = (id: string) => {
        setTransfers(prev => prev.filter(t => t.id !== id));
    };

    const addPlayerRegistration = (data: Omit<PlayerRegistration, 'id'>) => {
        setPlayerRegistrations(prev => [...prev, { id: `reg-${Date.now()}`, ...data }]);
    };
    const updatePlayerRegistration = (reg: PlayerRegistration) => {
        setPlayerRegistrations(prev => prev.map(r => r.id === reg.id ? reg : r));
    };
    const deletePlayerRegistration = (id: string) => {
        setPlayerRegistrations(prev => prev.filter(r => r.id !== id));
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
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            createdAt: new Date().toISOString(),
            ...data
        };
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
        counties, addCounty, updateCounty, deleteCounty,
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
