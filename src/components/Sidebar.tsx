import { NavLink } from 'react-router-dom';
import { useTournament } from '../context/TournamentContext';

export default function Sidebar() {
  const { state } = useTournament();

  return (
    <aside className="sidebar">
      <div>
        {/* Brand */}
        <div className="brand">
          <img src={state.settings.logoUrl || '/favicon.svg'} alt="Apex Bracket" />
          <span>APEX BRACKET</span>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <NavLink to="/admin/match" className={({ isActive }) => isActive ? 'active' : ''}>
            <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
            Match Controller
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
            Tournament Settings
          </NavLink>
          <NavLink to="/admin/participants" className={({ isActive }) => isActive ? 'active' : ''}>
            <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zm-4.07 11c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
            Participants
          </NavLink>
        </nav>

        {/* Quick Live Viewer Button */}
        <a href="/viewer" target="_blank" rel="noreferrer" className="sidebar-viewer-btn">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="sidebar-viewer-dot" />
            Live Viewer Screen
          </span>
          <span>↗</span>
        </a>
      </div>

      {/* Userbox */}
      <div className="userbox">
        <div className="user-avatar">♙</div>
        <div>
          <div className="user-name">Tournament Admin</div>
          <div className="user-role">System Operator</div>
        </div>
      </div>
    </aside>
  );
}
