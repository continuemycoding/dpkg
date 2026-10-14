import { Collapse, type CollapseProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { brand } from '../brand';

const items = [
  {
    key: 'jailbreak',
    label: 'iPhone 需要越狱、需要装被控端吗？',
    children: (
      <>
        <p className="faq-lead">iOS 18 及以上可以免越狱，且不用装被控端。</p>
        <p>
          免越狱由电脑上的控制端直接连接，仅支持 USB 与同一局域网，不支持广域网。用数据线连上手机、信任电脑，并在「设置 → 隐私与安全性」中开启开发者模式；同一局域网下，也可在控制中心的「屏幕镜像」里选择这台电脑。
        </p>
        <p>更低系统版本仍需越狱并安装被控端。越狱支持 iOS 13 – 26.0.1，任意越狱方式均可，并可使用广域网。</p>
      </>
    ),
  },
  {
    key: 'android',
    label: '安卓手机怎么接入？需要 Root 吗？',
    children: (
      <>
        <p className="faq-lead">不需要 Root，安装被控端即可接入；Root 后功能更全。</p>
        <p>
          在下载区找到 <a href="#zone-android-client">Android 被控端</a>，用安卓手机扫码或直接下载 APK 安装并保持运行，即可通过 USB、局域网或广域网连接控制端。
        </p>
      </>
    ),
  },
  {
    key: 'wan',
    label: '支持远程广域网控制吗？',
    children: (
      <p>
        安卓设备与越狱 iPhone 已支持。除 <em className="hl">USB</em> 与 <em className="hl">局域网</em> 外，还可使用{' '}
        <em className="hl">广域网</em> 跨网段、跨地域管理。免越狱的 iPhone 仅支持 USB 和同一局域网，不支持广域网。
      </p>
    ),
  },
  {
    key: 'pc',
    label: '对电脑配置有什么要求？',
    children: (
      <>
        <p>普通办公电脑即可。</p>
        <ul className="faq-list">
          <li>
            <strong>Windows</strong>：Win10 (1809+) 或 Win11
          </li>
          <li>
            <strong>Mac</strong>：macOS 13 及以上，支持 Intel 和 M 系列芯片
          </li>
        </ul>
      </>
    ),
  },
  {
    key: 'vsix',
    label: '脚本开发扩展怎么用？',
    children: (
      <p>
        从本站下载 <code>.vsix</code> 文件，在 VS Code、Cursor、Trae、Qoder、CodeBuddy 或 Kiro 里用「从 VSIX 安装」。详细步骤见{' '}
        <a href="/guide">脚本教程</a>；不会写代码可以看教程里的 <a href="/guide#agent">AI Agent 编程</a>。
      </p>
    ),
  },
];

export const faqExpandIcon: CollapseProps['expandIcon'] = ({ isActive }) => (
  <PlusOutlined className={`faq-icon${isActive ? ' is-open' : ''}`} />
);

export function FAQ() {
  const visibleItems = brand.showScripts ? items : items.filter((item) => item.key !== 'vsix');

  return (
    <section className="section" id="faq">
      <div className="container faq-layout">
        <div className="section-head is-left">
          <p className="section-kicker">常见问题</p>
          <h2>使用前的常见疑问</h2>
          <p>从越狱与 Root 要求、连接方式到电脑配置，这里整理了大家最常问的几个问题。</p>
        </div>
        <div className="faq-wrap">
          <Collapse
            items={visibleItems}
            bordered={false}
            expandIconPosition="end"
            expandIcon={faqExpandIcon}
            defaultActiveKey={[visibleItems[0].key]}
          />
        </div>
      </div>
    </section>
  );
}
