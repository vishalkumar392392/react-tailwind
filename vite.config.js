/// <reference types="vitest" />
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

  // React Compiler injects memoization branches that no test can hit —
  // skip it in test mode so coverage reflects real source branches only.
  const isTest = mode === "test";

  return {
    plugins: [
      react(),
      ...(isTest ? [] : [babel({ presets: [reactCompilerPreset()] })]),
      tailwindcss(),
      svgr(),
    ],
    server: {
      port: Number(env.VITE_DEV_PORT) || 3000,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.js"],
      css: false,
      coverage: {
        provider: "istanbul",
        reporter: ["text", "text-summary", "lcov", "html"],
        reportsDirectory: "./coverage",
        include: ["src/**/*.{js,jsx}"],
        exclude: [
          "src/main.jsx",
          "src/**/*.test.{js,jsx}",
          "src/test/**",
          "src/assets/**",
        ],
        thresholds: {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
      },
    },
  };
});
