import { isNotEmpty } from '@/shared/lib/value.util';
import { useState, useRef, useEffect } from 'react';

const SKELETON_MIN_DURATION_MS = 700;

export default function useDelay(
  value: boolean,
  delay: number = SKELETON_MIN_DURATION_MS,
): boolean | null {
  const [delayedValue, setDelayedValue] = useState<boolean | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (value) {
      setDelayedValue(true);
      startTimeRef.current = Date.now();
    } else if (isNotEmpty(value)) {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = delay - elapsed;
      if (remaining <= 0) {
        setDelayedValue(false);
      } else {
        timeoutRef.current = setTimeout(() => {
          setDelayedValue(false);
        }, remaining);
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return delayedValue;
}
