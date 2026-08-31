export const IDE_IDS = ['vscode', 'cursor', 'trae', 'qoder', 'codebuddy', 'windsurf', 'kiro'] as const;

export type IdeId = (typeof IDE_IDS)[number];

export interface IdeGuide {
  id: IdeId;
  name: string;
  tag: string;
  downloadUrl: string;
  downloadLabel: string;
  blurb: string;
}

export const IDES: IdeGuide[] = [
  {
    id: 'vscode',
    name: 'VS Code',
    tag: '微软',
    downloadUrl: 'https://code.visualstudio.com/',
    downloadLabel: 'code.visualstudio.com',
    blurb: '微软（Microsoft）出品的免费代码编辑器。没有内置 AI 也能用，教程和插件最多，第一次写脚本最稳妥。',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    tag: 'Anysphere',
    downloadUrl: 'https://cursor.com/',
    downloadLabel: 'cursor.com',
    blurb: 'Anysphere 出品。长得像 VS Code，但对话写代码是它的强项；装扩展的方法和 VS Code 一样。',
  },
  {
    id: 'trae',
    name: 'Trae',
    tag: '字节跳动',
    downloadUrl: 'https://www.trae.cn/ide',
    downloadLabel: 'trae.cn/ide',
    blurb: '字节跳动出品的 TraeCode（AI 开发工程师）。这一页就是编辑器本身，兼容 VS Code 扩展；不要下同站的 TraeWork 办公平台。',
  },
  {
    id: 'qoder',
    name: 'Qoder',
    tag: '阿里云',
    downloadUrl: 'https://qoder.com.cn/download?product=ide',
    downloadLabel: 'qoder.com.cn/download?product=ide',
    blurb: '阿里云出品的国内版 Qoder CN IDE，兼容 VS Code 扩展。这一页会定位到 IDE；不要用国际站 qoder.com，也不要下同页的 Qoder CN 工作台。',
  },
  {
    id: 'codebuddy',
    name: 'CodeBuddy',
    tag: '腾讯云',
    downloadUrl: 'https://www.codebuddy.cn/ide/',
    downloadLabel: 'codebuddy.cn/ide',
    blurb: '腾讯云出品的 CodeBuddy IDE。这一页可以直接下编辑器安装包，兼容 VS Code 扩展；不要下同站的 WorkBuddy。',
  },
  {
    id: 'windsurf',
    name: 'Devin Desktop',
    tag: '原 Windsurf',
    downloadUrl: 'https://devin.ai/desktop',
    downloadLabel: 'devin.ai/desktop',
    blurb: 'Cognition 出品。官方 FAQ 写明：Devin Desktop 就是原来的 Windsurf，内置完整 IDE，兼容 VS Code 扩展。请打开这一页下载桌面编辑器；devin.ai 首页是云端 Devin 工程师，不是这个软件。',
  },
  {
    id: 'kiro',
    name: 'Kiro',
    tag: '亚马逊 AWS',
    downloadUrl: 'https://kiro.dev/downloads/',
    downloadLabel: 'kiro.dev/downloads',
    blurb: '亚马逊云科技（AWS）出品，强调先写需求规格再让 AI 动手。下载页请选 IDE，不要下 Crew 或 CLI。兼容 VS Code 扩展，装好远控Pro后用法和其他编辑器一样。',
  },
];

const IDE_ALIASES: Record<string, IdeId> = {
  devin: 'windsurf',
};

export function parseIdeId(value: string | null): IdeId | null {
  if (!value) return null;
  if ((IDE_IDS as readonly string[]).includes(value)) return value as IdeId;
  return IDE_ALIASES[value] ?? null;
}

export function isIdeId(value: string | null): value is IdeId {
  return parseIdeId(value) !== null;
}
