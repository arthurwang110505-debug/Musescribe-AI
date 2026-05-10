import { useState, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export interface SavedScore {
  id?: string;
  userId: string;
  fileName: string;
  abcContent: string;
  createdAt: any;
}

export function useHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<SavedScore[]>([]);
  const [loading, setLoading] = useState(false);

  const saveScore = useCallback(async (fileName: string, abcContent: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'transcriptions'), {
        userId: user.uid,
        fileName,
        abcContent,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error saving transcription:', err);
    }
  }, [user]);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'transcriptions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const results: SavedScore[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as SavedScore);
      });
      setHistory(results);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteScore = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transcriptions', id));
      setHistory(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting score:', err);
    }
  };

  return { history, loading, saveScore, fetchHistory, deleteScore };
}
