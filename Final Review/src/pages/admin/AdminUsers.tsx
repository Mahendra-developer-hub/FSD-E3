import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile, UserRole } from '../../types';
import { User, Shield, Mail, RefreshCw, Search, Crown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ ...d.data(), userId: d.id } as UserProfile)));
    } catch {
      addToast({ type: 'error', message: 'Failed to load users.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (user: UserProfile) => {
    const newRole = user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    try {
      await updateDoc(doc(db, 'users', user.userId), { role: newRole });
      addToast({ type: 'success', message: `${user.displayName || user.email} is now ${newRole}.` });
      fetchUsers();
    } catch {
      addToast({ type: 'error', message: 'Failed to update user role.' });
    }
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (u.displayName || '').toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const adminCount = users.filter(u => u.role === UserRole.ADMIN).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Users</h2>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] pt-1">
            {users.length} registered · {adminCount} admins
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-medium text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-purple-500/50 w-56"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
          </div>
          <button onClick={fetchUsers} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/30 hover:text-white transition-all">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card p-6 border border-white/5 space-y-4 animate-shimmer h-40"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-white/20 text-[10px] font-black uppercase tracking-widest">
          {search ? `No users matching "${search}"` : 'No users found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(user => (
            <div key={user.userId} className="glass-card p-6 border border-white/5 space-y-6 group hover:border-purple-500/20 transition-all duration-500">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 ring-2 ring-white/5 group-hover:ring-purple-500/10 transition-all shrink-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-black text-purple-400">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-display font-black text-white text-base uppercase tracking-tight leading-none truncate">
                      {user.displayName || 'Anonymous'}
                    </div>
                    <div className="flex items-center text-[9px] text-white/20 font-black uppercase tracking-widest gap-1">
                      <Mail size={10} className="text-purple-500 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className={cn("p-2.5 rounded-xl border transition-all duration-500 shrink-0",
                  user.role === UserRole.ADMIN ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]" : "bg-white/5 text-white/20 border-white/5"
                )}>
                  {user.role === UserRole.ADMIN ? <Crown size={16} /> : <User size={16} />}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <div className="text-[8px] font-black text-white/10 uppercase tracking-[0.3em]">Joined</div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </div>
                </div>
                <button
                  onClick={() => toggleRole(user)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                    user.role === UserRole.ADMIN
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                      : "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
                  )}
                >
                  {user.role === UserRole.ADMIN ? 'Revoke Admin' : 'Make Admin'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
