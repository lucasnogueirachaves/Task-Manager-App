import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Em desenvolvimento, tudo que o front chama em /api é repassado para o Fastify
// (sem o prefixo /api). Assim não é preciso configurar CORS no backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3333",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
