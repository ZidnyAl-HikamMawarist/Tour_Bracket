import { useTournament } from '../context/TournamentContext';

export default function Topbar() {
  const { isUsingSupabase } = useTournament();

  return (
    <header className="topbar">
      <div className="search">
        <span>⌕</span>
        <span>Quick Search...</span>
      </div>
      <div className="server">
        <span>
          <i
            className="online-dot"
            style={{
              background: isUsingSupabase ? '#4ade80' : 'var(--accent)',
              boxShadow: isUsingSupabase ? '0 0 10px #4ade80' : '0 0 8px rgba(165,216,255,0.7)',
            }}
          />
          {isUsingSupabase ? 'Server: Supabase Connected' : 'Server: Online (Local Channel)'}
        </span>
        <span style={{ color: 'var(--muted)', fontSize: 16 }}>♧ &nbsp;?</span>
      </div>
    </header>
  );
}
