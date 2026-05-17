import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9NAjPX5Ke7qEXTPOg_QaakK2XkFXoLAs",
  authDomain: "musecribe-ai.firebaseapp.com",
  databaseURL: "https://musecribe-ai-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "musecribe-ai",
  storageBucket: "musecribe-ai.firebasestorage.app",
  messagingSenderId: "226004608226",
  appId: "1:226004608226:web:ceedfaf7c8256db8e02abb",
  measurementId: "G-308X7DGGET"
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.error("Firebase init error", e);
}

export const functions = app ? getFunctions(app) : null as any;
export const auth = app ? getAuth(app) : null as any;
export const db = app ? getFirestore(app) : null as any;
