import { Printer, Download } from 'lucide-react';

interface ExportBarProps {
  onExportPDF: () => void;
  onDownloadAbc: () => void;
  onReset: () => void;
}

export default function ExportBar({ onExportPDF, onDownloadAbc, onReset }: ExportBarProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 no-print pt-6 border-t border-white/10">
      <div className="flex gap-2 items-center">
         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mr-2">Export :</span>
         <button 
           onClick={onExportPDF} 
           className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-colors flex items-center gap-2"
         >
           <Printer size={12} /> PDF
         </button>
         <button 
           onClick={onDownloadAbc} 
           className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-colors flex items-center gap-2"
         >
           <Download size={12} /> ABC
         </button>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={onReset}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          New File
        </button>
        <button 
          onClick={onDownloadAbc}
          className="px-10 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-white font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Download Transcription
        </button>
      </div>
    </div>
  );
}
