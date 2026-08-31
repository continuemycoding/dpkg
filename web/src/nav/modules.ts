export type SitePage = 'home' | 'guide';

export interface PageLink {
  href: string;
  label: string;
  page?: SitePage;
  external?: boolean;
}

export interface PageModule {
  id: string;
  label: string;
}

export const PAGE_LINKS: PageLink[] = [
  { href: '/', label: '首页', page: 'home' },
  { href: '/guide', label: '脚本教程', page: 'guide' },
  { href: 'https://docs.remotepro.cn/', label: 'API文档', external: true },
];

export const HOME_MODULES: PageModule[] = [
  { id: 'download', label: '立即下载' },
  { id: 'start', label: '快速上手' },
  { id: 'features', label: '核心功能' },
  { id: 'faq', label: '常见问题' },
];

export const GUIDE_MODULES: PageModule[] = [
  { id: 'langs', label: '支持语言' },
  { id: 'prep', label: '开始准备' },
  { id: 'install', label: '安装扩展' },
  { id: 'first-run', label: '跑通脚本' },
  { id: 'agent', label: 'AI 写脚本' },
  { id: 'panels', label: '侧栏说明' },
  { id: 'troubleshoot', label: '常见问题' },
];
