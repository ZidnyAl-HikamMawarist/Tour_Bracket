import { describe, it, expect } from 'vitest';
import { buildEmptyBracket } from '../context/TournamentContext';

describe('Tournament Bracket Engine', () => {
  it('correctly builds 8-team bracket with 7 matches', () => {
    const bracket = buildEmptyBracket(8);
    expect(bracket).toHaveLength(7);

    // 4 Quarter Finals
    const qf = bracket.filter((m) => m.roundIndex === 0);
    expect(qf).toHaveLength(4);
    expect(qf[0].nextMatchId).toBe('sf-1');
    expect(qf[0].nextSlot).toBe(1);
    expect(qf[1].nextMatchId).toBe('sf-1');
    expect(qf[1].nextSlot).toBe(2);
    expect(qf[2].nextMatchId).toBe('sf-2');
    expect(qf[2].nextSlot).toBe(1);
    expect(qf[3].nextMatchId).toBe('sf-2');
    expect(qf[3].nextSlot).toBe(2);

    // 2 Semi Finals
    const sf = bracket.filter((m) => m.roundIndex === 1);
    expect(sf).toHaveLength(2);
    expect(sf[0].nextMatchId).toBe('gf-1');
    expect(sf[0].nextSlot).toBe(1);
    expect(sf[1].nextMatchId).toBe('gf-1');
    expect(sf[1].nextSlot).toBe(2);

    // 1 Grand Final
    const gf = bracket.find((m) => m.nextMatchId === null);
    expect(gf).toBeDefined();
    expect(gf?.id).toBe('gf-1');
    expect(gf?.roundName).toBe('Grand Final');
  });

  it('correctly builds 16-team bracket with 15 matches', () => {
    const bracket = buildEmptyBracket(16);
    expect(bracket).toHaveLength(15);

    const r16 = bracket.filter((m) => m.roundIndex === 0);
    expect(r16).toHaveLength(8);

    const qf = bracket.filter((m) => m.roundIndex === 1);
    expect(qf).toHaveLength(4);

    const sf = bracket.filter((m) => m.roundIndex === 2);
    expect(sf).toHaveLength(2);

    const gf = bracket.filter((m) => m.roundIndex === 3);
    expect(gf).toHaveLength(1);
  });
});
