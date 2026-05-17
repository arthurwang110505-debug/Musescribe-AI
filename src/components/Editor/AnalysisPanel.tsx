import { 
  History, 
  Activity, 
  Mic as TuningFork, 
  Settings, 
  ChevronRight,
  TrendingUp,
  Music4
} from 'lucide-react';
import { AbcMetadata } from '../../lib/abcParser';

interface SidebarProps {
  isProcessing: boolean;
  metadata?: AbcMetadata;
}

export default function Sidebar({ isProcessing, metadata }: SidebarProps) {
  const displayMetadata = metadata || { bpm: 'AUTO', key: 'Detecting', meter: '4/4' };

  return (
    <aside className="md:col-span-3 flex flex-col gap-6 no-print">
      {/* Analysis Engine Panel */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <Activity size={18} className="text-cyan-400" />
          <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Engine Status</span>
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Processing Power</span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">{isProcessing ? '98%' : '0%'}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-1000 ${isProcessing ? 'w-[98%]' : 'w-0'}`}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-2xl p-4 border border-white/5 group hover:border-cyan-500/30 transition-colors">
              <div className="text-[8px] font-bold text-slate-500 uppercase mb-1 tracking-widest">BPM Tempo</div>
              <div className="text-lg font-mono text-white font-bold tracking-tighter group-hover:text-cyan-400 transition-colors">{displayMetadata.bpm}</div>
            </div>
            <div className="bg-black/20 rounded-2xl p-4 border border-white/5 group hover:border-cyan-500/30 transition-colors">
              <div className="text-[8px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Scale / Key</div>
              <div className="text-lg font-mono text-white font-bold tracking-tighter group-hover:text-cyan-400 transition-colors">{displayMetadata.key}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation / Features */}
      <div className="flex flex-col gap-2">
        {[
          { icon: History, label: "Transcription History", count: "12" },
          { icon: Music4, label: "Musical Styles", count: "8" },
          { icon: TrendingUp, label: "Accuracy Metrics", count: "99%" },
          { icon: Settings, label: "Studio Config", count: null },
        ].map((item, i) => (
          <button key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-3">
              <item.icon size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{item.label}</span>
            </div>
            {item.count ? (
              <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded-md text-slate-500 group-hover:text-cyan-400 transition-colors">{item.count}</span>
            ) : (
              <ChevronRight size={12} className="text-slate-600" />
            )}
          </button>
        ))}
      </div>

    </aside>
  );
}
