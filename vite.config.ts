import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
 /* server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/thegoldenbook-rest-api/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), 
      },
    },
  },*/
  plugins: [react()],
});



