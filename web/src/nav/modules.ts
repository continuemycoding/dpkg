import { brand } from '../brand';

export type SitePage = 'home' | 'guide';

export interface PageLink {
  href: string;
  label: string;
  /** 指向某个页面时，在该页面高亮 */
  page?: SitePage;
  /** 指向首页某个模块时，滚动到该模块高亮 */
  section?: string;
  external?: boolean;
}

export interface PageModule {
  id: string;
  label: string;
}

export const HEADER_LINKS: PageLink[] = [
  { href: '/#features', label: '产品功能', section: 'features' },
  { href: '/#start', label: '快速上手', section: 'start' },
  { href: '/#faq', label: '常见问题', section: 'faq' },
  ...(brand.showScripts ? [{ href: '/guide', label: '脚本教程', page: 'guide' as const }] : []),
  ...(brand.docsUrl ? [{ href: brand.docsUrl, label: 'API 文档', external: true }] : []),
];

export const HOME_SECTIONS = ['download', 'features', 'start', 'faq'];

export const GUIDE_MODULES: PageModule[] = [
  { id: 'langs', label: '支持语言' },
  { id: 'prep', label: '开始准备' },
  { id: 'install', label: '安装扩展' },
  { id: 'first-run', label: '跑通脚本' },
  { id: 'agent', label: 'AI 写脚本' },
  { id: 'panels', label: '侧栏说明' },
  { id: 'troubleshoot', label: '常见问题' },
];
