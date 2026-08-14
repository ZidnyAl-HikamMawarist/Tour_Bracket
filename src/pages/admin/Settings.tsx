import React, { useState, useRef } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { ThemeMode, BestOfMode } from '../../types/tournament';

export default function Settings() {
  const { state, updateSettings, purgeAllData, isUsingSupabase } = useTournament();

  const [form, setForm] = useState({
    tournamentName: state.settings.tournamentName,
    seriesSubtitle: state.settings.seriesSubtitle,
    gameTitle: state.settings.gameTitle,
    logoUrl: state.settings.logoUrl,
    capacity: state.settings.capacity,
    format: state.settings.format,
    matchPointEnabled: state.settings.matchPointEnabled,
    thirdPlaceDecider: state.settings.thirdPlaceDecider,
    autoAdvanceByes: state.settings.autoAdvanceByes,
    tickerText: state.settings.tickerText,
    theme: state.settings.theme || 'apex_navy',
    defaultBestOf: state.settings.defaultBestOf || 3,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDangerModal, setShowDangerModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setForm((prev) => ({ ...prev, logoUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    showToast('Settings saved successfully!');
  };

  const themes: { id: ThemeMode; name: string; game: string; colors: string[] }[] = [
    { id: 'apex_navy', name: 'Apex Navy', game: 'Apex Legends / Default', colors: ['#0b1326', '#131b2e', '#e1f0ff', '#d3c5ad'] },
    { id: 'valorant_red', name: 'Valorant Red', game: 'Valorant / Crimson', colors: ['#0f1923', '#1b2733', '#ff4655', '#f3e5ab'] },
    { id: 'mlbb_gold', name: 'MLBB Gold', game: 'Mobile Legends / Royal', colors: ['#120b24', '#1d1238', '#ffcc00', '#ffd700'] },
    { id: 'pubg_emerald', name: 'PUBG Emerald', game: 'PUBG / Emerald Green', colors: ['#0c1810', '#14261b', '#2ecc71', '#f39c12'] },
  ];

  return (
    <div className="content">
      {/* Toast */}
      {toastMessage && <div className="toast">{toastMessage}</div>}

      {/* Danger Modal */}
      {showDangerModal && (
        <div className="danger-modal-overlay">
          <div className="danger-modal">
            <h3 style={{ color: 'var(--danger)', font: '700 20px Montserrat' }}>⚠ Confirm Reset System</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: '20px', marginTop: 16 }}>
              Resetting the system will purge all current bracket data, participant lists, and match histories. This action cannot be undone.
            </p>
            <div className="danger-modal-actions">
              <button className="danger-modal-cancel" onClick={() => setShowDangerModal(false)}>Cancel</button>
              <button className="danger-modal-confirm" onClick={() => { purgeAllData(); setShowDangerModal(false); showToast('System reset complete.'); }}>
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="page-title">Tournament Settings</h1>
      <p style={{ color: 'var(--muted)', fontSize: 18, lineHeight: '28px', margin: '8px 0 32px', maxWidth: 672 }}>
        Configure global parameters for the current event. Changes made here may impact live brackets if matches have already commenced.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="settings-layout">
          <div>
            {/* Visual Theme Preset Switcher */}
            <div className="section">
              <h2>Visual Theme Preset</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>
                Select a game-inspired color theme. Applied instantly across Admin &amp; Live Broadcast screens.
              </p>

              <div className="theme-grid">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    className={`theme-card ${form.theme === t.id ? 'active' : ''}`}
                    onClick={() => {
                      setForm((prev) => ({ ...prev, theme: t.id }));
                      document.documentElement.setAttribute('data-theme', t.id);
                    }}
                  >
                    <div className="theme-preview-bar">
                      {t.colors.map((c, idx) => (
                        <div key={idx} style={{ flex: 1, background: c }} />
                      ))}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: 14 }}>{t.name}</strong>
                      <small style={{ color: 'var(--muted)', fontSize: 11 }}>{t.game}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Details */}
            <div className="section">
              <h2>Core Details</h2>
              <div className="setting-group">
                <label className="label">Tournament Name</label>
                <input
                  type="text"
                  className="input-static"
                  value={form.tournamentName}
                  onChange={(e) => setForm({ ...form, tournamentName: e.target.value })}
                  required
                />
              </div>
              <div className="setting-group">
                <label className="label">Event Branding</label>
                <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                <div className="branding">
                  <div className="branding-preview">
                    <img src={form.logoUrl || '/favicon.svg'} alt="Apex Bracket" />
                  </div>
                  <div>
                    <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: '20px', marginBottom: 12 }}>
                      Upload the official primary crest or wordmark. Supported formats: PNG, SVG (Max 5MB).
                    </p>
                    <button type="button" className="replace" onClick={() => fileInputRef.current?.click()}>
                      ▧ Replace Image
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bracket Structure */}
            <div className="section">
              <h2>Bracket Structure &amp; Series Format</h2>
              <div className="two">
                <div>
                  <label className="label">Participant Capacity</label>
                  <select
                    className="select-static"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value, 10) as 8 | 16 })}
                  >
                    <option value={8}>8 Teams (Quarter-Finals)</option>
                    <option value={16}>16 Teams (Round of 16)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Match Series Format (Best of N)</label>
                  <select
                    className="select-static"
                    value={form.defaultBestOf}
                    onChange={(e) => setForm({ ...form, defaultBestOf: parseInt(e.target.value, 10) as BestOfMode })}
                  >
                    <option value={1}>Best of 1 (First to 1 Win)</option>
                    <option value={3}>Best of 3 (First to 2 Wins)</option>
                    <option value={5}>Best of 5 (First to 3 Wins)</option>
                    <option value={7}>Best of 7 (First to 4 Wins)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Match Protocol */}
            <div className="section">
              <h2>Match Protocol</h2>

              <div className="toggle-row">
                <div>
                  <strong>Enable Match Point Format</strong>
                  <small>Teams must reach a point threshold before becoming match-point eligible.</small>
                </div>
                <span
                  className={`toggle ${form.matchPointEnabled ? 'on' : ''}`}
                  onClick={() => setForm({ ...form, matchPointEnabled: !form.matchPointEnabled })}
                />
              </div>

              <div className="toggle-row">
                <div>
                  <strong>Third-Place Decider</strong>
                  <small>Generate a secondary match for semi-final losers.</small>
                </div>
                <span
                  className={`toggle ${form.thirdPlaceDecider ? 'on' : ''}`}
                  onClick={() => setForm({ ...form, thirdPlaceDecider: !form.thirdPlaceDecider })}
                />
              </div>

              <div className="toggle-row">
                <div>
                  <strong>Auto-Advance Byes</strong>
                  <small>Automatically progress higher-seeded teams in unbalanced brackets.</small>
                </div>
                <span
                  className={`toggle ${form.autoAdvanceByes ? 'on' : ''}`}
                  onClick={() => setForm({ ...form, autoAdvanceByes: !form.autoAdvanceByes })}
                />
              </div>
            </div>

            {/* Ticker Text */}
            <div className="section">
              <h2>Broadcast Ticker</h2>
              <div className="setting-group">
                <label className="label">Running Text</label>
                <input
                  type="text"
                  className="input-static"
                  value={form.tickerText}
                  onChange={(e) => setForm({ ...form, tickerText: e.target.value })}
                />
              </div>
            </div>

            {/* Save Button */}
            <div style={{ padding: '16px 0 48px', overflow: 'auto' }}>
              <button type="submit" className="save">▣ &nbsp; Save Configuration</button>
            </div>
          </div>

          {/* Aside: System Status & Danger Zone */}
          <aside>
            <div className="status">
              <div className="status-title">SYSTEM STATUS</div>
              <div className="status-line">
                <span>Data Store</span>
                <span style={{ color: isUsingSupabase ? '#4ade80' : 'var(--accent)' }}>
                  {isUsingSupabase ? '● Supabase Realtime' : '● Local Channel'}
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--panel3)', margin: '12px 0', borderRadius: 12 }}>
                <div style={{ width: isUsingSupabase ? '100%' : '12%', height: '100%', background: isUsingSupabase ? '#4ade80' : 'var(--accent)', borderRadius: 12 }} />
              </div>
              <div className="status-line">
                <span>API Sync Rate</span>
                <span style={{ fontFamily: 'monospace' }}>{isUsingSupabase ? '15ms (Supabase)' : '0ms (Cross-Tab)'}</span>
              </div>
            </div>

            <div className="danger">
              <h3>⚠ Danger Zone</h3>
              <p>Resetting the system will purge all current bracket data, participant lists, and match histories. This action cannot be undone.</p>
              <button type="button" onClick={() => setShowDangerModal(true)}>▣ &nbsp; RESET SYSTEM</button>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
