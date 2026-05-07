import { useEffect, useRef, useState } from 'react';
import abcjs from 'abcjs';
import { Play, Square, Loader2 } from 'lucide-react';

interface ScoreRendererProps {
  abcNotation: string;
  onNoteClick?: (start: number, end: number) => void;
}

export default function ScoreRenderer({ abcNotation, onNoteClick }: ScoreRendererProps) {
  const scoreRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    let visualObj: abcjs.TuneObject[] | null = null;
    if (scoreRef.current && abcNotation) {
      visualObj = abcjs.renderAbc(scoreRef.current, abcNotation, {
        responsive: 'resize',
        paddingtop: 10,
        paddingbottom: 10,
        paddingright: 10,
        paddingleft: 10,
        staffwidth: 740,
        wrap: { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 4 },
        clickListener: (abcElem) => {
          if (abcElem.startChar !== undefined && abcElem.endChar !== undefined) {
             onNoteClick?.(abcElem.startChar, abcElem.endChar);
          }
        }
      });
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, [abcNotation, onNoteClick]);

  const togglePlayback = async () => {
    if (isPlaying) {
      synthRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    if (!abcNotation || !scoreRef.current) return;

    try {
      setIsInitializing(true);
      const visualObj = abcjs.renderAbc(scoreRef.current, abcNotation)[0];
      
      const synth = new abcjs.synth.CreateSynth();
      await synth.init({
        visualObj,
        options: {
          soundFontUrl: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/"
        }
      });

      await synth.prime();
      synth.start();
      synthRef.current = synth;
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback error:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  if (!abcNotation) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 no-print">
        <button
          onClick={togglePlayback}
          disabled={isInitializing}
          className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all shadow-lg disabled:opacity-50"
        >
          {isInitializing ? <Loader2 className="animate-spin" size={18} /> : (isPlaying ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />)}
          {isInitializing ? 'INITIALIZING...' : (isPlaying ? 'STOP PLAYBACK' : 'LISTEN TO SCORE')}
        </button>
      </div>

      <div className="w-full bg-white p-8 rounded-xl shadow-inner border border-stone-200 overflow-x-auto min-h-[300px]">
        <div id="paper" ref={scoreRef} className="w-full cursor-pointer" title="點擊音符進行編輯" />
      </div>
    </div>
  );
}
