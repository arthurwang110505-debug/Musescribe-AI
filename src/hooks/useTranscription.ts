import { useState, useCallback } from 'react';
import { suggestChords } from '../lib/geminiService';
import { transcribeAudioToNotes } from '../lib/basicPitchService';
import { transcribeWithMT3, transcribeFromUrl } from '../lib/mt3Service';
import { useAuth } from './useAuth';
import { getAudioDuration, truncateAudioFile } from '../lib/audioUtils';
import { checkAndRecordUsage } from '../lib/usageService';

export function useTranscription() {
  const [abcContent, setAbcContent] = useState<string>('');
  const [transcribedNotes, setTranscribedNotes] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>();
  const [engine, setEngine] = useState<'basic-pitch' | 'mt3'>('basic-pitch');
  const { user } = useAuth();

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    
    try {
      const duration = await getAudioDuration(file);
      let fileToProcess = file;

      if (!user) {
        if (duration > 30) {
          // Truncate to 30s
          fileToProcess = await truncateAudioFile(file, 30);
          setError('Guest mode: Audio truncated to the first 30 seconds. Log in to process longer files.');
        }
      } else {
        const usageCheck = await checkAndRecordUsage(user.uid, duration);
        if (!usageCheck.allowed) {
          throw new Error(usageCheck.error || 'Usage limit exceeded.');
        }
      }

      // Create preview URL for the audio player using the potentially truncated file
      const url = URL.createObjectURL(fileToProcess);
      setAudioUrl(url);

      let notes: any[];
      if (engine === 'mt3') {
        notes = await transcribeWithMT3(fileToProcess);
      } else {
        notes = await transcribeAudioToNotes(fileToProcess);
      }
      
      setTranscribedNotes(notes);
      
      // Keep ABC for backward compatibility or metadata display
      const mockAbc = `X:1\nT:${file.name}\nM:4/4\nL:1/4\nK:C\n% Extracted ${notes.length} notes using ${engine}\n`;
      setAbcContent(mockAbc);
      setSelection(undefined);
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err instanceof Error ? err.message : 'Transcription failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [engine, user]);

  const handleUrlImport = useCallback(async (url: string) => {
    setIsProcessing(true);
    setError(null);
    setFileName('Link Transcription');
    try {
      const notes = await transcribeFromUrl(url);
      setTranscribedNotes(notes);
      const mockAbc = `X:1\nT:URL Import\nM:4/4\nL:1/4\nK:C\n% Extracted ${notes.length} notes using MT3\n`;
      setAbcContent(mockAbc);
    } catch (err) {
      console.error('URL Transcription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to transcribe from URL.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleSuggestChords = useCallback(async () => {
    if (!abcContent) return;
    setIsSuggesting(true);
    try {
      const updatedAbc = await suggestChords(abcContent);
      const cleaned = updatedAbc.replace(/```abc/g, '').replace(/```/g, '').trim();
      setAbcContent(cleaned);
    } catch (err) {
      console.error(err);
      setError('Chord suggestion failed. Please try again later.');
    } finally {
      setIsSuggesting(false);
    }
  }, [abcContent]);

  const reset = useCallback(() => {
    setAbcContent('');
    setFileName('');
    setError(null);
    setSelection(undefined);
  }, []);

  const handleNoteClick = useCallback((start: number, end: number) => {
    setSelection({ start, end });
  }, []);

  const handleBlankScore = useCallback(() => {
    setFileName('Untitled_Score.abc');
    setAbcContent('X:1\nT:Untitled Score\nC:Composer\nM:4/4\nL:1/4\nK:C\n|');
  }, []);

  return {
    abcContent,
    transcribedNotes,
    engine,
    audioUrl,
    setEngine,
    setAbcContent,
    isProcessing,
    isSuggesting,
    error,
    fileName,
    selection,
    handleFileSelect,
    handleUrlImport,
    handleSuggestChords,
    reset,
    handleNoteClick,
    handleBlankScore
  };
}
