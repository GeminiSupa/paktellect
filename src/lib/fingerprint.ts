import FingerprintJS from "@fingerprintjs/fingerprintjs"

const STORAGE_KEY = "paktellect_device_id_v1"
const LOAD_TIMEOUT_MS = 3500

function stableFallback(): string {
  if (typeof window === "undefined") return "ssr"
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY)
    if (existing) return existing
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `local-${crypto.randomUUID()}`
        : `local-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
    sessionStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    return `local-${Date.now()}`
  }
}

/**
 * Best-effort visitor id for analytics / metadata. Never blocks auth flows:
 * uses session cache, then a short timeout around FingerprintJS (often blocked
 * by privacy extensions or slow CDNs), then a stable per-tab fallback.
 */
export async function getDeviceId(): Promise<string> {
  if (typeof window === "undefined") return "ssr"

  try {
    const cached = sessionStorage.getItem(STORAGE_KEY)
    if (cached) return cached
  } catch {
    /* ignore */
  }

  try {
    const result = await Promise.race([
      (async () => {
        const fp = await FingerprintJS.load({ monitoring: false })
        return fp.get()
      })(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("fingerprint-timeout")), LOAD_TIMEOUT_MS)
      }),
    ])
    const id = result.visitorId
    try {
      sessionStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
    return id
  } catch (err) {
    console.warn("[getDeviceId] fingerprint unavailable, using fallback:", err)
    return stableFallback()
  }
}
