import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card as UICard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const stripePromise = loadStripe('pk_test_placeholder'); // In a real app, use process.env.VITE_STRIPE_PUBLIC_KEY

const CheckoutForm = ({ clientSecret, paymentDetails, onSuccess }: { clientSecret: string, paymentDetails: any, onSuccess: (ref: string) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setProcessing(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement as any,
        billing_details: {
          name: paymentDetails.name,
        },
      },
    });

    if (result.error) {
      setError(result.error.message || 'Payment failed');
      setProcessing(false);
    } else {
      if (result.paymentIntent?.status === 'succeeded') {
        // Confirm booking on backend
        try {
          const res = await fetch('/api/bookings/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ paymentIntentId: result.paymentIntent.id }),
          });
          
          if (res.ok) {
            onSuccess(result.paymentIntent.id.substring(3, 12).toUpperCase());
          } else {
            setError('Payment successful but failed to confirm booking.');
            setProcessing(false);
          }
        } catch (err) {
          setError('Server error during confirmation.');
          setProcessing(false);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-xl">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={!stripe || processing} className="w-full bg-[#1e2e22] text-white hover:bg-black rounded-xl py-4">
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useAppContext();
  const navigate = useNavigate();
  
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  
  // Extract query params
  const searchParams = new URLSearchParams(location.search);
  const tier = searchParams.get('tier') || 'General Admission';
  const qty = searchParams.get('qty');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (id && tier && qty) {
      // Initialize payment intent
      fetch('/api/bookings/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          eventId: id,
          ticketTierName: tier,
          quantity: parseInt(qty)
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    } else {
      setLoading(false);
      // In dev, mock it if not providing params
      setClientSecret('mock_secret');
    }
  }, [id, tier, qty, currentUser, navigate]);

  const handleSuccess = (ref: string) => {
    setBookingRef(ref || 'OD8WRN5TG');
    setIsSuccess(true);
    toast.success('Payment Successful!');
  };

  if (loading) {
    return <div className="text-center py-20">Initializing secure checkout...</div>;
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 flex flex-col items-center">
        <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-md flex items-center gap-2 mb-10 shadow-sm border border-emerald-100">
          <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-100" />
          <span className="text-sm font-bold tracking-wide">Payment Successful!</span>
        </div>

        <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm overflow-hidden text-center relative border-t-[12px] border-[#0dc87e] pb-16">
          <div className="pt-16 pb-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-[#0dc87e]" />
            </div>
            <h1 className="text-4xl font-serif text-stone-900 mb-2">Payment Successful</h1>
            <p className="text-[11px] font-bold text-stone-400 tracking-[0.2em] uppercase mb-8">
              REF: #{bookingRef || 'OD8WRN5TG'}
            </p>
            <p className="text-stone-600 text-[15px] max-w-lg mx-auto leading-relaxed mb-12">
              Thank you, {currentUser?.name || 'vsivaipavan'}. Your {tier} has been confirmed. A receipt has been sent to {currentUser?.email || 'vsivaipavan@1233'}.
            </p>
            
            <div className="flex gap-4 justify-center mb-16">
              <button className="px-6 py-3 bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-bold tracking-[0.15em] uppercase rounded-md border border-stone-200 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Add To Calendar
              </button>
              <button className="px-6 py-3 bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-bold tracking-[0.15em] uppercase rounded-md border border-stone-200 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Ticket
              </button>
            </div>
            
            <button onClick={() => navigate('/')} className="text-[11px] font-bold text-stone-500 hover:text-stone-800 tracking-[0.15em] uppercase underline underline-offset-4 decoration-stone-300">
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif font-bold mb-2">Secure Checkout</h1>
        <p className="text-stone-500 flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          Payments are securely processed by Stripe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <UICard className="p-8 h-fit bg-white border-none shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-stone-600">Event</span>
              <span className="font-medium">Event ID: {id || 'Mock'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Ticket Tier</span>
              <span className="font-medium">{tier || 'VIP'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Quantity</span>
              <span className="font-medium">{qty || '1'}</span>
            </div>
          </div>
        </UICard>

        {/* Payment Form */}
        <UICard className="p-8 bg-white border-none shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Payment Details</h2>
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm clientSecret={clientSecret} paymentDetails={{ name: currentUser?.name }} onSuccess={handleSuccess} />
            </Elements>
          ) : (
            <div className="text-center py-10">
              <p className="text-red-500">Could not initialize payment. Please check if event is valid.</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>Return Home</Button>
            </div>
          )}
        </UICard>
      </div>
    </div>
  );
}
