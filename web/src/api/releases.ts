export type Platform = 'win' | 'mac' | 'android' | 'iphone' | 'vsix';

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface GiteeRelease {
  tag_name: string;
  created_at: string;
  body?: string;
  assets: ReleaseAsset[];
}

export interface HistoryItem {
  version: string;
  date: string;
  url: string;
  description: string;
}

export interface PlatformState {
  latest: { version: string; url: string } | null;
  history: HistoryItem[];
  status: 'loading' | 'ready' | 'empty' | 'error';
}

export type ReleasesMap = Record<Platform, PlatformState>;

const GITEE_OWNER = 'RemotePro';

const REPOS: Record<Platform, string> = {
  win: 'RemotePro-windows',
  mac: 'RemotePro-macos',
  android: 'RemotePro-android',
  iphone: 'RemotePro-iphone',
  vsix: 'RemotePro-vsix',
};

const EXT_MAP: Record<Platform, string[]> = {
  win: ['.exe', '.zip', '.7z', '.msi'],
  mac: ['.dmg', '.pkg', '.zip', '.tar.gz'],
  android: ['.apk', '.aab', '.xapk', '.zip'],
  iphone: ['.ipa', '.tipa', '.zip'],
  vsix: ['.vsix', '.zip'],
};

function findAsset(assets: ReleaseAsset[] | undefined, platform: Platform): ReleaseAsset | undefined {
  if (!assets?.length) return undefined;
  return assets.find((asset) => {
    const name = asset.name.toLowerCase();
    return EXT_MAP[platform].some((ext) => name.endsWith(ext));
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function emptyState(status: PlatformState['status']): PlatformState {
  return { latest: null, history: [], status };
}

export const initialReleases = (): ReleasesMap => ({
  win: emptyState('loading'),
  mac: emptyState('loading'),
  android: emptyState('loading'),
  iphone: emptyState('loading'),
  vsix: emptyState('loading'),
});

function parseReleases(list: GiteeRelease[], platform: Platform): PlatformState {
  const history: HistoryItem[] = [];
  for (const release of list) {
    const asset = findAsset(release.assets, platform);
    if (!asset) continue;
    history.push({
      version: release.tag_name,
      date: formatDate(release.created_at),
      url: asset.browser_download_url,
      description: release.body ? release.body.replace(/\s+/g, ' ').trim() : '暂无更新说明',
    });
  }
  if (history.length === 0) return emptyState('empty');
  return {
    latest: { version: history[0].version, url: history[0].url },
    history,
    status: 'ready',
  };
}

async function fetchPlatform(platform: Platform): Promise<PlatformState> {
  const repo = REPOS[platform];
  const url = `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${repo}/releases?direction=desc&page=1&per_page=10`;
  try {
    const res = await fetch(url);
    if (!res.ok) return emptyState('empty');
    const data = (await res.json()) as GiteeRelease[];
    return parseReleases(Array.isArray(data) ? data : [], platform);
  } catch {
    return emptyState('error');
  }
}

export async function fetchAllReleases(): Promise<ReleasesMap> {
  const platforms: Platform[] = ['win', 'mac', 'android', 'iphone', 'vsix'];
  const results = await Promise.all(platforms.map(fetchPlatform));
  return {
    win: results[0],
    mac: results[1],
    android: results[2],
    iphone: results[3],
    vsix: results[4],
  };
}

export function latestLabel(state: PlatformState): string {
  if (state.status === 'loading') return '检测中...';
  if (state.status === 'error') return '网络异常';
  if (state.latest) return `最新版本 ${state.latest.version}`;
  return '即将上线';
}
