/**
 * Basic ASCII Guitar Tab Generator
 */

interface Note {
  pitchMidi: number;
  startTimeSeconds: number;
  durationSeconds: number;
}

export function generateGuitarTab(notes: Note[], title: string = 'Transcribed Tab'): string {
  const sortedNotes = [...notes].sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
  
  // Standard tuning: E2, A2, D3, G3, B3, E4
  const strings = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2 (Midi numbers)
  const stringNames = ['E', 'B', 'G', 'D', 'A', 'E'];
  
  let tab = `${title}\n\n`;
  
  const findBestString = (midi: number) => {
    for (let i = 0; i < strings.length; i++) {
      const fret = midi - strings[i];
      if (fret >= 0 && fret <= 24) {
        return { stringIndex: i, fret };
      }
    }
    return { stringIndex: 0, fret: midi - strings[0] }; // Fallback
  };

  const lines = stringNames.map(name => `${name}|-`);
  
  sortedNotes.forEach((note) => {
    const { stringIndex, fret } = findBestString(Math.round(note.pitchMidi));
    for (let i = 0; i < 6; i++) {
      if (i === stringIndex) {
        lines[i] += `${fret}-`;
      } else {
        lines[i] += '--';
      }
    }
  });

  lines.forEach(line => {
    tab += line + '|\n';
  });

  return tab;
}
