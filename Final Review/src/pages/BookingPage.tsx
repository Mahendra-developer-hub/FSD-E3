import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Ticket, Minus, Plus, CreditCard, ShieldCheck, ArrowLeft, Loader2, CheckCircle2, AlertCircle, MapPin, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EventDoc, BookingStatus } from '../types';

type CheckoutStep = 'review' | 'processing' | 'success' | 'error';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, addToast } = useStore();

  const eventId = searchParams.get('eventId');
  const initialTier = searchParams.get('tier');

  const [event, setEvent] = useState<EventDoc | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(initialTier);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<CheckoutStep>('review');
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) { navigate('/'); return; }
      try {
        const docRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const eventData = { id: docSnap.id, ...docSnap.data() } as EventDoc;
          setEvent(eventData);
          if (!selectedTier && eventData.ticketTiers) {
            setSelectedTier(Object.keys(eventData.ticketTiers)[0]);
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, navigate]);

  const handleCheckout = async () => {
    if (!user || !event || !selectedTier) return;
    setStep('processing');

    try {
      const price = (event.ticketTiers as any)[selectedTier] || 0;
      const totalAmount = price * quantity;

      // Create booking in Firestore
      const bookingData = {
        userId: user.userId,
        eventId: event.id,
        eventTitle: event.title,
        eventImage: event.images?.[0] || '',
        tickets: [{ tier: selectedTier, quantity, price }],
        totalAmount,
        status: BookingStatus.PENDING,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
      const newBookingId = bookingRef.id;
      setBookingId(newBookingId);

      // Simulate payment processing (dummy gateway)
      await new Promise(res => setTimeout(res, 2500));

      // Confirm booking
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ name: `${event.title} - ${selectedTier}`, price, quantity }]
        })
      }).catch(() => ({ json: async () => ({ success: true, transactionId: 'TXN' + Date.now() }) }));

      const data = await (response as any).json();

      // Mark booking as confirmed
      await updateDoc(doc(db, 'bookings', newBookingId), {
        status: BookingStatus.CONFIRMED,
        stripeSessionId: data.transactionId || 'LOCAL_' + Date.now(),
        updatedAt: serverTimestamp(),
      });

      // Send email notification (fire and forget)
      if (user.email) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user.email,
            subject: 'Booking Confirmed — Eventify Pro',
            html: `<div style="font-family:sans-serif;padding:24px;background:#050508;color:#fff;">
              <h2 style="color:#a78bfa">🎫 Booking Confirmed!</h2>
              <p>Hi ${user.displayName},</p>
              <p>Your booking for <strong>${event.title}</strong> is confirmed.</p>
              <p>Booking ID: <code>${newBookingId}</code></p>
              <p>Tier: ${selectedTier} × ${quantity}</p>
              <p>Total: ₹${totalAmount.toLocaleString()}</p>
              <br/><p>Enjoy the event! — Team Eventify Pro</p>
            </div>`
          })
        }).catch(() => {});
      }

      setStep('success');
      addToast({ type: 'success', message: `Booking confirmed! Check your profile for tickets.` });

    } catch (error) {
      console.error(error);
      setStep('error');
      addToast({ type: 'error', message: 'Payment failed. Please try again.' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <div className="w-12 h-12 border-2 border-white/5 border-t-purple-500 rounded-full animate-spin"></div>
      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Loading Event</div>
    </div>
  );

  if (!event || !selectedTier) return null;

  const price = (event.ticketTiers as any)[selectedTier] || 0;
  const total = price * quantity;
  const tierOptions = Object.entries(event.ticketTiers);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center space-x-2 text-white/30 hover:text-white transition-all group text-[10px] font-black uppercase tracking-widest"
        >
          <div className="p-2 border border-white/10 rounded-xl group-hover:bg-white/5">
            <ArrowLeft size={15} />
          </div>
          <span>Back to Event</span>
        </button>

        <AnimatePresence mode="wait">
          {/* REVIEW STEP */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-10"
            >
              {/* LEFT: Order Details */}
              <div className="lg:col-span-3 space-y-8">
                <div>
                  <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Order Review</h2>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest pt-2">Confirm your booking details</p>
                </div>

                {/* Event Card */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 space-y-6">
                  <div className="flex space-x-5">
                    <img 
                      src={event.images?.[0] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400'} 
                      className="w-24 h-24 rounded-2xl object-cover border border-white/10 shrink-0" 
                      alt={event.title}
                    />
                    <div className="space-y-2">
                      <h3 className="text-xl font-display font-black text-white uppercase tracking-tight leading-tight">{event.title}</h3>
                      <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin size={11} className="text-purple-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                        <Calendar size={11} className="text-purple-400" />
                        <span>{event.date?.toDate ? new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(event.date.toDate()) : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/5"></div>

                  {/* Tier Selector */}
                  <div className="space-y-3">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Select Ticket Tier</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tierOptions.map(([tier, tierPrice]) => (
                        <button
                          key={tier}
                          onClick={() => setSelectedTier(tier)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                            selectedTier === tier 
                              ? 'border-purple-500 bg-purple-500/10' 
                              : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Ticket size={16} className={selectedTier === tier ? 'text-purple-400' : 'text-white/20'} />
                              <span className={`font-black text-sm uppercase tracking-tight ${selectedTier === tier ? 'text-white' : 'text-white/40'}`}>{tier}</span>
                            </div>
                            <span className="font-display font-black text-white text-lg">₹{(tierPrice as number).toLocaleString()}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/5"></div>

                  {/* Quantity */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Quantity</div>
                      <div className="text-[10px] text-white/20 font-medium mt-0.5">Max 10 per order</div>
                    </div>
                    <div className="flex items-center space-x-4 bg-white/5 border border-white/10 rounded-2xl p-2">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/60 hover:text-white"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-display font-black text-xl w-8 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => Math.min(10, q + 1))}
                        className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/60 hover:text-white"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Payment Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 space-y-8 sticky top-24">
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">Order Summary</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{selectedTier} × {quantity}</span>
                      <span className="text-white font-bold">₹{(price * quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Platform Fee</span>
                      <span className="text-white/40 font-bold text-[11px]">Included</span>
                    </div>
                    <div className="h-[1px] bg-white/5"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-black uppercase tracking-widest text-[10px]">Total</span>
                      <span className="text-2xl font-display font-black text-white">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Security Badges */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: <ShieldCheck size={16} />, label: 'Secure' },
                      { icon: <CreditCard size={16} />, label: 'Encrypted' },
                      { icon: <CheckCircle2 size={16} />, label: 'Instant' },
                    ].map((badge, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-purple-400">{badge.icon}</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{badge.label}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-purple-400 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    <CreditCard size={16} />
                    <span>Confirm & Pay ₹{total.toLocaleString()}</span>
                  </button>

                  <p className="text-[9px] text-white/10 font-bold uppercase tracking-widest text-center leading-relaxed">
                    By continuing, you agree to Eventify Pro's Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* PROCESSING STEP */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[500px] space-y-10"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-white/5 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-white/5 border-b-blue-500 rounded-full animate-spin absolute top-4 left-4" style={{ animationDirection: 'reverse' }}></div>
              </div>
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Processing Payment</h2>
                <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest">Securing your transaction... please wait</p>
              </div>
              <div className="space-y-2 w-full max-w-xs">
                {['Validating order...', 'Processing payment...', 'Confirming booking...'].map((msg, i) => (
                  <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    <Loader2 size={12} className="animate-spin text-purple-400/50 shrink-0" />
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SUCCESS STEP */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[500px] space-y-10 max-w-xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 size={48} className="text-emerald-400" />
              </motion.div>

              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  Booking Confirmed
                </div>
                <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">You're all set!</h2>
                <p className="text-white/30 font-medium text-sm leading-relaxed max-w-sm">
                  Your booking has been confirmed. A confirmation email has been sent to <strong className="text-white/60">{user?.email}</strong>.
                </p>
              </div>

              {bookingId && (
                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2 w-full">
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">Booking Reference</div>
                  <div className="font-mono font-black text-purple-400 text-lg uppercase">#{bookingId.slice(-12).toUpperCase()}</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex-1 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-purple-400 transition-all"
                >
                  View My Tickets
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all"
                >
                  Browse More Events
                </button>
              </div>
            </motion.div>
          )}

          {/* ERROR STEP */}
          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[500px] space-y-8 max-w-md mx-auto text-center"
            >
              <div className="w-24 h-24 bg-rose-500/20 border border-rose-500/30 rounded-full flex items-center justify-center">
                <AlertCircle size={48} className="text-rose-400" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Payment Failed</h2>
                <p className="text-white/30 font-medium text-sm">Something went wrong during payment processing. No charges were made.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={() => setStep('review')}
                  className="flex-1 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-purple-400 transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}