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
import { ModuleNav } from './components/ModuleNav';
import { GUIDE_MODULES, HOME_MODULES } from './nav/modules';
import { brand } from './brand';
import './App.css';

const HOME_TITLE = `${brand.name} - 专业iOS越狱群控系统 (Win/Mac)`;
const GUIDE_TITLE = `脚本教程 - ${brand.name}脚本开发扩展`;
const HOME_DESCRIPTION = `${brand.name}：专业级 iOS 越狱设备批量投屏与群控，支持 USB、局域网与广域网连接。`;

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
        <SiteHeader page="home" modules={HOME_MODULES} />
        <div className="page-shell">
          <ModuleNav modules={HOME_MODULES} />
          <main>
            <Hero />
            <DownloadSection releases={releases} onOpenHistory={() => setHistoryOpen(true)} />
            <Features />
            <FAQ />
          </main>
        </div>
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
        <SiteHeader page="guide" modules={GUIDE_MODULES} />
        <div className="page-shell">
          <ModuleNav modules={GUIDE_MODULES} />
          <main>
            <GuidePage vsix={releases.vsix} />
          </main>
        </div>
        <SiteFooter onOpenLegal={setLegal} />
      </div>
      <LegalModals type={legal} onClose={() => setLegal(null)} />
    </div>
  );
}

export default function App() {
  const guide = brand.showScripts && isGuidePath(window.location.pathname);

  useEffect(() => {
    if (!brand.showScripts && isGuidePath(window.location.pathname)) {
      window.history.replaceState({}, '', `/${window.location.hash}`);
    }
  }, []);

  useEffect(() => {
    document.title = guide ? GUIDE_TITLE : HOME_TITLE;
    document.querySelector('meta[name="description"]')?.setAttribute('content', HOME_DESCRIPTION);
  }, [guide]);

  return (
    <ConfigProvider theme={appTheme} locale={zhCN}>
      <AntdApp>
        {guide ? <GuideRoute /> : <HomePage />}
      </AntdApp>
    </ConfigProvider>
  );
}
