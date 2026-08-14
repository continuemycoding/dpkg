import type { ReactNode } from 'react';
import { Modal } from 'antd';
import { FileProtectOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons';
import type { LegalType } from './SiteFooter';

interface LegalModalsProps {
  type: LegalType | null;
  onClose: () => void;
}

const content: Record<
  LegalType,
  { title: string; icon: ReactNode; okText: string; body: ReactNode }
> = {
  about: {
    title: '关于我们',
    icon: <TeamOutlined />,
    okText: '关闭',
    body: (
      <>
        <p>
          <strong>远控Pro</strong>是一支专注于移动设备自动化管理与群控技术的极客团队。我们致力于为应用测试、游戏工作室及设备运维人员提供最高效的 iOS 管理方案。
        </p>
        <p>我们的愿景是打破 iOS 系统封闭性的限制，通过合法的越狱技术，让设备管理变得像操作电脑一样简单直观。</p>
      </>
    ),
  },
  terms: {
    title: '使用协议',
    icon: <FileProtectOutlined />,
    okText: '我已阅读并同意',
    body: (
      <>
        <p>欢迎使用远控Pro。请您仔细阅读以下条款，使用本软件即表示您同意受本协议约束。</p>
        <h4>1. 授权范围</h4>
        <p>本软件授予您非排他性的、不可转让的许可，仅供您在个人或企业内部的合法设备上安装和使用。严禁对本软件进行反向工程、反编译或破解。</p>
        <h4>2. 合法使用承诺</h4>
        <p>
          您承诺仅将本软件用于合法的测试、管理或运维目的。
          <strong>严禁将本软件用于网络诈骗、流量劫持、非法攻击或其他违反当地法律法规的行为。</strong>
          若发现违规行为，我们将立即终止服务并配合执法部门调查。
        </p>
        <h4>3. 越狱风险提示</h4>
        <p>本软件依赖于 iOS 越狱环境运行。您知悉并同意：越狱可能会导致设备保修失效或系统不稳定。由此产生的设备损坏或数据丢失风险由用户自行承担。</p>
        <h4>4. 免责声明</h4>
        <p>本软件按“现状”提供，不提供任何明示或暗示的保证。对于因使用本软件造成的任何间接损失（包括但不限于利润损失、业务中断），开发团队不承担赔偿责任。</p>
      </>
    ),
  },
  privacy: {
    title: '隐私政策',
    icon: <SafetyCertificateOutlined />,
    okText: '理解并关闭',
    body: (
      <>
        <p>远控Pro高度重视您的隐私安全。本软件以本地与点对点连接为主，我们在数据处理上遵循“本地优先、最小必要”原则。</p>
        <h4>1. 数据传输机制</h4>
        <p>
          本软件的核心功能（投屏画面、触控指令、文件传输）可通过 <strong>USB、局域网 (LAN)</strong> 或您启用的{' '}
          <strong>广域网</strong> 链路与对端设备通信。USB 与典型局域网场景下多为直连；广域网模式下数据经互联网在您的设备之间传输。
          <strong>我们不会</strong>通过自有云端转发或存储您的投屏画面，也无法查看您的屏幕内容。
        </p>
        <h4>2. 我们收集的信息</h4>
        <ul>
          <li>
            <strong>授权验证信息：</strong>仅收集设备的 UDID 或序列号用于验证软件授权状态。
          </li>
          <li>
            <strong>崩溃日志：</strong>经您同意发送的程序错误日志，用于修复 Bug。
          </li>
        </ul>
        <h4>3. 权限调用</h4>
        <p>
          电脑端需要访问您的网络权限（用于连接手机）和文件读写权限（用于传输文件）。手机端越狱插件需要 Root 权限以实现底层控制，但不会窃取您的通讯录、相册等隐私数据。
        </p>
        <h4>4. 第三方服务</h4>
        <p>本网站及软件不包含任何第三方广告 SDK，也不会将您的任何信息出售给第三方。</p>
      </>
    ),
  },
};

export function LegalModals({ type, onClose }: LegalModalsProps) {
  const current = type ? content[type] : null;

  return (
    <Modal
      title={
        current ? (
          <span>
            {current.icon} {current.title}
          </span>
        ) : null
      }
      open={Boolean(type)}
      onCancel={onClose}
      onOk={onClose}
      okText={current?.okText ?? '关闭'}
      cancelButtonProps={{ style: { display: 'none' } }}
      width={640}
    >
      <div className="legal-body">{current?.body}</div>
    </Modal>
  );
}
