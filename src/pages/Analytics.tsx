import { BarChart3, Activity, Clock, Music } from 'lucide-react';

export default function Analytics() {
  const stats = [
    { label: 'Total Transcriptions', val: '124', icon: Music, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Hours Processed', val: '18.5', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Accuracy Score', val: '98.2%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ];

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Analytics</h1>
        <p className="text-slate-500 text-sm">Track your transcription usage and performance stats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white tracking-tighter mb-1">{stat.val}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
         <BarChart3 size={48} className="text-slate-600 mb-6" />
         <h3 className="text-xl font-bold text-white mb-2">Usage Graphs Coming Soon</h3>
         <p className="text-slate-500 text-sm max-w-sm">
           Detailed visual analytics of your transcription history and instrument usage will appear here in the next update.
         </p>
      </div>
    </div>
  );
}
