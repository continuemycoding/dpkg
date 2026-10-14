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
    title: '低延迟实时投屏',
    desc: '优化底层传输协议，画面清晰流畅，操作响应毫秒级。免越狱支持 USB 直连与同一局域网；安卓与越狱设备还可广域网远程连接。',
  },
  {
    icon: <SwapOutlined />,
    title: '同步输入与粘贴',
    desc: '在电脑和手机间双向复制粘贴文本和图片，可一键同步粘贴到所有选中设备。',
  },
  {
    icon: <FontSizeOutlined />,
    title: '多语言输入体验',
    desc: (
      <>
        用电脑键盘直接在手机输入框打字，支持各国语言文字，<kbd className="kbd">Ctrl</kbd> +{' '}
        <kbd className="kbd">Space</kbd> 快捷切换输入法。
      </>
    ),
  },
  {
    icon: <AppstoreOutlined />,
    title: '应用安装与卸载',
    desc: '拖入 IPA 文件即可批量安装应用，也能一键卸载指定 App，快速部署业务环境。',
  },
  {
    icon: <FolderOpenOutlined />,
    title: '全能文件管理',
    desc: '像管理电脑文件一样管理手机，上传、下载等常用操作应有尽有。',
  },
  {
    icon: <RocketOutlined />,
    title: '轻量省资源',
    desc: '针对多连接场景优化系统开销，长时间投屏或同时管控多台设备也依旧流畅。',
  },
];

const steps = [
  { title: '安装控制端', desc: '在 Windows、macOS、Android 或 iPhone 上下载并安装控制端。' },
  {
    title: '准备手机',
    desc: 'iOS 18 及以上免越狱，无需安装被控端。安卓手机下载安装被控端 APK；越狱 iPhone 在 Sileo 或 Cydia 中添加软件源安装被控端。',
  },
  { title: '连接并群控', desc: '通过 USB 或同一局域网连接，安卓与越狱设备还可使用广域网，即可批量投屏与操作。' },
];

export function Features() {
  return (
    <>
      <section className="section" id="features">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">产品功能</p>
            <h2>专注稳定连接与高效操作</h2>
            <p>摒弃繁杂，把常用的群控能力做到顺手</p>
          </div>
          <div className="feature-grid">
            {features.map((item) => (
              <article className="feature-card" key={item.title}>
                <div className="feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="start">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">快速上手</p>
            <h2>三步开始使用</h2>
            <p>从安装到连接，几分钟就能完成</p>
          </div>
          <ol className="steps">
            {steps.map((step, index) => (
              <li className="step" key={step.title}>
                <span className="step-index">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
