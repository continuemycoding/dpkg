import { Collapse } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const items = [
  {
    key: 'jailbreak',
    label: (
      <span>
        <QuestionCircleOutlined style={{ color: '#60a5fa', marginRight: 10 }} />
        被控端手机需要越狱吗？
      </span>
    ),
    children: (
      <p>
        <strong style={{ color: '#fbbf24' }}>是的，必须越狱。</strong>
        <br />
        暂不支持免越狱控制，越狱设备的控制体验更佳，免越狱的支持还在计划中。
      </p>
    ),
  },
  {
    key: 'wan',
    label: (
      <span>
        <QuestionCircleOutlined style={{ color: '#60a5fa', marginRight: 10 }} />
        支持远程广域网控制吗？
      </span>
    ),
    children: (
      <p>
        已支持。除 <span style={{ color: '#60a5fa', fontWeight: 600 }}>USB</span> 与{' '}
        <span style={{ color: '#60a5fa', fontWeight: 600 }}>局域网</span> 外，亦可使用{' '}
        <span style={{ color: '#60a5fa', fontWeight: 600 }}>广域网</span> 远程连接，跨网段、跨地域管理设备。
      </p>
    ),
  },
  {
    key: 'pc',
    label: (
      <span>
        <QuestionCircleOutlined style={{ color: '#60a5fa', marginRight: 10 }} />
        对电脑配置有什么要求？
      </span>
    ),
    children: (
      <p>
        普通办公电脑即可。
        <br />
        Windows：Win10 (1809+) 或 Win11 系统。
        <br />
        Mac：macOS 12 及以上版本，支持 Intel 和 M 系列芯片。
      </p>
    ),
  },
  {
    key: 'vsix',
    label: (
      <span>
        <QuestionCircleOutlined style={{ color: '#60a5fa', marginRight: 10 }} />
        脚本开发扩展怎么用？
      </span>
    ),
    children: (
      <p>
        从本站下载 <span style={{ color: '#c4b5fd', fontWeight: 600 }}>.vsix</span> 文件，在 VS Code、Cursor、Trae、Qoder、Windsurf 或 Kiro 里用「从 VSIX 安装」。
        <br />
        详细逐步说明见{' '}
        <a href="/guide" style={{ color: '#93c5fd', fontWeight: 600 }}>
          脚本教程
        </a>
        。不会写代码可以看教程里的{' '}
        <a href="/guide#agent" style={{ color: '#93c5fd', fontWeight: 600 }}>
          AI Agent 编程
        </a>
        。
      </p>
    ),
  },
];

export function FAQ() {
  return (
    <section className="section" id="faq">
      <div className="section-head">
        <p className="section-kicker">使用须知</p>
        <h2>常见问题</h2>
        <p>使用前的常见疑问解答</p>
      </div>
      <div className="faq-wrap">
        <Collapse accordion items={items} bordered={false} expandIconPosition="end" />
      </div>
    </section>
  );
}
