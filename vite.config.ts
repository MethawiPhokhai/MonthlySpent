/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/MonthlySpent/',
  server: { port: Number(process.env.PORT) || 5173 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
