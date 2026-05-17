/**
 * Converts a MIDI pitch number to a VexFlow key string (e.g., 60 -> "c/4")
 */
export function midiToVexKey(midi: number): string {
  const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  const octave = Math.floor(midi / 12) - 1;
  const noteName = notes[midi % 12];
  return `${noteName}/${octave}`;
}

/**
 * Simple quantization: Map duration in seconds to a VexFlow duration string
 * Assumes 120 BPM for now (0.5s per quarter note)
 */
export function durationToVexDuration(durationSeconds: number, bpm: number = 120): string {
  const quarterNoteLen = 60 / bpm;
  
  if (durationSeconds >= quarterNoteLen * 3.5) return 'w'; // Whole
  if (durationSeconds >= quarterNoteLen * 1.75) return 'h'; // Half
  if (durationSeconds >= quarterNoteLen * 0.85) return 'q'; // Quarter
  if (durationSeconds >= quarterNoteLen * 0.45) return '8'; // Eighth
  return '16'; // Sixteenth
}

/**
 * Interface representing a note from the transcription engine
 */
export interface TranscribedNote {
  pitchMidi: number;
  startTimeSeconds: number;
  durationSeconds: number;
  amplitude?: number;
}
