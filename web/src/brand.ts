export interface BrandDownloads {
  version: string;
  files: {
    win: string;
    mac: string;
    android: string;
    iphone: string;
  };
}

export interface Brand {
  /** 展示用产品名 */
  name: string;
  /** 是否展示脚本扩展、教程、API 文档等开发向内容 */
  showScripts: boolean;
  /** 是否展示历史版本 */
  showHistory: boolean;
  /** 被控端软件源地址 */
  siteUrl: string;
  /** 脚本 API 文档；无脚本能力时为 null */
  docsUrl: string | null;
  /** 写死版本并从站点根路径下载；走 Gitee 时为 null */
  downloads: BrandDownloads | null;
}

function currentHost(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hostname.toLowerCase();
}

function isWegoinHost(host: string): boolean {
  return host === 'wegoin.xyz' || host.endsWith('.wegoin.xyz');
}

function resolveBrand(): Brand {
  if (isWegoinHost(currentHost())) {
    return {
      name: 'Wegoin',
      showScripts: false,
      showHistory: false,
      siteUrl: 'https://wegoin.xyz',
      docsUrl: null,
      downloads: {
        version: '1.0.0',
        files: {
          win: 'Wegoin-windows.zip',
          mac: 'Wegoin-macos.zip',
          android: 'Wegoin.apk',
          iphone: 'Wegoin.ipa',
        },
      },
    };
  }

  return {
    name: '远控Pro',
    showScripts: true,
    showHistory: true,
    siteUrl: 'https://remotepro.cn',
    docsUrl: 'https://docs.remotepro.cn/',
    downloads: null,
  };
}

export const brand = resolveBrand();
