import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});

// Було
// export default defineConfig({
//   plugins: [react()],
// })

// 👀 варіант — тесту бекенд на Render, а фронт — локально.
// export default defineConfig({
//   server: {
//     https: true, // фронт працює по HTTPS
//     port: 5173,
//   },
//   plugins: [react()],
// });
