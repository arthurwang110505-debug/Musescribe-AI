import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Maximize2, FileText, Binary, Edit3, LogIn, X } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import { useTranscription } from '../hooks/useTranscription';
import AnalysisPanel from '../components/Editor/AnalysisPanel';
import EditorContainer from '../components/Editor/EditorContainer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useHistory } from '../hooks/useHistory';
import { parseAbcMetadata } from '../lib/abcParser';
import { separateStems, Stems } from '../lib/demucsService';
import { Activity, Music, Scissors, Loader2, Globe, Mic, Link as LinkIcon, Zap } from 'lucide-react';
import AudioRecorder from '../components/Editor/AudioRecorder';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { generateMusicXML } from '../lib/musicxmlGenerator';
import { generateGuitarTab } from '../lib/tabGenerator';

export default function Studio() {
  const {
    abcContent,
    transcribedNotes,
    engine,
    audioUrl,
    setEngine,
    setAbcContent,
    isProcessing,
    isSuggesting,
    error,
    fileName,
    selection,
    handleFileSelect,
    handleUrlImport,
    handleSuggestChords,
    reset,
    handleNoteClick,
    handleBlankScore
  } = useTranscription();
  const { user } = useAuth();
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(false);
  const [stems, setStems] = useState<Stems | null>(null);
  const [isSeparating, setIsSeparating] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  const { saveScore } = useHistory();
  const lastSavedRef = useRef<string>('');

  // Parse metadata whenever abcContent changes
  const metadata = useMemo(() => {
    try {
      return parseAbcMetadata(abcContent);
    } catch (e) {
      return { bpm: 'AUTO', key: 'Error', meter: '4/4' };
    }
  }, [abcContent]);

  // Auto-save to history when a new score is generated
  useEffect(() => {
    if (abcContent && !isProcessing && abcContent !== lastSavedRef.current) {
      saveScore(fileName, abcContent);
      lastSavedRef.current = abcContent;
    }
  }, [abcContent, isProcessing, fileName, saveScore]);

  // Pick up file handed off from Home page hero uploader via sessionStorage
  useEffect(() => {
    const pendingData = sessionStorage.getItem('hero_pending_file_data');
    const pendingName = sessionStorage.getItem('hero_pending_file_name');
    const pendingType = sessionStorage.getItem('hero_pending_file_type');
    if (pendingData && pendingName && pendingType) {
      sessionStorage.removeItem('hero_pending_file_data');
      sessionStorage.removeItem('hero_pending_file_name');
      sessionStorage.removeItem('hero_pending_file_type');
      try {
        const byteString = atob(pendingData.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        const file = new File([ab], pendingName, { type: pendingType });
        handleFileSelect(file);
      } catch {
        // Silently fail — user can upload manually
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const exportPDF = async () => {
    const element = document.getElementById('paper');
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName.split('.')[0]}.pdf`);
    }
  };

  const downloadAbc = () => {
    const blob = new Blob([abcContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.split('.')[0]}.abc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMusicXML = () => {
    const xml = generateMusicXML(transcribedNotes, fileName);
    const blob = new Blob([xml], { type: 'application/vnd.recordare.musicxml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.split('.')[0]}.musicxml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTabs = () => {
    const tab = generateGuitarTab(transcribedNotes, fileName);
    const blob = new Blob([tab], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.split('.')[0]}_tabs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 overflow-hidden">
      <AnalysisPanel isProcessing={isProcessing} metadata={metadata} />

      <div className="md:col-span-9 flex flex-col gap-6 overflow-hidden">
        {/* Engine Selection Toggle */}
        <div className="flex items-center gap-4 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit no-print">
          <button 
            onClick={() => setEngine('basic-pitch')}
            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${engine === 'basic-pitch' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            Standard
          </button>
          <button 
            onClick={() => setEngine('mt3')}
            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${engine === 'mt3' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            <Zap size={12} className={engine === 'mt3' ? 'fill-white' : ''} />
            MT3 Pro
          </button>
        </div>

        {/* Guest banner */}
        {!user && !guestBannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl px-5 py-3 no-print"
          >
            <LogIn size={16} className="text-indigo-400 shrink-0" />
            <p className="text-xs text-indigo-300 flex-1">
              You're transcribing as a guest. &nbsp;
              <Link to="/auth" className="font-bold underline underline-offset-2 hover:text-white transition-colors">
                Sign in or create a free account
              </Link>
              &nbsp;to save your work and export files.
            </p>
            <button
              onClick={() => setGuestBannerDismissed(true)}
              className="p-1 text-indigo-500 hover:text-white transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!abcContent ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 overflow-y-auto no-print scrollbar-hide pb-12"
            >
              <FileUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={handleBlankScore}
                  className="px-8 py-3 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 rounded-2xl text-xs font-bold text-indigo-300 uppercase tracking-widest transition-all flex items-center gap-2 group"
                >
                  <Edit3 size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" /> 
                  Create Blank Score
                </button>

                <AudioRecorder onRecordingComplete={handleFileSelect} />
              </div>

              {/* URL Import Section */}
              <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                  <Globe size={18} className="text-cyan-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Import from Link</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      placeholder="YouTube, Instagram, or TikTok URL..."
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                  <button 
                    onClick={() => handleUrlImport(importUrl)}
                    disabled={!importUrl || isProcessing}
                    className="px-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold rounded-2xl text-xs uppercase tracking-widest transition-all whitespace-nowrap"
                  >
                    Import
                  </button>
                </div>
                <p className="mt-3 text-[10px] text-slate-500 font-medium italic">
                  * URL imports always use MT3 Pro engine for maximum compatibility.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Maximize2, title: "Multi-Instrument", desc: "MT3 detects drums, piano & more" },
                  { icon: FileText, title: "Score Generation", desc: "Dynamic VexFlow rendering" },
                  { icon: Binary, title: "Smart Quantize", desc: "Automatic rhythm alignment" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm group hover:border-cyan-500/30 transition-colors">
                    <item.icon size={20} className="text-cyan-400 mt-1" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-white mb-1">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stem Separation Tool */}
              <div className="mt-12 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Scissors className="text-indigo-400" size={20} />
                      <h3 className="text-lg font-bold text-white tracking-tight">Instrument Separation (Demucs)</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                      Separate your track into stems before transcription. Highly recommended for multi-instrumental songs.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <input 
                      type="file" 
                      id="demucs-upload" 
                      className="hidden" 
                      accept="audio/*,video/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsSeparating(true);
                        try {
                          const res = await separateStems(file);
                          setStems(res);
                        } catch (err) {
                          alert('Demucs separation failed.');
                          console.error(err);
                        } finally {
                          setIsSeparating(false);
                        }
                      }}
                    />
                    <label 
                      htmlFor="demucs-upload"
                      className={`px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/20 cursor-pointer ${isSeparating ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {isSeparating ? <Loader2 size={16} className="animate-spin" /> : <Scissors size={16} />}
                      {isSeparating ? 'Analyzing...' : 'Upload & Split Track'}
                    </label>
                  </div>
                </div>

                {/* Stems Results */}
                {stems && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(stems).map(([name, url]) => (
                      <div key={name} className="bg-black/20 border border-indigo-500/20 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-indigo-300 font-bold uppercase tracking-widest text-xs">
                          {name}
                        </div>
                        <audio src={url} controls className="w-full h-8 outline-none" />
                        <button
                          onClick={async () => {
                            // Fetch the stem blob and transcribe
                            try {
                              const res = await fetch(url);
                              const blob = await res.blob();
                              const file = new File([blob], `${name}_stem.wav`, { type: 'audio/wav' });
                              handleFileSelect(file);
                            } catch (e) {
                              alert('Failed to load stem for transcription.');
                            }
                          }}
                          className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
                        >
                          Transcribe this stem
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
              </div>
            </motion.div>
          ) : (
            <EditorContainer 
              abcContent={abcContent}
              transcribedNotes={transcribedNotes}
              audioUrl={audioUrl}
              setAbcContent={setAbcContent}
              fileName={fileName}
              isSuggesting={isSuggesting}
              handleSuggestChords={handleSuggestChords}
              handleNoteClick={handleNoteClick}
              selection={selection}
              onExportPDF={exportPDF}
              onDownloadAbc={downloadAbc}
              onDownloadMusicXML={downloadMusicXML}
              onDownloadTabs={downloadTabs}
              onReset={reset}
            />
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
    </div>
  );
}
