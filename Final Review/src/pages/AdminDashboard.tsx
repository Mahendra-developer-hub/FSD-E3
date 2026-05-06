import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { 
  BarChart3, 
  Users, 
  Ticket, 
  TrendingUp, 
  LayoutDashboard, 
  CalendarDays, 
  Settings, 
  Bell,
  Search,
  Filter,
  ArrowUpRight,
  UserCheck,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

// Sub-pages
import AdminEvents from './admin/AdminEvents';
import AdminBookings from './admin/AdminBookings';
import AdminUsers from './admin/AdminUsers';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const eventsSnap = await getDocs(collection(db, 'events'));
        const bookingsSnap = await getDocs(collection(db, 'bookings'));
        
        let revenue = 0;
        bookingsSnap.forEach(doc => {
          if (doc.data().status === 'confirmed') {
            revenue += doc.data().totalAmount || 0;
          }
        });

        setStats({
          totalUsers: usersSnap.size,
          totalEvents: eventsSnap.size,
          totalBookings: bookingsSnap.size,
          totalRevenue: revenue,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Events', path: '/admin/events', icon: CalendarDays },
    { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={cn(
      "flex flex-col h-full backdrop-blur-3xl bg-white/[0.02] border-r border-white/10 p-6 space-y-10",
      mobile ? "w-full" : "w-72 hidden xl:flex"
    )}>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <LayoutDashboard size={16} />
          </div>
          <span className="font-display font-bold text-lg uppercase tracking-tighter">Admin<span className="text-purple-400">Panel</span></span>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/30 hover:text-white transition-all">
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-3 py-4 bg-white/5 rounded-2xl border border-white/5">
        <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 font-black text-sm shrink-0">
          {(user?.displayName || 'A')[0].toUpperCase()}
        </div>
        <div>
          <div className="font-black text-white text-xs uppercase tracking-tight">{user?.displayName || 'Admin'}</div>
          <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">System Root</div>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => mobile && setSidebarOpen(false)}
            className={cn(
              "flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group text-[10px] font-black uppercase tracking-widest border",
              isActive(item.path)
                ? "bg-purple-500/80 border-purple-500 text-white shadow-xl shadow-purple-500/20" 
                : "text-white/40 border-transparent hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={16} className={cn(isActive(item.path) ? "text-white" : "text-white/20 group-hover:text-purple-400")} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="space-y-3">
        <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span>All Systems Online</span>
          </div>
          <div className="text-[9px] font-bold text-white/10 uppercase tracking-widest">Uptime: 99.998%</div>
        </div>
        <button
          onClick={() => { auth.signOut(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black text-rose-400/40 hover:text-rose-400 hover:bg-rose-500/5 uppercase tracking-widest transition-all"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex text-white bg-[#050508]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="xl:hidden fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-xl" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative z-10 w-72 h-full flex flex-col">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-20 backdrop-blur-md bg-white/[0.02] border-b border-white/10 px-6 md:px-10 flex items-center justify-between shrink-0 gap-4">
          {/* Mobile menu toggle */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="xl:hidden p-2 text-white/30 hover:text-white transition-all rounded-xl hover:bg-white/5"
          >
            <Menu size={20} />
          </button>

          <div className="relative w-72 hidden md:block group">
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-[10px] font-medium focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-white/20"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={15} />
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <button className="relative p-2.5 text-white/30 hover:text-purple-400 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 border-2 border-[#050508] rounded-full animate-pulse"></span>
            </button>
            <Link to="/" className="text-[9px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-all border border-white/5 px-3 py-1.5 rounded-xl hover:border-white/10">
              ← View Site
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10">
          <Routes>
            <Route path="/" element={<AdminOverview stats={stats} />} />
            <Route path="/events" element={<AdminEvents />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/users" element={<AdminUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function AdminOverview({ stats }: { stats: any }) {
  const chartData = [
    { name: 'Mon', revenue: 45000 },
    { name: 'Tue', revenue: 52000 },
    { name: 'Wed', revenue: 48000 },
    { name: 'Thu', revenue: 61000 },
    { name: 'Fri', revenue: 59000 },
    { name: 'Sat', revenue: 78000 },
    { name: 'Sun', revenue: 84000 },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981'];

  const pieData = [
    { name: 'Direct', value: 400 },
    { name: 'Search', value: 300 },
    { name: 'Social', value: 300 },
    { name: 'Email', value: 200 },
  ];

  return (
    <div className="space-y-10 max-w-7xl animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter leading-none">Dashboard Overview</h2>
          <p className="text-white/30 font-bold text-[10px] uppercase tracking-[0.3em]">Real-time analytics & metrics</p>
        </div>
        <button className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl hover:bg-purple-400 transition-all flex items-center space-x-2">
          <Filter size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, delta: '+12.4%', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/10' },
          { label: 'Active Bookings', value: stats.totalBookings, icon: Ticket, delta: '+8.2%', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/10' },
          { label: 'Registered Users', value: stats.totalUsers, icon: UserCheck, delta: '+14.1%', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/10' },
          { label: 'Total Events', value: stats.totalEvents, icon: CalendarDays, delta: '+2.4%', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/10' }
        ].map((stat, i) => (
          <div key={i} className={cn("glass-card p-7 space-y-6 group border", stat.border, "hover:border-purple-500/20")}>
            <div className="flex items-center justify-between">
              <div className={cn("p-3.5 rounded-2xl border border-white/10", stat.bg, stat.color)}>
                <stat.icon size={22} />
              </div>
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-green-500/10 text-green-400 text-[9px] font-black rounded-full border border-green-500/20">
                <ArrowUpRight size={12} />
                <span>{stat.delta}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{stat.label}</div>
              <div className="text-3xl font-display font-black text-white group-hover:text-purple-400 transition-colors">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-8 space-y-8 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-black text-xl uppercase tracking-tighter">Revenue Flow</h4>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest pt-1">Weekly performance</p>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/40"></div>
              <span>Revenue</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700 }} dx={-10} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', fontSize: '10px', fontWeight: 700 }} 
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Distribution */}
        <div className="glass-card p-8 space-y-6 border border-white/5 flex flex-col">
          <div>
            <h4 className="font-display font-black text-xl uppercase tracking-tighter">Traffic Sources</h4>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest pt-1">Acquisition channels</p>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {COLORS.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0a0a12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '10px', fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 pt-2 border-t border-white/5">
            {[
              { label: 'Direct', pct: '40%', color: 'bg-purple-500' },
              { label: 'Search', pct: '30%', color: 'bg-blue-500' },
              { label: 'Social', pct: '20%', color: 'bg-pink-500' },
              { label: 'Email', pct: '10%', color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 text-white/40">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span>{item.label}</span>
                </div>
                <div className="text-white">{item.pct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: 'Manage Events', desc: 'Create, edit and delete events', path: '/admin/events', icon: CalendarDays, color: 'text-purple-400' },
          { title: 'View Bookings', desc: 'Review and manage all bookings', path: '/admin/bookings', icon: Ticket, color: 'text-blue-400' },
          { title: 'User Management', desc: 'Manage registered user accounts', path: '/admin/users', icon: Users, color: 'text-pink-400' },
        ].map((item) => (
          <Link key={item.path} to={item.path} className="p-6 glass-card border border-white/5 hover:border-purple-500/20 space-y-4 group">
            <div className={cn("p-3 bg-white/5 rounded-2xl border border-white/10 w-fit group-hover:scale-110 transition-transform", item.color)}>
              <item.icon size={20} />
            </div>
            <div>
              <h5 className="font-black text-white text-sm uppercase tracking-tight">{item.title}</h5>
              <p className="text-[10px] text-white/20 font-medium mt-1">{item.desc}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-purple-400/0 group-hover:text-purple-400 transition-all uppercase tracking-widest">
              <span>Open</span>
              <ArrowUpRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
