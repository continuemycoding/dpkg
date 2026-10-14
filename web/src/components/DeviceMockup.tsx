import type { CSSProperties } from 'react';
import { ThunderboltFilled } from '@ant-design/icons';
import { brand } from '../brand';

type ScreenKind = 'chat' | 'apps' | 'feed' | 'list';

const PHONES: { kind: ScreenKind; selected?: boolean }[] = [
  { kind: 'chat', selected: true },
  { kind: 'apps' },
  { kind: 'feed' },
  { kind: 'list' },
  { kind: 'apps' },
  { kind: 'feed' },
  { kind: 'list' },
  { kind: 'chat' },
];

const DEVICES = ['iPhone 15 Pro', 'Android 01', 'iPhone 14', 'Android 02', 'iPhone 13', 'Android 03'];

function Screen({ kind }: { kind: ScreenKind }) {
  switch (kind) {
    case 'chat':
      return (
        <div className="ms ms-chat">
          {[0, 1, 2, 3, 4].map((i) => (
            <div className="ms-row" key={i}>
              <i className="ms-avatar" />
              <span className="ms-lines">
                <b style={{ width: `${70 - i * 8}%` }} />
                <b />
              </span>
            </div>
          ))}
        </div>
      );
    case 'apps':
      return (
        <div className="ms ms-apps">
          {Array.from({ length: 16 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      );
    case 'feed':
      return (
        <div className="ms ms-feed">
          <div className="ms-hero" />
          <span className="ms-lines">
            <b style={{ width: '80%' }} />
            <b style={{ width: '55%' }} />
          </span>
          <div className="ms-hero ms-hero-sm" />
        </div>
      );
    default:
      return (
        <div className="ms ms-list">
          <div className="ms-search" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div className="ms-cell" key={i}>
              <b style={{ width: `${60 - (i % 3) * 10}%` }} />
              <i />
            </div>
          ))}
        </div>
      );
  }
}

/** 首屏产品示意图：电脑控制端同时投屏 / 操作多台 iPhone */
export function DeviceMockup() {
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-glow" />
      <div className="mock-window">
        <div className="mock-titlebar">
          <span className="mock-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="mock-title">{brand.name}</span>
          <span className="mock-pill">
            <i className="mock-live" />8 台在线
          </span>
        </div>
        <div className="mock-body">
          <aside className="mock-side">
            <p>设备</p>
            {DEVICES.map((name, index) => (
              <div className={`mock-device${index === 0 ? ' is-active' : ''}`} key={name}>
                <i />
                <span>{name}</span>
              </div>
            ))}
          </aside>
          <div className="mock-grid">
            {PHONES.map((phone, index) => (
              <div
                className={`mock-phone${phone.selected ? ' is-selected' : ''}`}
                key={index}
                style={{ '--d': `${index * 40}ms` } as CSSProperties}
              >
                <div className="mock-notch" />
                <Screen kind={phone.kind} />
                <span className="mock-tap" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mock-float mock-float-sync">
        <ThunderboltFilled />
        <span>
          <strong>同步操作</strong>
          <small>一次点击，全部执行</small>
        </span>
      </div>
      <div className="mock-float mock-float-latency">
        <span className="mock-meter">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>
          <strong>低延迟</strong>
          <small>USB · 局域网 · 广域网</small>
        </span>
      </div>
    </div>
  );
}
