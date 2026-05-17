import { useEffect, useRef, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';
import { midiToVexKey, durationToVexDuration, TranscribedNote } from '../lib/musicUtils';

interface VexFlowRendererProps {
  abcNotation: string; 
  notes?: TranscribedNote[];
  currentTime?: number;
  onNoteClick?: (start: number, end: number) => void;
  isPlaying?: boolean;
  onPlaybackEnd?: () => void;
}

export default function VexFlowRenderer({ abcNotation, notes, currentTime = 0, onNoteClick, isPlaying, onPlaybackEnd }: VexFlowRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous render
    containerRef.current.innerHTML = '';
    setRenderError(null);

    // If no notes, don't render yet
    if (!notes || notes.length === 0) return;

    try {
      const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
      
      // Calculate height based on number of measures
      const bpm = 120;
      const secondsPerMeasure = (60 / bpm) * 4;
      
      // Sort notes by start time
      const sortedNotes = [...notes].sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
      
      // Group notes into measures
      const measures: TranscribedNote[][] = [];
      sortedNotes.forEach(note => {
        const measureIndex = Math.floor(note.startTimeSeconds / secondsPerMeasure);
        if (!measures[measureIndex]) measures[measureIndex] = [];
        measures[measureIndex].push(note);
      });

      const maxMeasures = measures.length;
      renderer.resize(800, 200 * Math.ceil(maxMeasures / 2));
      const context = renderer.getContext();
      context.setFont('Arial', 10, '');

      // Render each measure
      measures.forEach((measureNotes, index) => {
        // ... (existing positioning logic)
        const row = Math.floor(index / 2);
        const col = index % 2;
        const x = col * 380 + 20;
        const y = row * 150 + 40;

        const stave = new Stave(x, y, 380);
        if (col === 0) stave.addClef('treble');
        if (index === 0) stave.addTimeSignature('4/4');
        stave.setContext(context).draw();

        if (measureNotes.length > 0) {
          const vexNotes = measureNotes.map((n, i) => {
            const note = new StaveNote({ 
              keys: [midiToVexKey(n.pitchMidi)], 
              duration: durationToVexDuration(n.durationSeconds, bpm) 
            });
            // Tag each note with its index and measure
            note.setAttribute('id', `note-${index}-${i}`);
            return note;
          });

          try {
             const voice = new Voice({ num_beats: 4, beat_value: 4 });
             voice.setStrict(false);
             voice.addTickables(vexNotes);
             new Formatter().joinVoices([voice]).format([voice], 300);
             voice.draw(context, stave);
          } catch (e) {
            console.warn("Voice rendering issue in measure", index, e);
          }
        }
      });

    } catch (err) {
      console.error("VexFlow Rendering Error:", err);
      setRenderError("Error rendering transcribed notes.");
    }
  }, [notes]);

  // Highlighting effect
  useEffect(() => {
    if (!notes || !containerRef.current) return;
    
    const bpm = 120;
    const secondsPerMeasure = (60 / bpm) * 4;

    notes.forEach((note, noteIdx) => {
      const measureIdx = Math.floor(note.startTimeSeconds / secondsPerMeasure);
      // This is a bit tricky because we don't know the exact index in the measure array
      // But we can find the element by searching for all notes and checking their time
    });

    // Better way: find all path/g elements that represent notes
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const noteElements = svg.querySelectorAll('.vf-stavenote');
    
    // We need a way to map currentTime to specific notes.
    // Let's go through all notes and check if they are active.
    notes.forEach((note, idx) => {
      const el = svg.querySelector(`[id^="vf-note-${idx}"]`); // If we could set it
      // Actually, let's just use a simpler method for now:
      // Find the note whose time matches and color it.
    });

    // Alternative: Just color the notes in the SVG based on their sequence if it matches notes array
    const allNoteG = svg.querySelectorAll('.vf-stavenote');
    notes.forEach((note, idx) => {
      const g = allNoteG[idx] as SVGGElement;
      if (!g) return;
      
      const isActive = currentTime >= note.startTimeSeconds && currentTime < (note.startTimeSeconds + note.durationSeconds);
      if (isActive) {
        g.style.fill = '#22d3ee';
        g.style.stroke = '#22d3ee';
        g.style.filter = 'drop-shadow(0 0 4px #22d3ee)';
      } else {
        g.style.fill = 'black';
        g.style.stroke = 'black';
        g.style.filter = 'none';
      }
    });

  }, [currentTime, notes]);

  if (!abcNotation && (!notes || notes.length === 0)) return null;

  return (
    <div className="w-full bg-white p-8 rounded-xl shadow-inner border border-stone-200 overflow-x-auto min-h-[300px] relative">
      {renderError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 text-red-500 font-bold text-center p-4">
          {renderError}
        </div>
      )}
      <div ref={containerRef} className="w-full cursor-pointer" />
    </div>
  );
}
