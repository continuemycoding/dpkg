import { useState } from 'react';
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
import './App.css';

function HomePage() {
  const releases = useReleases();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [legal, setLegal] = useState<LegalType | null>(null);

  return (
    <div className="page">
      <div className="page-bg" />
      <div className="page-inner">
        <SiteHeader />
        <main className="container">
          <Hero />
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

export default function App() {
  return (
    <ConfigProvider theme={appTheme} locale={zhCN}>
      <AntdApp>
        <HomePage />
      </AntdApp>
    </ConfigProvider>
  );
}
