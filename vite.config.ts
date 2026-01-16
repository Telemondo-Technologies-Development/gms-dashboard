import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:8080'

  return {
    plugins: [
      devtools(),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      viteReact(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          // Serve index.html for browser GET navigation requests instead of proxying
          bypass: (req, res) => {
            const accept = req.headers && (req.headers.accept || '')
            if (req.method === 'GET' && typeof accept === 'string' && accept.includes('text/html')) {
              return '/index.html'
            }
          },
        },
        '/auth': {
          target: apiTarget,
          changeOrigin: true,
          // Only proxy non-GET requests; allow client-side routing for GET
          bypass: (req, res) => {
            const accept = req.headers && (req.headers.accept || '')
            if (req.method === 'GET' && typeof accept === 'string' && accept.includes('text/html')) {
              return '/index.html'
            }
          },
        },
      },
    },
  }
})
