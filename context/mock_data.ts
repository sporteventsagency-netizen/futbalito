import {
  Team, Competition, Match, Player, OrganizationSettings, User, Role,
  Invoice, AuditLog, County, Arena, Sanction, Referee, Observer, Sport,
  Article, MediaImage, Gallery, Sponsor, Transfer, PlayerRegistration, PortalConfig,
  MatchEventType, PublicConfig, NationalTeam, NationalSquadPlayer
} from '../types.ts';

// MOCK DATA
export const mockTeams: Team[] = [
  { id: 'team-1', name: 'Steaua București', country: 'Romania', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/FCSB_logo_2022.svg/1200px-FCSB_logo_2022.svg.png', county: 'București', city: 'București', address: 'Bd. Ghencea 45', foundedYear: 1947, clubColors: { primary: '#0000FF', secondary: '#FF0000' }, president: 'Gigi Becali', competitionOrganizer: 'user-2', coach: 'Elias Charalambous', status: 'active' },
  { id: 'team-2', name: 'Dinamo București', country: 'Romania', logoUrl: 'https://upload.wikimedia.org/wikipedia/ro/thumb/2/27/Dinamo_Bucuresti_logo.svg/1200px-Dinamo_Bucuresti_logo.svg.png', county: 'București', city: 'București', address: 'Șos. Ștefan cel Mare 7-9', foundedYear: 1948, clubColors: { primary: '#FF0000', secondary: '#FFFFFF' }, president: 'Andrei Nicolescu', competitionOrganizer: 'user-2', coach: 'Željko Kopić', status: 'active' },
  { id: 'team-3', name: 'Rapid București', country: 'Romania', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/FCRB_logo.svg/1200px-FCRB_logo.svg.png', county: 'București', city: 'București', address: 'Calea Giulești 18', foundedYear: 1923, clubColors: { primary: '#660000', secondary: '#FFFFFF' }, president: 'Daniel Niculae', competitionOrganizer: 'user-2', coach: 'Neil Lennon', status: 'active' },
  { id: 'team-4', name: 'CFR Cluj', country: 'Romania', logoUrl: 'https://upload.wikimedia.org/wikipedia/ro/3/32/CFR_Cluj.png', county: 'Cluj', city: 'Cluj-Napoca', address: 'Str. Gruia 20', foundedYear: 1907, clubColors: { primary: '#800000', secondary: '#FFFFFF' }, president: 'Cristian Balaj', competitionOrganizer: 'user-3', coach: 'Dan Petrescu', status: 'active' },
  { id: 'team-5', name: 'Universitatea Craiova', country: 'Romania', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Universitatea_Craiova_logo.svg/1200px-Universitatea_Craiova_logo.svg.png', county: 'Dolj', city: 'Craiova', address: 'Bd. Ilie Balaci', foundedYear: 1948, clubColors: { primary: '#0033A0', secondary: '#FFFFFF' }, president: 'Mihai Rotaru', competitionOrganizer: 'user-3', coach: 'Costel Gâlcă', status: 'inactive' },
  { id: 'team-6', name: 'Farul Constanța', country: 'Romania', logoUrl: 'https://upload.wikimedia.org/wikipedia/ro/thumb/9/99/Logo_Farul_Constan%C8%9Ba_2021.svg/1200px-Logo_Farul_Constan%C8%9Ba_2021.svg.png', county: 'Constanța', city: 'Constanța', address: 'Str. Primăverii 2', foundedYear: 2021, clubColors: { primary: '#0053A0', secondary: '#FFFFFF' }, president: 'Gheorghe Popescu', competitionOrganizer: 'user-3', coach: 'Gheorghe Hagi', status: 'active' },
];

export const mockPlayers: Player[] = [
  { id: 'player-1', name: 'Florinel Coman', teamId: 'team-1', stats: { goals: 12, assists: 8, yellowCards: 3, redCards: 0 }, cnp: '1980410123456', dateOfBirth: '1998-04-10', registrationNumber: 'FRF001', registrationDate: '2016-07-01', phone: '0722000001', email: 'florin.coman@example.com', status: 'active', annualVisas: ['2023-08-15'], photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/398031-1685085025.jpg' },
  { id: 'player-2', name: 'Darius Olaru', teamId: 'team-1', stats: { goals: 9, assists: 10, yellowCards: 5, redCards: 1 }, cnp: '1980315123457', dateOfBirth: '1998-03-03', registrationNumber: 'FRF002', registrationDate: '2018-01-20', phone: '0722000002', email: 'darius.olaru@example.com', status: 'active', annualVisas: ['2023-08-15'], photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/433246-1685085375.jpg' },
  { id: 'player-3', name: 'Dennis Politic', teamId: 'team-2', stats: { goals: 7, assists: 3, yellowCards: 2, redCards: 0 }, cnp: '2000305123458', dateOfBirth: '2000-03-05', registrationNumber: 'FRF003', registrationDate: '2023-07-10', phone: '0722000003', email: 'dennis.politic@example.com', status: 'active', annualVisas: ['2023-08-20'], photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/476145-1692015328.jpg' },
  { id: 'player-4', name: 'Albion Rrahmani', teamId: 'team-3', stats: { goals: 15, assists: 4, yellowCards: 1, redCards: 0 }, cnp: '1990821123459', dateOfBirth: '2000-08-31', registrationNumber: 'FRF004', registrationDate: '2023-08-01', phone: '0722000004', email: 'albion.rrahmani@example.com', status: 'active', annualVisas: ['2023-09-01'], photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/528333-1692016629.jpg' },
  { id: 'player-5', name: 'Alexandru Mitriță', teamId: 'team-5', stats: { goals: 11, assists: 9, yellowCards: 6, redCards: 0 }, cnp: '1950210123450', dateOfBirth: '1995-02-08', registrationNumber: 'FRF005', registrationDate: '2023-06-01', phone: '0722000005', email: 'alex.mitrita@example.com', status: 'active', annualVisas: ['2023-07-15'], photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/250122-1687870914.jpg' },
  { id: 'player-6', name: 'Daniel Bîrligea', teamId: 'team-4', stats: { goals: 10, assists: 5, yellowCards: 2, redCards: 0 }, cnp: '2000423123451', dateOfBirth: '2000-04-19', registrationNumber: 'FRF006', registrationDate: '2022-01-26', phone: '0722000006', email: 'daniel.birligea@example.com', status: 'inactive', annualVisas: ['2023-08-10'], photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/655700-1684400589.jpg' },
  { id: 'player-7', name: 'Louis Munteanu', teamId: 'team-6', stats: { goals: 8, assists: 6, yellowCards: 3, redCards: 0 }, cnp: '2010616123452', dateOfBirth: '2002-06-16', registrationNumber: 'FRF007', registrationDate: '2022-08-15', phone: '0722000007', email: 'louis.munteanu@example.com', status: 'active', annualVisas: ['2023-09-05'], photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/549615-1685084556.jpg' },
];

export const mockSports: Sport[] = [
  { id: 'sport-1', name: 'Football', description: 'Standard association football.' },
  { id: 'sport-2', name: 'Futsal', description: '5-a-side indoor football.' },
  { id: 'sport-3', name: 'Handball', description: 'Team sport where two teams of seven players each pass a ball using their hands.' },
];

const defaultPublicConfig: PublicConfig = {
    title: 'Competition Site',
    logoUrl: '/vite.svg',
    primaryColor: '#2563eb',
    backgroundColor: '#f3f4f6',
    showRankings: true,
    showSchedule: true,
    showPlayerStats: true,
    showArticles: true,
    showGalleries: true,
    showSponsors: true,
    showRegulations: true,
    showLiveStream: true,
    featuredLiveMatchIds: [],
    announcements: [],
    committee: [],
    regulations: [],
};

export const mockCompetitions: Competition[] = [
  { id: 'comp-1', name: 'Liga 1', season: '2023-2024', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Liga_1_Betano_logo.svg/1200px-Liga_1_Betano_logo.svg.png', status: 'Ongoing', teamIds: ['team-1', 'team-2', 'team-3', 'team-4'], format: 'league', isPublic: true, publicConfig: {...defaultPublicConfig, title: 'Liga 1 Public Site', featuredLiveMatchIds: ['match-3']}, sportId: 'sport-1', pointsForWin: 3, pointsForTieBreakWin: 2 },
  { id: 'comp-2', name: 'Cupa Romaniei', season: '2023-2024', logoUrl: 'https://upload.wikimedia.org/wikipedia/ro/1/1a/Cupa_Romaniei_logo.png', status: 'Upcoming', teamIds: ['team-1', 'team-2', 'team-3', 'team-4', 'team-5', 'team-6'], format: 'cup', isPublic: true, publicConfig: {...defaultPublicConfig, title: 'Cupa Romaniei'}, sportId: 'sport-1', pointsForWin: 3, pointsForTieBreakWin: 2 },
];

export const mockMatches: Match[] = [
  { id: 'match-1', competitionId: 'comp-1', homeTeam: mockTeams[0], awayTeam: mockTeams[1], homeScore: 2, awayScore: 1, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Finished', elapsedSeconds: 0, events: [{id: 'evt-1', type: MatchEventType.GOAL, minute: 25, teamId: 'team-1', primaryPlayerId: 'player-1'}, {id: 'evt-2', type: MatchEventType.GOAL, minute: 60, teamId: 'team-2', primaryPlayerId: 'player-3'}, {id: 'evt-3', type: MatchEventType.GOAL, minute: 88, teamId: 'team-1', primaryPlayerId: 'player-2'}] },
  { id: 'match-2', competitionId: 'comp-1', homeTeam: mockTeams[2], awayTeam: mockTeams[3], homeScore: 1, awayScore: 1, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), status: 'Finished', elapsedSeconds: 0, events: [] },
  { id: 'match-3', competitionId: 'comp-1', homeTeam: mockTeams[0], awayTeam: mockTeams[2], homeScore: 0, awayScore: 0, date: new Date().toISOString(), status: 'In Progress', liveStreamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', elapsedSeconds: 0, events: [] },
  { id: 'match-4', competitionId: 'comp-1', homeTeam: mockTeams[1], awayTeam: mockTeams[3], homeScore: 0, awayScore: 0, date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Not Started', elapsedSeconds: 0, events: [] },
  { id: 'match-5', competitionId: 'comp-2', homeTeam: mockTeams[4], awayTeam: mockTeams[5], homeScore: 0, awayScore: 0, date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), status: 'Not Started', elapsedSeconds: 0, events: [] },
];

export const mockOrganizationSettings: OrganizationSettings = { name: 'Futbalito', logoUrl: '/vite.svg', email: 'contact@futbalito.com', phone: '123-456-7890', address: '123 Futbalito St, City', defaultTimezone: 'Europe/Bucharest', defaultCompetitionFormat: 'league' };

export const mockRoles: Role[] = [
  { id: 'role-admin', name: 'Super Admin', description: 'Full access to all features', permissions: ['competitions:create', 'competitions:edit', 'competitions:delete', 'teams:create', 'teams:edit', 'teams:delete', 'players:manage', 'arenas:manage', 'referees:manage', 'observers:manage', 'organizers:manage', 'matches:manage_live', 'publish:manage_articles', 'publish:manage_media', 'publish:manage_sponsors', 'publish:manage_regulations', 'publish:customize_sites', 'settings:manage_organization', 'settings:manage_counties', 'users:invite', 'users:manage_roles', 'transfers:manage', 'sports:manage'] },
  { id: 'role-content-editor', name: 'Content Editor', description: 'Can manage articles, media and public sites', permissions: ['publish:manage_articles', 'publish:manage_media', 'publish:customize_sites'] },
  { id: 'role-match-manager', name: 'Match Manager', description: 'Can manage live match data', permissions: ['matches:manage_live'] },
];

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Super Admin', email: 'admin@futbalito.com', roleId: 'role-admin', status: 'ACTIVE' },
  { id: 'user-2', name: 'John Doe', email: 'john@futbalito.com', roleId: 'role-content-editor', status: 'ACTIVE' },
  { id: 'user-3', name: 'Jane Smith', email: 'jane@futbalito.com', roleId: 'role-match-manager', status: 'PENDING' },
];

export const mockInvoices: Invoice[] = [ { id: '#12345', date: 'July 1, 2024', amount: '$49.00', status: 'Paid' } ];
export const mockAuditLog: AuditLog[] = [ { id: 'log-1', userId: 'user-1', userName: 'Super Admin', action: 'Create Competition', details: 'Created competition: Liga 1', timestamp: new Date().toISOString() } ];
export const mockCounties: County[] = [ { id: 'county-1', name: 'Bucuresti' }, { id: 'county-2', name: 'Cluj' } ];

export const mockArenas: Arena[] = [
  { 
    id: 'arena-1', 
    name: 'Arena Națională', 
    location: 'Bucharest', 
    fields: ['Main Field'],
    county: 'București',
    fieldDimensions: '105 x 68 m',
    goalDimensions: '7.32 x 2.44 m',
    hasFloodlights: true,
    spectatorCapacity: 55634,
    homologationDate: '2011-08-10',
    homologationExpiration: '2025-08-10'
  },
  { 
    id: 'arena-2', 
    name: 'Cluj Arena', 
    location: 'Cluj-Napoca', 
    fields: ['Field 1', 'Field 2'],
    county: 'Cluj',
    fieldDimensions: '105 x 68 m',
    goalDimensions: '7.32 x 2.44 m',
    hasFloodlights: true,
    spectatorCapacity: 30200,
    homologationDate: '2011-10-01',
    homologationExpiration: '2026-10-01'
  },
];

export const mockSanctions: Sanction[] = [ { id: 'sanction-1', competitionId: 'comp-1', playerId: 'player-2', reason: 'Red Card', details: '2 match suspension', date: new Date().toISOString() } ];

export const mockReferees: Referee[] = [ 
  { 
    id: 'ref-1', 
    name: 'István Kovács', 
    county: 'Satu Mare',
    city: 'Carei',
    dateOfBirth: '1984-09-16',
    phone: '0744123456',
    email: 'istvan.kovacs@frf.ro',
    category: 'CATEGORIA 1',
    photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/1111-1692015024.jpg'
  }, 
  { 
    id: 'ref-2', 
    name: 'Ovidiu Hațegan',
    county: 'Arad',
    city: 'Arad',
    dateOfBirth: '1980-07-14',
    phone: '0744654321',
    email: 'ovidiu.hategan@frf.ro',
    category: 'CATEGORIA 1',
    photoUrl: 'https://tmssl.akamaized.net/images/portrait/header/1110-1502978713.jpg'
  } 
];

export const mockObservers: Observer[] = [ 
  { 
    id: 'obs-1', 
    name: 'Ion Crăciunescu',
    county: 'Vâlcea',
    city: 'Râmnicu Vâlcea',
    dateOfBirth: '1950-09-27',
    phone: '0755123456',
    email: 'ion.craciunescu@example.com',
    category: 'CATEGORIA 1',
    photoUrl: 'https://avatar.iran.liara.run/username?username=Ion+Craciunescu'
  },
  { 
    id: 'obs-2', 
    name: 'Adrian Porumboiu',
    county: 'Vaslui',
    city: 'Vaslui',
    dateOfBirth: '1950-09-27',
    phone: '0755654321',
    email: 'adrian.porumboiu@example.com',
    category: 'CATEGORIA 1',
    photoUrl: 'https://avatar.iran.liara.run/username?username=Adrian+Porumboiu'
  } 
];

export const mockArticles: Article[] = [
  { id: 'art-1', competitionId: 'comp-1', title: 'Season Kick-off! The Eternal Derby sets the tone.', content: 'Steaua and Dinamo faced off in a thrilling match to open the new Liga 1 season. The game was filled with passion and drama, ending in a 2-1 victory for the hosts.', featuredImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop', author: 'John Doe', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'published' },
  { id: 'art-2', competitionId: 'comp-2', title: 'Cupa Romaniei Draw Announced', content: 'The initial draw for the Cupa Romaniei has been made. Exciting matchups are on the horizon as lower-league teams get a chance to challenge the giants.', featuredImageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop', author: 'John Doe', createdAt: new Date().toISOString(), status: 'published' },
];

export const mockMediaImages: MediaImage[] = [
  { id: 'img-1', competitionId: 'comp-1', url: 'https://images.unsplash.com/photo-1553776971-d6a35a585f5e?q=80&w=2070&auto=format&fit=crop' },
  { id: 'img-2', competitionId: 'comp-1', url: 'https://images.unsplash.com/photo-1517423568346-d5a28b413936?q=80&w=1974&auto=format&fit=crop' },
];

export const mockGalleries: Gallery[] = [ { id: 'gal-1', competitionId: 'comp-1', title: 'Eternal Derby Highlights', imageIds: ['img-1', 'img-2'] } ];
export const mockSponsors: Sponsor[] = [ { id: 'spn-1', competitionId: 'comp-1', name: 'Main Sponsor', websiteUrl: 'https://example.com', logoUrl: 'https://logo.clearbit.com/tailwindui.com' } ];

export const mockTransfers: Transfer[] = [ { id: 'trn-1', playerId: 'player-1', fromTeamId: 'team-2', toTeamId: 'team-1', date: new Date('2023-08-15').toISOString(), fee: 500000 } ];
export const mockPlayerRegistrations: PlayerRegistration[] = [ { id: 'reg-1', playerId: 'player-1', registrationNumber: 'RO-12345', validFrom: new Date('2023-07-01').toISOString(), validUntil: new Date('2024-06-30').toISOString(), status: 'ACTIVE' } ];

export const mockPortalConfig: PortalConfig = { title: 'Futbalito Portal', logoUrl: '/vite.svg', primaryColor: '#2563eb', backgroundColor: '#f3f4f6' };

export const MOCK_NATIONAL_TEAM: NationalTeam = {
  id: 'nat-team-ro',
  name: 'Romania National Team',
  logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Coat_of_arms_of_Romania.svg/1200px-Coat_of_arms_of_Romania.svg.png',
};

export const MOCK_NATIONAL_SQUAD: NationalSquadPlayer[] = [
  { playerId: 'player-1', caps: 15, goals: 3 },
  { playerId: 'player-5', caps: 25, goals: 7 },
];

export const MOCK_INTERNATIONAL_MATCHES: Match[] = [
    {
        id: 'int-match-1',
        competitionId: 'intl',
        isInternational: true,
        homeTeam: { id: 'nat-team-ro', name: 'Romania', country: 'Romania', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Coat_of_arms_of_Romania.svg/1200px-Coat_of_arms_of_Romania.svg.png' },
        awayTeam: { id: 'nat-team-de', name: 'Germany', country: 'Germany', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/DFB_logo.svg/1200px-DFB_logo.svg.png' },
        homeScore: 0,
        awayScore: 0,
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Not Started',
        elapsedSeconds: 0,
        events: []
    }
];