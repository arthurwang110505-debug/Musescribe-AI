import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Gauge } from 'lucide-react';

interface WaveformPlayerProps {
  url: string;
  onTimeUpdate?: (time: number) => void;
  onFinish?: () => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5];

export default function WaveformPlayer({ url, onTimeUpdate, onFinish }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(255, 255, 255, 0.12)',
      progressColor: '#22d3ee',
      cursorColor: '#22d3ee',
      barWidth: 2,
      barRadius: 3,
      responsive: true,
      height: 52,
      normalize: true,
      partialRender: true,
    });

    ws.load(url);

    ws.on('ready', () => {
      setDuration(ws.getDuration());
      ws.setPlaybackRate(playbackRate);
      wavesurferRef.current = ws;
    });

    ws.on('audioprocess', () => {
      const time = ws.getCurrentTime();
      setCurrentTime(time);
      onTimeUpdate?.(time);
    });

    ws.on('finish', () => {
      setIsPlaying(false);
      onFinish?.();
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));

    return () => {
      ws.destroy();
    };
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => wavesurferRef.current?.playPause();

  const toggleMute = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleReset = () => {
    wavesurferRef.current?.stop();
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    wavesurferRef.current?.setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform shrink-0"
        >
          {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} className="ml-0.5" fill="black" />}
        </button>

        {/* Waveform */}
        <div className="flex-1 min-w-0">
          <div ref={containerRef} />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[10px] font-mono text-cyan-400 font-bold">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <div className="flex items-center gap-2">
            {/* Speed control */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors ${showSpeedMenu ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}
                title="Playback speed"
              >
                <Gauge size={12} />
                {playbackRate}x
              </button>
              {showSpeedMenu && (
                <div className="absolute right-0 bottom-full mb-2 bg-[#0d0d14] border border-white/15 rounded-xl py-1.5 shadow-2xl z-50 min-w-[80px]">
                  {SPEED_OPTIONS.map(rate => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`w-full px-4 py-2 text-left text-xs font-mono font-bold transition-colors ${rate === playbackRate ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleReset} className="p-1.5 text-slate-500 hover:text-white transition-colors" title="Restart">
              <RotateCcw size={13} />
            </button>
            <button onClick={toggleMute} className="p-1.5 text-slate-500 hover:text-white transition-colors" title="Mute">
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
