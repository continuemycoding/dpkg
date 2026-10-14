import { useMemo } from 'react';
import { ApiOutlined, ArrowDownOutlined, ArrowRightOutlined, CheckCircleFilled, DownloadOutlined } from '@ant-design/icons';
import type { ReleasesMap } from '../api/releases';
import { brand } from '../brand';
import { detectPlatform, PLATFORM_LABEL } from '../platform';
import { DeviceMockup } from './DeviceMockup';

const HIGHLIGHTS = [
  'iOS 18+ 免越狱，无需安装被控端',
  '安卓免 Root 可用，Root 后功能更全',
  'USB / 局域网 / 广域网多种连接',
  'Windows · macOS · 手机多端控制',
];

export function Hero({ releases }: { releases: ReleasesMap }) {
  const platform = useMemo(() => detectPlatform(), []);
  const recommended = platform ? releases[platform].latest : null;

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <a className="hero-badge" href="#zone-android-client">
            <span className="tag-new">新</span>
            已支持 Android 被控端
            <ArrowRightOutlined />
          </a>
          <h1>
            批量投屏与群控
            <span className="hero-h1-accent">一屏掌控 iPhone 与安卓</span>
          </h1>
          <p className="hero-lead">
            iOS 18 及以上免越狱，无需安装被控端，USB 或局域网直连即可使用；安卓手机与越狱 iPhone 安装被控端后，还能通过广域网远程控制。
          </p>
          <div className="hero-actions">
            {platform && recommended ? (
              <a className="btn btn-primary btn-lg" href={recommended.url}>
                <DownloadOutlined />
                {platform === 'android' ? '下载 Android 控制端' : `下载 ${PLATFORM_LABEL[platform]} 版`}
              </a>
            ) : (
              <a className="btn btn-primary btn-lg" href="#download">
                <DownloadOutlined />
                立即下载
              </a>
            )}
            {brand.docsUrl ? (
              <a className="btn btn-ghost btn-lg" href={brand.docsUrl} target="_blank" rel="noopener noreferrer">
                <ApiOutlined />
                API 文档
              </a>
            ) : (
              <a className="btn btn-ghost btn-lg" href="#features">
                了解功能
              </a>
            )}
          </div>
          <p className="hero-meta">
            {platform && recommended ? (
              <>
                版本 {recommended.version}
                <span aria-hidden="true"> · </span>
                {platform === 'android' ? (
                  <a href="#zone-android-client">
                    要装被控端？ <ArrowDownOutlined />
                  </a>
                ) : (
                  <a href="#download">
                    其他平台 <ArrowDownOutlined />
                  </a>
                )}
              </>
            ) : (
              '支持 Windows、macOS、Android 与 iPhone'
            )}
          </p>
          <ul className="hero-highlights">
            {HIGHLIGHTS.map((item) => (
              <li key={item}>
                <CheckCircleFilled />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <DeviceMockup />
      </div>
    </section>
  );
}
