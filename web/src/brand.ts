export interface Brand {
  /** 展示用产品名 */
  name: string;
  /** 是否展示脚本扩展、教程、API 文档等开发向内容 */
  showScripts: boolean;
  /** 被控端软件源地址 */
  siteUrl: string;
  /** 脚本 API 文档；无脚本能力时为 null */
  docsUrl: string | null;
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
      siteUrl: 'https://wegoin.xyz',
      docsUrl: null,
    };
  }

  return {
    name: '远控Pro',
    showScripts: true,
    siteUrl: 'https://remotepro.cn',
    docsUrl: 'https://docs.remotepro.cn/',
  };
}

export const brand = resolveBrand();
