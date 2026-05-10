import { useEffect, useRef, useState } from 'react';
import abcjs from 'abcjs';

interface ScoreRendererProps {
  abcNotation: string;
  onNoteClick?: (start: number, end: number) => void;
  isPlaying?: boolean;
  onPlaybackEnd?: () => void;
}

export default function ScoreRenderer({ abcNotation, onNoteClick, isPlaying, onPlaybackEnd }: ScoreRendererProps) {
  const scoreRef = useRef<HTMLDivElement>(null);
  const midiBufferRef = useRef<any>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  useEffect(() => {
    if (scoreRef.current && abcNotation) {
      const visualObj = abcjs.renderAbc(scoreRef.current, abcNotation, {
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
      })[0];

      // Setup MIDI Synth
      if (abcjs.synth.supportsAudio()) {
        const midiBuffer = new abcjs.synth.CreateSynth();
        midiBuffer.init({
          visualObj,
          options: {
            soundFontUrl: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/"
          }
        }).then(() => {
          midiBufferRef.current = midiBuffer;
          setIsAudioReady(true);
        }).catch(err => console.warn("Audio init failed", err));
      }
    }

    return () => {
      if (midiBufferRef.current) {
        midiBufferRef.current.stop();
      }
    };
  }, [abcNotation, onNoteClick]);

  useEffect(() => {
    if (isPlaying && midiBufferRef.current && isAudioReady) {
      midiBufferRef.current.prime().then(() => {
        midiBufferRef.current.start();
      });
    } else if (!isPlaying && midiBufferRef.current) {
      midiBufferRef.current.stop();
    }
  }, [isPlaying, isAudioReady]);

  if (!abcNotation) return null;

  return (
    <div className="w-full bg-white p-8 rounded-xl shadow-inner border border-stone-200 overflow-x-auto min-h-[300px]">
      <div id="paper" ref={scoreRef} className="w-full cursor-pointer" title="點擊音符進行編輯" />
    </div>
  );
}
