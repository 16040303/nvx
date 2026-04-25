'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export type PlatformId =
  | 'facebook'
  | 'zalo-oa'
  | 'instagram'
  | 'whatsapp'
  | 'wechat'
  | 'telegram'
  | 'line'
  | 'viber'
  | 'tiktok'
  | 'lazada'
  | 'shopee'
  | 'booking'
  | 'agoda'
  | 'traveloka'
  | 'expedia'
  | 'email'
  | 'sms'
  | 'google-business'
  | 'discord'

type ConnectedLabelType = 'trang' | 'shop' | 'tài khoản'
type DashboardPlatformId = 'shopee' | 'facebook' | 'zaloOA' | 'tiktok' | 'instagram'

type StoredDashboardChannel = {
  platform: DashboardPlatformId
  status: 'connected' | 'disconnected' | 'error'
  lastUpdated: string
}

interface ConnectedPlatform {
  platformId: PlatformId
  connectedCount: number
  lastConnectedAt: string
  labelType: ConnectedLabelType
}

interface ChannelsContextValue {
  connectedPlatforms: ConnectedPlatform[]
  getConnectedCount: (platformId: PlatformId) => number
  getConnectedLabelType: (platformId: PlatformId) => ConnectedPlatform['labelType']
  incrementConnected: (platformId: PlatformId) => void
  decrementConnected: (platformId: PlatformId) => void
  setConnectedCount: (
    platformId: PlatformId,
    connectedCount: number,
    labelType?: ConnectedPlatform['labelType'],
  ) => void
  isPlatformConnected: (platformId: PlatformId) => boolean
}

export const CHANNELS_STORAGE_KEY = 'nvx-connected-platforms'
const DASHBOARD_CHANNELS_STORAGE_KEY = 'nvx-dashboard-channels'

const DEFAULT_CONNECTED: ConnectedPlatform[] = [
  {
    platformId: 'facebook',
    connectedCount: 1,
    lastConnectedAt: '17/03/2026, 09:30',
    labelType: 'trang',
  },
  {
    platformId: 'zalo-oa',
    connectedCount: 2,
    lastConnectedAt: '15/07/2024, 08:17',
    labelType: 'trang',
  },
  {
    platformId: 'tiktok',
    connectedCount: 1,
    lastConnectedAt: '14/07/2024, 10:24',
    labelType: 'tài khoản',
  },
]

const ChannelsContext = createContext<ChannelsContextValue | null>(null)

function loadFromStorage(): ConnectedPlatform[] {
  if (typeof window === 'undefined') return DEFAULT_CONNECTED
  try {
    const raw = window.sessionStorage.getItem(CHANNELS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }

    const derived = deriveConnectedPlatformsFromDashboardStorage()
    return derived.length > 0 ? derived : DEFAULT_CONNECTED
  } catch {
    return DEFAULT_CONNECTED
  }
}

function deriveConnectedPlatformsFromDashboardStorage(): ConnectedPlatform[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.sessionStorage.getItem(DASHBOARD_CHANNELS_STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const platformMap = new Map<PlatformId, ConnectedPlatform>()

    parsed.forEach((channel) => {
      if (!isStoredDashboardChannel(channel) || channel.status !== 'connected') {
        return
      }

      const platformId = mapDashboardPlatformToConnectPlatform(channel.platform)
      const labelType = getLabelType(platformId)
      const existing = platformMap.get(platformId)

      if (existing) {
        existing.connectedCount += 1
        if (compareTimestamps(channel.lastUpdated, existing.lastConnectedAt) > 0) {
          existing.lastConnectedAt = channel.lastUpdated
        }
        return
      }

      platformMap.set(platformId, {
        platformId,
        connectedCount: 1,
        lastConnectedAt: channel.lastUpdated,
        labelType,
      })
    })

    return Array.from(platformMap.values())
  } catch {
    return []
  }
}

function isStoredDashboardChannel(value: unknown): value is StoredDashboardChannel {
  if (!value || typeof value !== 'object') {
    return false
  }

  const channel = value as Record<string, unknown>

  return (
    (channel.platform === 'shopee' ||
      channel.platform === 'facebook' ||
      channel.platform === 'zaloOA' ||
      channel.platform === 'tiktok' ||
      channel.platform === 'instagram') &&
    (channel.status === 'connected' ||
      channel.status === 'disconnected' ||
      channel.status === 'error') &&
    typeof channel.lastUpdated === 'string'
  )
}

function mapDashboardPlatformToConnectPlatform(platform: DashboardPlatformId): PlatformId {
  return platform === 'zaloOA' ? 'zalo-oa' : platform
}

function getLabelType(platformId: PlatformId): ConnectedLabelType {
  return platformId === 'shopee' ? 'shop' : platformId === 'tiktok' ? 'tài khoản' : 'trang'
}

function saveToStorage(platforms: ConnectedPlatform[]) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(platforms))
}

export function ChannelsProvider({ children }: { children: React.ReactNode }) {
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>(DEFAULT_CONNECTED)

  useEffect(() => {
    setConnectedPlatforms(loadFromStorage())
  }, [])

  const getConnectedCount = useCallback(
    (platformId: PlatformId): number => {
      const found = connectedPlatforms.find((p) => p.platformId === platformId)
      return found?.connectedCount ?? 0
    },
    [connectedPlatforms],
  )

  const getConnectedLabelType = useCallback(
    (platformId: PlatformId): ConnectedPlatform['labelType'] => {
      const found = connectedPlatforms.find((p) => p.platformId === platformId)
      return found?.labelType ?? 'trang'
    },
    [connectedPlatforms],
  )

  const incrementConnected = useCallback((platformId: PlatformId) => {
    setConnectedPlatforms((prev) => {
      const next = prev.map((p) =>
        p.platformId === platformId
          ? {
              ...p,
              connectedCount: p.connectedCount + 1,
              lastConnectedAt: formatNow(),
            }
          : p,
      )
      const exists = prev.some((p) => p.platformId === platformId)
      if (!exists) {
        next.push({
          platformId,
          connectedCount: 1,
          lastConnectedAt: formatNow(),
          labelType: getLabelType(platformId),
        })
      }
      saveToStorage(next)
      return next
    })
  }, [])

  const setConnectedCount = useCallback(
    (
      platformId: PlatformId,
      connectedCount: number,
      labelType: ConnectedPlatform['labelType'] = 'trang',
    ) => {
      setConnectedPlatforms((prev) => {
        const next = prev.filter((p) => p.platformId !== platformId)
        if (connectedCount > 0) {
          next.push({
            platformId,
            connectedCount,
            lastConnectedAt: formatNow(),
            labelType,
          })
        }
        saveToStorage(next)
        return next
      })
    },
    [],
  )

  const decrementConnected = useCallback((platformId: PlatformId) => {
    setConnectedPlatforms((prev) => {
      const next = prev
        .map((p) =>
          p.platformId === platformId
            ? {
                ...p,
                connectedCount: Math.max(0, p.connectedCount - 1),
                lastConnectedAt: formatNow(),
              }
            : p,
        )
        .filter((p) => p.connectedCount > 0)
      saveToStorage(next)
      return next
    })
  }, [])

  const isPlatformConnected = useCallback(
    (platformId: PlatformId): boolean => getConnectedCount(platformId) > 0,
    [getConnectedCount],
  )

  return (
    <ChannelsContext.Provider
      value={{
        connectedPlatforms,
        getConnectedCount,
        getConnectedLabelType,
        incrementConnected,
        decrementConnected,
        setConnectedCount,
        isPlatformConnected,
      }}
    >
      {children}
    </ChannelsContext.Provider>
  )
}

export function useChannels() {
  const ctx = useContext(ChannelsContext)
  if (!ctx) {
    throw new Error('useChannels must be used inside <ChannelsProvider>')
  }
  return ctx
}

function formatNow(): string {
  const d = new Date()
  const pad = (v: number) => v.toString().padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function compareTimestamps(a: string, b: string) {
  return parseTimestamp(a) - parseTimestamp(b)
}

function parseTimestamp(value: string) {
  const matchedValue = value.match(/^(\d{2})\/(\d{2})\/(\d{4}),\s(\d{2}):(\d{2})$/)

  if (!matchedValue) {
    return 0
  }

  const [, day, month, year, hour, minute] = matchedValue
  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    0,
    0,
  )

  const parsedTime = parsedDate.getTime()
  return Number.isNaN(parsedTime) ? 0 : parsedTime
}
