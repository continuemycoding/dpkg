import { useEffect, useState } from 'react';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { appTheme } from './theme';
import { useReleases } from './hooks/useReleases';
import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { DownloadSection } from './components/DownloadSection';
import { Features } from './components/Features';
import { FAQ } from './components/FAQ';
import { SiteFooter, type LegalType } from './components/SiteFooter';
import { HistoryModal } from './components/HistoryModal';
import { LegalModals } from './components/LegalModals';
import { GuidePage } from './components/GuidePage';
import './App.css';

const HOME_TITLE = '远控Pro - 专业iOS越狱群控系统 (Win/Mac)';
const GUIDE_TITLE = '使用教程 - 远控Pro脚本开发扩展';

function isGuidePath(pathname: string): boolean {
  return pathname.replace(/\/+$/, '') === '/guide';
}

function HomePage() {
  const releases = useReleases();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [legal, setLegal] = useState<LegalType | null>(null);

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '');
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  return (
    <div className="page">
      <div className="page-bg" />
      <div className="page-inner">
        <SiteHeader page="home" />
        <main className="container">
          <Hero vsix={releases.vsix} />
          <DownloadSection releases={releases} onOpenHistory={() => setHistoryOpen(true)} />
          <Features />
          <FAQ />
        </main>
        <SiteFooter onOpenLegal={setLegal} />
      </div>
      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} releases={releases} />
      <LegalModals type={legal} onClose={() => setLegal(null)} />
    </div>
  );
}

function GuideRoute() {
  const releases = useReleases();
  const [legal, setLegal] = useState<LegalType | null>(null);

  return (
    <div className="page">
      <div className="page-bg" />
      <div className="page-inner">
        <SiteHeader page="guide" />
        <main className="container">
          <GuidePage vsix={releases.vsix} />
        </main>
        <SiteFooter onOpenLegal={setLegal} />
      </div>
      <LegalModals type={legal} onClose={() => setLegal(null)} />
    </div>
  );
}

export default function App() {
  const guide = isGuidePath(window.location.pathname);

  useEffect(() => {
    document.title = guide ? GUIDE_TITLE : HOME_TITLE;
  }, [guide]);

  return (
    <ConfigProvider theme={appTheme} locale={zhCN}>
      <AntdApp>
        {guide ? <GuideRoute /> : <HomePage />}
      </AntdApp>
    </ConfigProvider>
  );
}
