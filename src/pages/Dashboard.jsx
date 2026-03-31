import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, shortenUrl, getQRCode } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortening, setShortening] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState('');
  const [showQR, setShowQR] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await getDashboard();
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleShorten = async (e) => {
    e.preventDefault();
    setShortening(true);
    setError('');
    setSuccess('');
    try {
      await shortenUrl(url, alias || null);
      setUrl('');
      setAlias('');
      setSuccess('URL shortened successfully!');
      fetchDashboard();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to shorten URL.');
    } finally {
      setShortening(false);
    }
  };

  const handleCopy = (short_code) => {
    navigator.clipboard.writeText(`http://127.0.0.1:8000/${short_code}`);
    setCopied(short_code);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f8f9fc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid #4F46E5',
          borderTop: '3px solid transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite', margin: '0 auto 16px'
        }} />
        <p style={{ color: '#718096' }}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fc' }}>

      {/* Sidebar */}
      <div style={{
        width: '240px', background: 'white', borderRight: '1px solid #eee',
        padding: '24px 16px', display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', marginBottom: '32px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#4F46E5',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: '700'
          }}>L</div>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>LinkSnap</span>
        </div>

        {/* Nav Items */}
        {[
          { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
          { id: 'links', icon: '🔗', label: 'My Links' },
          { id: 'analytics', icon: '📊', label: 'Analytics' },
        ].map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', border: 'none',
            background: activeTab === item.id ? '#EEF2FF' : 'transparent',
            color: activeTab === item.id ? '#4F46E5' : '#4a5568',
            fontSize: '14px', fontWeight: activeTab === item.id ? '600' : '400',
            width: '100%', textAlign: 'left', cursor: 'pointer',
            marginBottom: '4px'
          }}>
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}

        {/* Bottom - User */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{
            padding: '12px', background: '#f8f9fc', borderRadius: '8px',
            marginBottom: '8px'
          }}>
            <p style={{ fontSize: '12px', color: '#718096', marginBottom: '2px' }}>Signed in as</p>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a2e', wordBreak: 'break-all' }}>
              {data?.email}
            </p>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', background: 'none',
            border: '1px solid #e2e8f0', borderRadius: '8px',
            color: '#718096', fontSize: '13px', cursor: 'pointer'
          }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e' }}>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'links' && 'My Links'}
            {activeTab === 'analytics' && 'Analytics'}
          </h1>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '4px' }}>
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Metric Cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px', marginBottom: '32px'
        }}>
          {[
            { label: 'Total Links', value: data?.total_urls || 0, icon: '🔗', color: '#4F46E5', bg: '#EEF2FF' },
            { label: 'Total Clicks', value: data?.total_clicks || 0, icon: '👆', color: '#059669', bg: '#ECFDF5' },
            { label: 'Active Today', value: data?.urls?.filter(u => u.is_active).length || 0, icon: '✅', color: '#D97706', bg: '#FFFBEB' },
          ].map((card) => (
            <div key={card.label} style={{
              background: 'white', borderRadius: '16px', padding: '24px',
              border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#718096', marginBottom: '8px' }}>{card.label}</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e' }}>{card.value}</p>
                </div>
                <div style={{
                  width: '44px', height: '44px', background: card.bg,
                  borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '20px'
                }}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Shorten URL Form */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '24px',
          border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>
            ✂️ Shorten a new URL
          </h2>

          {success && (
            <div style={{
              background: '#F0FFF4', border: '1px solid #9AE6B4',
              borderRadius: '8px', padding: '10px 14px',
              color: '#276749', fontSize: '14px', marginBottom: '16px'
            }}>{success}</div>
          )}
          {error && (
            <div style={{
              background: '#FFF5F5', border: '1px solid #FED7D7',
              borderRadius: '8px', padding: '10px 14px',
              color: '#C53030', fontSize: '14px', marginBottom: '16px'
            }}>{error}</div>
          )}

          <form onSubmit={handleShorten}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-long-url.com"
                required
                style={{
                  flex: '2', minWidth: '200px', padding: '12px 16px',
                  borderRadius: '8px', border: '1px solid #E2E8F0',
                  fontSize: '14px', outline: 'none'
                }}
              />
              <input
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Custom alias (optional)"
                style={{
                  flex: '1', minWidth: '150px', padding: '12px 16px',
                  borderRadius: '8px', border: '1px solid #E2E8F0',
                  fontSize: '14px', outline: 'none'
                }}
              />
              <button type="submit" disabled={shortening} style={{
                padding: '12px 24px', background: '#4F46E5', border: 'none',
                borderRadius: '8px', color: 'white', fontSize: '14px',
                fontWeight: '600', opacity: shortening ? 0.7 : 1
              }}>
                {shortening ? 'Shortening...' : 'Shorten →'}
              </button>
            </div>
          </form>
        </div>

        {/* Links Table */}
        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid #f0f0f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e' }}>
              🔗 Your Links ({data?.total_urls || 0})
            </h2>
          </div>

          {!data?.urls?.length ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔗</p>
              <p style={{ color: '#718096', fontSize: '15px' }}>No links yet. Create your first one above!</p>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 120px',
                padding: '12px 24px', background: '#f8f9fc',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {['Original URL', 'Short Code', 'Clicks', 'Status', 'Actions'].map(h => (
                  <span key={h} style={{ fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                ))}
              </div>

              {/* Table Rows */}
              {data.urls.map((url) => (
                <div key={url.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 120px',
                  padding: '16px 24px', borderBottom: '1px solid #f9f9f9',
                  alignItems: 'center'
                }}>
                  {/* Original URL */}
                  <div>
                    <p style={{
                      fontSize: '14px', color: '#1a1a2e', fontWeight: '500',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      maxWidth: '280px'
                    }}>{url.original_url}</p>
                    <p style={{ fontSize: '12px', color: '#4F46E5', marginTop: '2px', fontFamily: 'monospace' }}>
                      127.0.0.1:8000/{url.short_code}
                    </p>
                  </div>

                  {/* Short Code */}
                  <span style={{
                    fontSize: '13px', fontFamily: 'monospace',
                    background: '#EEF2FF', color: '#4F46E5',
                    padding: '4px 8px', borderRadius: '6px', width: 'fit-content'
                  }}>{url.short_code}</span>

                  {/* Clicks */}
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                    {url.click_count}
                  </span>

                  {/* Status */}
                  <span style={{
                    fontSize: '12px', padding: '4px 10px', borderRadius: '20px',
                    background: url.is_active ? '#ECFDF5' : '#FFF5F5',
                    color: url.is_active ? '#059669' : '#C53030',
                    fontWeight: '500', width: 'fit-content'
                  }}>
                    {url.is_active ? 'Active' : 'Inactive'}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleCopy(url.short_code)} style={{
                      padding: '6px 12px', background: copied === url.short_code ? '#ECFDF5' : '#f8f9fc',
                      border: '1px solid #e2e8f0', borderRadius: '6px',
                      fontSize: '12px', color: copied === url.short_code ? '#059669' : '#4a5568',
                      cursor: 'pointer', fontWeight: '500'
                    }}>
                      {copied === url.short_code ? '✓' : 'Copy'}
                    </button>
                    <button onClick={() => setShowQR(showQR === url.short_code ? null : url.short_code)} style={{
                      padding: '6px 12px', background: '#f8f9fc',
                      border: '1px solid #e2e8f0', borderRadius: '6px',
                      fontSize: '12px', color: '#4a5568', cursor: 'pointer'
                    }}>QR</button>
                  </div>
                </div>
              ))}

              {/* QR Code Popup */}
              {showQR && (
                <div style={{
                  padding: '20px 24px', background: '#f8f9fc',
                  borderTop: '1px solid #f0f0f0', textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', color: '#718096', marginBottom: '12px' }}>
                    QR Code for /{showQR}
                  </p>
                  <img
                    src={getQRCode(showQR)}
                    alt="QR Code"
                    style={{ width: '150px', height: '150px', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
