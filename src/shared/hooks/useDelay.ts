import { useEffect, useState } from 'react';
import { isNotEmpty } from '../lib';

const SKELETON_MIN_DURATION_MS = 700;

export default function useDelay(
  value: boolean,
  delay: number = SKELETON_MIN_DURATION_MS
): boolean | null {
  const [delayedValue, setDelayedValue] = useState<boolean | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isNotEmpty(value)) {
      timeoutId = setTimeout(() => {
        setDelayedValue(true);
      }, delay);
    } else {
      setDelayedValue(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay, value]);

  return delayedValue;
}
