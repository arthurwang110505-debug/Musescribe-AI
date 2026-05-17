/**
 * Basic MusicXML Generator
 * Converts transcribed notes into a valid MusicXML structure.
 */

interface Note {
  pitchMidi: number;
  startTimeSeconds: number;
  durationSeconds: number;
}

export function generateMusicXML(notes: Note[], title: string = 'Transcribed Score'): string {
  const bpm = 120;
  const divisions = 480; // Standard divisions per quarter note

  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work>
    <work-title>${title}</work-title>
  </work>
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>${divisions}</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <direction placement="above">
        <direction-type>
          <metronome>
            <beat-unit>quarter</beat-unit>
            <per-minute>${bpm}</per-minute>
          </metronome>
        </direction-type>
      </direction>
`;

  const midiToName = (midi: number) => {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const step = names[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return { step: step.replace('#', ''), alter: step.includes('#') ? 1 : 0, octave };
  };

  let measureContent = '';
  // Sort notes by start time
  const sortedNotes = [...notes].sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);

  sortedNotes.forEach((note) => {
    const { step, alter, octave } = midiToName(Math.round(note.pitchMidi));
    const duration = Math.round((note.durationSeconds * bpm / 60) * divisions);
    
    measureContent += `      <note>
        <pitch>
          <step>${step}</step>
          ${alter ? `<alter>${alter}</alter>` : ''}
          <octave>${octave}</octave>
        </pitch>
        <duration>${duration}</duration>
        <type>${getNoteType(note.durationSeconds, bpm)}</type>
      </note>\n`;
  });

  const xmlFooter = `    </measure>
  </part>
</score-partwise>`;

  return xmlHeader + measureContent + xmlFooter;
}

function getNoteType(duration: number, bpm: number): string {
  const quarterDuration = 60 / bpm;
  const ratio = duration / quarterDuration;

  if (ratio >= 3.5) return 'whole';
  if (ratio >= 1.75) return 'half';
  if (ratio >= 0.8) return 'quarter';
  if (ratio >= 0.4) return 'eighth';
  if (ratio >= 0.2) return '16th';
  return '32nd';
}
