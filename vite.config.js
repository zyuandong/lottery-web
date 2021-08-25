import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from 'path';

const pathResolve = (dir) => {
  return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    hmr: true,
    port: 3001,
    open: false,
    proxy: {
      "/lottery_service_api": {
        target: "http://192.168.22.14:3000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lottery_service_api/, '')
      }
    },
  },
  resolve: {
    alias: {
      '@': pathResolve('./src')
    }
  }
});
