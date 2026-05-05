import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Twitter, Linkedin, Github, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, isDarkMode, toggleDarkMode } = useAppContext();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-text selection:bg-stone-200 flex flex-col items-center font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none z-0 dark:bg-emerald-400/5" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-stone-500/10 blur-[120px] pointer-events-none z-0 dark:bg-stone-400/5" />

      {/* Navigation */}
      <nav className="w-full max-w-[1000px] flex items-center justify-between p-6 relative z-20 mt-2">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-stone-900">
          Eventify
        </Link>
        <div className="flex gap-6 text-[10px] uppercase font-bold tracking-widest items-center">
          <Link to="/" className={`transition-colors hover:text-emerald-700 ${location.pathname === '/' ? 'text-emerald-600' : 'text-stone-400'}`}>Home</Link>
          
          {currentUser?.role === 'ADMIN' && (
            <Link to="/admin" className={`transition-colors hover:text-emerald-700 ${location.pathname === '/admin' ? 'text-emerald-600' : 'text-stone-400'}`}>Admin</Link>
          )}

          <div className="h-4 w-px bg-stone-200"></div>
          
          {/* Theme Toggle */}
          <button onClick={toggleDarkMode} className="p-1.5 rounded-full text-stone-400 hover:bg-stone-200 transition-colors" aria-label="Toggle Dark Mode">
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-stone-600">
                <UserIcon size={14} />
                {currentUser.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="flex items-center gap-1 text-stone-400 hover:text-red-500 transition-colors">
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className={`transition-colors hover:text-stone-800 ${location.pathname === '/login' ? 'text-stone-800' : 'text-stone-400'}`}>Login</Link>
              <Link to="/signup" className="bg-[#1e2e22] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors shadow-sm tracking-[0.2em]">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="w-full flex-grow flex flex-col items-center p-4 md:p-8 lg:p-12 relative z-10 pt-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-6xl flex justify-center"
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center text-editorial-muted text-xs pb-8 pt-4 w-full max-w-5xl relative z-10">
        <div className="flex justify-center gap-6 mb-6">
          <a href="#" className="p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white hover:text-editorial-accent hover:shadow-md transition-all duration-300"><Twitter size={18} /></a>
          <a href="#" className="p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white hover:text-editorial-accent hover:shadow-md transition-all duration-300"><Linkedin size={18} /></a>
          <a href="#" className="p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white hover:text-editorial-accent hover:shadow-md transition-all duration-300"><Github size={18} /></a>
        </div>
        <p className="font-serif italic tracking-wide text-sm mb-2 text-stone-500">Empowering the next generation of engineers.</p>
        <p className="font-medium text-[10px] uppercase tracking-widest">© 2026 CSE Department, All Rights Reserved.</p>
        <div className="mt-6 flex justify-center gap-8 text-[9px] font-bold uppercase tracking-[0.2em]">
          {currentUser?.role === 'ADMIN' && <Link to="/admin" className="hover:text-editorial-accent transition-colors">Admin Portal</Link>}
          <a href="#" className="hover:text-editorial-accent transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-editorial-accent transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}


