import React, { useState, useRef } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Team } from '../../types/tournament';
import { useNavigate } from 'react-router-dom';

export default function Participants() {
  const { state, addTeam, deleteTeam, toggleTeamStatus, shuffleAndGenerateBracket } = useTournament();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState('');
  const [seed, setSeed] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'waitlist'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    const sName = teamName.substring(0, 3).toUpperCase();
    const seedNumber = seed.trim() ? parseInt(seed, 10) : undefined;

    addTeam({
      name: teamName.trim(),
      shortName: sName,
      seed: seedNumber && !isNaN(seedNumber) ? seedNumber : undefined,
      logo: logoPreview || undefined,
      status: 'draft_ready',
    });

    setTeamName('');
    setSeed('');
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast(`Team "${teamName}" registered!`);
  };

  const handleGenerate = () => {
    shuffleAndGenerateBracket(false);
    showToast('Bracket generated successfully!');
    setTimeout(() => navigate('/admin/match'), 400);
  };

  const filteredTeams = state.teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'waitlist') return t.status === 'waitlist';
    return true;
  });

  const waitlistCount = state.teams.filter((t) => t.status === 'waitlist').length;

  return (
    <div className="content">
      {/* Toast */}
      {toastMessage && <div className="toast">{toastMessage}</div>}

      {/* Header */}
      <div className="roster-head">
        <div>
          <div className="roster-title">
            <h1>ROSTER COMMAND</h1>
          </div>
          <p>
            Manage registered teams, verify participant details, and finalize the<br />
            tournament lineup before generating the competition bracket.
          </p>
        </div>
        <button className="generate" onClick={handleGenerate}>↗ &nbsp; Shuffle &amp; Generate Bracket</button>
      </div>

      {/* Grid */}
      <div className="participants-grid">
        {/* Left Column: Add Participant Form & Stats */}
        <div>
          <div className="card">
            <h2>♙ Add Participant</h2>
            <form onSubmit={handleRegister}>
              <label className="label">Team Name</label>
              <input
                type="text"
                className="roster-input"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Quantum Sentinels"
                style={{ marginBottom: 20 }}
                required
              />

              <label className="label">Team Logo (Optional)</label>
              <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
              <div className="upload" onClick={() => fileInputRef.current?.click()}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" />
                ) : (
                  <div>☁<br />Drag &amp; drop or click to upload</div>
                )}
              </div>

              <label className="label" style={{ marginTop: 24 }}>Seed Override</label>
              <input
                type="number"
                className="roster-input"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="#  Auto"
              />

              <button type="submit" className="register" style={{ marginTop: 28 }}>＋ REGISTER TEAM</button>
            </form>
          </div>

          <div className="stats">
            <div>
              <span className="label">Total Teams</span>
              <strong>{state.teams.length}</strong>
            </div>
            <div className="stats-icon">▥</div>
          </div>
        </div>

        {/* Right Column: Filter Bar & Teams Grid */}
        <div>
          <div className="filters">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All ({state.teams.length})
              </button>
              <button
                className={`tab ${activeTab === 'waitlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('waitlist')}
              >
                Waitlist ({waitlistCount})
              </button>
            </div>
            <input
              type="text"
              className="roster-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="⌕  Search roster..."
            />
          </div>

          <div className="team-grid">
            {filteredTeams.map((team: Team) => {
              const isReady = team.status === 'draft_ready';
              return (
                <div key={team.id} className="team-card">
                  <div className="team-logo">
                    {team.logo ? (
                      <img src={team.logo} alt={team.name} />
                    ) : (
                      team.shortName
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3>{team.name}</h3>
                    <div className="meta">
                      {team.seed ? `Seed ${team.seed}` : 'Unseeded'}
                      {' · '}
                      <button onClick={() => toggleTeamStatus(team.id)}>
                        {isReady ? 'Move to Waitlist' : 'Set Ready'}
                      </button>
                    </div>
                  </div>
                  <span className={`tag ${!isReady ? 'pending' : ''}`}>
                    {isReady ? '● DRAFT READY' : '● PENDING INFO'}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTeam(team.id)}
                    title="Hapus Tim"
                    aria-label="Hapus Tim"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
