const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenAI } = require("@google/genai");

admin.initializeApp();

// Access the API key from environment variables or secrets
// Use firebase functions:secrets:set GEMINI_API_KEY=YOUR_KEY to set it
const apiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key;

const genAI = new GoogleGenAI(apiKey);

exports.transcribeAudio = functions.https.onCall(async (data, context) => {
  const { base64Data, mimeType } = data;

  if (!base64Data || !mimeType) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with base64Data and mimeType.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
      {
        text: `You are an expert music transcriber. Analyze the provided audio/video and transcribe the main melody into ABC Notation. 
        
Return ONLY the ABC notation string. 
Ensure you include:
- X: (reference number)
- T: (title, use "Generated Transcription")
- M: (meter/time signature)
- L: (unit note length)
- K: (key signature)
- The melody notes

If the audio is silent or no melody is detected, return an empty melody in the correct key.
Do not provide any explanations or markdown outside the ABC notation.`,
      },
    ]);

    const transcription = result.response.text();
    return { transcription };
  } catch (error) {
    console.error("Transcription error:", error);
    throw new functions.https.HttpsError('internal', 'Transcription failed.', error.message);
  }
});

exports.suggestChords = functions.https.onCall(async (data, context) => {
  const { abcNotation } = data;

  if (!abcNotation) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with abcNotation.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent([
      {
        text: `You are a music theory expert. Given the following ABC notation melody, please add appropriate chord symbols (like "C", "Dm7", "G7") before the notes. 
        
Ensure the chords match the harmonic rhythm of the piece. 
Return ONLY the updated ABC notation string.

ABC Notation:
${abcNotation}`,
      },
    ]);

    const updatedAbc = result.response.text();
    return { updatedAbc };
  } catch (error) {
    console.error("Chord suggestion error:", error);
    throw new functions.https.HttpsError('internal', 'Chord suggestion failed.', error.message);
  }
});
