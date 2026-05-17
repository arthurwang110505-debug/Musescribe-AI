import { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Calendar, 
  Trash2, 
  ExternalLink, 
  Music,
  Loader2
} from 'lucide-react';
import { useHistory, SavedScore } from '../hooks/useHistory';
import { useNavigate } from 'react-router-dom';

export default function Library() {
  const { history, loading, fetchHistory, deleteScore } = useHistory();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Library</h1>
          <p className="text-slate-400 text-sm">Access and manage all your past transcriptions.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3 self-start md:self-auto">
          <Music className="text-cyan-400" size={18} />
          <span className="text-sm font-bold text-white uppercase tracking-widest">{history.length} Scores Saved</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 size={40} className="text-cyan-400 animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">Loading your collection...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-700">
            <FileText size={40} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Transcriptions Yet</h2>
          <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">Start recording or uploading audio in the Studio to build your library.</p>
          <button 
            onClick={() => navigate('/studio')}
            className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            Go to Studio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((score, i) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:border-cyan-500/30 transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                  <FileText size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteScore(score.id!)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors truncate">
                {score.fileName}
              </h3>
              
              <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-8">
                <span className="flex items-center gap-1.5"><Calendar size={12}/> {formatDate(score.createdAt)}</span>
              </div>

              <div className="h-[1px] bg-white/10 w-full mb-6"></div>

              <button 
                onClick={() => navigate('/studio', { state: { abc: score.abcContent, fileName: score.fileName } })}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                Open in Studio <ExternalLink size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
