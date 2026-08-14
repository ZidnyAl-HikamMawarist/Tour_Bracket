import { describe, it, expect } from 'vitest';
import { buildEmptyBracket } from '../context/TournamentContext';
import type { Team, Match } from '../types/tournament';

describe('Tournament State & Match Progression Flow', () => {
  it('advances winner from Quarter-Final to Semi-Final and then Grand Final', () => {
    const bracket: Match[] = buildEmptyBracket(8);

    const teamA: Team = { id: 'team-a', name: 'Alpha', shortName: 'ALP', status: 'draft_ready', createdAt: '' };
    const teamB: Team = { id: 'team-b', name: 'Beta', shortName: 'BET', status: 'draft_ready', createdAt: '' };

    // Set Quarter Final 1 teams
    bracket[0].team1 = teamA;
    bracket[0].team2 = teamB;
    bracket[0].score1 = 2;
    bracket[0].score2 = 0;
    bracket[0].winnerId = teamA.id;
    bracket[0].status = 'finished';

    // Propagate to next match (sf-1, slot 1)
    const sf1Index = bracket.findIndex((m) => m.id === bracket[0].nextMatchId);
    expect(sf1Index).toBe(4);
    if (bracket[0].nextSlot === 1) {
      bracket[sf1Index].team1 = teamA;
    }

    expect(bracket[4].team1?.name).toBe('Alpha');

    // Simulate winning Semi-Final
    bracket[4].score1 = 3;
    bracket[4].score2 = 1;
    bracket[4].winnerId = teamA.id;
    bracket[4].status = 'finished';

    // Propagate to Grand Final (gf-1, slot 1)
    const gfIndex = bracket.findIndex((m) => m.id === bracket[4].nextMatchId);
    expect(gfIndex).toBe(6);
    if (bracket[4].nextSlot === 1) {
      bracket[gfIndex].team1 = teamA;
    }

    expect(bracket[6].team1?.name).toBe('Alpha');
  });
});
