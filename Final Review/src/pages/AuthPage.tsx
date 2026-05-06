import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { LogIn, Mail, ShieldCheck, Zap, Globe, Lock, User, Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle, createUserWithEmailAndPassword, signInWithEmailAndPassword, auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, addToast } = useStore();

  // Already logged in → redirect home
  if (user) return <Navigate to="/" />;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      addToast({ type: 'success', message: 'Welcome back! Signed in with Google.' });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        addToast({ type: 'success', message: 'Welcome back! Signed in successfully.' });
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        addToast({ type: 'success', message: 'Account created! Welcome to EventifyPro.' });
      }
      navigate('/');
    } catch (err: any) {
      const codes: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };
      setError(codes[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex relative overflow-hidden">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
        <div className="relative z-10 space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={28} className="text-purple-400" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="text-6xl font-display font-black text-white leading-[0.9] tracking-tighter uppercase">
            Enterprise <br /> Standard <br /> <span className="text-gradient">Infrastructure.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="text-white/40 text-lg max-w-sm font-medium leading-relaxed">
            Join 50k+ elite professionals discovering the world's most high-impact tech and culture summits.
          </motion.p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/5 pt-10">
          {[{ v: '50K+', l: 'Monthly Bookings' }, { v: '12K+', l: 'Global Venues' }].map(s => (
            <div key={s.l} className="space-y-1">
              <div className="text-white font-black text-3xl font-display tracking-tight">{s.v}</div>
              <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-display font-black text-white tracking-tighter uppercase">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-white/30 text-sm font-medium">
              {isLogin ? 'Sign in to access your account' : 'Join EventifyPro for free today'}
            </p>
          </div>

          <div className="glass-card p-8 space-y-6 border border-white/10">
            {error && (
              <div className="p-4 bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-widest rounded-2xl border border-rose-500/20 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">Full Name</label>
                  <div className="relative">
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-white/20 text-sm font-medium"
                      placeholder="Your full name" />
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">Email Address</label>
                <div className="relative">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-white/20 text-sm font-medium"
                    placeholder="you@example.com" />
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-12 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-white/20 text-sm font-medium"
                    placeholder="••••••••" />
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-400 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-60">
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center"><span className="bg-[#050508] px-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">or</span></div>
            </div>

            <button onClick={handleGoogleSignIn} disabled={loading} type="button"
              className="w-full flex items-center justify-center space-x-3 px-6 py-3.5 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all disabled:opacity-60">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            <div className="grid grid-cols-3 gap-4">
              {[{ icon: <Zap size={18} />, label: 'Instant' }, { icon: <Globe size={18} />, label: 'Global' }, { icon: <ShieldCheck size={18} />, label: 'Secure' }].map(f => (
                <div key={f.label} className="flex flex-col items-center space-y-2 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all">
                  <span className="text-purple-400">{f.icon}</span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} type="button"
              className="text-[11px] font-bold text-white/40 hover:text-white uppercase tracking-widest border-b border-transparent hover:border-white transition-all">
              {isLogin ? "Don't have an account? Sign up free" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
