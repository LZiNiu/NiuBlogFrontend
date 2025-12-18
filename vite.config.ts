import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// icon 插件
import Icons from "unplugin-icons/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    AutoImport({
      imports: ["vue", "vue-router"],
      resolvers: [ElementPlusResolver()],
      dts: "./auto-imports.d.ts",
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    Icons({
      compiler: "vue3", // 指定编译器
      autoInstall: true, // 自动安装
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    host: "127.0.0.1",
    port: 8080,
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1'),
      },
    },
  },
});
