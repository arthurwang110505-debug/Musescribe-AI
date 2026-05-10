import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Music, FileVideo } from 'lucide-react';
import { motion } from 'motion/react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
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

  return (
    <div
      {...getRootProps()}
      className={`
        relative group cursor-pointer
        border border-white/10 rounded-3xl p-12 h-full
        transition-all duration-500 ease-out overflow-hidden
        flex flex-col items-center justify-center gap-6
        ${isDragActive ? 'border-cyan-500 bg-cyan-500/5' : 'bg-white/5 hover:border-white/20'}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.05),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.08),transparent_60%)] transition-all duration-700"></div>

      <input {...getInputProps()} />
      
      <div className="relative z-10">
        <motion.div
          animate={isProcessing ? { rotate: 360, scale: [1, 1.1, 1] } : { scale: isDragActive ? 1.2 : 1 }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.3 }
          }}
          className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-cyan-500/40 transition-all duration-500 shadow-2xl"
        >
          {isProcessing ? (
            <Upload size={32} className="text-cyan-400" />
          ) : (
            <svg className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          )}
        </motion.div>
      </div>

      <div className="text-center z-10">
        <p className="text-xl font-medium text-white tracking-tight">
          {isProcessing ? 'Analyzing Harmonics...' : (isDragActive ? 'Release to Start' : 'Drag & Drop Audio to Analyze')}
        </p>
        <p className="text-xs text-slate-500 mt-2 uppercase tracking-[0.2em] font-mono font-bold font-mono">
          AI Transcription begins immediately
        </p>
      </div>

      {isProcessing && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-[3px] px-12 h-32 opacity-20 pointer-events-none">
           {[...Array(40)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ height: [Math.random() * 20 + 10, Math.random() * 80 + 20, Math.random() * 20 + 10] }}
               transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
               className="w-1 bg-cyan-400 rounded-t-full"
             />
           ))}
        </div>
      )}
    </div>
  );
}
