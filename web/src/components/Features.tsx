import {
  AppstoreOutlined,
  FolderOpenOutlined,
  FontSizeOutlined,
  RocketOutlined,
  SwapOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const features = [
  {
    icon: <ThunderboltOutlined />,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.12)',
    title: '低延迟实时投屏',
    desc: '优化底层传输协议，支持 USB 直连、局域网 Wi‑Fi 与广域网远程连接，画面清晰流畅，操作响应毫秒级。',
  },
  {
    icon: <FontSizeOutlined />,
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.12)',
    title: '多语言输入体验',
    desc: (
      <>
        支持电脑键盘直接在手机输入框打字，支持各国语言文字，使用 <code className="kbd">Ctrl</code> +{' '}
        <code className="kbd">Space</code> 可快捷切换输入法。
      </>
    ),
  },
  {
    icon: <FolderOpenOutlined />,
    color: '#2dd4bf',
    bg: 'rgba(45, 212, 191, 0.12)',
    title: '全能文件管理',
    desc: '像管理电脑文件一样管理手机，上传下载等常用操作尽有尽有。',
  },
  {
    icon: <SwapOutlined />,
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.12)',
    title: '同步输入与粘贴',
    desc: '在电脑和手机间双向复制粘贴文本和图片，可一键同步粘贴到所有选中设备。',
  },
  {
    icon: <AppstoreOutlined />,
    color: '#f472b6',
    bg: 'rgba(244, 114, 182, 0.12)',
    title: '应用安装与卸载',
    desc: '拖入 IPA 文件即可批量安装应用，亦可一键卸载指定 App，极速部署业务环境。',
  },
  {
    icon: <RocketOutlined />,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.12)',
    title: '轻量省资源，多开也不卡',
    desc: '针对多连接场景优化系统开销，长时间投屏或同时管控多台设备体验都很丝滑。',
  },
];

const steps = [
  { title: '安装控制端', desc: '在 Windows / macOS / Android / iPhone 上下载并安装控制端。' },
  { title: '添加被控端源', desc: '在越狱 iPhone 的 Sileo 或 Cydia 中添加软件源，安装被控端。' },
  { title: '连接并群控', desc: '通过 USB、局域网或广域网连接设备，即可批量投屏与操作。' },
];

export function Features() {
  return (
    <>
      <section className="section">
        <div className="section-head">
          <h2>三步开始使用</h2>
          <p>从安装到连接，流程清晰直观</p>
        </div>
        <div className="steps">
          {steps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <div className="step-index">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="features" style={{ paddingTop: 12 }}>
        <div className="section-head">
          <h2>核心功能亮点</h2>
          <p>摒弃繁杂，专注于稳定连接与高效操作</p>
        </div>
        <div className="feature-grid">
          {features.map((item) => (
            <article className="feature-card" key={item.title}>
              <div className="feature-icon" style={{ color: item.color, background: item.bg }}>
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
