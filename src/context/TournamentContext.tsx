import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Team, Match, TournamentSettings, TournamentState } from '../types/tournament';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'apex_bracket_state_v1';
const SYNC_CHANNEL = 'apex_bracket_broadcast_channel';

const DEFAULT_SETTINGS: TournamentSettings = {
  tournamentName: 'APEX LEGENDS GLOBAL SERIES',
  seriesSubtitle: 'TOURNAMENT SERIES',
  gameTitle: 'Apex Legends',
  logoUrl: '/favicon.svg',
  capacity: 8,
  format: 'single_elimination',
  matchPointEnabled: true,
  thirdPlaceDecider: false,
  autoAdvanceByes: true,
  tickerText: 'LIVE UPDATES • WELCOME TO THE CHAMPIONSHIP • UPCOMING MATCH: CYBERNETIC RAVENS VS ABYSSAL KINGS • LIVE UPDATES • WELCOME TO THE CHAMPIONSHIP •',
  theme: 'apex_navy',
  defaultBestOf: 3,
};

const DEFAULT_TEAMS: Team[] = [
  { id: 'team-1', name: 'Cybernetic Ravens', shortName: 'CR', seed: 1, status: 'draft_ready', createdAt: '2026-08-14T10:00:00.000Z' },
  { id: 'team-2', name: 'Void Walkers', shortName: 'VW', seed: 8, status: 'draft_ready', createdAt: '2026-08-14T10:05:00.000Z' },
  { id: 'team-3', name: 'Neon Syndicate', shortName: 'NS', seed: 4, status: 'draft_ready', createdAt: '2026-08-14T10:10:00.000Z' },
  { id: 'team-4', name: 'Solar Flares', shortName: 'SF', seed: 5, status: 'draft_ready', createdAt: '2026-08-14T10:15:00.000Z' },
  { id: 'team-5', name: 'Abyssal Kings', shortName: 'AK', seed: 2, status: 'draft_ready', createdAt: '2026-08-14T10:20:00.000Z' },
  { id: 'team-6', name: 'Quantum Sentinels', shortName: 'QS', seed: 7, status: 'draft_ready', createdAt: '2026-08-14T10:25:00.000Z' },
  { id: 'team-7', name: 'Cloud9', shortName: 'C9', seed: 3, status: 'draft_ready', createdAt: '2026-08-14T10:30:00.000Z' },
  { id: 'team-8', name: 'Team Liquid', shortName: 'TL', seed: 6, status: 'draft_ready', createdAt: '2026-08-14T10:35:00.000Z' },
];

export function buildEmptyBracket(capacity: 8 | 16): Match[] {
  const matches: Match[] = [];
  if (capacity === 8) {
    // Round 0: Quarter Finals (4 matches)
    for (let i = 0; i < 4; i++) {
      const nextMatchIndex = Math.floor(i / 2);
      matches.push({
        id: `qf-${i + 1}`,
        roundIndex: 0,
        roundName: 'Quarter-Finals',
        matchIndex: i,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winnerId: null,
        status: 'pending',
        nextMatchId: `sf-${nextMatchIndex + 1}`,
        nextSlot: (i % 2 === 0 ? 1 : 2) as 1 | 2,
      });
    }
    // Round 1: Semi Finals (2 matches)
    for (let i = 0; i < 2; i++) {
      matches.push({
        id: `sf-${i + 1}`,
        roundIndex: 1,
        roundName: 'Semi-Finals',
        matchIndex: i,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winnerId: null,
        status: 'pending',
        nextMatchId: 'gf-1',
        nextSlot: (i === 0 ? 1 : 2) as 1 | 2,
      });
    }
    // Round 2: Grand Final (1 match)
    matches.push({
      id: 'gf-1',
      roundIndex: 2,
      roundName: 'Grand Final',
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winnerId: null,
      status: 'pending',
      nextMatchId: null,
    });
  } else {
    // 16 teams structure
    for (let i = 0; i < 8; i++) {
      matches.push({
        id: `r16-${i + 1}`,
        roundIndex: 0,
        roundName: 'Round of 16',
        matchIndex: i,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winnerId: null,
        status: 'pending',
        nextMatchId: `qf-${Math.floor(i / 2) + 1}`,
        nextSlot: (i % 2 === 0 ? 1 : 2) as 1 | 2,
      });
    }
    for (let i = 0; i < 4; i++) {
      matches.push({
        id: `qf-${i + 1}`,
        roundIndex: 1,
        roundName: 'Quarter-Finals',
        matchIndex: i,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winnerId: null,
        status: 'pending',
        nextMatchId: `sf-${Math.floor(i / 2) + 1}`,
        nextSlot: (i % 2 === 0 ? 1 : 2) as 1 | 2,
      });
    }
    for (let i = 0; i < 2; i++) {
      matches.push({
        id: `sf-${i + 1}`,
        roundIndex: 2,
        roundName: 'Semi-Finals',
        matchIndex: i,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winnerId: null,
        status: 'pending',
        nextMatchId: 'gf-1',
        nextSlot: (i === 0 ? 1 : 2) as 1 | 2,
      });
    }
    matches.push({
      id: 'gf-1',
      roundIndex: 3,
      roundName: 'Grand Final',
      matchIndex: 0,
      team1: null,
      team2: null,
      score1: null,
      score2: null,
      winnerId: null,
      status: 'pending',
      nextMatchId: null,
    });
  }
  return matches;
}

function buildInitialPopulatedState(): TournamentState {
  const matches = buildEmptyBracket(8);
  const t = DEFAULT_TEAMS;

  matches[0].team1 = t[0]; matches[0].team2 = t[1]; matches[0].score1 = 3; matches[0].score2 = 1; matches[0].winnerId = t[0].id; matches[0].status = 'finished';
  matches[1].team1 = t[2]; matches[1].team2 = t[3]; matches[1].score1 = 2; matches[1].score2 = 0; matches[1].winnerId = t[2].id; matches[1].status = 'finished';
  matches[2].team1 = t[4]; matches[2].team2 = t[5]; matches[2].score1 = 3; matches[2].score2 = 2; matches[2].winnerId = t[4].id; matches[2].status = 'finished';
  matches[3].team1 = t[6]; matches[3].team2 = t[7]; matches[3].score1 = 2; matches[3].score2 = 0; matches[3].winnerId = t[6].id; matches[3].status = 'finished';

  matches[4].team1 = t[0]; matches[4].team2 = t[2]; matches[4].score1 = 3; matches[4].score2 = 0; matches[4].winnerId = t[0].id; matches[4].status = 'finished';
  matches[5].team1 = t[4]; matches[5].team2 = t[6]; matches[5].score1 = 3; matches[5].score2 = 1; matches[5].winnerId = t[4].id; matches[5].status = 'finished';

  matches[6].team1 = t[0]; matches[6].team2 = t[4]; matches[6].score1 = 4; matches[6].score2 = 2; matches[6].winnerId = t[0].id; matches[6].status = 'finished';

  return {
    settings: DEFAULT_SETTINGS,
    teams: DEFAULT_TEAMS,
    matches,
    champion: t[0],
    history: [],
  };
}

interface TournamentContextValue {
  state: TournamentState;
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
  toggleTeamStatus: (teamId: string) => void;
  shuffleAndGenerateBracket: (seeded?: boolean) => void;
  setMatchScore: (matchId: string, score1: number | null, score2: number | null) => void;
  setMatchWinner: (matchId: string, winnerId: string | null) => void;
  setMatchStatus: (matchId: string, status: Match['status']) => void;
  undoLastAction: () => void;
  resetTournamentBracket: () => void;
  purgeAllData: () => void;
  updateSettings: (newSettings: Partial<TournamentSettings>) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (password?: string) => boolean;
  logoutAdmin: () => void;
  isUsingSupabase: boolean;
}

const TournamentContext = createContext<TournamentContextValue | undefined>(undefined);

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TournamentState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load local tournament state:', e);
    }
    return buildInitialPopulatedState();
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('apex_admin_auth') === 'true';
  });

  const isUsingSupabase = isSupabaseConfigured();

  // Apply data-theme attribute on <html> element
  useEffect(() => {
    const theme = state.settings.theme || 'apex_navy';
    document.documentElement.setAttribute('data-theme', theme);
  }, [state.settings?.theme]);

  // Supabase Real-time Subscription & initial fetch
  useEffect(() => {
    const client = supabase;
    if (!client || !isSupabaseConfigured()) return;

    const fetchSupabaseState = async () => {
      try {
        const { data, error } = await client
          .from('tournament_state')
          .select('*')
          .eq('id', 'default')
          .single();

        if (data && !error) {
          const fetchedState: TournamentState = {
            settings: data.settings,
            teams: data.teams,
            matches: data.matches,
            champion: data.champion,
            history: data.history || [],
          };
          setState(fetchedState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedState));
        }
      } catch (err) {
        console.warn('Failed to fetch initial Supabase state:', err);
      }
    };

    fetchSupabaseState();

    const channel = client
      .channel('public:tournament_state')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournament_state' },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as any;
            const updatedState: TournamentState = {
              settings: newData.settings,
              teams: newData.teams,
              matches: newData.matches,
              champion: newData.champion,
              history: newData.history || [],
            };
            setState(updatedState);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // Cross-tab BroadcastChannel & LocalStorage listener (Fallback & Multi-tab)
  useEffect(() => {
    let broadcast: BroadcastChannel | null = null;
    try {
      broadcast = new BroadcastChannel(SYNC_CHANNEL);
      broadcast.onmessage = (event) => {
        if (event.data && event.data.type === 'STATE_UPDATE') {
          setState(event.data.payload);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      if (broadcast) broadcast.close();
    };
  }, []);

  const saveAndBroadcast = useCallback((newState: TournamentState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      const broadcast = new BroadcastChannel(SYNC_CHANNEL);
      broadcast.postMessage({ type: 'STATE_UPDATE', payload: newState });
      broadcast.close();
    } catch (e) {
      console.error('Failed to broadcast tournament state locally', e);
    }

    // Persist to Supabase if configured
    const client = supabase;
    if (client && isSupabaseConfigured()) {
      client
        .from('tournament_state')
        .upsert({
          id: 'default',
          settings: newState.settings,
          teams: newState.teams,
          matches: newState.matches,
          champion: newState.champion,
          history: newState.history,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) {
            console.warn('Failed to upsert state to Supabase:', error.message);
          }
        });
    }
  }, []);

  const addTeam = useCallback((teamData: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    saveAndBroadcast({
      ...state,
      teams: [...state.teams, newTeam],
    });
  }, [state, saveAndBroadcast]);

  const updateTeam = useCallback((updatedTeam: Team) => {
    const updatedTeams = state.teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t));
    const updatedMatches = state.matches.map((m) => ({
      ...m,
      team1: m.team1?.id === updatedTeam.id ? updatedTeam : m.team1,
      team2: m.team2?.id === updatedTeam.id ? updatedTeam : m.team2,
    }));
    const updatedChampion = state.champion?.id === updatedTeam.id ? updatedTeam : state.champion;

    saveAndBroadcast({
      ...state,
      teams: updatedTeams,
      matches: updatedMatches,
      champion: updatedChampion,
    });
  }, [state, saveAndBroadcast]);

  const deleteTeam = useCallback((teamId: string) => {
    const updatedTeams = state.teams.filter((t) => t.id !== teamId);
    saveAndBroadcast({
      ...state,
      teams: updatedTeams,
    });
  }, [state, saveAndBroadcast]);

  const toggleTeamStatus = useCallback((teamId: string) => {
    const updatedTeams = state.teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          status: (t.status === 'draft_ready' ? 'waitlist' : 'draft_ready') as Team['status'],
        };
      }
      return t;
    });
    saveAndBroadcast({
      ...state,
      teams: updatedTeams,
    });
  }, [state, saveAndBroadcast]);

  const shuffleAndGenerateBracket = useCallback((seeded: boolean = false) => {
    const activeTeams = state.teams.filter((t) => t.status !== 'waitlist');
    let eligibleTeams = [...activeTeams];

    if (!seeded) {
      for (let i = eligibleTeams.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [eligibleTeams[i], eligibleTeams[j]] = [eligibleTeams[j], eligibleTeams[i]];
      }
    } else {
      eligibleTeams.sort((a, b) => (a.seed ?? 99) - (b.seed ?? 99));
    }

    const capacity = state.settings.capacity;
    const freshMatches = buildEmptyBracket(capacity);

    if (capacity === 8) {
      for (let i = 0; i < 4; i++) {
        freshMatches[i].team1 = eligibleTeams[i * 2] || null;
        freshMatches[i].team2 = eligibleTeams[i * 2 + 1] || null;
      }
    } else {
      for (let i = 0; i < 8; i++) {
        freshMatches[i].team1 = eligibleTeams[i * 2] || null;
        freshMatches[i].team2 = eligibleTeams[i * 2 + 1] || null;
      }
    }

    const newHistory = [
      ...state.history,
      { matches: state.matches, champion: state.champion, timestamp: Date.now() },
    ];

    saveAndBroadcast({
      ...state,
      matches: freshMatches,
      champion: null,
      history: newHistory,
    });
  }, [state, saveAndBroadcast]);

  const setMatchScore = useCallback((matchId: string, score1: number | null, score2: number | null) => {
    const updatedMatches = state.matches.map((m) => {
      if (m.id === matchId) {
        return {
          ...m,
          score1,
          score2,
        };
      }
      return m;
    });

    saveAndBroadcast({
      ...state,
      matches: updatedMatches,
    });
  }, [state, saveAndBroadcast]);

  const setMatchWinner = useCallback((matchId: string, winnerId: string | null) => {
    const currentMatches = [...state.matches];
    const matchIndex = currentMatches.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) return;

    const match = currentMatches[matchIndex];
    const winnerTeam = winnerId
      ? match.team1?.id === winnerId
        ? match.team1
        : match.team2?.id === winnerId
        ? match.team2
        : null
      : null;

    const newHistory = [
      ...state.history,
      { matches: state.matches, champion: state.champion, timestamp: Date.now() },
    ];

    currentMatches[matchIndex] = {
      ...match,
      winnerId,
      status: winnerId ? 'finished' : 'pending',
    };

    let newChampion = state.champion;

    if (match.nextMatchId) {
      const nextMatchIndex = currentMatches.findIndex((m) => m.id === match.nextMatchId);
      if (nextMatchIndex !== -1) {
        const nextMatch = { ...currentMatches[nextMatchIndex] };
        if (match.nextSlot === 1) {
          nextMatch.team1 = winnerTeam;
        } else {
          nextMatch.team2 = winnerTeam;
        }
        if (!winnerTeam) {
          nextMatch.winnerId = null;
          nextMatch.score1 = null;
          nextMatch.score2 = null;
          nextMatch.status = 'pending';
        }
        currentMatches[nextMatchIndex] = nextMatch;
      }
    } else {
      newChampion = winnerTeam;
    }

    saveAndBroadcast({
      ...state,
      matches: currentMatches,
      champion: newChampion,
      history: newHistory,
    });
  }, [state, saveAndBroadcast]);

  const setMatchStatus = useCallback((matchId: string, status: Match['status']) => {
    const updatedMatches = state.matches.map((m) => (m.id === matchId ? { ...m, status } : m));
    saveAndBroadcast({
      ...state,
      matches: updatedMatches,
    });
  }, [state, saveAndBroadcast]);

  const undoLastAction = useCallback(() => {
    if (state.history.length === 0) return;
    const prevHistory = [...state.history];
    const lastSnapshot = prevHistory.pop()!;

    saveAndBroadcast({
      ...state,
      matches: lastSnapshot.matches,
      champion: lastSnapshot.champion,
      history: prevHistory,
    });
  }, [state, saveAndBroadcast]);

  const resetTournamentBracket = useCallback(() => {
    const freshMatches = buildEmptyBracket(state.settings.capacity);
    saveAndBroadcast({
      ...state,
      matches: freshMatches,
      champion: null,
      history: [],
    });
  }, [state, saveAndBroadcast]);

  const purgeAllData = useCallback(() => {
    const freshState: TournamentState = {
      settings: DEFAULT_SETTINGS,
      teams: [],
      matches: buildEmptyBracket(8),
      champion: null,
      history: [],
    };
    saveAndBroadcast(freshState);
  }, [saveAndBroadcast]);

  const updateSettings = useCallback((newSettings: Partial<TournamentSettings>) => {
    const updated = { ...state.settings, ...newSettings };
    let matches = state.matches;
    if (newSettings.capacity && newSettings.capacity !== state.settings.capacity) {
      matches = buildEmptyBracket(newSettings.capacity);
    }
    saveAndBroadcast({
      ...state,
      settings: updated,
      matches,
    });
  }, [state, saveAndBroadcast]);

  const loginAdmin = useCallback((_password?: string) => {
    sessionStorage.setItem('apex_admin_auth', 'true');
    setIsAdminAuthenticated(true);
    return true;
  }, []);

  const logoutAdmin = useCallback(() => {
    sessionStorage.removeItem('apex_admin_auth');
    setIsAdminAuthenticated(false);
  }, []);

  return (
    <TournamentContext.Provider
      value={{
        state,
        addTeam,
        updateTeam,
        deleteTeam,
        toggleTeamStatus,
        shuffleAndGenerateBracket,
        setMatchScore,
        setMatchWinner,
        setMatchStatus,
        undoLastAction,
        resetTournamentBracket,
        purgeAllData,
        updateSettings,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        isUsingSupabase,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}
