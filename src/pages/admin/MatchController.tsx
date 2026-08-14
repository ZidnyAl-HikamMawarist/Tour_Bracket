import { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Team } from '../../types/tournament';

export default function MatchController() {
  const {
    state,
    setMatchScore,
    setMatchWinner,
    setMatchStatus,
    undoLastAction,
    resetTournamentBracket,
  } = useTournament();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleScoreChange = (match: Match, teamIndex: 1 | 2, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentScore = (teamIndex === 1 ? match.score1 : match.score2) ?? 0;
    const newScore = Math.max(0, currentScore + delta);
    if (teamIndex === 1) {
      setMatchScore(match.id, newScore, match.score2);
    } else {
      setMatchScore(match.id, match.score1, newScore);
    }
  };

  const handleSetWinner = (match: Match, team: Team | null) => {
    if (!team) return;
    if (match.winnerId === team.id) {
      setMatchWinner(match.id, null);
      showToast(`Winner cleared for ${match.roundName}`);
    } else {
      setMatchWinner(match.id, team.id);
      showToast(`${team.name} advanced!`);
    }
  };

  const toggleLiveStatus = (match: Match, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = match.status === 'live' ? 'pending' : 'live';
    setMatchStatus(match.id, nextStatus);
  };

  // Group matches by round
  const round0Matches = state.matches.filter((m) => m.roundIndex === 0);
  const round1Matches = state.matches.filter((m) => m.roundIndex === 1);
  const grandFinal = state.matches.find((m) => m.nextMatchId === null);

  const renderTeamRow = (match: Match, team: Team | null, score: number | null, isTeam1: boolean) => {
    const isWinner = match.winnerId && team && match.winnerId === team.id;
    const isLoser = match.winnerId && team && match.winnerId !== team.id;

    if (!team) {
      return (
        <div className="team tbd">
          <div className="team-left">
            <span className="badge">?</span>
            <span className="team-name">TBD</span>
          </div>
          <span className="score">-</span>
        </div>
      );
    }

    const classes = ['team'];
    if (isWinner) classes.push('winner');
    if (isLoser) classes.push('dim');

    return (
      <div
        className={classes.join(' ')}
        onClick={() => handleSetWinner(match, team)}
        title="Click to declare / toggle winner"
      >
        <div className="team-left">
          <span className="badge">
            {team.logo ? <img src={team.logo} alt={team.name} /> : team.shortName}
          </span>
          <span className="team-name">{team.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="score-controls">
            <button className="score-btn" onClick={(e) => handleScoreChange(match, isTeam1 ? 1 : 2, -1, e)}>-</button>
            <button className="score-btn" onClick={(e) => handleScoreChange(match, isTeam1 ? 1 : 2, 1, e)}>+</button>
          </div>
          <span className="score">{score !== null && score !== undefined ? score : '-'}</span>
        </div>
      </div>
    );
  };

  const renderMatchBlock = (match: Match | undefined, posClass: string) => {
    if (!match) return null;
    return (
      <div className={`match ${posClass}`}>
        <span
          className={`live-badge ${match.status !== 'live' ? 'inactive' : ''}`}
          onClick={(e) => toggleLiveStatus(match, e)}
        >
          {match.status === 'live' ? 'LIVE' : 'SET LIVE'}
        </span>
        {renderTeamRow(match, match.team1, match.score1, true)}
        {renderTeamRow(match, match.team2, match.score2, false)}
      </div>
    );
  };

  return (
    <div className="match-content">
      <div className="content">
        {/* Toast */}
        {toastMessage && <div className="toast">{toastMessage}</div>}

        {/* Header */}
        <div className="match-head">
          <div className="title-wrap">
            <div className="title-logo">
              <img src={state.settings.logoUrl || '/favicon.svg'} alt="Apex Bracket" />
            </div>
            <div>
              <h1 className="page-title">Match Controller</h1>
              <p className="eyebrow">Quarter-Finals Live</p>
            </div>
          </div>
          <div className="actions">
            <button className="btn" onClick={resetTournamentBracket}>↻ Reload Data</button>
            {state.history.length > 0 && (
              <button className="btn" onClick={undoLastAction}>Undo ({state.history.length})</button>
            )}
            <a href="/viewer" target="_blank" rel="noreferrer" className="btn primary">Publish Results ↗</a>
          </div>
        </div>

        {/* Bracket Grid */}
        <div className="bracket">
          {/* Column 1: Quarter Finals */}
          <div className="col">
            {renderMatchBlock(round0Matches[0], 'm1')}
            {renderMatchBlock(round0Matches[1], 'm2')}
            {renderMatchBlock(round0Matches[2], 'm3')}
            {renderMatchBlock(round0Matches[3], 'm4')}
          </div>

          {/* Column 2: Semi Finals */}
          <div className="col semi">
            {round1Matches.map((m) => (
              <div key={m.id} className="match relative">
                {m.status === 'live' && (
                  <span className="live-badge" onClick={(e) => toggleLiveStatus(m, e)}>LIVE</span>
                )}
                {renderTeamRow(m, m.team1, m.score1, true)}
                {renderTeamRow(m, m.team2, m.score2, false)}
              </div>
            ))}
          </div>

          {/* Column 3: Grand Final */}
          {grandFinal && (
            <div className="col grand">
              <div style={{ width: '100%' }}>
                <div className="grand-title">GRAND FINAL</div>

                <div className="match relative" style={{ position: 'relative', alignItems: 'center' }}>
                  <span
                    className={`live-badge ${grandFinal.status !== 'live' ? 'inactive' : ''}`}
                    onClick={(e) => toggleLiveStatus(grandFinal, e)}
                    style={{ position: 'static', transform: 'none', marginBottom: 12 }}
                  >
                    {grandFinal.status === 'live' ? 'LIVE MATCH' : 'SET LIVE'}
                  </span>

                  <div style={{ width: '100%' }}>
                    {/* Finalist 1 */}
                    {renderTeamRow(grandFinal, grandFinal.team1, grandFinal.score1, true)}

                    {/* Podium */}
                    <div className="podium">♕</div>

                    {/* Finalist 2 */}
                    {renderTeamRow(grandFinal, grandFinal.team2, grandFinal.score2, false)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
