import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Music, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

// Skeleton row — mimics a staff line of transcribed notes
function SkeletonStaff({ delay = 0, width = '100%' }: { delay?: number; width?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity, delay }}
      className="h-8 bg-white/5 rounded-lg"
      style={{ width }}
    />
  );
}

export default function FileUploader({ onFileSelect, isProcessing }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  // @ts-expect-error - React 19 type mismatch with react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  if (isProcessing) {
    return (
      <div className="relative border border-white/10 rounded-3xl p-10 bg-white/5 flex flex-col gap-8 overflow-hidden">
        {/* Processing indicator */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-2xl flex items-center justify-center shrink-0">
            <Loader2 className="text-cyan-400 animate-spin" size={22} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-white">Analyzing Audio…</span>
            <span className="text-xs text-slate-500 animate-pulse">AI engine processing your file</span>
          </div>
          {/* Animated waveform badge */}
          <div className="ml-auto flex items-end gap-[3px] h-8 opacity-60">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [6, Math.random() * 24 + 8, 6] }}
                transition={{ duration: 0.5 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.07 }}
                className="w-1.5 bg-cyan-400 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Sheet music skeleton */}
        <div className="flex flex-col gap-4 px-2">
          {/* Staff 1 */}
          <div className="flex flex-col gap-1.5">
            <SkeletonStaff delay={0} width="100%" />
            <SkeletonStaff delay={0.1} width="82%" />
            <SkeletonStaff delay={0.2} width="90%" />
          </div>
          {/* Staff 2 */}
          <div className="flex flex-col gap-1.5">
            <SkeletonStaff delay={0.3} width="100%" />
            <SkeletonStaff delay={0.4} width="65%" />
          </div>
          {/* Staff 3 */}
          <div className="flex flex-col gap-1.5">
            <SkeletonStaff delay={0.5} width="100%" />
            <SkeletonStaff delay={0.6} width="78%" />
            <SkeletonStaff delay={0.7} width="55%" />
          </div>
        </div>

        {/* Scan line effect */}
        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none"
        />
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative group cursor-pointer
        border border-white/10 rounded-3xl p-12 h-full
        transition-all duration-500 ease-out overflow-hidden
        flex flex-col items-center justify-center gap-6
        ${isDragActive ? 'border-cyan-500 bg-cyan-500/5' : 'bg-white/5 hover:border-white/20'}
      `}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.05),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.08),transparent_60%)] transition-all duration-700" />

      <input {...getInputProps()} />

      <div className="relative z-10 w-full flex flex-col items-center">
        {isDragActive ? (
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-12 h-12 text-cyan-400 animate-bounce" />
            <span className="text-xl font-bold text-white">Drop to Start Transcribing!</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-700 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all duration-500">
              <Music size={40} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                Select Audio File
              </span>
              <span className="text-slate-500 text-sm">Drag and drop or click to browse</span>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {['MP3', 'WAV', 'M4A', 'OGG', 'MP4', 'MOV'].map(ext => (
                <span key={ext} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-500 font-mono">
                  {ext}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
