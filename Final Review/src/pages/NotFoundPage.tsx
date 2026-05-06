import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-12 max-w-2xl"
      >
        {/* Error Code */}
        <div className="relative">
          <div className="text-[200px] font-display font-black text-white/[0.03] leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center">
              <Search size={28} className="text-purple-400" />
            </div>
            <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">
              Node Not Found
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-display font-black text-white uppercase tracking-tighter">
            Signal Lost
          </h1>
          <p className="text-white/30 text-sm font-medium max-w-sm mx-auto leading-relaxed">
            The resource you're trying to access does not exist or has been moved to another node.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl hover:bg-purple-400 transition-all duration-300 hover:-translate-y-1"
          >
            <Home size={16} />
            <span>Return Home</span>
          </Link>
          <Link
            to="/auth"
            className="flex items-center gap-3 px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all"
          >
            <span>Browse Events</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
