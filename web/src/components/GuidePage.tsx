import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Collapse, Tabs } from 'antd';
import {
  ApiOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  DesktopOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
  MessageOutlined,
  MobileOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import type { PlatformState } from '../api/releases';
import { brand } from '../brand';
import { IDES, parseIdeId, type IdeId } from '../guide/ides';

const DOCS_URL = brand.docsUrl ?? 'https://docs.remotepro.cn/';
const productName = brand.name;

const LANGUAGES = [
  { name: 'Python', hint: '最适合入门，语法简单' },
  { name: 'JavaScript', hint: '改完就能跑，适合自用' },
  { name: 'TypeScript', hint: '有类型提示，更好维护' },
  { name: 'Lua', hint: '轻量，写自动化很快' },
  { name: 'C#', hint: '推荐对外分发' },
  { name: 'C++', hint: '性能高，推荐对外分发' },
  { name: 'Rust', hint: '安全且难逆向' },
  { name: 'Go', hint: '语法简洁，适合分发' },
  { name: 'Swift', hint: 'iOS 原生；本地调试仅 macOS' },
  { name: 'Objective-C', hint: 'iOS 原生；本地调试仅 macOS' },
];

const FIRST_STEPS = [
  {
    title: `打开「${productName}」侧栏`,
    desc: `看编辑器最左边那一列图标（活动栏），点「${productName}」。侧栏顶部有两个页签：编译部署、设备管理。`,
  },
  {
    title: '新建一个项目',
    desc: '在「编译部署」里点「新建项目」，先选语言。不确定就选 Python 或 JavaScript。接着选模板、填项目名、选保存文件夹。编辑器会打开这个新文件夹。',
  },
  {
    title: '连上你的手机',
    desc: `切到「设备管理」，点「扫描局域网」。出现设备后点「连接」。电脑和手机要在同一 Wi‑Fi；手机上需要安装「${productName}」被控端。`,
  },
  {
    title: '配置调试环境',
    desc: '回到「编译部署」，展开「调试环境」，点「配置调试环境」。扩展会自动安装该语言需要的插件和工具。弹窗让你重载窗口时，选重载。变成「已就绪」就可以了。',
  },
  {
    title: '按 F5 在本地跑起来',
    desc: '打开项目里的主文件（例如 Python 的 src/main.py），按F5，脚本会连到手机执行，并可断点调试。',
  },
  {
    title: '远程编译并发布到手机',
    desc: '在「编译」卡片点「开始编译」。完成后打开「构建列表」：分享是某个版本自己的链接，每个版本各有一条；发布全项目只有一条链接，始终指向你设成发布的那个版本。手机端扫码订阅即可使用。',
  },
];

const TOOLS = [
  { title: '实时控制', desc: '在编辑器里看手机画面，并直接点击、滑动。' },
  { title: '元素查找', desc: '查看界面控件树，复制控件信息，方便脚本定位按钮。' },
  { title: '文字识别', desc: '把屏幕上的字认出来，适合找「登录」「确定」这类文字。' },
  { title: '找图找色', desc: '按图片或颜色找位置，适合没有现成控件的界面。' },
  { title: '目标检测', desc: '用模型识别屏幕上的物体，适合更复杂的场景。' },
  { title: '接口日志', desc: '查看脚本调用了哪些设备接口，排查问题时很有用。' },
];

const AGENT_IDEAS = [
  {
    icon: <MessageOutlined />,
    title: '对话窗口',
    desc: '编辑器右边（有的在底部）有一个聊天框。你用中文说话，AI 用中文回你。',
  },
  {
    icon: <RobotOutlined />,
    title: 'Agent 模式',
    desc: 'Ask / Chat 只能回答问题，不会改文件。写脚本要选能动手的那种：VS Code 的 Copilot、以及 Cursor、Trae、Qoder 都选 Agent；CodeBuddy 叫 Craft（复杂任务用 Plan）；Devin Desktop 选 Devin Local；Kiro 打开对话就能改。',
  },
  {
    icon: <ApiOutlined />,
    title: 'MCP 工具箱',
    desc: `装好${productName}扩展后，会出现 remotepro-toolkit。打开它，AI 才能查接口文档、检查调试环境、看到已连接的手机。`,
  },
];

const AGENT_STEPS = [
  {
    title: '先把项目和手机准备好',
    desc: '确认已经新建项目、连上手机、调试环境是「已就绪」。就是上面「跑通脚本」里做过的那些；没做完先回去做完，AI 写完才能在真机上跑。',
  },
  {
    title: '打开对话，选 Agent',
    desc: '打开右侧对话（快捷键因软件而异，常见是 Ctrl+L、Ctrl+U 或 Ctrl+I）。不要停在 Ask / Chat。VS Code 的 Copilot、以及 Cursor、Trae、Qoder 都选 Agent；CodeBuddy 选 Craft 或 Plan；Devin Desktop 右下角选 Devin Local，模式用 Normal；Kiro 直接说需求即可。',
  },
  {
    title: '打开 remotepro-toolkit',
    desc: '到编辑器的 MCP / 工具 设置里，找到名字以 remotepro-toolkit 开头的项，打开开关。有的软件第一次默认关着，不打开 AI 就查不了文档、也看不到手机。',
  },
  {
    title: '用中文把需求说清楚',
    desc: '写清 App 名字、从哪一页开始、要点哪些按钮。一次做一个功能，跑通再加。下面有一段可直接复制。',
  },
];

const AGENT_CAN = [
  { title: '查接口文档', desc: '点击、滑动、找控件、识别文字，AI 会自己翻文档再写，不用你记接口名字。' },
  { title: '检查调试环境', desc: '缺插件或工具链时，AI 可以检测，并在你同意后帮你装。' },
  { title: '看已连接手机', desc: '确认扩展里已经连上设备，避免对着空设备写脚本。' },
  { title: '按步骤改代码', desc: '把流程告诉它，它会改项目里的主文件，并尽量让代码能编过。' },
];

const AGENT_PROMPT = `我用${productName}写自动化脚本。
请帮我写：打开「微信」，点搜索，输入「文件传输助手」，点进去，发送「你好」。`;

function Kbd({ children }: { children: string }) {
  return <code className="kbd">{children}</code>;
}

function faqLabel(text: string) {
  return (
    <span>
      <QuestionCircleOutlined style={{ color: 'var(--accent)', marginRight: 10 }} />
      {text}
    </span>
  );
}

const GUIDE_FAQ = [
  {
    key: 'vsix-market',
    label: faqLabel(`扩展视图里搜不到「${productName}」？`),
    children: (
      <p>
        正常。它目前通过 .vsix 文件安装，不会出现在 VS Code / Cursor 等扩展市场里。请用扩展视图右上角 ··· →
        「从 VSIX 安装」。
      </p>
    ),
  },
  {
    key: 'no-icon',
    label: faqLabel(`装完左侧没有${productName}图标？`),
    children: (
      <p>
        打开命令面板（<Kbd>Ctrl+Shift+P</Kbd> 或 Mac <Kbd>⌘⇧P</Kbd>），输入 Reload Window 并回车。
      </p>
    ),
  },
  {
    key: 'scan',
    label: faqLabel('扫描不到手机？'),
    children: (
      <p>
        手机已装被控端且在运行；电脑关掉 VPN；双方同一 Wi‑Fi。仍不行就手动添加 IP，端口填 65322。广域网需要在手机的远程调试页面打开，并填写授权码。
      </p>
    ),
  },
  {
    key: 'debug-env',
    label: faqLabel('配置调试环境失败？'),
    children: (
      <p>
        点卡片里的失败步骤看日志。常见原因是网络中断或工具链下载失败，点「重新检查」或再点一次「配置调试环境」。Windows 上装 C++ / Rust
        工具链会比较久，请等它走完。
      </p>
    ),
  },
  {
    key: 'no-script',
    label: faqLabel('编译成功了，手机上没有脚本？'),
    children: (
      <p>
        在构建列表里对该版本点「分享」或「发布」，再用手机端扫码 / 打开链接订阅。分享是这一版自己的链接，换版本链接也换；发布全项目只有一条链接，始终对应你设成发布的那个版本。
      </p>
    ),
  },
  {
    key: 'ai-ask',
    label: faqLabel('AI 只回文字，不改我的文件？'),
    children: (
      <p>
        对话多半还停在 Ask / Chat，那只回答、不改文件。VS Code 的 Copilot、以及 Cursor、Trae、Qoder 改成 Agent；CodeBuddy 改成 Craft 或 Plan；Devin Desktop 选 Devin Local 且不要用 Ask。同时还要打开{' '}
        <code>remotepro-toolkit</code>，否则它查不了文档，更容易空聊。
      </p>
    ),
  },
  {
    key: 'mcp',
    label: faqLabel('AI 让我先开启 MCP / remotepro-toolkit？'),
    children: (
      <p>
        正常。到编辑器设置里找「MCP」或「工具」，打开名字以 <code>remotepro-toolkit</code>{' '}
        开头的那一项。要先装好{productName}扩展并打开项目，这项才会出现。找不到就重载窗口再看一次。
      </p>
    ),
  },
  {
    key: 'vscode-agent',
    label: faqLabel('VS Code 能用 AI Agent 吗？'),
    children: (
      <p>
        可以。VS Code 自带 GitHub Copilot，对话里选 Agent 就能改文件。也可以另装 Cline 或 Claude Code。装好{productName}扩展后，记得打开 remotepro-toolkit。
      </p>
    ),
  },
];

function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="guide-steps">
      {steps.map((step, index) => (
        <li key={step.title}>
          <span className="guide-step-index">{index + 1}</span>
          <div>
            <strong>{step.title}</strong>
            <p>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function IdePanel({
  ide,
  vsixHref,
}: {
  ide: (typeof IDES)[number];
  vsixHref?: string;
}) {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform);
  const mod = isMac ? '⌘' : 'Ctrl';
  const shift = isMac ? '⇧' : 'Shift';

  return (
    <div className="guide-ide">
      <p className="guide-ide-blurb">{ide.blurb}</p>

      <h3>1. 安装 {ide.name}</h3>
      <p>
        打开官网下载并安装：{' '}
        <a href={ide.downloadUrl} target="_blank" rel="noopener noreferrer">
          {ide.downloadLabel}
        </a>
        。装好后从开始菜单或启动台打开它。
      </p>

      <h3>2. 下载{productName}扩展</h3>
      <p>
        点下面按钮下载 <code>.vsix</code> 文件。它不是安装包，下一步要把它装进 {ide.name}。
      </p>
      <p>
        <Button type="primary" href={vsixHref || '/#download'} icon={<DownloadOutlined />}>
          {vsixHref ? `下载${productName}扩展 (.vsix)` : '去首页下载扩展'}
        </Button>
      </p>

      <h3>3. 装进 {ide.name}</h3>
      <StepList
        steps={[
          {
            title: '打开扩展视图',
            body: `按 ${mod}+${shift}+X，或点左侧活动栏里像四块拼图的图标。`,
          },
          {
            title: '打开更多菜单',
            body: '看扩展视图顶部标题右侧的 ···（三个点），点开。',
          },
          {
            title: '选择从 VSIX 安装',
            body: '菜单里点「从 VSIX 安装...」或 Install from VSIX...，选出刚才下载的 .vsix 文件。',
          },
          {
            title: `看到${productName}图标就成功了`,
            body: `若提示「重新加载」，点它。左侧活动栏出现「${productName}」图标后，就可以往下跟着做了。`,
          },
        ]}
      />
    </div>
  );
}

export function GuidePage({ vsix }: { vsix: PlatformState }) {
  const vsixHref = vsix.latest?.url;
  const initialIde = useMemo(() => {
    const value = new URLSearchParams(window.location.search).get('ide');
    return parseIdeId(value) ?? 'vscode';
  }, []);
  const [ide, setIde] = useState<IdeId>(initialIde);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('ide', ide);
    window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
  }, [ide]);

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '');
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  return (
    <article className="guide">
      <header className="guide-hero">
        <p className="section-kicker">写给第一次用的同学</p>
        <h1>零基础也能写脚本</h1>
        <p className="guide-lead">
          把{productName}扩展装进 VS Code、Cursor、Trae 等编辑器，连上越狱 iPhone，就可以写自动化、边写边调试，再发布到手机。
          不会写代码也没关系：装好后用中文描述需求，让 AI Agent 帮你写。
        </p>
        <div className="guide-hero-actions">
          <Button type="primary" size="large" href="#install">
            开始安装
          </Button>
          <Button size="large" href="#agent" icon={<RobotOutlined />}>
            不会写代码？用 AI
          </Button>
          <Button size="large" href={vsixHref || '/#download'} icon={<DownloadOutlined />}>
            下载 .vsix 扩展
          </Button>
        </div>
      </header>

      <section className="guide-section" id="langs">
        <div className="section-head">
          <p className="section-kicker">写脚本</p>
          <h2>可以选哪些语言</h2>
          <p>新建项目时会让你选，不确定就先用 Python；10种语言都内置支持AI编程</p>
        </div>
        <div className="guide-lang-grid">
          {LANGUAGES.map((lang) => (
            <div className={`guide-lang${lang.name === 'Python' ? ' is-recommended' : ''}`} key={lang.name}>
              <strong>{lang.name}</strong>
              <span>{lang.hint}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="guide-section" id="prep">
        <div className="section-head">
          <p className="section-kicker">开始之前</p>
          <h2>先准备这 3 样</h2>
          <p>缺一样都连不上手机，建议先勾完再装扩展</p>
        </div>
        <div className="guide-prep">
          <article className="guide-card">
            <MobileOutlined />
            <h3>越狱 iPhone + 被控端</h3>
            <p>
              手机已越狱，并用 Sileo / Cydia 添加{' '}
              <a href="/#zone-client">{productName}软件源</a>
              ，装好被控端。手机保持亮屏、被控端在运行。
            </p>
          </article>
          <article className="guide-card">
            <DesktopOutlined />
            <h3>电脑和手机在一起</h3>
            <p>
              同一局域网（同一个 Wi‑Fi）点击扫描局域网最省事，也支持广域网并填设备上的授权码远程连。
            </p>
          </article>
          <article className="guide-card">
            <CodeOutlined />
            <h3>一个支持的编辑器</h3>
            <p>
              VS Code、Cursor、Trae、Qoder、CodeBuddy、Devin Desktop、Kiro 都可以。VS Code 用 Copilot 即可；国产的 Trae、Qoder、CodeBuddy 最省事，Cursor 使用体验最好。
            </p>
          </article>
        </div>
      </section>

      <section className="guide-section" id="install">
        <div className="section-head">
          <p className="section-kicker">按编辑器安装</p>
          <h2>把扩展装进你的 IDE</h2>
          <p>点下面的名字，只看你正在用的那一款。步骤都是「下载编辑器 → 下载 vsix → 从 VSIX 安装」</p>
        </div>
        <Tabs
          className="guide-ide-tabs"
          activeKey={ide}
          onChange={(key) => setIde(key as IdeId)}
          items={IDES.map((item) => ({
            key: item.id,
            label: (
              <span className="guide-ide-tab">
                {item.name}
                <small>{item.tag}</small>
              </span>
            ),
            children: <IdePanel ide={item} vsixHref={vsixHref} />,
          }))}
        />
      </section>

      <section className="guide-section" id="first-run">
        <div className="section-head">
          <p className="section-kicker">装好之后</p>
          <h2>跟着做一遍，跑通第一条脚本</h2>
          <p>下面这些操作在所有编辑器里都一样</p>
        </div>
        <div className="guide-flow">
          {FIRST_STEPS.map((step, index) => (
            <article className="guide-flow-item" key={step.title}>
              <div className="guide-flow-index">{index + 1}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <Alert
          className="guide-alert"
          type="info"
          showIcon
          message="容易漏的两点"
          description={
            <ul>
              <li>
                扫描不到设备：确认手机和电脑同一 Wi‑Fi，关闭电脑 VPN 再试。
              </li>
              <li>
                按 F5 没反应：先点「配置调试环境」等到「已就绪」。Swift / Objective-C 的本地调试只支持 Mac。
              </li>
            </ul>
          }
        />
      </section>

      <section className="guide-section" id="agent">
        <div className="section-head">
          <p className="section-kicker">不会写代码也行</p>
          <h2>用 AI Agent 帮你写脚本</h2>
          <p>模板已经能跑了。接下来用中文说要做什么，AI 自己查文档、改文件、检查有没有连上手机</p>
        </div>

        <div className="guide-prep">
          {AGENT_IDEAS.map((item) => (
            <article className="guide-card" key={item.title}>
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>

        <div className="guide-flow guide-flow-follow">
          {AGENT_STEPS.map((step, index) => (
            <article className="guide-flow-item" key={step.title}>
              <div className="guide-flow-index">{index + 1}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <h3 className="guide-subhead">第一次不知道说什么，复制这段</h3>
        <p className="guide-sublead">贴到对话窗口，把「微信」和后面的步骤改成你自己的 App 和流程即可。</p>
        <pre className="guide-prompt">{AGENT_PROMPT}</pre>

        <h3 className="guide-subhead">打开工具箱之后，AI 能帮你干什么</h3>
        <div className="guide-tool-grid guide-agent-can">
          {AGENT_CAN.map((item) => (
            <div key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.desc}</span>
            </div>
          ))}
        </div>

        <Alert
          className="guide-alert"
          type="info"
          showIcon
          message="跟 AI 说话的几个习惯"
          description={
            <ul>
              <li>一次只做一个功能，跑通再加下一步，比一次丢一整份需求更稳。</li>
              <li>说清 App 名字、从哪一页开始、要点哪个字或哪个按钮。越具体，点错的越少。</li>
              <li>AI 改完你先看一眼主文件，再按 F5。它偶尔会写偏，盯一眼比事后排查省事。</li>
              <li>
                新建项目时已经带了给 AI 看的说明（<code>AGENTS.md</code>
                ），不用自己配。你只要打开 Agent，并打开 remotepro-toolkit。
              </li>
            </ul>
          }
        />
      </section>

      <section className="guide-section" id="panels">
        <div className="section-head">
          <p className="section-kicker">侧栏说明</p>
          <h2>两个页签都干什么</h2>
        </div>
        <div className="guide-split">
          <article className="guide-card">
            <FolderOpenOutlined />
            <h3>编译部署</h3>
            <ul className="guide-bullets">
              <li>
                <strong>新建项目 / 重置项目</strong>：从模板生成工程；重置会回到模板默认内容。
              </li>
              <li>
                <strong>文档</strong>：打开 API 文档，查点击、滑动、截图等接口。
              </li>
              <li>
                <strong>登录</strong>：可选。登录后项目和构建能在多台电脑间同步。
              </li>
              <li>
                <strong>调试环境</strong>：一键安装 F5 调试需要的扩展和系统工具。
              </li>
              <li>
                <strong>开始编译</strong>：把代码交到云端编译，供手机使用。可勾选自动递增版本号、编译后自动发布。
              </li>
              <li>
                <strong>构建列表</strong>：历史版本。分享对应具体某一版，每版一条固定链接；发布全项目只有一条链接，指向你当前设的版本。
              </li>
            </ul>
          </article>
          <article className="guide-card">
            <ToolOutlined />
            <h3>设备管理</h3>
            <ul className="guide-bullets">
              <li>
                <strong>扫描局域网 / 刷新状态</strong>：找附近的被控端。
              </li>
              <li>
                <strong>手动添加</strong>：填 IP、端口；远程控制勾选「广域网」并填写手机「远程调试」页里的授权码。
              </li>
              <li>
                <strong>连接 / 断开</strong>：连上之后才能调试和用下面这些工具。
              </li>
            </ul>
            <div className="guide-tool-grid">
              {TOOLS.map((tool) => (
                <div key={tool.title}>
                  <strong>{tool.title}</strong>
                  <span>{tool.desc}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="guide-section" id="troubleshoot">
        <div className="section-head">
          <p className="section-kicker">卡住了</p>
          <h2>常见问题</h2>
        </div>
        <div className="faq-wrap">
          <Collapse
            items={GUIDE_FAQ}
            bordered={false}
            expandIconPosition="end"
            defaultActiveKey={GUIDE_FAQ.map((item) => item.key)}
          />
        </div>
      </section>

      <section className="guide-next">
        <CheckCircleOutlined className="guide-next-check" />
        <div>
          <h2>跑通之后做什么</h2>
          <p>
            对照文档写第一条真正业务脚本；也可以打开{' '}
            <a href="#agent">AI Agent</a>
            ，用中文描述流程让它写。
          </p>
        </div>
        <div className="guide-next-actions">
          <Button type="primary" size="large" href={DOCS_URL} target="_blank" icon={<BookOutlined />}>
            打开 API 文档
          </Button>
          <Button size="large" href="#agent" icon={<RobotOutlined />}>
            用 AI 写脚本
          </Button>
          <Button size="large" href="/#download" icon={<PlayCircleOutlined />}>
            返回下载页
          </Button>
        </div>
      </section>
    </article>
  );
}
