function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Copy .env.example to .env.local and fill it in.`,
    )
  }
  return value
}

const configuredBaseUrl = required(
  'VITE_APM_API_BASE_URL',
  import.meta.env.VITE_APM_API_BASE_URL,
)

export const env = {
  // Dev: same-origin, proxied by Vite (see vite.config.ts) so the browser never has to
  // trust the pilot server's self-signed cert. Prod: the real on-prem API origin.
  apiBaseUrl: import.meta.env.DEV ? '' : configuredBaseUrl,
  readToken: required('VITE_APM_READ_TOKEN', import.meta.env.VITE_APM_READ_TOKEN),
}
