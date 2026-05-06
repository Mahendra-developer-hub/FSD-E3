import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ToastMessage } from '../types';

function ToastItem({ toast }: { toast: ToastMessage }) {
  const { removeToast } = useStore();
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    error: <XCircle size={18} className="text-rose-400 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
    info: <Info size={18} className="text-blue-400 shrink-0" />,
  };

  const colors = {
    success: 'border-emerald-500/20 bg-emerald-500/5',
    error: 'border-rose-500/20 bg-rose-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    info: 'border-blue-500/20 bg-blue-500/5',
  };

  return (
    <div
      className={`toast flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-xl ${colors[toast.type]} ${removing ? 'removing' : ''} shadow-2xl`}
    >
      <div className="pt-0.5">{icons[toast.type]}</div>
      <p className="flex-1 text-[11px] font-bold text-white/80 uppercase tracking-widest leading-relaxed">
        {toast.message}
      </p>
      <button
        onClick={handleRemove}
        className="text-white/20 hover:text-white transition-colors shrink-0 mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useStore();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
