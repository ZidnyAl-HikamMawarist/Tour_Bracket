import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTournament } from '../../context/TournamentContext';
import { signInUser } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { loginAdmin } = useTournament();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { error } = await signInUser({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        loginAdmin(password);
        navigate('/admin/match');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/favicon.svg" alt="Apex Bracket" />
        </div>

        <h1>Admin Workspace</h1>
        <div className="login-sub">Organizer Authentication</div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(255, 180, 171, 0.15)',
              border: '1px solid rgba(255, 180, 171, 0.3)',
              color: 'var(--danger)',
              padding: '10px 14px',
              borderRadius: 6,
              fontSize: 13,
              marginTop: 16,
              textAlign: 'left',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignIn} className="login-form">
          <div className="field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat Email Organizer"
              required
            />
            <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>

          <div className="field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>

          <div className="form-actions">
            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/admin/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Daftar Akun Baru
            </Link>
          </div>

          <button type="submit" className="signin" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>

        <div className="env">
          <span className="env-dot" />
          Production Organizer Cloud
        </div>
      </div>
    </div>
  );
}
