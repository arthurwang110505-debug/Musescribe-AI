import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export async function transcribeAudio(file: File): Promise<string> {
  const base64Data = await fileToBase64(file);
  const mimeType = file.type;

  const transcribeFunc = httpsCallable<{ base64Data: string; mimeType: string }, { transcription: string }>(functions, 'transcribeAudio');
  
  try {
    const result = await transcribeFunc({ base64Data, mimeType });
    return result.data.transcription || "";
  } catch (error) {
    console.error("Firebase Function error:", error);
    throw error;
  }
}

export async function suggestChords(abcNotation: string): Promise<string> {
  const suggestFunc = httpsCallable<{ abcNotation: string }, { updatedAbc: string }>(functions, 'suggestChords');
  
  try {
    const result = await suggestFunc({ abcNotation });
    return result.data.updatedAbc || abcNotation;
  } catch (error) {
    console.error("Firebase Function error:", error);
    throw error;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}
