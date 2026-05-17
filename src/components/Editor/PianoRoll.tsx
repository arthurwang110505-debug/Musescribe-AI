import { useEffect, useRef } from 'react';

interface Note {
  pitchMidi: number;
  startTimeSeconds: number;
  durationSeconds: number;
  amplitude: number;
}

interface PianoRollProps {
  notes: Note[];
  currentTime: number;
}

export default function PianoRoll({ notes, currentTime }: PianoRollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !notes.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.fillStyle = '#0f172a'; // tailwind slate-900
    ctx.fillRect(0, 0, width, height);

    const minPitch = Math.max(0, Math.min(...notes.map(n => n.pitchMidi)) - 4);
    const maxPitch = Math.min(127, Math.max(...notes.map(n => n.pitchMidi)) + 4);
    const pitchRange = Math.max(12, maxPitch - minPitch);
    
    // We display a sliding window of time: e.g., currentTime - 2s to currentTime + 8s
    const windowStart = Math.max(0, currentTime - 2);
    const windowEnd = windowStart + 10;
    const timeRange = windowEnd - windowStart;

    // Draw horizontal lines for pitches
    for (let p = minPitch; p <= maxPitch; p++) {
      const y = height - ((p - minPitch) / pitchRange) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      // Highlight black keys
      const isBlackKey = [1, 3, 6, 8, 10].includes(p % 12);
      ctx.strokeStyle = isBlackKey ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = height / pitchRange;
      ctx.stroke();
    }

    // Draw vertical lines for seconds
    for (let t = Math.floor(windowStart); t <= Math.ceil(windowEnd); t++) {
      const x = ((t - windowStart) / timeRange) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw playhead
    const playheadX = ((currentTime - windowStart) / timeRange) * width;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.strokeStyle = '#06b6d4'; // cyan-500
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Notes
    notes.forEach(note => {
      // Check if note is visible in current time window
      if (note.startTimeSeconds + note.durationSeconds < windowStart || note.startTimeSeconds > windowEnd) return;

      const x = ((note.startTimeSeconds - windowStart) / timeRange) * width;
      const w = (note.durationSeconds / timeRange) * width;
      const y = height - ((note.pitchMidi - minPitch) / pitchRange) * height;
      const h = Math.max(4, height / pitchRange - 2);

      // Determine if note is currently playing
      const isPlaying = currentTime >= note.startTimeSeconds && currentTime <= note.startTimeSeconds + note.durationSeconds;

      ctx.fillStyle = isPlaying ? '#22d3ee' : '#6366f1'; // cyan-400 or indigo-500
      ctx.beginPath();
      ctx.roundRect(x, y - h / 2, Math.max(w, 4), h, 4);
      ctx.fill();
    });

  }, [notes, currentTime]);

  return (
    <div className="w-full relative group">
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur text-[10px] uppercase tracking-widest text-slate-400 font-bold rounded-lg pointer-events-none">
        Piano Roll
      </div>
      <canvas 
        ref={canvasRef} 
        className="w-full h-48 bg-slate-900 rounded-2xl border border-white/10 shadow-inner" 
      />
    </div>
  );
}
