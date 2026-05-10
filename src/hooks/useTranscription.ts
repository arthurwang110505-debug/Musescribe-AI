import { useState, useCallback } from 'react';
import { transcribeAudio, suggestChords } from '../lib/geminiService';

export function useTranscription() {
  const [abcContent, setAbcContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>();

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    try {
      const transcription = await transcribeAudio(file);
      // Clean up common AI markdown artifacts
      const cleaned = transcription.replace(/```abc/g, '').replace(/```/g, '').trim();
      setAbcContent(cleaned);
      setSelection(undefined);
    } catch (err) {
      console.error(err);
      setError('無法分析該檔案。這可能是由於檔案過大或網路連線問題。');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestChords = async () => {
    if (!abcContent) return;
    setIsSuggesting(true);
    try {
      const updatedAbc = await suggestChords(abcContent);
      const cleaned = updatedAbc.replace(/```abc/g, '').replace(/```/g, '').trim();
      setAbcContent(cleaned);
    } catch (err) {
      console.error(err);
      setError('和弦建議失敗，請稍後再試。');
    } finally {
      setIsSuggesting(false);
    }
  };

  const reset = () => {
    setAbcContent('');
    setFileName('');
    setError(null);
    setSelection(undefined);
  };

  const handleNoteClick = useCallback((start: number, end: number) => {
    setSelection({ start, end });
  }, []);

  return {
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
  };
}
