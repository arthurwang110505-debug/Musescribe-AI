import { BasicPitch, outputToNotesPoly, noteFramesToTime } from '@spotify/basic-pitch';

let basicPitchInstance: BasicPitch | null = null;

export async function initBasicPitch() {
  if (!basicPitchInstance) {
    basicPitchInstance = new BasicPitch('https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json');
  }
}

export async function transcribeAudioToNotes(file: File) {
  await initBasicPitch();
  
  if (!basicPitchInstance) throw new Error("BasicPitch failed to initialize");

  // Create an AudioContext to decode the audio file
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 22050 });
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  return new Promise<any[]>((resolve, reject) => {
    try {
      basicPitchInstance!.evaluateModel(
        audioBuffer,
        (frames: number[][], onsets: number[][], contours: number[][]) => {
          // Extract notes using basic-pitch utility
          const noteEvents = outputToNotesPoly(frames, onsets);
          // Convert to timed events (start, end, duration)
          const timedNotes = noteFramesToTime(noteEvents);
          resolve(timedNotes);
        },
        (percent: number) => {
          console.log(`Basic Pitch Processing: ${Math.round(percent * 100)}%`);
        }
      ).catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}
