import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000, // Chạy trên cổng 3000
    open: true, // Tự động mở trình duyệt khi chạy
  },
  build: {
    outDir: 'dist', // Thư mục lưu file sau khi build
    sourcemap: true, // Tạo file sourcemap để debug
  },
  base: './', // Đảm bảo đường dẫn tĩnh hoạt động đúng trong trình duyệt
});
