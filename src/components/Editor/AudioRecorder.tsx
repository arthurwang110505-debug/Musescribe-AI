import { useState, useRef } from 'react';
import { Mic, Square, Loader2, RefreshCw } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const file = new File([blob], "live_recording.wav", { type: 'audio/wav' });
        onRecordingComplete(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      {isRecording ? (
        <div className="flex items-center gap-4 px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-2xl animate-pulse">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs font-bold text-red-400 font-mono">{formatTime(recordingTime)}</span>
          <button 
            onClick={stopRecording}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
          >
            <Square size={16} fill="white" />
          </button>
        </div>
      ) : (
        <button 
          onClick={startRecording}
          className="px-8 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 rounded-2xl text-xs font-bold text-red-300 uppercase tracking-widest transition-all flex items-center gap-2 group"
        >
          <Mic size={16} className="text-red-400 group-hover:scale-110 transition-transform" /> 
          Record Live
        </button>
      )}
    </div>
  );
}
