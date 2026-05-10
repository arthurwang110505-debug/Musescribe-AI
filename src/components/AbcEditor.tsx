import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Info, Music2, Type, Hash, Clock, ChevronUp, ChevronDown, Minus, Plus } from 'lucide-react';

interface AbcEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  selection?: { start: number; end: number };
}

export default function AbcEditor({ value, onChange, selection }: AbcEditorProps) {
  const [internalValue, setInternalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (selection && textareaRef.current) {
      const { start, end } = selection;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
      // Optional: scroll into view
    }
  }, [selection]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    onChange(val);
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = 
      internalValue.substring(0, start) + 
      text + 
      internalValue.substring(end);
    
    setInternalValue(newValue);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const modifySelection = (modifier: (text: string) => string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = internalValue.substring(start, end);
    if (!selectedText) return;

    const modified = modifier(selectedText);
    const newValue = internalValue.substring(0, start) + modified + internalValue.substring(end);
    
    setInternalValue(newValue);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + modified.length);
    }, 0);
  };

  // Music Logic: Transpose
  const transpose = (dir: number) => {
    modifySelection((text) => {
      // Basic transposer: C -> D, c -> d, etc. 
      // This is a naive implementation but functional for basic notes
      const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const notesLower = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
      
      return text.replace(/[A-Ga-g]/g, (match) => {
        const isUpper = match === match.toUpperCase();
        const list = isUpper ? notes : notesLower;
        const idx = list.indexOf(match);
        const nextIdx = (idx + dir + 7) % 7;
        return list[nextIdx];
      });
    });
  };

  const tools = [
    { label: '節拍', icon: Clock, snippet: '\nM:4/4\n' },
    { label: '調性', icon: Hash, snippet: '\nK:C\n' },
    { label: '和弦', icon: Type, snippet: '"C" ' },
    { label: '新音軌', icon: Music2, snippet: '\nV:2\n' },
    { label: '小節線', icon: Edit3, snippet: ' | ' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Edit3 size={14} className="text-cyan-400" />
          Score Editor
        </div>
        
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <button
              key={tool.label}
              onClick={() => insertText(tool.snippet)}
              className="flex items-center gap-1.5 px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-[10px] font-bold text-slate-300 transition-all"
              title={`插入 ${tool.label}`}
            >
              <tool.icon size={12} className="text-cyan-400/70" />
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          ))}
          
          <div className="group relative ml-2">
             <Info size={14} className="text-slate-600 cursor-help" />
             <div className="absolute bottom-full right-0 mb-2 w-64 p-4 bg-stone-900 border border-white/10 rounded-2xl text-[10px] text-slate-400 hidden group-hover:block z-50 shadow-2xl backdrop-blur-xl">
               <p className="font-bold text-white mb-2 underline decoration-cyan-500">ABC 語法快速指南</p>
               <ul className="space-y-1.5 text-[9px]">
                 <li><span className="text-cyan-400">V:1 / V:2</span> - 定義多軌聲部</li>
                 <li><span className="text-cyan-400">[CDEFGAB]</span> - 基礎音階</li>
                 <li><span className="text-cyan-400">"Am7"</span> - 在音符前添加和弦</li>
                 <li><span className="text-cyan-400">/2</span> - 時值減半, <span className="text-cyan-400">2</span> - 時值加倍</li>
               </ul>
             </div>
          </div>
        </div>
      </div>
      
      <div className="relative group flex flex-col gap-3">
        <textarea
          ref={textareaRef}
          value={internalValue}
          onChange={handleChange}
          spellCheck="false"
          className="w-full h-56 bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm text-cyan-50 focus:border-cyan-500/50 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
          placeholder="在此輸入或修改 ABC 樂譜代碼..."
        />

        {/* Floating Quick Edit Bar */}
        <AnimatePresence>
          {selection && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-2 bg-stone-900 border border-cyan-500/30 rounded-xl shadow-2xl self-start"
            >
               <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest px-2 border-r border-white/10">Quick Edit</span>
               <div className="flex gap-1">
                 <button onClick={() => transpose(1)} className="p-1.5 hover:bg-white/5 rounded text-slate-300" title="升音"><ChevronUp size={14}/></button>
                 <button onClick={() => transpose(-1)} className="p-1.5 hover:bg-white/5 rounded text-slate-300" title="降音"><ChevronDown size={14}/></button>
                 <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                 <button onClick={() => modifySelection(t => t + '2')} className="p-1.5 hover:bg-white/5 rounded text-slate-300" title="加倍時值"><Plus size={14}/></button>
                 <button onClick={() => modifySelection(t => t + '/2')} className="p-1.5 hover:bg-white/5 rounded text-slate-300" title="減半時值"><Minus size={14}/></button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
