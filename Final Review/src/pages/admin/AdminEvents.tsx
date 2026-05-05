import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { EventDoc, EventCategory, EventStatus } from '../../types';
import { Plus, Edit, Trash2, X, MapPin, Users, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDate } from '../../lib/utils';
import { useStore } from '../../store/useStore';

const defaultForm = {
  title: '',
  description: '',
  category: EventCategory.TECH,
  location: '',
  date: '',
  totalCapacity: 500,
  availableTickets: 500,
  status: EventStatus.UPCOMING,
  isFeatured: false,
  image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1200',
  ticketTiers: { VIP: 5000, Premium: 2500, General: 1000 }
};

const SAMPLE_EVENTS = [
  {
    title: 'Global Tech Summit 2026',
    description: 'The largest gathering of tech visionaries. Featuring keynotes from industry leaders on AI, Quantum Computing, and Sustainable Tech.',
    category: EventCategory.TECH,
    location: 'Bangalore Convention Centre',
    date: new Date(Date.now() + 86400000 * 30),
    totalCapacity: 5000, availableTickets: 4200,
    status: EventStatus.UPCOMING, isFeatured: true,
    images: ['https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1200'],
    ticketTiers: { VIP: 15000, Premium: 8000, General: 4000 },
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  },
  {
    title: 'Neon Nights Music Festival',
    description: 'A 3-day immersive musical experience featuring world-class artists, light shows, and interactive art installations.',
    category: EventCategory.MUSIC,
    location: 'Mahalaxmi Racecourse, Mumbai',
    date: new Date(Date.now() + 86400000 * 60),
    totalCapacity: 10000, availableTickets: 8500,
    status: EventStatus.UPCOMING, isFeatured: true,
    images: ['https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=1200'],
    ticketTiers: { VIP: 5000, Premium: 3000, General: 1500 },
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  },
  {
    title: 'Startup India Business Summit',
    description: 'Connect with 1000+ founders, investors and enterprise leaders. Pitch competitions, workshops, and networking sessions.',
    category: EventCategory.BUSINESS,
    location: 'Hyderabad International Convention Centre',
    date: new Date(Date.now() + 86400000 * 45),
    totalCapacity: 3000, availableTickets: 2400,
    status: EventStatus.UPCOMING, isFeatured: false,
    images: ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200'],
    ticketTiers: { VIP: 20000, Premium: 12000, General: 6000 },
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  },
  {
    title: 'IPL Fan Fest 2026',
    description: 'The ultimate cricket fan experience with live screening, player meet & greets, games and exclusive merchandise.',
    category: EventCategory.SPORTS,
    location: 'DY Patil Stadium, Navi Mumbai',
    date: new Date(Date.now() + 86400000 * 15),
    totalCapacity: 20000, availableTickets: 15000,
    status: EventStatus.UPCOMING, isFeatured: false,
    images: ['https://images.unsplash.com/photo-1540747913346-19212a4cf528?auto=format&fit=crop&q=80&w=1200'],
    ticketTiers: { VIP: 3000, Premium: 1500, General: 800 },
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  },
];

export default function AdminEvents() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDoc | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const { addToast } = useStore();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as EventDoc)));
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Failed to load events.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => {
    setEditingEvent(null);
    setFormData(defaultForm);
    setShowModal(true);
  };

  const openEdit = (event: EventDoc) => {
    setEditingEvent(event);
    // Convert Firestore timestamp date to datetime-local string
    let dateStr = '';
    if (event.date) {
      const d = event.date.toDate ? event.date.toDate() : new Date(event.date);
      dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    setFormData({
      ...defaultForm,
      title: event.title,
      description: event.description,
      category: event.category,
      location: event.location,
      date: dateStr,
      totalCapacity: event.totalCapacity,
      availableTickets: event.availableTickets,
      status: event.status,
      isFeatured: event.isFeatured,
      image: event.images?.[0] || defaultForm.image,
      ticketTiers: { ...defaultForm.ticketTiers, ...(event.ticketTiers as any) },
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date),
        images: [formData.image],
        updatedAt: serverTimestamp(),
      };
      if (editingEvent) {
        await updateDoc(doc(db, 'events', editingEvent.id), payload);
        addToast({ type: 'success', message: 'Event updated successfully!' });
      } else {
        await addDoc(collection(db, 'events'), { ...payload, createdAt: serverTimestamp() });
        addToast({ type: 'success', message: 'Event created successfully!' });
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Failed to save event.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      addToast({ type: 'success', message: 'Event deleted.' });
      fetchEvents();
    } catch {
      addToast({ type: 'error', message: 'Failed to delete event.' });
    }
  };

  const handleSeed = async () => {
    if (!window.confirm(`Seed ${SAMPLE_EVENTS.length} sample events?`)) return;
    setSeeding(true);
    try {
      for (const e of SAMPLE_EVENTS) await addDoc(collection(db, 'events'), e);
      addToast({ type: 'success', message: `${SAMPLE_EVENTS.length} sample events added!` });
      fetchEvents();
    } catch {
      addToast({ type: 'error', message: 'Seeding failed.' });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Event Catalog</h2>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] pt-1">{events.length} events in system</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <Filter size={14} />}
            <span>Seed Sample Data</span>
          </button>
          <button
            onClick={openCreate}
            className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Event</span>
          </button>
        </div>
      </div>

      <div className="backdrop-blur-3xl bg-white/[0.02] rounded-[32px] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5">
                {['Event', 'Category', 'Capacity', 'Min Price', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-24"><Loader2 className="w-8 h-8 border-2 border-white/5 border-t-purple-500 rounded-full animate-spin inline-block" /></td></tr>
              ) : events.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-24 text-white/20 text-[10px] font-black uppercase tracking-widest">No events yet. Click "New Event" or seed sample data.</td></tr>
              ) : events.map(event => (
                <tr key={event.id} className="hover:bg-white/[0.03] transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img src={event.images?.[0]} className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0" alt="" />
                      <div>
                        <div className="font-bold text-white text-sm uppercase tracking-tight line-clamp-1">{event.title}</div>
                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{formatDate(event.date)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest">{event.category}</span>
                  </td>
                  <td className="px-6 py-5 text-[10px] font-black text-white/60 uppercase tracking-widest">
                    {event.availableTickets} / {event.totalCapacity}
                  </td>
                  <td className="px-6 py-5 font-display font-black text-white text-lg">
                    ₹{Math.min(...(Object.values(event.ticketTiers || {}) as number[])).toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${event.status === 'upcoming' ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`}></div>
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">{event.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openEdit(event)} className="p-2 text-white/30 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="p-2 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 rounded-xl transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-[#050508]/80 backdrop-blur-2xl z-[100]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a12] border border-white/10 rounded-[40px] z-[101] overflow-hidden shadow-2xl"
            >
              <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest pt-1">Fill in the event details below</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-xl transition-all"><X size={22} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Event Title *</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none font-bold text-sm uppercase tracking-tight placeholder:text-white/10"
                      placeholder="Event title" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as EventCategory})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none font-bold uppercase tracking-widest text-[10px] cursor-pointer">
                      {Object.values(EventCategory).map(c => <option key={c} value={c} className="bg-[#0a0a12]">{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Date & Time *</label>
                    <input type="datetime-local" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none font-bold text-[10px] cursor-pointer" />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Description *</label>
                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none text-sm min-h-[100px] placeholder:text-white/10 leading-relaxed resize-none"
                      placeholder="Describe your event..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Location *</label>
                    <div className="relative">
                      <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none font-bold text-[10px] uppercase tracking-tight placeholder:text-white/10"
                        placeholder="Venue / City" />
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Total Capacity *</label>
                    <div className="relative">
                      <input type="number" required value={formData.totalCapacity}
                        onChange={e => setFormData({...formData, totalCapacity: +e.target.value, availableTickets: +e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none font-bold" />
                      <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Cover Image URL</label>
                    <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:ring-1 focus:ring-purple-500/50 outline-none text-sm placeholder:text-white/10"
                      placeholder="https://..." />
                    {formData.image && <img src={formData.image} className="w-full h-28 object-cover rounded-xl border border-white/5 mt-2" alt="" onError={e => (e.currentTarget.style.display='none')} />}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Ticket Prices (₹)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(formData.ticketTiers).map(([tier, price]) => (
                      <div key={tier} className="space-y-2">
                        <label className="text-[9px] font-bold text-purple-400/50 uppercase tracking-[0.2em]">{tier}</label>
                        <input type="number" value={price}
                          onChange={e => setFormData({...formData, ticketTiers: {...formData.ticketTiers, [tier]: +e.target.value}})}
                          className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-3 text-white font-black text-lg outline-none focus:ring-1 focus:ring-purple-400/50" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-4 h-4 rounded accent-purple-500" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Mark as Featured</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-[10px] font-black text-white/20 hover:text-white transition-all uppercase tracking-widest">Cancel</button>
                    <button type="submit" className="px-10 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-purple-400 transition-all">
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
