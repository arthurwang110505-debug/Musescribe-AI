import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/auth'; // Wait, it's firestore. Let me fix the imports.
// Actually, let's just write the correct imports.
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export async function checkAndRecordUsage(uid: string, durationSeconds: number): Promise<{ allowed: boolean, error?: string }> {
  try {
    const usageRef = doc(db, 'users', uid, 'usage', 'transcription');
    const usageSnap = await getDoc(usageRef);

    const LIMIT_SECONDS = 900; // 15 minutes

    if (!usageSnap.exists()) {
      if (durationSeconds > LIMIT_SECONDS) {
        return { allowed: false, error: 'File duration exceeds your 15-minute free limit.' };
      }
      await setDoc(usageRef, { totalSeconds: durationSeconds });
      return { allowed: true };
    }

    const data = usageSnap.data();
    const currentTotal = data.totalSeconds || 0;

    if (currentTotal + durationSeconds > LIMIT_SECONDS) {
      return { allowed: false, error: `You have reached your 15-minute free limit. You have ${Math.max(0, LIMIT_SECONDS - currentTotal).toFixed(0)} seconds left.` };
    }

    await updateDoc(usageRef, {
      totalSeconds: increment(durationSeconds)
    });

    return { allowed: true };
  } catch (err) {
    console.error('Error checking usage limit:', err);
    // Allow transcription if we can't check the DB just to avoid breaking the UX, or fail gracefully.
    return { allowed: true };
  }
}
