import { motion } from 'motion/react';
import { Music, ArrowRight, Play, Zap, Shield, Globe } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function LandingPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-[#050508] text-slate-300 flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <nav className="flex items-center justify-between p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Music className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight uppercase">MuseScribe <span className="text-cyan-400 font-light italic">AI</span></span>
        </div>
        <button 
          onClick={login}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white text-xs font-bold uppercase tracking-widest"
        >
          Login
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Gen-3 Transcription Engine Active</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-tight">
            Transcribe Any Audio <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 italic">Into Pure Score.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Professional AI-powered music transcription for composers, musicians, and educators. 
            Upload files and get accurate sheet music in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={login}
              className="px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 justify-center shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              Start Transcribing <ArrowRight size={18} />
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
              View Showcase
            </button>
          </div>
        </motion.div>

        {/* Features Bento */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full px-6 mb-32">
          {[
            { icon: Zap, title: "Instant Analysis", desc: "Process complex polyphonic recordings in sub-second latency using our proprietary AI model." },
            { icon: Globe, title: "Multi-Format Export", desc: "Professional output in PDF, MusicXML, MIDI, and ABC formats ready for any DAW or editor." },
            { icon: Shield, title: "Secure & Private", desc: "Your compositions are yours. Encrypted data flow ensures your creativity stays protected." }
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-sm group hover:border-cyan-500/20 transition-all text-left">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                <item.icon size={24} />
              </div>
              <h3 className="text-white font-bold mb-3 uppercase tracking-wider">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-8 border-t border-white/5 text-center text-[10px] font-mono text-slate-600 uppercase tracking-[0.5em]">
        MuseScribe Laboratories // Built for the next generation of composers
      </footer>
    </div>
  );
}
