import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Team } from '../../types/tournament';

export default function LiveViewer() {
  const { state } = useTournament();

  const theme = state.settings.theme || 'apex_navy';
  const defaultBestOf = state.settings.defaultBestOf || 3;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const round0Matches = state.matches.filter((m) => m.roundIndex === 0);
  const round1Matches = state.matches.filter((m) => m.roundIndex === 1);
  const grandFinal = state.matches.find((m) => m.nextMatchId === null);

  const renderBestOfDots = (score: number | null, bestOf: number = 3) => {
    const winsNeeded = Math.ceil(bestOf / 2);
    const currentScore = score ?? 0;
    const dots = [];
    for (let i = 0; i < winsNeeded; i++) {
      dots.push(<span key={i} className={i < currentScore ? 'won' : ''} />);
    }
    return <span className="dot-score">{dots}</span>;
  };

  const renderMatchCard = (match: Match) => {
    const hasWinner = !!match.winnerId;
    const currentBestOf = match.bestOf || defaultBestOf;

    const renderRow = (team: Team | null, score: number | null, isFirst: boolean) => {
      const isWinner = match.winnerId && team && match.winnerId === team.id;
      const isLoser = match.winnerId && team && match.winnerId !== team.id;

      const rowClasses = ['row'];
      if (isWinner) rowClasses.push('winner-row-viewer');
      if (isLoser) rowClasses.push('loser-row-viewer');

      return (
        <div className={rowClasses.join(' ')} key={isFirst ? 'r1' : 'r2'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            {match.roundIndex > 0 && team && <span>🎮</span>}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {team ? team.name : 'TBD'}
            </span>
            {team && renderBestOfDots(score, currentBestOf)}
          </div>
          <b style={{ fontFamily: 'Montserrat', fontWeight: 600, minWidth: 16, textAlign: 'right' }}>
            {score !== null && score !== undefined ? score : '-'}
          </b>
        </div>
      );
    };

    return (
      <motion.div
        key={match.id}
        layout
        className={`viewer-match ${hasWinner ? 'active' : ''} ${match.roundIndex >= 1 ? 'semi-match' : ''}`}
      >
        {renderRow(match.team1, match.score1, true)}
        {renderRow(match.team2, match.score2, false)}

        {match.status === 'live' && (
          <span className="viewer-live-badge">LIVE</span>
        )}
      </motion.div>
    );
  };

  return (
    <>
      {/* Header */}
      <header className="viewer-header">
        <div className="broadcast">
          LIVE BROADCAST
          <b>APEX BRACKET</b>
        </div>

        <div className="live-pill">● LIVE</div>

        <div className="series">
          <small>{state.settings.seriesSubtitle} • BEST OF {defaultBestOf}</small>
          <h1>{state.settings.tournamentName}</h1>
          <hr />
        </div>
      </header>

      {/* Bracket Grid */}
      <div className="viewer-bracket">
        {/* Column 1: Quarter Finals */}
        <div className="viewer-col">
          {round0Matches.slice(0, 2).map((m) => renderMatchCard(m))}
        </div>

        {/* If more QF matches */}
        {round0Matches.length > 2 && (
          <div className="viewer-col">
            {round0Matches.slice(2, 4).map((m) => renderMatchCard(m))}
          </div>
        )}

        {/* Column 2: Semi Finals */}
        {round1Matches.length > 0 && (
          <div className="viewer-col viewer-semis">
            {round1Matches.map((m) => renderMatchCard(m))}
          </div>
        )}

        {/* Column 3: Grand Final */}
        {grandFinal && (
          <div className="grand-view">
            <div className="grand-label">
              ♕<br />
              GRAND FINAL (Bo{grandFinal.bestOf || defaultBestOf})
            </div>

            {state.champion ? (
              <motion.div layout className="champion">
                {/* Winner Row */}
                <div className="winner-row">
                  <div>
                    <small style={{ color: 'rgba(211,197,173,0.7)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 4 }}>
                      Champion
                    </small>
                    <div className="champion-name">{state.champion.name}</div>
                    <div style={{ marginTop: 8 }}>
                      {renderBestOfDots(
                        grandFinal.winnerId === grandFinal.team1?.id ? grandFinal.score1 : grandFinal.score2,
                        grandFinal.bestOf || defaultBestOf
                      )}
                    </div>
                  </div>
                  <div className="champion-score">
                    {grandFinal.winnerId === grandFinal.team1?.id ? grandFinal.score1 ?? 4 : grandFinal.score2 ?? 4}
                  </div>
                </div>

                {/* Loser Row */}
                <div className="loser-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    ◯ {grandFinal.winnerId === grandFinal.team1?.id
                      ? grandFinal.team2?.name ?? 'Runner Up'
                      : grandFinal.team1?.name ?? 'Runner Up'}
                  </span>
                  <span style={{ fontFamily: 'Montserrat', fontSize: 24 }}>
                    {grandFinal.winnerId === grandFinal.team1?.id
                      ? grandFinal.score2 ?? 0
                      : grandFinal.score1 ?? 0}
                  </span>
                </div>

                {grandFinal.status === 'live' && (
                  <span className="viewer-live-badge" style={{ right: -12, top: -12 }}>LIVE MATCH</span>
                )}
              </motion.div>
            ) : (
              <motion.div layout className="viewer-match" style={{ width: '100%' }}>
                <div className="row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{grandFinal.team1 ? grandFinal.team1.name : 'Awaiting Finalist'}</span>
                    {grandFinal.team1 && renderBestOfDots(grandFinal.score1, grandFinal.bestOf || defaultBestOf)}
                  </div>
                  <b style={{ fontFamily: 'Montserrat' }}>{grandFinal.score1 ?? '-'}</b>
                </div>
                <div className="row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{grandFinal.team2 ? grandFinal.team2.name : 'Awaiting Finalist'}</span>
                    {grandFinal.team2 && renderBestOfDots(grandFinal.score2, grandFinal.bestOf || defaultBestOf)}
                  </div>
                  <b style={{ fontFamily: 'Montserrat' }}>{grandFinal.score2 ?? '-'}</b>
                </div>
                {grandFinal.status === 'live' && (
                  <span className="viewer-live-badge">LIVE MATCH</span>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Powered by */}
      <div className="powered">
        Powered by
        <img src={state.settings.logoUrl || '/favicon.svg'} alt="Apex Bracket" />
      </div>

      {/* Ticker */}
      <div className="viewer-footer">
        <div className="ticker">{state.settings.tickerText}</div>
      </div>
    </>
  );
}
