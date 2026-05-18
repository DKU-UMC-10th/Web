import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 🥊 1. 최신 테일윈드 v4 플러그인 가져오기

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 🥊 2. 여기에 플러그인을 무조건 꽂아줘야 테일윈드가 켜집니다!
  ],
  server: {
    proxy: {
      // 7주차에서 쓰시던 백엔드 프록시 설정 완벽 유지!
      '/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});