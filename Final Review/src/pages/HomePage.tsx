import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EventDoc, EventCategory, EventStatus } from '../types';
import { Search, MapPin, Calendar, ArrowRight, Sparkles, Zap, Users, Globe, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';

const CATEGORY_ICONS: Record<string, string> = {
  'All': '✦',
  'Tech': '⚡',
  'Cultural': '🎭',
  'Sports': '🏆',
  'Music': '🎵',
  'Business': '💼',
  'Art': '🎨',
};

export default function HomePage() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [allEvents, setAllEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const { searchQuery, setSearchQuery } = useStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Pick up URL search param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'events'),
          where('status', '==', EventStatus.UPCOMING),
          orderBy('date', 'asc'),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as EventDoc[];
        setAllEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Client-side filtering
  const filteredEvents = useMemo(() => {
    let result = allEvents;

    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allEvents, selectedCategory, searchQuery]);

  const categories = ['All', ...Object.values(EventCategory)];
  const featuredEvent = allEvents.find(e => e.isFeatured) || allEvents[0];

  const formatEventDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
  };

  const getMinPrice = (tiers: any) => {
    if (!tiers) return 0;
    const prices = Object.values(tiers) as number[];
    return Math.min(...prices);
  };

  return (
    <div className="space-y-0 pb-24">
      {/* Hero Section */}
      <section className="relative h-[680px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/30 to-[#050508]/60"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-400 text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Discover the Extraordinary</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            GATEWAY TO <br />
            <span className="text-gradient">UNFORGETTABLE</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Join 50,000+ pioneers. Book tickets for the world's most exclusive tech summits, cultural festivals, and high-stakes arenas.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <button 
              onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl hover:bg-purple-400 transition-all duration-300 transform hover:-translate-y-1"
            >
              Browse Events
            </button>
            <Link 
              to="/auth"
              className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ChevronRight size={14} />
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-4"
          >
            {[
              { value: '50K+', label: 'Monthly Bookings' },
              { value: '12K+', label: 'Global Venues' },
              { value: '99.9%', label: 'Uptime SLA' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-black text-2xl text-white">{stat.value}</div>
                <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events-section" className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pt-0">
        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl space-y-8">
          
          {/* Search + Filter Header */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border flex items-center gap-1.5 ${
                    selectedCategory === cat 
                      ? 'bg-purple-500/80 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                      : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat] || '•'}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, locations..." 
                  className="pl-11 pr-5 py-3 bg-white/5 border border-white/10 rounded-2xl w-72 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 transition-all duration-500 outline-none text-xs font-medium text-white placeholder:text-white/20"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={15} />
              </div>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              {searchQuery || selectedCategory !== 'All' ? (
                <span>{filteredEvents.length} results {searchQuery ? `for "${searchQuery}"` : ''} {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}</span>
              ) : (
                <span>{allEvents.length} upcoming events</span>
              )}
            </div>
          )}

          <div className="h-[1px] bg-white/5"></div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-shimmer space-y-4 rounded-[28px] overflow-hidden">
                  <div className="aspect-[16/10] bg-white/5 rounded-[28px]"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-white/5 rounded-xl w-3/4"></div>
                    <div className="h-3 bg-white/5 rounded-xl w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group glass-card overflow-hidden hover:shadow-xl hover:shadow-purple-500/5"
                >
                  <Link to={`/events/${event.id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] m-2">
                      <img 
                        src={event.images?.[0] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-md rounded-full text-[9px] font-bold text-white uppercase tracking-widest">
                          {event.category}
                        </span>
                      </div>
                      {event.isFeatured && (
                        <div className="absolute top-3 right-3">
                          <div className="w-7 h-7 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center">
                            <Sparkles size={12} className="text-yellow-400" />
                          </div>
                        </div>
                      )}
                      {/* Availability bar */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-400 rounded-full transition-all" 
                            style={{ width: `${Math.round((event.availableTickets / event.totalCapacity) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-3 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-base font-display font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1 uppercase tracking-tight">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-white/40 text-[10px] font-bold uppercase tracking-widest">
                          <MapPin size={11} className="mr-1.5 text-purple-500 shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="space-y-0.5">
                          <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">From</div>
                          <div className="text-xl font-display font-black text-white">
                            ₹{getMinPrice(event.ticketTiers).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-0.5 text-white/40 font-bold text-[9px] uppercase tracking-widest">
                          <div className="flex items-center space-x-1.5">
                            <Calendar size={10} className="text-purple-500" />
                            <span>{formatEventDate(event.date)}</span>
                          </div>
                          <div className="text-white/20">
                            {event.availableTickets} seats left
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/20">
                <Search size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">No events found</h3>
                <p className="text-white/30 font-medium text-sm">
                  {searchQuery ? `No results for "${searchQuery}". Try different keywords.` : 'No events in this category yet.'}
                </p>
              </div>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="px-8 py-3 bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Event Banner */}
      {!loading && featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[40px] overflow-hidden border border-white/10 h-[300px]"
          >
            <img 
              src={featuredEvent.images?.[0] || 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=2000'}
              className="w-full h-full object-cover"
              alt={featuredEvent.title}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/60 to-transparent"></div>
            <div className="absolute inset-0 p-12 flex flex-col justify-end">
              <div className="space-y-4 max-w-lg">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full">
                  <Sparkles size={12} className="text-yellow-400" />
                  <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">Featured Event</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter leading-none">
                  {featuredEvent.title}
                </h2>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin size={12} className="text-purple-400" />
                    {featuredEvent.location}
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    <Users size={12} className="text-purple-400" />
                    {featuredEvent.totalCapacity.toLocaleString()} Capacity
                  </div>
                </div>
                <Link 
                  to={`/events/${featuredEvent.id}`}
                  className="inline-flex items-center gap-3 px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-purple-400 transition-all"
                >
                  <span>Explore Event</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Social Proof / Partnerships */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-12">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Integrated with World Leaders</div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-20 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-700">
            <div className="text-2xl font-black text-white font-display tracking-tighter">TECH<span className="text-purple-500">CON</span></div>
            <div className="text-2xl font-black text-white font-display tracking-tighter italic">GLOBAL MUSIC</div>
            <div className="text-2xl font-black text-white font-display tracking-tighter">SPORT<span className="text-blue-500">IFY</span></div>
            <div className="text-2xl font-black text-white font-display tracking-tighter">ARTBASE</div>
            <div className="text-2xl font-black text-white font-display tracking-tighter underline decoration-purple-500 decoration-4">DEVHUB</div>
          </div>
        </div>
      </section>
    </div>
  );
}
