import { Collapse } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { brand } from '../brand';

const items = [
  {
    key: 'jailbreak',
    label: (
      <span>
        <QuestionCircleOutlined style={{ color: 'var(--accent)', marginRight: 10 }} />
        手机需要越狱、需要装被控端吗？
      </span>
    ),
    children: (
      <p>
        <strong style={{ color: 'var(--gold)' }}>iOS 18 及以上可以免越狱，且不用装被控端。</strong>
        <br />
        免越狱由电脑上的控制端直接连接，无需安装被控端，仅支持 USB 与同一局域网，不支持广域网。用数据线连上手机，信任电脑，并在「设置 → 隐私与安全性」中开启开发者模式；同一局域网下，也可在控制中心的「屏幕镜像」里选择这台电脑。
        <br />
        更低系统版本仍需越狱并安装被控端。越狱支持 iOS 13 – 26.0.1，任意越狱方式均可，并可使用广域网。
      </p>
    ),
  },
  {
    key: 'wan',
    label: (
      <span>
        <QuestionCircleOutlined style={{ color: 'var(--accent)', marginRight: 10 }} />
        支持远程广域网控制吗？
      </span>
    ),
    children: (
      <p>
        越狱设备已支持。除 <span style={{ color: 'var(--accent)', fontWeight: 600 }}>USB</span> 与{' '}
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>局域网</span> 外，可使用{' '}
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>广域网</span> 跨网段、跨地域管理。
        <br />
        免越狱仅支持 USB 和同一局域网，不支持广域网。
      </p>
    ),
  },
  {
    key: 'pc',
    label: (
      <span>
        <QuestionCircleOutlined style={{ color: 'var(--accent)', marginRight: 10 }} />
        对电脑配置有什么要求？
      </span>
    ),
    children: (
      <p>
        普通办公电脑即可。
        <br />
        Windows：Win10 (1809+) 或 Win11 系统。
        <br />
        Mac：macOS 13 及以上版本，支持 Intel 和 M 系列芯片。
      </p>
    ),
  },
  {
    key: 'vsix',
    label: (
      <span>
        <QuestionCircleOutlined style={{ color: 'var(--accent)', marginRight: 10 }} />
        脚本开发扩展怎么用？
      </span>
    ),
    children: (
      <p>
        从本站下载 <span style={{ color: 'var(--accent)', fontWeight: 600 }}>.vsix</span> 文件，在 VS Code、Cursor、Trae、Qoder、CodeBuddy 或 Kiro 里用「从 VSIX 安装」。
        <br />
        详细逐步说明见{' '}
        <a href="/guide" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          脚本教程
        </a>
        。不会写代码可以看教程里的{' '}
        <a href="/guide#agent" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          AI Agent 编程
        </a>
        。
      </p>
    ),
  },
];

export function FAQ() {
  const visibleItems = brand.showScripts ? items : items.filter((item) => item.key !== 'vsix');

  return (
    <section className="section" id="faq">
      <div className="section-head">
        <p className="section-kicker">使用须知</p>
        <h2>常见问题</h2>
        <p>使用前的常见疑问解答</p>
      </div>
      <div className="faq-wrap">
        <Collapse
          items={visibleItems}
          bordered={false}
          expandIconPosition="end"
          defaultActiveKey={visibleItems.map((item) => item.key)}
        />
      </div>
    </section>
  );
}
