import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { BookingDoc, BookingStatus } from '../../types';
import { CheckCircle, XCircle, Clock, Loader2, RefreshCw } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { useStore } from '../../store/useStore';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const { addToast } = useStore();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as BookingDoc)));
    } catch {
      addToast({ type: 'error', message: 'Failed to load bookings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      addToast({ type: 'success', message: `Booking marked as ${status}.` });
      fetchBookings();
    } catch {
      addToast({ type: 'error', message: 'Failed to update booking.' });
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const statusColor: Record<string, string> = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Bookings</h2>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] pt-1">{bookings.length} total transactions</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter Pills */}
          {(['all', BookingStatus.CONFIRMED, BookingStatus.PENDING, BookingStatus.CANCELLED] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                filter === s ? "bg-purple-500/80 border-purple-500 text-white" : "bg-white/5 border-white/5 text-white/30 hover:text-white"
              )}>
              {s}
            </button>
          ))}
          <button onClick={fetchBookings} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/30 hover:text-white transition-all">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="backdrop-blur-3xl bg-white/[0.02] rounded-[32px] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5">
                {['Booking ID', 'Event', 'Customer', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-24"><Loader2 className="w-8 h-8 animate-spin text-purple-500 inline-block" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-24 text-white/20 text-[10px] font-black uppercase tracking-widest">No {filter !== 'all' ? filter : ''} bookings found.</td></tr>
              ) : filtered.map(booking => (
                <tr key={booking.id} className="hover:bg-white/[0.03] transition-all group">
                  <td className="px-6 py-5">
                    <div className="font-mono text-[10px] text-purple-400 font-bold">#{booking.id.slice(-8).toUpperCase()}</div>
                    <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest pt-0.5">{formatDate(booking.createdAt)}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-white text-sm uppercase tracking-tight line-clamp-1">{booking.eventTitle}</div>
                    <div className="text-[9px] text-white/30 font-black uppercase tracking-widest pt-0.5">
                      {booking.tickets?.[0]?.tier} × {booking.tickets?.[0]?.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[10px] text-white/40 font-black uppercase tracking-widest">
                    {booking.userId.slice(0, 10)}...
                  </td>
                  <td className="px-6 py-5 font-display font-black text-xl text-white">
                    ₹{booking.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border", statusColor[booking.status])}>
                      {booking.status === BookingStatus.CONFIRMED && <CheckCircle size={10} />}
                      {booking.status === BookingStatus.PENDING && <Clock size={10} />}
                      {booking.status === BookingStatus.CANCELLED && <XCircle size={10} />}
                      <span>{booking.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {booking.status === BookingStatus.PENDING && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => updateStatus(booking.id, BookingStatus.CONFIRMED)}
                          className="p-2 text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 rounded-xl transition-all" title="Confirm">
                          <CheckCircle size={16} />
                        </button>
                        <button onClick={() => updateStatus(booking.id, BookingStatus.CANCELLED)}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 rounded-xl transition-all" title="Cancel">
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        {!loading && bookings.length > 0 && (
          <div className="px-6 py-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-[9px] font-black uppercase tracking-widest text-white/20">
            <span>Showing {filtered.length} of {bookings.length} bookings</span>
            <div className="flex items-center gap-6">
              <span className="text-emerald-400">{bookings.filter(b => b.status === 'confirmed').length} confirmed</span>
              <span className="text-amber-400">{bookings.filter(b => b.status === 'pending').length} pending</span>
              <span className="text-rose-400">{bookings.filter(b => b.status === 'cancelled').length} cancelled</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
