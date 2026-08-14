import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpUser } from '../../lib/supabase';
import { useTournament } from '../../context/TournamentContext';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { loginAdmin } = useTournament();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Password dan konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal harus 6 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUpUser({
        email,
        password,
        fullName,
        organizationName,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        loginAdmin(password);
        navigate('/admin/match');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ minHeight: 'auto', padding: 36 }}>
        <div className="login-logo" style={{ marginBottom: 20 }}>
          <img src="/favicon.svg" alt="Apex Bracket" />
        </div>

        <h1>Pendaftaran Organizer</h1>
        <div className="login-sub">Buat Akun Penyelenggara Turnamen</div>

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

        <form onSubmit={handleRegister} className="login-form" style={{ marginTop: 24 }}>
          <div className="field">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama Lengkap Penyelenggara"
              required
            />
            <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>

          <div className="field">
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Nama Komunitas / Event Organizer (mis. MLBB Indo League)"
              required
            />
            <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>

          <div className="field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat Email (mis. admin@esports.com)"
              required
            />
            <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>

          <div className="field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 karakter)"
              required
            />
            <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>

          <div className="field">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi Password"
              required
            />
            <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>

          <button type="submit" className="signin" disabled={isLoading} style={{ marginTop: 8 }}>
            {isLoading ? 'Mendaftarkan...' : 'Daftar Akun Sekarang →'}
          </button>
        </form>

        <div style={{ marginTop: 24, fontSize: 14, color: 'var(--muted)' }}>
          Sudah punya akun Organizer?{' '}
          <Link to="/admin/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign In di sini
          </Link>
        </div>

        <div className="env" style={{ marginTop: 24 }}>
          <span className="env-dot" />
          SaaS Organizer Account Mode
        </div>
      </div>
    </div>
  );
}
