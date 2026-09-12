import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Windows / macOS 本地开发才走 Vite 代理；Ubuntu（生产与 Linux 开发）直连 Gitee。 */
const useGiteeDevProxy = process.platform !== 'linux';

const giteeProxy = {
  '/gitee-api': {
    target: 'https://gitee.com',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/gitee-api/, '/api/v5'),
  },
  '/gitee-page': {
    target: 'https://gitee.com',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/gitee-page/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    __GITEE_DEV_PROXY__: useGiteeDevProxy,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: useGiteeDevProxy ? giteeProxy : undefined,
  },
  preview: {
    proxy: useGiteeDevProxy ? giteeProxy : undefined,
  },
});
