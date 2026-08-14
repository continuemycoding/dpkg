import { useEffect, useState } from 'react';
import { fetchAllReleases, initialReleases, type ReleasesMap } from '../api/releases';

export function useReleases(): ReleasesMap {
  const [releases, setReleases] = useState<ReleasesMap>(initialReleases);

  useEffect(() => {
    let cancelled = false;
    fetchAllReleases().then((data) => {
      if (!cancelled) setReleases(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return releases;
}
