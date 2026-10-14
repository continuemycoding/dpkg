/** 品牌图标：一块屏幕带出多台手机，示意“一控多” */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none">
        <rect x="5" y="8" width="15" height="11" rx="2.2" stroke="currentColor" strokeWidth="2" />
        <path d="M10 23h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="19" y="12" width="8" height="13" rx="2" fill="currentColor" />
        <rect x="21.6" y="22" width="2.8" height="1.2" rx="0.6" fill="var(--brand-mark-bg)" />
      </svg>
    </span>
  );
}
