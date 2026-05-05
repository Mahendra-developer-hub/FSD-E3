import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EventDoc } from '../types';
import { 
  Calendar, MapPin, ShieldCheck, Clock, Users, ChevronRight, 
  Ticket, Info, Zap, Sparkles, Share2, ArrowLeft, Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate } from '../lib/utils';
import { useStore } from '../store/useStore';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToast } = useStore();
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as EventDoc;
          setEvent(data);
          const tiers = docSnap.data().ticketTiers;
          if (tiers) setSelectedTier(Object.keys(tiers)[0]);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleBooking = () => {
    if (!user) {
      addToast({ type: 'info', message: 'Please sign in to book tickets.' });
      navigate('/auth');
      return;
    }
    if (!selectedTier || !event) return;
    navigate(`/bookings?eventId=${event.id}&tier=${selectedTier}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: event?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      addToast({ type: 'success', message: 'Event link copied to clipboard!' });
    }
  };

  const getAvailabilityPercent = () => {
    if (!event) return 0;
    return Math.round((event.availableTickets / event.totalCapacity) * 100);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 border-2 border-white/5 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Loading Event</div>
      </div>
    </div>
  );

  if (!event) return null;

  const availabilityPct = getAvailabilityPercent();
  const highlights = [
    { title: 'Expert Speakers', desc: 'Industry-leading keynotes and panel discussions.', icon: <Zap className="text-purple-400" size={20} /> },
    { title: 'Networking', desc: 'Connect with 500+ verified global professionals.', icon: <Users className="text-blue-400" size={20} /> },
    { title: 'Digital Pass', desc: 'QR-coded entry pass for all ticket tiers.', icon: <Ticket className="text-pink-400" size={20} /> },
    { title: 'Premium Experience', desc: 'Curated entertainment and interactive sessions.', icon: <Sparkles className="text-emerald-400" size={20} /> },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Cover Image Section */}
      <section className="relative h-[520px] overflow-hidden">
        <img 
          src={event.images?.[0] || 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=2000'} 
          alt={event.title}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/50 to-transparent"></div>
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-white/60 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-white/60 hover:text-white transition-all"
        >
          <Share2 size={16} />
        </button>
        
        <div className="absolute bottom-12 inset-x-0">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 bg-purple-500/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                  {event.category}
                </span>
                {event.isFeatured && (
                  <span className="px-4 py-1.5 bg-yellow-400/20 border border-yellow-400/30 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-400 flex items-center gap-1.5">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </span>
                )}
                <span className={`px-4 py-1.5 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-1.5 ${
                  event.status === 'upcoming' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/40'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${event.status === 'upcoming' ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`}></div>
                  {event.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter leading-[0.85] uppercase max-w-4xl">
                {event.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl space-y-12">
              
              {/* Event Info Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white/20">
                    <Calendar size={13} className="text-purple-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Date</span>
                  </div>
                  <div className="font-bold text-white text-sm uppercase tracking-tight">{formatDate(event.date)}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white/20">
                    <MapPin size={13} className="text-purple-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Location</span>
                  </div>
                  <div className="font-bold text-white text-sm uppercase tracking-tight">{event.location}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white/20">
                    <Users size={13} className="text-purple-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Capacity</span>
                  </div>
                  <div className="font-bold text-white text-sm uppercase tracking-tight">{event.totalCapacity.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white/20">
                    <Clock size={13} className="text-purple-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Availability</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${availabilityPct > 20 ? 'bg-green-500 animate-pulse' : availabilityPct > 0 ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></div>
                    <span className="font-bold text-white text-sm uppercase tracking-tight">
                      {availabilityPct > 0 ? `${event.availableTickets} left` : 'Sold Out'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-white/5"></div>

              {/* Description */}
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">About This Event</h2>
                <p className="text-white/50 leading-relaxed text-base whitespace-pre-wrap font-medium">
                  {event.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">What's Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlights.map((item, i) => (
                    <div key={i} className="flex items-start space-x-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform shrink-0">
                        {item.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm uppercase tracking-tight">{item.title}</h4>
                        <p className="text-xs text-white/30 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="glass-card p-8 space-y-8 border border-white/10">
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Reserve Seat</h3>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Select your ticket tier</p>
                </div>

                {/* Tier Selection */}
                <div className="space-y-3">
                  {Object.entries(event.ticketTiers).map(([tier, price]) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center justify-between group ${
                        selectedTier === tier 
                          ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10' 
                          : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl transition-all ${selectedTier === tier ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/20 group-hover:bg-white/10 group-hover:text-purple-400'}`}>
                          <Ticket size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <div className={`font-bold text-base uppercase tracking-tight ${selectedTier === tier ? 'text-white' : 'text-white/60'}`}>{tier}</div>
                          <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Per ticket</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-display font-black text-white">₹{(price as number).toLocaleString()}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <span>Seats Available</span>
                    <span className="text-white">{availabilityPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${availabilityPct > 50 ? 'bg-emerald-500' : availabilityPct > 20 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${availabilityPct}%` }}
                    ></div>
                  </div>
                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest text-center">
                    {event.availableTickets.toLocaleString()} of {event.totalCapacity.toLocaleString()} seats remaining
                  </div>
                </div>
                
                {/* Book Button */}
                <button 
                  onClick={handleBooking}
                  disabled={event.availableTickets === 0}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl hover:bg-purple-400 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  <span>{event.availableTickets === 0 ? 'Sold Out' : 'Book Now'}</span>
                  {event.availableTickets > 0 && <ChevronRight size={16} />}
                </button>

                <div className="flex items-center justify-center space-x-6 text-[9px] font-bold text-white/10 uppercase tracking-widest pt-1">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                  <div className="flex items-center space-x-1.5">
                    <Info size={12} />
                    <span>Instant Ticket</span>
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div className="p-8 backdrop-blur-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/5 rounded-[32px] border border-purple-500/10 space-y-3">
                <h4 className="font-bold text-purple-400 flex items-center space-x-2 uppercase tracking-widest text-sm">
                  <Zap size={16} />
                  <span>Pro Tip</span>
                </h4>
                <p className="text-[10px] font-bold text-purple-200/30 uppercase tracking-[0.15em] leading-relaxed">
                  VIP & Premium tickets include exclusive speaker lounge access, priority seating, and digital recording access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
