import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/v1'으로 시작하는 모든 요청을 처리
      '/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // 만약 서버 주소에 /v1이 없다면 아래 주석을 해제하세요.
        // rewrite: (path) => path.replace(/^\/v1/, ''), 
      },
    },
  },
});