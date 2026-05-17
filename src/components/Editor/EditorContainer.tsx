import { useState } from 'react';
import { motion } from 'motion/react';
import { Binary } from 'lucide-react';
import ScoreRenderer from '../VexFlowRenderer';
import AbcEditor from '../AbcEditor';
import ExportBar from './ExportBar';
import WaveformPlayer from './WaveformPlayer';
import PianoRoll from './PianoRoll';
import LearningMode from './LearningMode';

interface EditorContainerProps {
  abcContent: string;
  transcribedNotes: any[];
  audioUrl: string | null;
  setAbcContent: (content: string) => void;
  fileName: string;
  isSuggesting: boolean;
  handleSuggestChords: () => void;
  handleNoteClick: (start: number, end: number) => void;
  selection?: { start: number; end: number };
  onExportPDF: () => void;
  onDownloadAbc: () => void;
  onDownloadMusicXML: () => void;
  onDownloadTabs: () => void;
  onReset: () => void;
}

export default function EditorContainer({
  abcContent,
  transcribedNotes,
  audioUrl,
  setAbcContent,
  fileName,
  isSuggesting,
  handleSuggestChords,
  handleNoteClick,
  selection,
  onExportPDF,
  onDownloadAbc,
  onDownloadMusicXML,
  onDownloadTabs,
  onReset,
}: EditorContainerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLearningMode, setIsLearningMode] = useState(false);

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col gap-6 overflow-hidden"
    >
      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden relative backdrop-blur-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 no-print">
          <div className="flex flex-col">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">Live Score Preview</h2>
            <div className="text-white text-sm font-bold truncate max-w-[200px] font-mono uppercase tracking-tighter">{fileName}</div>
          </div>
          <div className="flex gap-3 invisible">
            {/* Play button removed in favor of WaveformPlayer controls */}
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-1" />
          <div className="flex gap-2">
            <button
              onClick={() => setIsLearningMode(!isLearningMode)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${isLearningMode ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20'}`}
            >
              {isLearningMode ? 'Exit Learning Mode' : 'Learning Mode'}
            </button>
            <button
              onClick={handleSuggestChords}
              disabled={isSuggesting}
              className={`px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest text-indigo-300 hover:bg-indigo-500/20 transition-all flex items-center gap-2 ${isSuggesting ? 'opacity-50 animate-pulse' : ''}`}
            >
              <Binary size={12} /> {isSuggesting ? 'AI Suggesting...' : 'AI Suggest Chords'}
            </button>
          </div>
        </div>

        {/* Learning Mode */}
        <LearningMode 
          notes={transcribedNotes} 
          currentTime={currentTime} 
          isActive={isLearningMode} 
          onClose={() => setIsLearningMode(false)} 
        />

        {/* Audio Waveform */}
        {audioUrl && (
          <div className="mb-6 no-print">
            <WaveformPlayer 
              url={audioUrl} 
              onTimeUpdate={setCurrentTime} 
              onFinish={() => setIsPlaying(false)} 
            />
          </div>
        )}


        {/* Score View */}
        <div className="flex-1 overflow-y-auto scrollbar-hide mb-8">
          <ScoreRenderer
            abcNotation={abcContent}
            notes={transcribedNotes}
            currentTime={currentTime}
            onNoteClick={handleNoteClick}
            isPlaying={isPlaying}
            onPlaybackEnd={() => setIsPlaying(false)}
          />
        </div>

        {/* Piano Roll View */}
        <div className="no-print mb-8">
          <PianoRoll notes={transcribedNotes} currentTime={currentTime} />
        </div>

        {/* ABC Editor */}
        <div className="no-print mb-6">
          <AbcEditor value={abcContent} onChange={setAbcContent} selection={selection} />
        </div>

        {/* Actions */}
        <ExportBar 
          onExportPDF={onExportPDF} 
          onDownloadAbc={onDownloadAbc} 
          onDownloadMusicXML={onDownloadMusicXML}
          onDownloadTabs={onDownloadTabs}
          onReset={onReset} 
        />

        {/* Metadata Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print px-2 mt-8">
          {[
            { label: 'FORMAT', val: 'ABC 2.1' },
            { label: 'TRANSCRIBER', val: 'MuseScribe AI' },
            { label: 'LATENCY', val: '0.2ms' },
            { label: 'SESSION', val: new Date().toLocaleTimeString() },
          ].map((stat, i) => (
            <div key={i} className="border-l border-white/10 pl-6 py-1">
              <div className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.1em] mb-1">{stat.label}</div>
              <div className="text-[11px] font-bold text-white font-mono">{stat.val}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
