export const IDE_IDS = ['vscode', 'cursor', 'trae', 'qoder', 'windsurf', 'kiro'] as const;

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
    downloadUrl: 'https://www.trae.cn/download',
    downloadLabel: 'trae.cn/download',
    blurb: '字节跳动（ByteDance）出品，国内用的人比较多。界面和快捷键跟 VS Code 同一套，把 .vsix 装进去就能用远控Pro。',
  },
  {
    id: 'qoder',
    name: 'Qoder',
    tag: '阿里巴巴',
    downloadUrl: 'https://qoder.com/download',
    downloadLabel: 'qoder.com/download',
    blurb: '阿里巴巴（Alibaba）出品的智能体编程 IDE，可以交给 AI 做一整段开发任务。兼容 VS Code 扩展，侧栏操作和其他编辑器一致。',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    tag: 'Cognition',
    downloadUrl: 'https://devin.ai/download',
    downloadLabel: 'devin.ai/download',
    blurb: 'Cognition 出品，现名 Devin Desktop，以前叫 Windsurf（Codeium）。下载页或桌面图标可能写 Windsurf 或 Devin，其实是同一款，可以装 .vsix。',
  },
  {
    id: 'kiro',
    name: 'Kiro',
    tag: '亚马逊 AWS',
    downloadUrl: 'https://kiro.dev/',
    downloadLabel: 'kiro.dev',
    blurb: '亚马逊云科技（AWS）出品，强调先写需求规格再让 AI 动手。兼容 VS Code 扩展，装好远控Pro后用法和其他编辑器一样。',
  },
];

export function isIdeId(value: string | null): value is IdeId {
  return !!value && (IDE_IDS as readonly string[]).includes(value);
}
