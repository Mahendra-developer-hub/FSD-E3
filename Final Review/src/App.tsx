import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useStore } from './store/useStore';
import { UserRole, UserProfile } from './types';

// Pages
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

function GlobalLoader() {
  return (
    <div className="fixed inset-0 bg-[#050508] z-[200] flex flex-col items-center justify-center space-y-8">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
        </div>
        <div>
          <div className="font-display text-xl font-black tracking-tighter uppercase leading-none text-white">
            Eventify<span className="text-purple-500">Pro</span>
          </div>
          <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] pt-1">Enterprise Link</div>
        </div>
      </div>

      {/* Spinner */}
      <div className="relative">
        <div className="w-12 h-12 border-2 border-white/5 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="w-8 h-8 border-2 border-white/5 border-b-blue-500 rounded-full animate-spin absolute top-2 left-2" style={{ animationDirection: 'reverse' }}></div>
      </div>
      
      <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] animate-pulse">
        Initializing Protocols...
      </div>
    </div>
  );
}

export default function App() {
  const { setUser, setIsLoading, user, isLoading } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Fetch or create user profile
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            userId: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL || '',
            role: firebaseUser.email === 'mahendra04165@gmail.com' ? UserRole.ADMIN : UserRole.USER,
            wishlist: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(userRef, {
            ...newUser,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  // Show global loader only on first load
  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
        {/* Background Blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="bg-blob top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30"></div>
          <div className="bg-blob bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20"></div>
          <div className="bg-blob top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-900/10"></div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/bookings" 
                element={user ? <BookingPage /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/profile" 
                element={user ? <ProfilePage /> : <Navigate to="/auth" />} 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/*" 
                element={user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/" />} 
              />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
