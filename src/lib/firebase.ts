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

const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
