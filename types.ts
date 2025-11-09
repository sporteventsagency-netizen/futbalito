// types.ts

// Basic types
export type Page = 
  | 'DASHBOARD' | 'BROWSE' | 'MANAGE_COMPETITIONS' | 'MANAGE_TEAMS' | 'MANAGE_PLAYERS'
  | 'MANAGE_ARENAS' | 'MANAGE_REFEREES' | 'MANAGE_OBSERVERS' | 'MANAGE_ORGANIZERS'
  | 'MANAGE_NATIONAL_TEAM' | 'PUBLISH' | 'REPORTS' | 'MARKETPLACE' | 'SETTINGS'
  | 'MANAGE_SPORTS';

export type Permission =
  | 'competitions:create' | 'competitions:edit' | 'competitions:delete'
  | 'teams:create' | 'teams:edit' | 'teams:delete'
  | 'players:manage'
  | 'arenas:manage'
  | 'referees:manage'
  | 'observers:manage'
  | 'organizers:manage'
  | 'matches:manage_live'
  | 'publish:manage_articles' | 'publish:manage_media' | 'publish:manage_sponsors'
  | 'publish:manage_regulations' | 'publish:customize_sites'
  | 'settings:manage_organization' | 'settings:manage_counties'
  | 'users:invite' | 'users:manage_roles'
  | 'transfers:manage'
  | 'sports:manage';

// Core data models
export interface Team {
  id: string;
  name: string;
  country: string;
  logoUrl: string;
  county?: string;
  city?: string;
  address?: string;
  foundedYear?: number;
  clubColors?: {
    primary: string;
    secondary: string;
  };
  president?: string;
  competitionOrganizer?: string; // User ID
  coach?: string;
  status?: 'active' | 'inactive';
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  stats: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
  cnp?: string;
  dateOfBirth?: string; // ISO string
  registrationNumber?: string;
  registrationDate?: string; // ISO string
  phone?: string;
  email?: string;
  status?: 'active' | 'inactive';
  annualVisas?: string[]; // Array of ISO date strings
  photoUrl?: string;
}

export enum MatchEventType {
  GOAL = 'GOAL',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  SUBSTITUTION = 'SUBSTITUTION',
}

export interface MatchEvent {
  id: string;
  type: MatchEventType;
  minute: number;
  teamId: string;
  primaryPlayerId: string;
  secondaryPlayerId?: string; // For substitutions
}

export interface Match {
  id: string;
  competitionId: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  date: string; // ISO string
  status: 'Not Started' | 'In Progress' | 'Finished';
  events: MatchEvent[];
  stage?: string;
  liveStreamUrl?: string;
  isInternational?: boolean;
  elapsedSeconds?: number;
}

export interface Sanction {
    id: string;
    competitionId: string;
    teamId?: string;
    playerId?: string;
    reason: string;
    details: string; // e.g., "2 match suspension"
    date: string; // ISO string
}

export interface Competition {
  id: string;
  name: string;
  season: string;
  logoUrl: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  teamIds: string[];
  format: 'league' | 'cup' | 'mixed';
  twoLegged?: boolean;
  teamsPerGroup?: number;
  defaultArenaId?: string;
  isPublic?: boolean;
  county?: string;
  organizerId?: string;
  sportId?: string;
  pointsForWin?: number;
  pointsForTieBreakWin?: number;
  publicConfig?: PublicConfig;
}

export interface Standing {
    teamId: string;
    teamName: string;
    logoUrl: string;
    played: number;
    wins: number;
    losses: number;
    draws: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
}


// Settings & Admin
export interface OrganizationSettings {
  name: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  defaultTimezone: string;
  defaultCompetitionFormat: 'league' | 'cup' | 'mixed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: 'ACTIVE' | 'PENDING';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid';
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
    timestamp: string; // ISO string
}

export interface County {
    id: string;
    name: string;
}

export interface Arena {
    id: string;
    name: string;
    location: string;
    fields: string[];
    county?: string;
    fieldDimensions?: string;
    goalDimensions?: string;
    hasFloodlights?: boolean;
    spectatorCapacity?: number;
    homologationDate?: string; // ISO string
    homologationExpiration?: string; // ISO string
}

export interface Sport {
    id: string;
    name: string;
    description: string;
}

export type RefereeCategory = 'ASPIRANTI' | 'STAGIARI' | 'CATEGORIA 3' | 'CATEGORIA 2' | 'CATEGORIA 1';

export interface Referee {
    id: string;
    name: string;
    county?: string;
    city?: string;
    dateOfBirth?: string; // ISO string
    phone?: string;
    email?: string;
    category?: RefereeCategory;
    photoUrl?: string;
}

export interface Observer {
    id: string;
    name: string;
    county?: string;
    city?: string;
    dateOfBirth?: string; // ISO string
    phone?: string;
    email?: string;
    category?: RefereeCategory;
    photoUrl?: string;
}

export interface NationalTeam {
    id: string;
    name: string;
    logoUrl: string;
}

export interface NationalSquadPlayer {
    playerId: string;
    caps: number;
    goals: number;
}

// Publishing models
export interface Article {
    id: string;
    competitionId: string;
    title: string;
    content: string;
    featuredImageUrl: string;
    author: string;
    createdAt: string; // ISO string
    status: 'draft' | 'published';
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  createdAt: string; // ISO string
}

export interface MediaImage {
    id: string;
    competitionId: string;
    url: string;
}

export interface Gallery {
    id: string;
    competitionId: string;
    title: string;
    imageIds: string[];
}

export interface Sponsor {
    id: string;
    competitionId: string;
    name: string;
    websiteUrl: string;
    logoUrl: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string; // ISO string
}

export interface CommitteeMember {
    id: string;
    name: string;
    role: string;
}

export interface Regulation {
    id: string;
    title: string;
    content: string;
    lastUpdatedAt: string; // ISO string
}

export interface PublicConfig {
    title: string;
    logoUrl: string;
    primaryColor: string;
    backgroundColor: string;
    showRankings: boolean;
    showSchedule: boolean;
    showPlayerStats: boolean;
    showArticles: boolean;
    showGalleries: boolean;
    showSponsors: boolean;
    showRegulations: boolean;
    showLiveStream: boolean;
    featuredLiveMatchIds: string[];
    announcements: Announcement[];
    committee: CommitteeMember[];
    regulations: Regulation[];
}

export interface PortalConfig {
    title: string;
    logoUrl: string;
    primaryColor: string;
    backgroundColor: string;
}

// Reports
export interface Transfer {
    id: string;
    playerId: string;
    fromTeamId: string;
    toTeamId: string;
    date: string; // ISO string
    fee: number;
}

export type PlayerRegistrationStatus = 'ACTIVE' | 'EXPIRED';

export interface PlayerRegistration {
    id: string;
    playerId: string;
    registrationNumber: string;
    validFrom: string; // ISO string
    validUntil: string; // ISO string
    status: PlayerRegistrationStatus;
}