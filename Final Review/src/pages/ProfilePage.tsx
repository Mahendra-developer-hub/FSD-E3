import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { BookingDoc, BookingStatus } from '../types';
import { 
  Package, QrCode, ChevronRight, User, Settings, Heart, Loader2, 
  Sparkles, MapPinned, ShieldCheck, CheckCircle2, Ticket, Calendar,
  Bell, Lock, Trash2, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from '../lib/utils';
import { updateProfile } from 'firebase/auth';

type ProfileTab = 'tickets' | 'wishlist' | 'settings';

export default function ProfilePage() {
  const { user, addToast } = useStore();
  const [bookings, setBookings] = useState<BookingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>('tickets');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const q = query(
          collection(db, 'bookings'), 
          where('userId', '==', user.userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookingDoc));
        setBookings(fetched);
      } catch (error) {
        console.error("Fetch bookings error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!auth.currentUser || !displayName.trim()) return;
    try {
      setSavingProfile(true);
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      addToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch {
      addToast({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) return null;

  const navItems = [
    { id: 'tickets' as ProfileTab, name: 'My Tickets', icon: Package, count: bookings.length },
    { id: 'wishlist' as ProfileTab, name: 'Wishlist', icon: Heart, count: user.wishlist?.length || 0 },
    { id: 'settings' as ProfileTab, name: 'Settings', icon: Settings },
  ];

  const confirmedBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED);
  const totalSpent = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="relative pt-20 pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12"
          >
            <div className="relative group">
              <div className="w-32 h-32 rounded-[40px] overflow-hidden bg-white/5 ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-500">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-5xl font-black text-purple-400">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-500 border-4 border-[#050508] rounded-[16px] flex items-center justify-center text-white shadow-2xl">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
                  {user.displayName || 'Anonymous'}
                </h1>
                <p className="text-white/30 font-bold text-xs uppercase tracking-[0.4em]">{user.email}</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white/40 uppercase tracking-widest">
                  {user.role} Account
                </div>
                <div className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  <span>Verified</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-2">
                <div>
                  <div className="text-xl font-display font-black text-white">{bookings.length}</div>
                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Total Bookings</div>
                </div>
                <div>
                  <div className="text-xl font-display font-black text-white">{confirmedBookings.length}</div>
                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Confirmed</div>
                </div>
                <div>
                  <div className="text-xl font-display font-black text-white">₹{totalSpent.toLocaleString()}</div>
                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Total Spent</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 -mt-28 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[32px] p-3">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                      activeTab === item.id ? "bg-white text-black shadow-2xl" : "text-white/40 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={18} className={cn(activeTab === item.id ? "text-black" : "text-white/20 group-hover:text-purple-400")} />
                      <span className="font-black text-[10px] uppercase tracking-widest">{item.name}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={cn("text-[10px] font-black px-2.5 py-0.5 rounded-lg", activeTab === item.id ? "bg-black/10" : "bg-white/5 border border-white/10")}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Upgrade CTA */}
            <div className="p-8 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-[32px] text-white space-y-5 shadow-2xl shadow-purple-500/20 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 text-white/10 group-hover:rotate-12 group-hover:scale-150 transition-all duration-700">
                <Sparkles size={80} />
              </div>
              <h4 className="font-display font-black text-2xl uppercase tracking-tighter leading-none relative z-10">Pro<br/>Access</h4>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed relative z-10">
                Unlock priority booking, exclusive events, and member perks.
              </p>
              <button className="w-full py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl relative z-10 hover:bg-purple-100 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {/* TICKETS TAB */}
              {activeTab === 'tickets' && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">My Tickets</h2>
                    <Link to="/" className="text-[10px] font-black text-purple-400 hover:text-white uppercase tracking-widest border-b border-transparent hover:border-purple-400 transition-all">
                      Browse Events →
                    </Link>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                      <div className="w-10 h-10 border-2 border-white/5 border-t-purple-500 rounded-full animate-spin"></div>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Loading tickets</span>
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <motion.div
                          key={booking.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group glass-card p-6 md:p-8 border border-white/5 hover:border-purple-500/20 transition-all duration-500"
                        >
                          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                            <div className="flex items-center space-x-6">
                              <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                                booking.status === BookingStatus.CONFIRMED 
                                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                                  : booking.status === BookingStatus.PENDING
                                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                                  : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                              )}>
                                {booking.status === BookingStatus.CONFIRMED ? (
                                  <QrCode size={28} />
                                ) : booking.status === BookingStatus.PENDING ? (
                                  <Loader2 size={28} className="animate-spin" />
                                ) : (
                                  <Ticket size={28} />
                                )}
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-display font-black text-lg text-white uppercase tracking-tight leading-none">{booking.eventTitle}</h4>
                                <div className="flex items-center text-[9px] font-black text-white/30 uppercase tracking-[0.2em] gap-3">
                                  <span className="flex items-center gap-1"><MapPinned size={10} className="text-purple-500" /> Virtual Event</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1"><Calendar size={10} className="text-purple-500" /> {formatDate(booking.createdAt)}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {booking.tickets.map((t, i) => (
                                    <span key={i} className="px-2.5 py-0.5 bg-white/5 border border-white/5 text-[8px] font-black text-white/40 uppercase tracking-widest rounded-lg">
                                      {t.quantity}× {t.tier}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between xl:justify-end gap-8 pt-4 xl:pt-0 border-t xl:border-t-0 border-white/5">
                              <div className="text-right">
                                <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Total</div>
                                <div className="text-2xl font-display font-black text-white">₹{booking.totalAmount.toLocaleString()}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                                  booking.status === BookingStatus.CONFIRMED ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                                  booking.status === BookingStatus.PENDING ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                                  "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                )}>
                                  {booking.status}
                                </div>
                                <Link to={`/events/${booking.eventId}`} className="p-2.5 bg-white/5 text-white/30 rounded-xl hover:bg-white hover:text-black transition-all">
                                  <ChevronRight size={18} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/5 rounded-[40px] p-20 text-center space-y-6">
                      <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
                        <Package size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">No Tickets Yet</h3>
                        <p className="text-white/20 font-bold text-[10px] uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
                          Browse upcoming events and book your first ticket.
                        </p>
                      </div>
                      <Link to="/" className="inline-flex items-center space-x-3 px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl hover:bg-purple-400 transition-all">
                        <span>Explore Events</span>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Wishlist</h2>
                  <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/5 rounded-[40px] p-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mx-auto text-white/10">
                      <Heart size={40} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                        {user.wishlist?.length > 0 ? `${user.wishlist.length} Saved Events` : 'Wishlist is Empty'}
                      </h3>
                      <p className="text-white/20 font-bold text-[10px] uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
                        Save events you're interested in to keep track of them here.
                      </p>
                    </div>
                    <Link to="/" className="inline-flex items-center space-x-3 px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl hover:bg-purple-400 transition-all">
                      <span>Discover Events</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Account Settings</h2>

                  {/* Profile Settings */}
                  <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[32px] p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-2">
                      <User size={18} className="text-purple-400" />
                      <h3 className="font-bold text-white text-sm uppercase tracking-widest">Profile Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Display Name</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none transition-all font-medium text-sm placeholder:text-white/20"
                          placeholder="Your display name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white/40 outline-none font-medium text-sm opacity-60 cursor-not-allowed"
                        />
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-purple-400 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {savingProfile ? <Loader2 size={14} className="animate-spin" /> : null}
                        {savingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[32px] p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-2">
                      <Bell size={18} className="text-purple-400" />
                      <h3 className="font-bold text-white text-sm uppercase tracking-widest">Notifications</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Email Booking Confirmations', desc: 'Receive confirmation emails for bookings' },
                        { label: 'New Event Alerts', desc: 'Get notified about events in your interest areas' },
                        { label: 'Payment Receipts', desc: 'Receive payment receipts via email' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div>
                            <div className="font-bold text-white text-xs uppercase tracking-widest">{item.label}</div>
                            <div className="text-[9px] font-medium text-white/20 mt-0.5">{item.desc}</div>
                          </div>
                          <div className="w-10 h-6 bg-purple-500/80 rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-md"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security */}
                  <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[32px] p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-2">
                      <Lock size={18} className="text-purple-400" />
                      <h3 className="font-bold text-white text-sm uppercase tracking-widest">Security</h3>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-white/30 group-hover:text-purple-400 transition-colors" />
                          <span className="font-bold text-white/60 text-xs uppercase tracking-widest">Change Password</span>
                        </div>
                        <ChevronRight size={16} className="text-white/20" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 hover:border-rose-500/20 transition-all group">
                        <div className="flex items-center gap-3">
                          <Trash2 size={16} className="text-rose-400/50 group-hover:text-rose-400 transition-colors" />
                          <span className="font-bold text-rose-400/50 group-hover:text-rose-400 text-xs uppercase tracking-widest transition-colors">Delete Account</span>
                        </div>
                        <ChevronRight size={16} className="text-rose-400/20" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
