import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const setWithHistory = useCallback((newState: T) => {
    if (newState === state) return;
    setPast((p) => [...p, state]);
    setState(newState);
    setFuture([]);
  }, [state]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setFuture((f) => [state, ...f]);
    setPast(newPast);
    setState(previous);
  }, [past, state]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast((p) => [...p, state]);
    setFuture(newFuture);
    setState(next);
  }, [future, state]);

  return { state, set: setWithHistory, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}
