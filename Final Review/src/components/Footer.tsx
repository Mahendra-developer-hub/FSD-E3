import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 px-8 py-20 backdrop-blur-3xl bg-[#050508]/60 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-4 group text-white">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-2xl group-hover:bg-purple-400 transition-all duration-500">
                <Calendar size={20} strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-black tracking-tighter uppercase leading-none">
                Eventify<span className="text-purple-500">Pro</span>
              </span>
            </Link>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs">
              Unified architecture for global event distribution and secure transaction processing.
            </p>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Protocols</h5>
            <div className="flex flex-col space-y-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <a href="#" className="hover:text-purple-400 transition-colors">Neural Interface</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Data Privacy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Security Audit</a>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Infrastructure</h5>
            <div className="flex flex-col space-y-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <a href="#" className="hover:text-purple-400 transition-colors">Global Nodes</a>
              <a href="#" className="hover:text-purple-400 transition-colors">API documentation</a>
              <a href="#" className="hover:text-purple-400 transition-colors">System Health</a>
            </div>
          </div>

          <div className="space-y-8 text-right flex flex-col md:items-end">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase">System Operational</span>
            </div>
            <div className="flex items-center space-x-6">
               <a href="#" className="text-white/20 hover:text-white transition-all"><Facebook size={18} /></a>
               <a href="#" className="text-white/20 hover:text-white transition-all"><Twitter size={18} /></a>
               <a href="#" className="text-white/20 hover:text-white transition-all"><Instagram size={18} /></a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} Eventify Pro. ALL PROTOCOLS VERIFIED.
          </p>
          <div className="flex gap-10 text-[9px] font-black text-white/10 tracking-[0.3em] uppercase">
            <span className="text-white/5">AES-256 ENCRYPTION</span>
            <span>Handcrafted by the Matrix</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
