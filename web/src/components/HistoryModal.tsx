import type { ReactNode } from 'react';
import { Button, Empty, Modal, Spin, Tabs } from 'antd';
import {
  AndroidOutlined,
  AppleOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  DownloadOutlined,
  WindowsOutlined,
} from '@ant-design/icons';
import type { HistoryItem, Platform, ReleasesMap } from '../api/releases';

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  releases: ReleasesMap;
}

function VersionList({ items, status }: { items: HistoryItem[]; status: ReleasesMap[Platform]['status'] }) {
  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <Spin />
      </div>
    );
  }
  if (status === 'error') {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="获取版本列表失败，请检查网络" />;
  }
  if (items.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无历史版本" />;
  }

  return (
    <div className="history-list">
      {items.map((item) => (
        <article className="history-item" key={`${item.version}-${item.url}`}>
          <div className="history-item-top">
            <strong>{item.version}</strong>
            <time>
              <ClockCircleOutlined style={{ marginRight: 6 }} />
              {item.date}
            </time>
          </div>
          <p>{item.description}</p>
          <div>
            <Button type="primary" ghost size="small" href={item.url} icon={<DownloadOutlined />}>
              下载此版本
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

const tabMeta: { key: Platform; label: string; icon: ReactNode }[] = [
  { key: 'win', label: 'Windows', icon: <WindowsOutlined /> },
  { key: 'mac', label: 'macOS', icon: <AppleOutlined /> },
  { key: 'android', label: 'Android', icon: <AndroidOutlined /> },
  { key: 'iphone', label: 'iPhone', icon: <AppstoreOutlined /> },
  { key: 'vsix', label: '脚本开发扩展', icon: <CodeOutlined /> },
];

export function HistoryModal({ open, onClose, releases }: HistoryModalProps) {
  return (
    <Modal
      title="历史版本下载"
      open={open}
      onCancel={onClose}
      footer={
        <Button onClick={onClose}>关闭</Button>
      }
      width={720}
      destroyOnClose
    >
      <p style={{ color: '#94a3b8', marginTop: -4, marginBottom: 16 }}>
        建议始终使用最新版本以获得最佳安全性和性能。
      </p>
      <Tabs
        items={tabMeta.map((tab) => ({
          key: tab.key,
          label: (
            <span>
              {tab.icon} {tab.label}
            </span>
          ),
          children: <VersionList items={releases[tab.key].history} status={releases[tab.key].status} />,
        }))}
      />
    </Modal>
  );
}
