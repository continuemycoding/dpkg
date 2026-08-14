import { useEffect, useState } from 'react';
import {
  fetchAllReleases,
  initialReleases,
  isCacheFresh,
  loadCachedReleases,
  type ReleasesMap,
} from '../api/releases';

export function useReleases(): ReleasesMap {
  const [releases, setReleases] = useState<ReleasesMap>(() => loadCachedReleases() ?? initialReleases());

  useEffect(() => {
    if (isCacheFresh()) return;

    let cancelled = false;
    fetchAllReleases().then((data) => {
      if (cancelled) return;
      const anyReady = Object.values(data).some((item) => item.status === 'ready');
      if (!anyReady && loadCachedReleases()) return;
      setReleases(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return releases;
}
