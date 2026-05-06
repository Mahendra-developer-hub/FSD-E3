import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        if (data.ticketTiers && data.ticketTiers.length > 0) {
          setSelectedTier(data.ticketTiers[0].name);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/checkout/${id}?tier=${selectedTier}&qty=${quantity}`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return <div className="text-center py-20 font-serif italic text-stone-500">Loading event details...</div>;
  }

  if (!event) {
    return <div className="text-center py-20 font-serif italic text-stone-500">Event not found.</div>;
  }

  const currentTierData = event.ticketTiers?.find((t: any) => t.name === selectedTier);

  return (
    <div className="w-full max-w-[1000px] mx-auto mt-4 mb-20">
      {/* Hero Image & Basics */}
      <div className="relative w-full h-[450px] rounded-[24px] overflow-hidden mb-8 bg-stone-100 border border-stone-200">
        {event.image && (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover mix-blend-multiply" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent flex items-end p-10 md:p-14">
          <div className="text-white w-full flex justify-between items-end">
            <div>
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 inline-block">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-serif font-bold mb-4">{event.title}</h1>
              <div className="flex gap-6 text-[13px] font-medium opacity-90 tracking-wide">
                <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(event.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><MapPin size={16} /> {event.location}</span>
              </div>
            </div>
            <button onClick={toggleWishlist} className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors flex items-center justify-center">
              <Heart size={24} className={isWishlisted ? "text-red-500 fill-red-500" : "text-white"} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-10 rounded-[24px] shadow-sm border border-stone-100">
            <h2 className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-6">About this event</h2>
            <p className="text-[15px] text-stone-600 leading-relaxed font-serif">
              {event.description}
            </p>
          </div>

          {/* Image Gallery */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="bg-white p-10 rounded-[24px] shadow-sm border border-stone-100">
              <h2 className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-6">Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {event.gallery.map((img: string, i: number) => (
                  <img key={i} src={img} alt="Gallery" className="rounded-xl w-full h-48 object-cover" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Ticketing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[24px] shadow-sm border border-stone-100 sticky top-24">
            <h3 className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-6 pb-4 border-b border-stone-100">Registration</h3>
            
            {event.ticketTiers && event.ticketTiers.length > 0 ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  {event.ticketTiers.map((tier: any) => (
                    <div 
                      key={tier.name}
                      onClick={() => setSelectedTier(tier.name)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedTier === tier.name 
                        ? 'border-[#1e2e22] bg-[#f8f9fa]' 
                        : 'border-stone-100 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-serif font-bold text-[17px] text-stone-900">{tier.name}</span>
                        <span className="text-[15px] font-bold text-stone-900">₹{tier.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold tracking-widest uppercase text-stone-400">
                        <span className="flex items-center gap-1"><Users size={12}/> {tier.capacity - tier.sold} available</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="py-6 border-t border-b border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-stone-500">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors font-bold">-</button>
                    <span className="w-6 text-center font-bold text-stone-900 text-[15px]">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors font-bold">+</button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-stone-500">Total</span>
                  <span className="text-3xl font-serif font-bold text-stone-900">₹{(currentTierData?.price || 0) * quantity}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#1e2e22] text-white font-bold py-4 px-8 rounded-xl hover:bg-black transition-colors duration-300 text-[11px] tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="text-[11px] font-bold tracking-widest uppercase text-stone-400">Tickets unavailable</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

