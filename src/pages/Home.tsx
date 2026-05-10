import { motion } from 'motion/react';
import { Music, Zap, FileText, Download, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full"
        >
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em]">Next-Gen Music AI</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.9]"
        >
          Record. Transcribe. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Play Forever.</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 max-w-2xl text-lg mb-12 leading-relaxed"
        >
          Transform your musical recordings into professional sheet music in seconds. Powered by Gemini 1.5 Pro for unprecedented accuracy.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <Link to="/studio" className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl text-white font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
            Open Studio <ChevronRight size={18} />
          </Link>
          <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3">
            Watch Demo <Play size={16} fill="white" />
          </button>
        </motion.div>

        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {[
          { icon: Zap, title: "Instant Analysis", desc: "Our AI processes harmonics and rhythms in real-time, delivering results faster than manual transcription." },
          { icon: Music, title: "Polyphonic Detection", desc: "Recognizes complex chords and multiple instruments, not just single notes." },
          { icon: FileText, title: "Standard ABC Format", desc: "Export to ABC, PDF, or MIDI (Coming Soon). Compatible with all major sheet music software." }
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md"
          >
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 text-cyan-400">
              <feature.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
