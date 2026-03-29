import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#f8f9fc',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', background: '#4F46E5',
            borderRadius: '12px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 12px',
            color: 'white', fontWeight: '700', fontSize: '22px'
          }}>L</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e' }}>Welcome back</h1>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '4px' }}>
            Sign in to your LinkSnap account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0'
        }}>
          {error && (
            <div style={{
              background: '#FFF5F5', border: '1px solid #FED7D7',
              borderRadius: '8px', padding: '12px 16px',
              color: '#C53030', fontSize: '14px', marginBottom: '20px'
            }}>{error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#2D3748', display: 'block', marginBottom: '6px' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vedant@example.com"
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '8px',
                  border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#2D3748', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '8px',
                  border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none'
                }}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', background: '#4F46E5',
              border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '15px', fontWeight: '600', opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#718096' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4F46E5', fontWeight: '500' }}>
            Sign up free
          </Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '12px' }}>
          <Link to="/" style={{ fontSize: '13px', color: '#A0AEC0' }}>
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}