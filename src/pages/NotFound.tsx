import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20">
          <AlertTriangle size={48} />
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4 tracking-tighter">404</h1>
        <h2 className="text-xl text-slate-300 font-medium mb-2">Page Not Found</h2>
        <p className="text-slate-500 max-w-md mb-10 text-sm">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <Link 
          to="/"
          className="px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-cyan-400 transition-colors uppercase tracking-widest text-xs"
        >
          <Home size={16} /> Return Home
        </Link>
      </motion.div>
    </div>
  );
}
