import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Toaster position="top-center" richColors />
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);

