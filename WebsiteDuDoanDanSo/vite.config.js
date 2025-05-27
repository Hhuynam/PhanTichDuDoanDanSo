import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  server: {
    // Cấu hình cổng 5002
    port: 5002,
    // Cho phép CORS
    cors: true, 
  },
  // Plugin react giúp chuyển đổi mã React khi chạy trên Vite
  plugins: [react()],
})