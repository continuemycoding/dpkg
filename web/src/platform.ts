export type ClientPlatform = 'win' | 'mac' | 'android' | 'iphone';

export const PLATFORM_LABEL: Record<ClientPlatform, string> = {
  win: 'Windows',
  mac: 'macOS',
  android: 'Android',
  iphone: 'iPhone',
};

function isIOSLike(): boolean {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  // iPadOS 13+ 默认伪装成 Mac
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/** 根据 UA 猜测访客正在用的系统，用于高亮推荐下载 */
export function detectPlatform(): ClientPlatform | null {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent;
  if (isIOSLike()) return 'iphone';
  if (/Android/i.test(ua)) return 'android';
  if (/Windows/i.test(ua)) return 'win';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'mac';
  return null;
}

/** 越狱商店（Sileo / Cydia）只在 iOS 设备上能被唤起 */
export function canOpenJailbreakStore(): boolean {
  if (typeof navigator === 'undefined') return false;
  return isIOSLike();
}

export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'absolute';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(ta);
  if (!ok) throw new Error('copy failed');
}
