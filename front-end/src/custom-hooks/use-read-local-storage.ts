/* eslint-disable unicorn/no-null */

import { useCallback, useEffect, useState } from 'react';

import { useEventListener } from './use-event-listener';

type Value<T> = T | null;

export function useReadLocalStorage<T>(key: string): Value<T> {
  const readValue = useCallback((): Value<T> => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return null;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState<Value<T>>(readValue);

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue());
    },
    [key, readValue]
  );

  useEventListener('storage', handleStorageChange);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEventListener('local-storage', handleStorageChange);

  return storedValue;
}
