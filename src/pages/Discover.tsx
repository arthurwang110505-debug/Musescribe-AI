import { Globe, Search, Play } from 'lucide-react';

export default function Discover() {
  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Discover</h1>
          <p className="text-slate-500 text-sm">Explore public transcriptions from the MuseScribe community</p>
        </div>
        
        <div className="relative hidden md:block">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
           <input 
             type="text" 
             placeholder="Search scores..."
             className="w-64 bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50"
           />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Community Cards */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white/5 border border-white/10 rounded-3xl p-6 group hover:border-cyan-500/30 transition-all cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-500/40 hover:scale-105 transition-transform">
                 <Play size={16} fill="white" />
               </button>
             </div>
             
             <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
               <Globe size={20} />
             </div>
             <h3 className="text-lg font-bold text-white mb-1 truncate">Community Score #{item}</h3>
             <p className="text-slate-500 text-xs mb-4">by User{Math.floor(Math.random() * 1000)}</p>
             
             <div className="flex items-center gap-2">
               <span className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold uppercase tracking-widest text-slate-400">Piano</span>
               <span className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold uppercase tracking-widest text-slate-400">Jazz</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
