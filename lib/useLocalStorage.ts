import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null && raw !== 'undefined') {
        if (raw === 'null') {
          window.localStorage.removeItem(key);
          setValue(defaultValue);
        } else {
          try {
            setValue(JSON.parse(raw));
          } catch {
            setValue(raw as unknown as T);
          }
        }
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        try {
          if (resolved === null || resolved === undefined) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          }
        } catch {
          // ignore quota / privacy-mode errors
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}
