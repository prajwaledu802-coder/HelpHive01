import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AnimatedButton from '../components/ui/AnimatedButton';
import { useAuth } from '../context/AuthContext';

const GOOGLE_SCRIPT_ID = 'google-identity-services';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });

const LoginPage = () => {
  const { login, loginAsRole, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('volunteer');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef(null);
  const roleRef = useRef('volunteer');

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'admin' || roleFromQuery === 'volunteer') {
      setRole(roleFromQuery);
      roleRef.current = roleFromQuery;
    }
  }, [searchParams]);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    if (!user?.role) return;
    navigate('/role-selection', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current) {
      return;
    }

    let mounted = true;

    loadGoogleScript()
      .then(() => {
        if (!mounted || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (!response?.credential) {
              setError('Google sign-in failed. Missing credential token.');
              return;
            }

            setSubmitting(true);
            setError('');
            try {
              await loginWithGoogle(response.credential, roleRef.current);
            } catch (err) {
              setError(err.response?.data?.message || 'Google login failed.');
            } finally {
              setSubmitting(false);
            }
          },
        });

        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 320,
          text: 'continue_with',
        });

        setGoogleReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setGoogleReady(false);
        setError('Unable to load Google sign-in. Check internet and client ID.');
      });

    return () => {
      mounted = false;
    };
  }, [loginWithGoogle]);

  const handleRoleLogin = async (role) => {
    setError('');
    setSubmitting(true);
    try {
      await loginAsRole(role);
    } catch (err) {
      setError(err.response?.data?.message || 'Role login failed. Ensure seed users exist in backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col items-center"
      >
        <h1 className="mb-2 font-['Sora'] text-2xl font-bold text-center">HelpHive Login</h1>
        <p className="mb-6 text-center text-sm text-[var(--text-secondary)]">Access your admin or volunteer dashboard securely.</p>

        <div className="w-full space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-1">
            <button
              type="button"
              onClick={() => setRole('volunteer')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${role === 'volunteer' ? 'bg-emerald-600 text-white' : 'text-[var(--text-secondary)]'}`}
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${role === 'admin' ? 'bg-blue-600 text-white' : 'text-[var(--text-secondary)]'}`}
            >
              Admin
            </button>
          </div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </div>

        {error ? <p className="mb-3 w-full rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-center text-xs text-rose-300">{error}</p> : null}

        <div className="w-full space-y-4">
          <AnimatedButton type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </AnimatedButton>

          <div className="relative py-1">
            <div className="h-px w-full bg-[var(--border-muted)]" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--bg-base)] px-2 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              or
            </span>
          </div>

          {GOOGLE_CLIENT_ID ? (
            <div className="flex w-full justify-center">
              <div ref={googleButtonRef} className="min-h-[40px]" />
            </div>
          ) : (
            <p className="text-center text-xs text-amber-300">Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.</p>
          )}

          {GOOGLE_CLIENT_ID && !googleReady ? (
            <p className="text-center text-xs text-[var(--text-muted)]">Preparing Google sign-in...</p>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <AnimatedButton
              type="button"
              onClick={() => handleRoleLogin('admin')}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={submitting}
            >
              Quick Admin
            </AnimatedButton>
            <AnimatedButton
              type="button"
              onClick={() => handleRoleLogin('volunteer')}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={submitting}
            >
              Quick Volunteer
            </AnimatedButton>
          </div>

          <p className="pt-1 text-center text-xs text-[var(--text-muted)]">
            Quick login uses seeded backend role users.
          </p>
          <p className="text-center text-xs text-[var(--text-secondary)]">
            New here? <Link to={`/register?role=${role}`} className="font-semibold text-[var(--text-primary)]">Register here</Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default LoginPage;
