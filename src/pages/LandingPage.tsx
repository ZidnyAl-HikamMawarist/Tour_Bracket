import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header / Navbar */}
      <header
        style={{
          height: 80,
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--line)',
          background: 'rgba(19, 27, 46, 0.8)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/favicon.svg" alt="Apex Bracket" style={{ width: 36, height: 36 }} />
          <span style={{ font: '700 22px Montserrat', color: 'var(--accent)', letterSpacing: '-0.5px' }}>
            APEX BRACKET
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#features" style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 500 }}>
            Fitur
          </a>
          <a href="#how-it-works" style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 500 }}>
            Cara Kerja
          </a>
          <a href="#games" style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 500 }}>
            Game Dukungan
          </a>
          <Link
            to="/admin/login"
            style={{
              padding: '8px 18px',
              borderRadius: 6,
              background: 'rgba(45, 52, 73, 0.6)',
              border: '1px solid var(--line)',
              color: 'var(--text)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Sign In
          </Link>
          <Link
            to="/admin/register"
            style={{
              padding: '8px 20px',
              borderRadius: 6,
              background: 'var(--accent)',
              color: 'var(--accent-dark)',
              fontSize: 13,
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(165, 216, 255, 0.3)',
            }}
          >
            Daftar Akun Gratis ↗
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '96px 24px 64px',
          maxWidth: 1200,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(225, 240, 255, 0.08)',
            border: '1px solid rgba(225, 240, 255, 0.2)',
            color: 'var(--accent)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1.2,
            marginBottom: 24,
            textTransform: 'uppercase',
          }}
        >
          <span>🏆 Platform SaaS Turnamen E-Sports &amp; MLBB #1</span>
        </div>

        <h1
          style={{
            font: '700 56px/64px Montserrat',
            letterSpacing: '-1.5px',
            maxWidth: 960,
            margin: '0 auto 24px',
            background: 'linear-gradient(180deg, #ffffff 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Sistem Bagan Turnamen Real-Time Beranimasi Siap OBS Stream &amp; Proyektor
        </h1>

        <p
          style={{
            color: 'var(--muted)',
            fontSize: 18,
            lineHeight: '30px',
            maxWidth: 760,
            margin: '0 auto 40px',
          }}
        >
          Platform khusus untuk penyelenggara turnamen Mobile Legends, Valorant, Apex Legends &amp; PUBG.
          Kelola peserta, update skor real-time via Supabase Cloud, dan tampilkan bagan beranimasi profesional di OBS / layar proyektor dalam hitungan detik.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link
            to="/admin/register"
            style={{
              padding: '16px 36px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: 'var(--accent-dark)',
              font: '700 16px Montserrat',
              boxShadow: '0 0 25px rgba(165, 216, 255, 0.4)',
            }}
          >
            🚀 Buat Turnamen Sekarang
          </Link>
          <Link
            to="/viewer"
            target="_blank"
            style={{
              padding: '16px 32px',
              borderRadius: 8,
              background: 'var(--panel2)',
              border: '1px solid var(--line)',
              color: 'var(--text)',
              font: '600 16px Montserrat',
            }}
          >
            📺 Lihat Live Viewer Demo ↗
          </Link>
        </div>

        {/* Live Preview Banner Card */}
        <div
          style={{
            marginTop: 64,
            padding: 24,
            borderRadius: 16,
            background: 'rgba(19, 27, 46, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 16,
              borderBottom: '1px solid var(--line)',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <span style={{ font: '600 12px Montserrat', color: 'var(--accent)', letterSpacing: 1.5 }}>
              ● LIVE OBS BROADCAST PREVIEW
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              textAlign: 'left',
            }}
          >
            <div style={{ background: 'var(--panel2)', padding: 16, borderRadius: 8, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase' }}>Quarter-Finals (Bo3)</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--accent)' }}>
                <span>Cybernetic Ravens</span> <b>2 ● ●</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5, marginTop: 8 }}>
                <span>Void Walkers</span> <b>0 ○ ○</b>
              </div>
            </div>

            <div style={{ background: 'var(--panel2)', padding: 16, borderRadius: 8, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase' }}>Semi-Finals (Bo3)</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--accent)' }}>
                <span>Abyssal Kings</span> <b>2 ● ●</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5, marginTop: 8 }}>
                <span>Quantum Sentinels</span> <b>1 ● ○</b>
              </div>
            </div>

            <div style={{ background: 'rgba(211, 197, 173, 0.1)', padding: 16, borderRadius: 8, border: '1px solid rgba(211, 197, 173, 0.3)' }}>
              <div style={{ fontSize: 11, color: 'var(--gold)', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>♕ Grand Final Champion</div>
              <div style={{ font: '700 20px Montserrat', color: 'var(--gold)' }}>Cybernetic Ravens</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Grand Final Score: 4 - 2</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" style={{ padding: '80px 24px', background: 'var(--panel)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ font: '700 36px Montserrat', letterSpacing: '-0.5px' }}>Fitur Unggulan Penyelenggara Turnamen</h2>
            <p style={{ color: 'var(--muted)', fontSize: 16, marginTop: 8 }}>Segala yang Anda butuhkan untuk siaran langsung e-sports kelas dunia.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            <div style={{ background: 'var(--panel2)', padding: 32, borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>🎨</div>
              <h3 style={{ font: '600 20px Montserrat', marginBottom: 12 }}>Multi-Game Theme Switcher</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: '22px' }}>
                Pilih tema visual instan sesuai game: <b>MLBB Gold</b>, <b>Valorant Red</b>, <b>Apex Navy</b>, dan <b>PUBG Emerald</b>.
              </p>
            </div>

            <div style={{ background: 'var(--panel2)', padding: 32, borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>⚡</div>
              <h3 style={{ font: '600 20px Montserrat', marginBottom: 12 }}>Supabase Cloud Real-Time</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: '22px' }}>
                Update skor dari dashboard admin langsung ter-broadcast ke OBS / layar proyektor dalam waktu &lt;15ms via WebSocket.
              </p>
            </div>

            <div style={{ background: 'var(--panel2)', padding: 32, borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>⚔️</div>
              <h3 style={{ font: '600 20px Montserrat', marginBottom: 12 }}>Best of N &amp; Dot Score</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: '22px' }}>
                Dukungan seri Bo1, Bo3, Bo5, Bo7 dengan penanda skor dot kemenangan (<b>● ● ○</b>) otomatis.
              </p>
            </div>

            <div style={{ background: 'var(--panel2)', padding: 32, borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
              <h3 style={{ font: '600 20px Montserrat', marginBottom: 12 }}>Multi-Organizer Account</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: '22px' }}>
                Setiap penyelenggara memiliki akun sendiri dengan proteksi database RLS (*Row Level Security*) aman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ font: '700 36px Montserrat' }}>3 Langkah Mudah Memulai Turnamen</h2>
            <p style={{ color: 'var(--muted)', fontSize: 16, marginTop: 8 }}>Tanpa instalasi software rumit, cukup jalankan lewat browser.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, textAlign: 'center' }}>
            <div style={{ background: 'rgba(45, 52, 73, 0.2)', padding: 32, borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-dark)', font: '700 20px Montserrat', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>1</div>
              <h3 style={{ font: '600 20px Montserrat', marginBottom: 12 }}>Daftar &amp; Buat Event</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: '22px' }}>
                Buat akun penyelenggara gratis, atur nama turnamen, dan pilih tema warna visual game.
              </p>
            </div>

            <div style={{ background: 'rgba(45, 52, 73, 0.2)', padding: 32, borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-dark)', font: '700 20px Montserrat', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>2</div>
              <h3 style={{ font: '600 20px Montserrat', marginBottom: 12 }}>Input Tim &amp; Shuffle</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: '22px' }}>
                Daftarkan tim peserta beserta logo, lalu tekan tombol <i>Auto-Shuffle</i> untuk mengacak bagan otomatis.
              </p>
            </div>

            <div style={{ background: 'rgba(45, 52, 73, 0.2)', padding: 32, borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-dark)', font: '700 20px Montserrat', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>3</div>
              <h3 style={{ font: '600 20px Montserrat', marginBottom: 12 }}>Broadcast &amp; Update Live</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: '22px' }}>
                Buka link Live Viewer di OBS Stream Browser Source atau proyektor. Update skor via Match Controller!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '32px 48px', background: 'var(--panel)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/favicon.svg" alt="Apex Bracket" style={{ width: 28, height: 28 }} />
            <span style={{ font: '600 16px Montserrat', color: 'var(--accent)' }}>APEX BRACKET</span>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            &copy; 2026 Apex Bracket SaaS. Built for E-Sports Tournament Organizers.
          </div>
        </div>
      </footer>
    </div>
  );
}
