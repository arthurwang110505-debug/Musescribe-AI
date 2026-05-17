import { Client } from '@gradio/client';
import { Midi } from '@tonejs/midi';

export interface MT3Note {
  pitchMidi: number;
  startTimeSeconds: number;
  durationSeconds: number;
  velocity: number;
  instrument: string;
}

/**
 * Transcribes audio using the MT3 (Multi-Task Music Transformer) model via Hugging Face.
 * This model is much more powerful than Basic Pitch and can detect multiple instruments.
 */
export async function transcribeWithMT3(file: File): Promise<MT3Note[]> {
  const hfToken = import.meta.env.VITE_HF_TOKEN;
  
  if (!hfToken) {
    console.warn("Hugging Face Token missing. MT3 might fail or be heavily rate-limited.");
  }

  // Connect to the YourMT3 space which is a reliable MT3 implementation
  const client = await Client.connect("mimbres/YourMT3", {
    hf_token: hfToken as `hf_${string}`
  });

  // Call the transcription endpoint
  const result = await client.predict("/predict", {
    inputs: file,
  });

  const data = result.data as any[];
  
  // Handle case where Space returns HTML (data URL might be inside)
  if (typeof data[0] === 'string' && data[0].includes('<')) {
    const dataUrlMatch = data[0].match(/data:audio\/midi;base64,[A-Za-z0-9+/=]+/);
    if (dataUrlMatch) {
      const response = await fetch(dataUrlMatch[0]);
      return parseMidi(await response.arrayBuffer());
    }
    throw new Error("MT3 engine returned an unexpected format. Please try again or use the Standard engine.");
  }

  const midiUrl = data[0]?.url;

  if (!midiUrl) throw new Error("MT3 failed to generate MIDI file. The file might be too large or the service is busy.");

  const response = await fetch(midiUrl);
  const arrayBuffer = await response.arrayBuffer();
  return parseMidi(arrayBuffer);
}
export async function transcribeFromUrl(url: string): Promise<MT3Note[]> {
  const hfToken = import.meta.env.VITE_HF_TOKEN;
  
  try {
    const client = await Client.connect("mimbres/YourMT3", {
      hf_token: hfToken as `hf_${string}`
    });

    // Call the YouTube processing endpoint
    // Note: mimbres/YourMT3 often fails for real YouTube URLs because Hugging Face IPs are blocked by YT.
    // They have a 'temp' function that only works for specific examples.
    const result = await client.predict("/process_audio_yt_temp", {
      youtube_url: url,
    });

    const data = result.data as any[];
    
    // If we get back a string that looks like HTML instead of a File object with a URL,
    // it usually means the Space returned an error message or a demo player.
    if (typeof data[0] === 'string' && data[0].includes('<')) {
      // Try to see if there's a data URL embedded (unlikely but possible)
      const dataUrlMatch = data[0].match(/data:audio\/midi;base64,[A-Za-z0-9+/=]+/);
      if (dataUrlMatch) {
        const response = await fetch(dataUrlMatch[0]);
        return parseMidi(await response.arrayBuffer());
      }
      
      throw new Error("YouTube transcription is currently restricted by the AI engine provider (IP Blocked). Please download the audio and upload it manually for 100% reliability.");
    }

    const midiUrl = data[0]?.url;

    if (!midiUrl) {
      throw new Error("The AI engine was unable to process this link. This usually happens with restricted or very long videos. Try uploading the file instead.");
    }

    const response = await fetch(midiUrl);
    const arrayBuffer = await response.arrayBuffer();
    return parseMidi(arrayBuffer);
  } catch (error: any) {
    console.error("MT3 URL Error:", error);
    if (error.message?.includes("IP Blocked") || error.message?.includes("restricted")) {
      throw error;
    }
    throw new Error("Failed to transcribe from URL. The external AI service might be down or busy. Manual upload is recommended.");
  }
}

/**
 * Helper to parse MIDI array buffer into MT3Note objects
 */
async function parseMidi(arrayBuffer: ArrayBuffer): Promise<MT3Note[]> {
  const midi = new Midi(arrayBuffer);
  const allNotes: MT3Note[] = [];
  
  midi.tracks.forEach(track => {
    track.notes.forEach(note => {
      allNotes.push({
        pitchMidi: note.midi,
        startTimeSeconds: note.time,
        durationSeconds: note.duration,
        velocity: note.velocity,
        instrument: track.name || 'unknown'
      });
    });
  });

  return allNotes.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
}
