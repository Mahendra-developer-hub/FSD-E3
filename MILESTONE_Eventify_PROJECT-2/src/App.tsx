import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

import Layout from './components/Layout';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Admin = lazy(() => import('./pages/Admin'));
const EventDetail = lazy(() => import('./pages/EventDetail'));

const PageSkeleton = () => (
  <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[50vh] opacity-50 animate-pulse">
    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-emerald-600 font-serif italic">Loading experience...</p>
  </div>
);

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<PageSkeleton />}>
              <Home />
            </Suspense>
          } />
          <Route path="events/:id" element={
            <Suspense fallback={<PageSkeleton />}>
              <EventDetail />
            </Suspense>
          } />
          <Route path="login" element={
            <Suspense fallback={<PageSkeleton />}>
              <Login />
            </Suspense>
          } />
          <Route path="signup" element={
            <Suspense fallback={<PageSkeleton />}>
              <Signup />
            </Suspense>
          } />
          <Route path="checkout/:id" element={
            <Suspense fallback={<PageSkeleton />}>
              <Checkout />
            </Suspense>
          } />
          <Route path="admin" element={
            <Suspense fallback={<PageSkeleton />}>
              <Admin />
            </Suspense>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
