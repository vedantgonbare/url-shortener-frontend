import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login } from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(email, password);
      // Auto login after register
      const res = await login(email, password);
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
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
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e' }}>Create account</h1>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '4px' }}>
            Start shortening URLs for free
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

          <form onSubmit={handleRegister}>
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
                  border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#2D3748', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '8px',
                  border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#2D3748', display: 'block', marginBottom: '6px' }}>
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#718096' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4F46E5', fontWeight: '500' }}>
            Sign in
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