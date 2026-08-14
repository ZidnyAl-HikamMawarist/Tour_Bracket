export type TeamStatus = 'registered' | 'waitlist' | 'draft_ready';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  seed?: number;
  status: TeamStatus;
  createdAt: string;
}

export type MatchStatus = 'pending' | 'live' | 'finished';
export type BestOfMode = 1 | 3 | 5 | 7;
export type ThemeMode = 'apex_navy' | 'valorant_red' | 'mlbb_gold' | 'pubg_emerald';

export interface Match {
  id: string;
  roundIndex: number; // 0 = Quarter Finals / R16, 1 = Semi Finals, 2 = Grand Final
  roundName: string;
  matchIndex: number;
  team1: Team | null;
  team2: Team | null;
  score1: number | null;
  score2: number | null;
  winnerId: string | null;
  status: MatchStatus;
  nextMatchId: string | null;
  nextSlot?: 1 | 2; // Which slot (team1 or team2) the winner advances to
  bestOf?: BestOfMode;
}

export interface TournamentSettings {
  tournamentName: string;
  seriesSubtitle: string;
  gameTitle: string;
  logoUrl: string;
  capacity: 8 | 16;
  format: 'single_elimination';
  matchPointEnabled: boolean;
  thirdPlaceDecider: boolean;
  autoAdvanceByes: boolean;
  tickerText: string;
  theme: ThemeMode;
  defaultBestOf: BestOfMode;
}

export interface TournamentState {
  settings: TournamentSettings;
  teams: Team[];
  matches: Match[];
  champion: Team | null;
  history: {
    matches: Match[];
    champion: Team | null;
    timestamp: number;
  }[];
}
