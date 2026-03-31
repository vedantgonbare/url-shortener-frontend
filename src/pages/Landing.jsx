import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenUrl } from '../services/api';

export default function Landing() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleShorten = async (e) => {
  e.preventDefault();
  if (!url) return;
  setLoading(true);
  setError('');
  setResult(null);
  try {
    // Add https:// if the URL doesn't have a protocol
    let formattedUrl = url.trim();
    if (!formattedUrl.match(/^https?:\/\//i)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    const res = await shortenUrl(formattedUrl);
    setResult(res.data);
  } catch (err) {
    setError('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleCopy = () => {
    navigator.clipboard.writeText(`${process.env.REACT_APP_API_URL}/${result.short_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc' }}>
      {/* Navbar */}
      <nav style={{
        background: 'white', borderBottom: '1px solid #eee',
        padding: '0 48px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#4F46E5',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px'
          }}>L</div>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>LinkSnap</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'none', border: '1px solid #e2e8f0',
            padding: '8px 20px', borderRadius: '8px', fontSize: '14px',
            color: '#4a5568', fontWeight: '500'
          }}>Login</button>
          <button onClick={() => navigate('/register')} style={{
            background: '#4F46E5', border: 'none',
            padding: '8px 20px', borderRadius: '8px', fontSize: '14px',
            color: 'white', fontWeight: '500'
          }}>Sign up free</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 48px 120px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-40px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '6px 16px', borderRadius: '20px', marginBottom: '24px'
          }}>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>
              ✨ Free URL shortener with analytics
            </span>
          </div>

          <h1 style={{
            fontSize: '52px', fontWeight: '700', color: 'white',
            lineHeight: '1.2', marginBottom: '16px'
          }}>
            Shorten URLs.<br />
            <span style={{ fontStyle: 'italic', fontWeight: '400' }}>Track everything.</span>
          </h1>
          <p style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.85)',
            marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px'
          }}>
            Create short, powerful links with real-time analytics, QR codes, and a beautiful dashboard.
          </p>

          {/* URL Input */}
          <form onSubmit={handleShorten} style={{
            display: 'flex', gap: '12px', maxWidth: '600px',
            margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center'
          }}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              style={{
                flex: '1', minWidth: '300px', padding: '16px 20px',
                borderRadius: '12px', border: 'none', fontSize: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', outline: 'none'
              }}
            />
            <button type="submit" disabled={loading} style={{
              padding: '16px 32px', background: '#1a1a2e', border: 'none',
              borderRadius: '12px', color: 'white', fontSize: '15px',
              fontWeight: '600', boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Shortening...' : 'Shorten →'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: '16px', color: '#fed7d7', fontSize: '14px'
            }}>{error}</div>
          )}

          {/* Result */}
          {result && (
            <div style={{
              marginTop: '20px', background: 'rgba(255,255,255,0.95)',
              borderRadius: '12px', padding: '16px 24px',
              maxWidth: '600px', margin: '20px auto 0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '12px', flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Your short link</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#4F46E5' }}>
                  http://127.0.0.1:8000/{result.short_code}
                </p>
              </div>
              <button onClick={handleCopy} style={{
                padding: '10px 20px', background: copied ? '#48BB78' : '#4F46E5',
                border: 'none', borderRadius: '8px', color: 'white',
                fontSize: '14px', fontWeight: '500', transition: 'background 0.2s'
              }}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px', maxWidth: '800px', margin: '-40px auto 0',
        padding: '0 24px', position: 'relative', zIndex: 10
      }}>
        {[
          { number: '10M+', label: 'Links Created' },
          { number: '500M+', label: 'Clicks Tracked' },
          { number: '99.9%', label: 'Uptime' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0'
          }}>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#4F46E5' }}>{stat.number}</p>
            <p style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 48px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', marginBottom: '48px', color: '#1a1a2e' }}>
          Everything you need
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Shorten any URL in milliseconds with our optimized infrastructure.' },
            { icon: '📊', title: 'Real Analytics', desc: 'Track clicks, monitor performance, and understand your audience.' },
            { icon: '🔒', title: 'Secure Links', desc: 'JWT authentication keeps your links and data safe.' },
            { icon: '📱', title: 'QR Codes', desc: 'Auto-generate QR codes for every shortened link.' },
            { icon: '⏰', title: 'Link Expiry', desc: 'Set expiration dates on links for time-sensitive campaigns.' },
            { icon: '🎯', title: 'Custom Aliases', desc: 'Create branded short links with your own custom alias.' },
          ].map((f) => (
            <div key={f.title} style={{
              background: 'white', borderRadius: '16px', padding: '28px',
              border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1a1a2e' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: '#4F46E5', padding: '64px 48px', textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'white', marginBottom: '16px' }}>
          Ready to get started?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px', fontSize: '16px' }}>
          Create your free account and start shortening URLs today.
        </p>
        <button onClick={() => navigate('/register')} style={{
          padding: '16px 40px', background: 'white', border: 'none',
          borderRadius: '12px', fontSize: '16px', fontWeight: '600',
          color: '#4F46E5', cursor: 'pointer'
        }}>
          Get started for free →
        </button>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#1a1a2e', padding: '24px 48px',
        textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px'
      }}>
        © 2026 LinkSnap · Built with FastAPI + React
      </footer>
    </div>
  );
}
