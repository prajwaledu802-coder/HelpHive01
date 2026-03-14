import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AnimatedButton from '../components/ui/AnimatedButton';
import { useAuth } from '../context/AuthContext';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, loginAsRole } = useAuth();

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
    try {
      await loginAsRole(nextRole);
      navigate('/role-selection');
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed');
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

        <div className="mt-4 grid grid-cols-2 gap-3">
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

        <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
          Already have an account? <Link to={`/login?role=${role}`} className="font-semibold text-[var(--accent-primary)]">Login</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterPage;
