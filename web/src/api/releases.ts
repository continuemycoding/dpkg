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
const CACHE_KEY = 'rp-releases-v2';
const CACHE_TTL_MS = 10 * 60 * 1000;

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

const PLATFORMS: Platform[] = ['win', 'mac', 'android', 'iphone', 'vsix'];

function findAsset(assets: ReleaseAsset[] | undefined, platform: Platform): ReleaseAsset | undefined {
  if (!assets?.length) return undefined;
  return assets.find((asset) => {
    const name = asset.name.toLowerCase();
    if (name.includes('source code') || name.endsWith('.tar.gz') && platform !== 'mac') return false;
    return EXT_MAP[platform].some((ext) => name.endsWith(ext));
  });
}

function formatDate(dateString: string): string {
  const normalized = dateString.replace(/\s+\+\d{4}$/, '').trim();
  const date = new Date(normalized.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return dateString.trim();
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

function decodeHtml(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x000A;/g, '\n')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseHtmlReleases(html: string, platform: Platform): PlatformState {
  const blocks = html.split("class='release-tag-item'");
  const history: HistoryItem[] = [];

  for (const block of blocks.slice(1)) {
    const version = block.match(/data-tag='([^']+)'/)?.[1];
    const dateRaw =
      block.match(/data-commit-date='([^']+)'/)?.[1] ||
      block.match(/class='release-time'[^>]*>\s*([^<]+)/)?.[1] ||
      '';
    const descRaw = block.match(/<textarea class='content'[^>]*>([\s\S]*?)<\/textarea>/)?.[1] || '';
    const links = [...block.matchAll(/href="(\/[^"]+\/releases\/download\/[^"]+)"/g)];
    const assets: ReleaseAsset[] = links.map((match) => {
      const path = match[1];
      const name = decodeURIComponent(path.split('/').pop() || '');
      return {
        name,
        browser_download_url: `https://gitee.com${path}`,
      };
    });
    const asset = findAsset(assets, platform);
    if (!version || !asset) continue;
    history.push({
      version,
      date: formatDate(dateRaw),
      url: asset.browser_download_url,
      description: decodeHtml(descRaw) || '暂无更新说明',
    });
    if (history.length >= 10) break;
  }

  if (history.length === 0) return emptyState('empty');
  return {
    latest: { version: history[0].version, url: history[0].url },
    history,
    status: 'ready',
  };
}

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const USE_GITEE_PROXY = import.meta.env.DEV && __GITEE_DEV_PROXY__;

async function fetchFromApi(platform: Platform): Promise<PlatformState | null> {
  const repo = REPOS[platform];
  const direct = `https://gitee.com/api/v5/repos/${GITEE_OWNER}/${repo}/releases?direction=desc&page=1&per_page=10`;
  const urls = USE_GITEE_PROXY
    ? [`/gitee-api/repos/${GITEE_OWNER}/${repo}/releases?direction=desc&page=1&per_page=10`, direct]
    : [direct];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;
      const data = await readJson(res);
      if (!Array.isArray(data)) continue;
      return parseReleases(data as GiteeRelease[], platform);
    } catch {
      continue;
    }
  }
  return null;
}

async function fetchFromHtml(platform: Platform): Promise<PlatformState | null> {
  if (!USE_GITEE_PROXY) return null;
  const repo = REPOS[platform];
  const urls = [`/gitee-page/${GITEE_OWNER}/${repo}/releases`];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { Accept: 'text/html' } });
      if (!res.ok) continue;
      const html = await res.text();
      if (!html.includes('release-tag-item')) continue;
      const parsed = parseHtmlReleases(html, platform);
      if (parsed.status === 'ready') return parsed;
    } catch {
      continue;
    }
  }
  return null;
}

async function fetchPlatform(platform: Platform): Promise<PlatformState> {
  const fromApi = await fetchFromApi(platform);
  if (fromApi?.status === 'ready') return fromApi;

  const fromHtml = await fetchFromHtml(platform);
  if (fromHtml?.status === 'ready') return fromHtml;

  if (fromApi?.status === 'empty' || fromHtml?.status === 'empty') return emptyState('empty');
  return emptyState('error');
}

export function loadCachedReleases(): ReleasesMap | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: ReleasesMap };
    if (!parsed?.data) return null;
    const ready = PLATFORMS.some((platform) => parsed.data[platform]?.status === 'ready');
    if (!ready) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function isCacheFresh(): boolean {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { ts: number; data: ReleasesMap };
    if (!parsed?.ts || Date.now() - parsed.ts > CACHE_TTL_MS) return false;
    return PLATFORMS.every((platform) => parsed.data?.[platform]?.status === 'ready');
  } catch {
    return false;
  }
}

function saveCachedReleases(data: ReleasesMap) {
  try {
    if (!PLATFORMS.some((platform) => data[platform].status === 'ready')) return;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* ignore quota / private mode */
  }
}

export async function fetchAllReleases(): Promise<ReleasesMap> {
  const results = await Promise.all(PLATFORMS.map(fetchPlatform));
  const data: ReleasesMap = {
    win: results[0],
    mac: results[1],
    android: results[2],
    iphone: results[3],
    vsix: results[4],
  };
  saveCachedReleases(data);
  return data;
}

export function staticReleases(
  version: string,
  files: { win: string; mac: string; android: string; iphone: string },
): ReleasesMap {
  const one = (file: string): PlatformState => ({
    latest: { version, url: `/${file}` },
    history: [],
    status: 'ready',
  });
  return {
    win: one(files.win),
    mac: one(files.mac),
    android: one(files.android),
    iphone: one(files.iphone),
    vsix: emptyState('empty'),
  };
}

export function latestLabel(state: PlatformState): string {
  if (state.status === 'loading') return '检测中...';
  if (state.status === 'error') return '网络异常';
  if (state.latest) return `最新版本 ${state.latest.version}`;
  return '即将上线';
}
