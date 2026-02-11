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
          bypass: (req) => {
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
          bypass: (req) => {
            const accept = req.headers && (req.headers.accept || '')
            if (req.method === 'GET' && typeof accept === 'string' && accept.includes('text/html')) {
              return '/index.html'
            }
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'tanstack-vendor': [
              '@tanstack/react-query',
              '@tanstack/react-router',
              '@tanstack/react-table',
            ],
            'radix-vendor': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-aspect-ratio',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-label',
              '@radix-ui/react-menubar',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip',
            ],
            charts: ['recharts'],
            leaflet: ['leaflet', 'react-leaflet', 'leaflet-defaulticon-compatibility'],
          },
        },
      },
    },
  }
})
