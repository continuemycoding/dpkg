import { useEffect, useState } from 'react';
import {
  fetchAllReleases,
  initialReleases,
  isCacheFresh,
  loadCachedReleases,
  staticReleases,
  type ReleasesMap,
} from '../api/releases';
import { brand } from '../brand';

const LOCAL_RELEASES: ReleasesMap | null = brand.downloads
  ? staticReleases(brand.downloads.version, brand.downloads.files)
  : null;

export function useReleases(): ReleasesMap {
  const [releases, setReleases] = useState<ReleasesMap>(
    () => LOCAL_RELEASES ?? loadCachedReleases() ?? initialReleases(),
  );

  useEffect(() => {
    if (LOCAL_RELEASES) return;
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

  return LOCAL_RELEASES ?? releases;
}
