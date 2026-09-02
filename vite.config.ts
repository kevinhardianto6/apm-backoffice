import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    server: {
      // ── DEV-ONLY WORKAROUND, not required infrastructure ──────────────────────
      // The pilot server (README-pilot-api.md) is self-signed TLS, and this project's
      // sandboxed preview browser refuses that cert with no click-through option.
      // Proxying same-origin sidesteps that: `secure: false` skips cert verification
      // on the Node side instead of asking a browser to trust it. A real browser (your
      // own Chrome, after trusting the cert once like the Simulator step in
      // README-pilot-api.md) doesn't need this at all and can hit the pilot server
      // directly. The PRODUCTION BUILD ignores this section entirely and always talks
      // to VITE_APM_API_BASE_URL directly — see src/config/env.ts.
      proxy: {
        '/v1': { target: env.VITE_APM_API_BASE_URL, changeOrigin: true, secure: false },
        '/health': { target: env.VITE_APM_API_BASE_URL, changeOrigin: true, secure: false },
      },
    },
  }
})
