import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, User, LogOut, LayoutDashboard, Search, Heart, Menu, X, Ticket } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, searchQuery, setSearchQuery } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-3xl bg-[#050508]/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between h-20 items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group text-white shrink-0">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-2xl group-hover:bg-purple-400 group-hover:scale-105 transition-all duration-500">
                <Calendar size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-black tracking-tighter uppercase leading-none">
                  Eventify<span className="text-purple-500">Pro</span>
                </span>
                <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em] pt-0.5 hidden sm:block">Enterprise Link</span>
              </div>
            </Link>

            {/* Center: Search + Nav Links (desktop) */}
            <div className="hidden md:flex flex-1 items-center space-x-6 max-w-xl">
              <form onSubmit={handleSearch} className="relative group flex-1">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..." 
                  className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl w-full focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all duration-500 outline-none text-[11px] font-medium text-white placeholder:text-white/20"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={15} />
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="hidden md:flex items-center space-x-6">
                  <Link to="/bookings" className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/bookings') ? 'text-purple-400' : 'text-white/30 hover:text-white'}`}>
                    <Ticket size={16} />
                    <span>My Tickets</span>
                  </Link>
                  {user.role === UserRole.ADMIN && (
                    <Link to="/admin" className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 flex items-center space-x-2 transition-all hover:bg-purple-500/20 text-[10px] font-black uppercase tracking-widest">
                      <LayoutDashboard size={14} />
                      <span>Admin</span>
                    </Link>
                  )}
                  <div className="h-8 w-[1px] bg-white/5"></div>
                  <Link to="/profile" className="flex items-center space-x-3 group">
                    <div className="w-9 h-9 rounded-[14px] border-2 border-white/5 p-0.5 overflow-hidden group-hover:border-purple-500/40 transition-all duration-500">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-[10px] object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-[10px] flex items-center justify-center text-purple-400 text-xs font-black">
                          {(user.displayName || user.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors max-w-[100px] truncate">{user.displayName || 'Profile'}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-white/10 hover:text-rose-400 transition-all rounded-xl hover:bg-white/5"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link to="/auth" className="px-5 py-2.5 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
                    Login
                  </Link>
                  <Link to="/auth" className="inline-flex items-center justify-center px-8 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all duration-500 shadow-2xl">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white/40 hover:text-white transition-all rounded-xl hover:bg-white/5"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-20 z-40 bg-[#050508]/95 backdrop-blur-3xl border-t border-white/5 p-6 space-y-6 overflow-y-auto"
          >
            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="relative group">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..." 
                className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl w-full focus:ring-1 focus:ring-purple-500/50 outline-none text-sm font-medium text-white placeholder:text-white/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            </form>

            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${isActive('/') ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                <Calendar size={18} />
                <span>Browse Events</span>
              </Link>
              {user && (
                <>
                  <Link
                    to="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${isActive('/bookings') ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                  >
                    <Ticket size={18} />
                    <span>My Tickets</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${isActive('/profile') ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>
                  {user.role === UserRole.ADMIN && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 transition-all"
                    >
                      <LayoutDashboard size={18} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-left"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
              {!user && (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-white text-black hover:bg-purple-400 transition-all"
                >
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
