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
        target: "http://localhost:3000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lettory_service_api/, '')
      }
    },
  },
  resolve: {
    alias: {
      '@': pathResolve('./src')
    }
  }
});
