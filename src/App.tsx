import { useState, useEffect } from 'react';
import abcjs from 'abcjs';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Download, 
  Printer, 
  RefreshCw, 
  AlertCircle,
  FileText,
  Binary,
  Maximize2,
  Undo2,
  Redo2,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import FileUploader from './components/FileUploader';
import ScoreRenderer from './components/ScoreRenderer';
import { transcribeAudio, suggestChords } from './lib/geminiService';
import AbcEditor from './components/AbcEditor';
import jsPDF from 'jspdf';
import { useAuth } from './components/AuthProvider';
import LandingPage from './components/LandingPage';
import { useHistory } from './hooks/useHistory';

export default function App() {
  const { user, loading, logout } = useAuth();
  const { state: abcContent, set: setAbcContent, undo, redo, canUndo, canRedo } = useHistory<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cyan-500"
        >
          <Music size={48} />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    try {
      const transcription = await transcribeAudio(file);
      const cleaned = transcription.replace(/```abc/g, '').replace(/```/g, '').trim();
      setAbcContent(cleaned);
      setSelection(undefined);
    } catch (err) {
      console.error(err);
      setError('無法分析該檔案。這可能是由於檔案過大或網路連線問題。');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNoteClick = (start: number, end: number) => {
    setSelection({ start, end });
  };

  const handleSuggestChords = async () => {
    if (!abcContent) return;
    setIsSuggesting(true);
    try {
      const updatedAbc = await suggestChords(abcContent);
      const cleaned = updatedAbc.replace(/```abc/g, '').replace(/```/g, '').trim();
      setAbcContent(cleaned);
    } catch (err) {
      console.error(err);
      setError('和弦建議失敗，請稍後再試。');
    } finally {
      setIsSuggesting(false);
    }
  };

  const reset = () => {
    setAbcContent('');
    setFileName('');
    setError(null);
  };

  const exportPDF = () => {
    window.print();
  };

  const downloadAbc = () => {
    const blob = new Blob([abcContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.split('.')[0] || 'score'}.abc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMidi = async () => {
    try {
      const visualObj = abcjs.renderAbc('paper', abcContent)[0];
      const midiData = abcjs.synth.getMidiFile(visualObj);
      const blob = new Blob([midiData], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.split('.')[0] || 'score'}.mid`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("MIDI export error:", err);
      setError("MIDI 匯出失敗。");
    }
  };

  return (
    <div className="min-h-screen technical-grid flex flex-col p-6 text-slate-300 font-sans">
      {/* Header Navigation */}
      <header className="flex items-center justify-between mb-8 px-2 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Music className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight uppercase">MuseScribe <span className="text-cyan-400 font-light italic">AI</span></span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-6 h-6 rounded-full border border-white/20" alt="avatar" />
            ) : (
              <UserIcon size={16} />
            )}
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{user.displayName || 'Musician'}</span>
            <button onClick={logout} className="ml-2 p-1 hover:text-red-400 transition-colors" title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="md:col-span-3 flex flex-col gap-6 no-print">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Input Source
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <Music size={16} className="text-cyan-400" />
                <div className="flex flex-col">
                  <span className="text-sm text-cyan-100 font-medium">Local File</span>
                  <span className="text-[10px] text-cyan-400/70 font-mono">AUDIO / VIDEO</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex-1">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-5">Workflow Tools</h3>
            <div className="space-y-6">
              <div className="flex gap-2">
                <button 
                  onClick={undo} 
                  disabled={!canUndo}
                  className="flex-1 flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-30"
                >
                  <Undo2 size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Undo</span>
                </button>
                <button 
                  onClick={redo} 
                  disabled={!canRedo}
                  className="flex-1 flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-30"
                >
                  <Redo2 size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Redo</span>
                </button>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 mb-3 block font-mono">AI CONFIDENCE</label>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isProcessing ? "70%" : "98%" }}
                    className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Editor */}
        <div className="md:col-span-9 flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {!abcContent ? (
              <motion.div
                key="uploader"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-1/2 no-print"
              >
                <FileUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Maximize2, title: "音頻分析", desc: "偵測音高與節奏" },
                    { icon: FileText, title: "多軌生成", desc: "AI 智能樂器分離" },
                    { icon: Binary, title: "智慧編曲", desc: "自動配戴和弦進行" }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm group hover:border-cyan-500/30 transition-colors">
                      <item.icon size={20} className="text-cyan-400 mt-1" />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-white mb-1 font-mono">{item.title}</div>
                        <div className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col gap-6 overflow-hidden"
              >
                {/* Score Result Area */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden relative backdrop-blur-xl flex flex-col">
                  <div className="flex items-center justify-between mb-8 no-print">
                    <div className="flex flex-col">
                      <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">Live Score Preview</h2>
                      <div className="text-white text-sm font-bold truncate max-w-[200px] font-mono uppercase tracking-tighter">{fileName}</div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={handleSuggestChords}
                        disabled={isSuggesting}
                        className={`px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest text-indigo-300 hover:bg-indigo-500/20 transition-all flex items-center gap-2 ${isSuggesting ? 'opacity-50 animate-pulse' : ''}`}
                      >
                        <Binary size={12} /> {isSuggesting ? 'Generating Harmony...' : 'AI Add Chords'}
                      </button>
                    </div>
                  </div>

                  {/* Score Display Area */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide mb-8">
                    <ScoreRenderer abcNotation={abcContent} onNoteClick={handleNoteClick} />
                  </div>

                  {/* Editor Area */}
                  <div className="no-print">
                    <AbcEditor value={abcContent} onChange={setAbcContent} selection={selection} />
                  </div>

                  {/* Bottom Export Bar */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 no-print pt-6 border-t border-white/10">
                    <div className="flex gap-2 items-center">
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mr-2">Export :</span>
                       <button onClick={exportPDF} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-colors flex items-center gap-2">
                         PDF
                       </button>
                       <button onClick={downloadAbc} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-colors flex items-center gap-2">
                         ABC
                       </button>
                       <button onClick={downloadMidi} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-colors flex items-center gap-2">
                         MIDI
                       </button>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={reset}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                      >
                        New File
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 bg-red-500/10 border border-red-500/30 text-red-300 p-5 rounded-2xl backdrop-blur-md"
            >
              <AlertCircle size={20} className="text-red-400" />
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-red-200">Processing Error</span>
                <span className="text-[11px] opacity-70">{error}</span>
              </div>
              <button onClick={reset} className="ml-auto bg-red-500/20 px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-red-500/30 transition-colors">Retry</button>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="mt-8 py-4 flex justify-between items-center text-[9px] font-mono text-slate-600 no-print uppercase tracking-[0.3em]">
        <span>&copy; {new Date().getFullYear()} MUSE SCRIBE LABORATORIES</span>
        <span className="hidden md:block">ENCRYPTED DATA FLOW // SECURE TRANSCRIPTION ENGINE</span>
      </footer>
    </div>
  );
}
