import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Ticket, ArrowRight, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';

export default function Home() {
  const { currentUser } = useAppContext();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 172,
    hours: 8,
    mins: 15,
    secs: 43
  });

  useEffect(() => {
    fetchEvents();
    
    // Fake countdown timer for visual fidelity to the screenshot
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) {
          secs--;
        } else {
          secs = 59;
          if (mins > 0) {
            mins--;
          } else {
            mins = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              days--;
            }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.events && data.events.length > 0) {
        setEvent(data.events[0]);
      } else {
        setEvent({
          _id: '1',
          title: 'Annual Technical Symposium 2026',
          category: 'CSE DEPARTMENT',
          date: new Date('2026-10-24').toISOString(),
          location: 'Main Auditorium, Block C',
          capacity: 100,
          soldTickets: 0
        });
      }
    } catch (error) {
      setEvent({
        _id: '1',
        title: 'Annual Technical Symposium 2026',
        category: 'CSE DEPARTMENT',
        date: new Date('2026-10-24').toISOString(),
        location: 'Main Auditorium, Block C',
        capacity: 100,
        soldTickets: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !event) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading event...</div>;
  }

  const handleRegister = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto mt-4 mb-20 bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      
      {/* LEFT PANE - Event Details */}
      <div className="w-full md:w-1/2 p-10 md:p-14 border-r border-stone-100 flex flex-col justify-center">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-6">
            {event.category || 'CSE DEPARTMENT'}
          </span>
          <h1 className="text-[44px] leading-[1.1] font-serif text-stone-900 tracking-tight mb-8">
            {event.title}
          </h1>
        </div>

        {/* Countdown Timer */}
        <div className="flex bg-white border border-stone-100 rounded-xl p-6 mb-10 shadow-sm justify-between">
          <div className="text-center px-4">
            <div className="text-3xl font-serif font-bold text-stone-800">{timeLeft.days}</div>
            <div className="text-[9px] font-bold tracking-[0.2em] text-stone-400 mt-1 uppercase">Days</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-serif font-bold text-stone-800">{timeLeft.hours}</div>
            <div className="text-[9px] font-bold tracking-[0.2em] text-stone-400 mt-1 uppercase">Hours</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-serif font-bold text-stone-800">{timeLeft.mins}</div>
            <div className="text-[9px] font-bold tracking-[0.2em] text-stone-400 mt-1 uppercase">Mins</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-serif font-bold text-stone-800">{timeLeft.secs}</div>
            <div className="text-[9px] font-bold tracking-[0.2em] text-stone-400 mt-1 uppercase">Secs</div>
          </div>
        </div>

        {/* Event Meta Grid */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
          <div className="flex gap-4 items-start">
            <Calendar size={18} className="text-stone-400 mt-1" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-1">Date</div>
              <div className="text-[13px] font-medium text-stone-800">October 24, 2026</div>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Clock size={18} className="text-stone-400 mt-1" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-1">Time</div>
              <div className="text-[13px] font-medium text-stone-800">09:00 AM - 05:00 PM</div>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <MapPin size={18} className="text-stone-400 mt-1" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-1">Venue</div>
              <div className="text-[13px] font-medium text-stone-800">{event.location}</div>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Ticket size={18} className="text-stone-400 mt-1" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-1">Availability</div>
              <div className="text-[13px] font-medium text-stone-800">{event.capacity} / {event.capacity} Seats</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE - Auth/Registration */}
      <div className="w-full md:w-1/2 p-10 md:p-14 bg-[#fcfcfc] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-stone-50/50 pointer-events-none"></div>
        
        {!currentUser ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[340px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 text-center relative z-10 border border-stone-100"
          >
            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-600">
              <Lock size={20} />
            </div>
            <h2 className="text-2xl font-serif text-stone-900 mb-3">Members Only</h2>
            <p className="text-[12px] text-stone-500 leading-relaxed mb-8">
              You must be logged into your institutional account to register for this event.
            </p>
            
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-[#1e2e22] text-white font-bold py-4 px-6 rounded-xl hover:bg-black transition-colors duration-300 text-[11px] tracking-widest flex items-center justify-center gap-2 group uppercase mb-6"
            >
              Log In To Register
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
            
            <Link to="/signup" className="text-[10px] font-bold text-stone-400 hover:text-stone-800 tracking-widest uppercase">
              Create An Account
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[340px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 relative z-10 border border-stone-100"
          >
            <div className="text-center mb-8">
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
                Access Granted
              </div>
              <h2 className="text-2xl font-serif text-stone-900 mb-2">Welcome, {currentUser.name.split(' ')[0]}</h2>
              <p className="text-[12px] text-stone-500">You are eligible to register for this event.</p>
            </div>

            <button 
              onClick={handleRegister}
              className="w-full bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-emerald-700 transition-colors duration-300 text-[11px] tracking-widest flex items-center justify-center gap-2 group uppercase"
            >
              Continue To Registration
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>

    </div>
  );
}



