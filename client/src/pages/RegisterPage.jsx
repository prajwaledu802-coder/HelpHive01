import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AnimatedButton from '../components/ui/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import { firebaseAuth, firebaseGoogleProvider } from '../services/firebase';

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    skills: '',
    volunteerRole: '',
  });
  const [role, setRole] = useState('volunteer');
  const [error, setError] = useState('');
  const [quickCreds, setQuickCreds] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, loginAsRole, loginWithGoogle } = useAuth();

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'admin' || roleFromQuery === 'volunteer') {
      setRole(roleFromQuery);
    }
  }, [searchParams]);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setQuickCreds('');
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        location: form.location,
        skills: form.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        role,
      });
      navigate('/role-selection');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleQuickRole = async (nextRole) => {
    setError('');
    setQuickCreds('');
    try {
      await loginAsRole(nextRole);
      navigate('/role-selection');
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed');
    }
  };

  const handleQuickRegister = async (nextRole) => {
    setError('');
    setQuickCreds('');

    const stamp = `${Date.now()}${Math.floor(Math.random() * 900 + 100)}`;
    const email = `quick.${nextRole}.${stamp}@helphive.local`;
    const password = 'Quick@1234';
    const fullName = nextRole === 'admin' ? 'Quick Admin User' : 'Quick Volunteer User';

    try {
      await register({
        fullName,
        email,
        password,
        phone: '',
        location: 'Auto Generated',
        skills: nextRole === 'volunteer' ? ['coordination'] : [],
        role: nextRole,
      });

      setQuickCreds(`Quick register success -> ${email} / ${password}`);
      navigate('/role-selection');
    } catch (err) {
      setError(err.response?.data?.message || 'Quick register failed');
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setQuickCreds('');
    try {
      const result = await signInWithPopup(firebaseAuth, firebaseGoogleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken;

      if (!idToken) {
        throw new Error('Google credential token not available');
      }

      await loginWithGoogle(idToken, role);
      navigate('/role-selection');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google signup/login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-2xl rounded-2xl p-6 shadow-2xl"
      >
        <h1 className="mb-2 font-['Sora'] text-2xl font-bold">Create HelpHive Account</h1>
        <p className="mb-5 text-sm text-[var(--text-secondary)]">Register as admin or volunteer and continue to your role dashboard.</p>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-1">
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

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['fullName', 'Full Name'],
            ['email', 'Email'],
            ['password', 'Password'],
            ['phone', 'Phone Number'],
            ['location', 'Location'],
            ['skills', 'Skills'],
            ['volunteerRole', 'Volunteer Role'],
          ].map(([name, label]) => (
            <input
              key={name}
              name={name}
              value={form[name]}
              onChange={onChange}
              type={name === 'password' ? 'password' : 'text'}
              placeholder={label}
              className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-primary)]"
              required={['fullName', 'email', 'password'].includes(name)}
            />
          ))}
        </div>

        {error && <p className="mt-3 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

        <AnimatedButton type="submit" className="mt-5 w-full">
          Register
        </AnimatedButton>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2.5 text-sm font-semibold text-[var(--text-primary)]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#EA4335" d="M9 7.2v3.6h5.1C13.88 12.9 11.7 14.4 9 14.4A5.4 5.4 0 1 1 9 3.6c1.48 0 2.84.56 3.87 1.48l2.55-2.55A8.96 8.96 0 0 0 9 0a9 9 0 1 0 0 18c5.2 0 8.64-3.66 8.64-8.82 0-.6-.06-1.2-.18-1.98H9Z"/>
            <path fill="#34A853" d="M1.04 5.82 4 8a5.4 5.4 0 0 1 5-3.4c1.48 0 2.84.56 3.87 1.48l2.55-2.55A8.96 8.96 0 0 0 9 0 8.99 8.99 0 0 0 1.04 5.82Z"/>
            <path fill="#FBBC05" d="M9 18c2.62 0 4.83-.86 6.44-2.34l-2.97-2.3A5.41 5.41 0 0 1 9 14.4 5.4 5.4 0 0 1 4.01 11l-2.95 2.27A9 9 0 0 0 9 18Z"/>
            <path fill="#4285F4" d="M17.64 9.18c0-.6-.06-1.2-.18-1.98H9v3.6h5.1a4.77 4.77 0 0 1-1.63 2.56l2.97 2.3c1.74-1.6 2.2-3.98 2.2-6.48Z"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <AnimatedButton
            type="button"
            onClick={() => handleQuickRegister('admin')}
            className="w-full bg-slate-700 hover:bg-slate-800"
          >
            Quick Register Admin
          </AnimatedButton>
          <AnimatedButton
            type="button"
            onClick={() => handleQuickRegister('volunteer')}
            className="w-full bg-slate-700 hover:bg-slate-800"
          >
            Quick Register Volunteer
          </AnimatedButton>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <AnimatedButton
            type="button"
            onClick={() => handleQuickRole('admin')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Quick Admin
          </AnimatedButton>
          <AnimatedButton
            type="button"
            onClick={() => handleQuickRole('volunteer')}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Quick Volunteer
          </AnimatedButton>
        </div>

        {quickCreds ? <p className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">{quickCreds}</p> : null}

        <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
          Already have an account? <Link to={`/login?role=${role}`} className="font-semibold text-[var(--accent-primary)]">Login</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterPage;
