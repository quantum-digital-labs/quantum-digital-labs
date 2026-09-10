import { useEffect, useState } from 'react';

/**
 * Load a content list from the API, falling back to static data on error.
 */
export function useContentList<T>(
  load: () => Promise<T[]>,
  fallback: T[],
): { items: T[]; loading: boolean } {
  const [items, setItems] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    load()
      .then((data) => {
        if (cancelled) return;
        setItems(Array.isArray(data) && data.length > 0 ? data : fallback);
      })
      .catch(() => {
        if (!cancelled) setItems(fallback);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // Intentionally once on mount — load/fallback are stable module refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading };
}

/**
 * Load a single content item from the API, falling back to a static getter.
 */
export function useContentItem<T>(
  id: string | undefined,
  load: (id: string) => Promise<T>,
  fallback: (id: string) => T | undefined,
): { item: T | undefined; loading: boolean } {
  const [item, setItem] = useState<T | undefined>(() =>
    id ? fallback(id) : undefined,
  );
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      setItem(undefined);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const local = fallback(id);
    setItem(local);
    setLoading(true);

    load(id)
      .then((data) => {
        if (!cancelled && data) setItem(data);
      })
      .catch(() => {
        if (!cancelled) setItem(local);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { item, loading };
}
