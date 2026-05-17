import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env variables (including non-VITE_ ones) for use in this config file.
  // The third argument "" removes the VITE_ prefix restriction so all vars are available.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      svgr(),
    ],
    server: {
      port: Number(env.VITE_DEV_PORT) || 3000,
    },
  };
});
