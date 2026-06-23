import mixpanel from 'mixpanel-browser'

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

let initialized = false

function ensureInit() {
  if (initialized || !token || typeof window === 'undefined') return
  mixpanel.init(token, { track_pageview: true, persistence: 'localStorage' })
  initialized = true
}

export function track(event: string, props?: Record<string, unknown>) {
  ensureInit()
  if (!initialized) return
  mixpanel.track(event, props)
}
