import { useState, useEffect, useCallback } from 'react';
import { Mic, Music, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Note {
  pitchMidi: number;
  startTimeSeconds: number;
  durationSeconds: number;
  amplitude: number;
}

interface LearningModeProps {
  notes: Note[];
  currentTime: number;
  isActive: boolean;
  onClose: () => void;
}

export default function LearningMode({ notes, currentTime, isActive, onClose }: LearningModeProps) {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [activeMidiNotes, setActiveMidiNotes] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);

  // Initialize MIDI
  const initMidi = useCallback(async () => {
    try {
      const access = await navigator.requestMIDIAccess();
      setMidiAccess(access);
      
      access.inputs.forEach((input) => {
        input.onmidimessage = (msg: WebMidi.MIDIMessageEvent) => {
          const [command, note, velocity] = msg.data;
          // Note On (usually 144, but can be 128-143 depending on channel)
          if ((command >= 144 && command <= 159) && velocity > 0) {
            setActiveMidiNotes(prev => new Set(prev).add(note));
          }
          // Note Off (128-143) or Note On with 0 velocity
          if ((command >= 128 && command <= 143) || ((command >= 144 && command <= 159) && velocity === 0)) {
            setActiveMidiNotes(prev => {
              const next = new Set(prev);
              next.delete(note);
              return next;
            });
          }
        };
      });
    } catch (err) {
      console.warn("MIDI Access failed", err);
    }
  }, []);

  useEffect(() => {
    if (isActive && !midiAccess) {
      initMidi();
    }
  }, [isActive, midiAccess, initMidi]);

  // Scoring logic: if currentTime overlaps a note and activeMidiNotes contains that note's pitch
  useEffect(() => {
    if (!isActive) return;
    
    // Find expected notes at current time
    const expectedNotes = notes.filter(n => 
      currentTime >= n.startTimeSeconds && 
      currentTime <= n.startTimeSeconds + n.durationSeconds
    );

    if (expectedNotes.length > 0) {
      const isCorrect = expectedNotes.some(en => activeMidiNotes.has(Math.round(en.pitchMidi)));
      if (isCorrect) {
        setScore(s => s + 1); // Simple incrementing score
      }
    }
  }, [currentTime, isActive, notes, activeMidiNotes]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-black/40 border border-cyan-500/30 rounded-2xl p-6 mb-8 relative backdrop-blur-md"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <Music className="text-cyan-400" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Learning Mode Active</h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Connect MIDI Keyboard & Play Along</p>
            </div>
          </div>

          <div className="flex gap-8 items-center mt-6">
            <div className="flex-1 bg-white/5 rounded-xl p-4 flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-1 font-mono">{score}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Current Score</div>
            </div>

            <div className="flex-1 bg-white/5 rounded-xl p-4 flex flex-col items-center">
              <div className="flex gap-2">
                {Array.from(activeMidiNotes).map(pitch => (
                  <span key={pitch} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm font-bold font-mono border border-cyan-500/30">
                    {pitch}
                  </span>
                ))}
                {activeMidiNotes.size === 0 && (
                  <span className="text-slate-600 font-mono text-sm">Waiting for input...</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-2">Active MIDI Notes</div>
            </div>
          </div>
          
          <div className="mt-4 text-[10px] text-center text-slate-500 flex justify-center items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${midiAccess ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
            {midiAccess ? 'MIDI Device Connected' : 'Waiting for MIDI permissions...'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
