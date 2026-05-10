import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Maximize2, FileText, Binary } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import { useTranscription } from '../hooks/useTranscription';
import Sidebar from '../components/Layout/Sidebar';
import EditorContainer from '../components/Editor/EditorContainer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useHistory } from '../hooks/useHistory';
import { parseAbcMetadata } from '../lib/abcParser';

export default function Studio() {
  const {
    abcContent,
    setAbcContent,
    isProcessing,
    isSuggesting,
    error,
    fileName,
    selection,
    handleFileSelect,
    handleSuggestChords,
    reset,
    handleNoteClick
  } = useTranscription();

  const { saveScore } = useHistory();
  const lastSavedRef = useRef<string>('');

  // Parse metadata whenever abcContent changes
  const metadata = useMemo(() => {
    try {
      return parseAbcMetadata(abcContent);
    } catch (e) {
      return { bpm: 'AUTO', key: 'Error', meter: '4/4' };
    }
  }, [abcContent]);

  // Auto-save to history when a new score is generated
  useEffect(() => {
    if (abcContent && !isProcessing && abcContent !== lastSavedRef.current) {
      saveScore(fileName, abcContent);
      lastSavedRef.current = abcContent;
    }
  }, [abcContent, isProcessing, fileName, saveScore]);

  const exportPDF = async () => {
    const element = document.getElementById('paper');
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName.split('.')[0]}.pdf`);
    }
  };

  const downloadAbc = () => {
    const blob = new Blob([abcContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.split('.')[0]}.abc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 overflow-hidden">
      <Sidebar isProcessing={isProcessing} metadata={metadata} />

      <div className="md:col-span-9 flex flex-col gap-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {!abcContent ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-1/2 no-print"
            >
              <FileUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Maximize2, title: "音頻分析", desc: "偵測音高與節奏" },
                  { icon: FileText, title: "樂譜產生", desc: "符合標準 ABC 格式" },
                  { icon: Binary, title: "智慧轉錄", desc: "區分不同樂器與風格" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm group hover:border-cyan-500/30 transition-colors">
                    <item.icon size={20} className="text-cyan-400 mt-1" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-white mb-1">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <EditorContainer 
              abcContent={abcContent}
              setAbcContent={setAbcContent}
              fileName={fileName}
              isSuggesting={isSuggesting}
              handleSuggestChords={handleSuggestChords}
              handleNoteClick={handleNoteClick}
              selection={selection}
              onExportPDF={exportPDF}
              onDownloadAbc={downloadAbc}
              onReset={reset}
            />
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-red-500/10 border border-red-500/30 text-red-300 p-5 rounded-2xl backdrop-blur-md"
          >
            <AlertCircle size={20} className="text-red-400" />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-red-200">Processing Error</span>
              <span className="text-[11px] opacity-70">{error}</span>
            </div>
            <button onClick={reset} className="ml-auto bg-red-500/20 px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-red-500/30 transition-colors">Retry</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
