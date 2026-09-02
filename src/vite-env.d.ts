/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APM_API_BASE_URL: string
  readonly VITE_APM_READ_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
