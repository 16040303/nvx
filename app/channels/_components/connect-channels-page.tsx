'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, Search, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { CHANNEL_PLATFORM_GROUPS } from './channel-platform-data'
import { useChannels, PlatformId } from '@/lib/channels-context'
import { useToast } from '@/hooks/use-toast'

const CONNECT_STORAGE_KEY = 'nvx-connected-platforms'
const DASHBOARD_STORAGE_KEY = 'nvx-dashboard-channels'
const NEW_CHANNEL_HIGHLIGHT_KEY = 'nvx-new-channel-highlight-id'

type DashboardPlatformId = 'shopee' | 'facebook' | 'zaloOA' | 'tiktok' | 'instagram'
type DashboardChannelStatus = 'connected' | 'disconnected' | 'error'

type DashboardChannel = {
  id: string
  name: string
  displayName: string
  platform: DashboardPlatformId
  lastUpdated: string
  status: DashboardChannelStatus
  syncPaused: boolean
  connectedAt: string
  disconnectedAt: string
  disconnectedAtUnix: number | null
}

const DEFAULT_DASHBOARD_CHANNELS: DashboardChannel[] = [
  {
    id: 'c-1',
    name: 'Robot AI nhà NuverxAI',
    displayName: 'Robot AI số 1',
    platform: 'facebook',
    lastUpdated: '17/03/2026, 09:30',
    status: 'connected',
    syncPaused: false,
    connectedAt: '17/03/2026, 09:30',
    disconnectedAt: '',
    disconnectedAtUnix: null,
  },
  {
    id: 'c-2',
    name: 'NuverxAI - Robot - Zalo OA',
    displayName: 'Robot Zalo OA 1',
    platform: 'zaloOA',
    lastUpdated: '15/07/2024, 08:17',
    status: 'connected',
    syncPaused: false,
    connectedAt: '15/07/2024, 08:17',
    disconnectedAt: '',
    disconnectedAtUnix: null,
  },
  {
    id: 'c-3',
    name: 'NuverxAI - Zalo OA',
    displayName: 'Zalo OA chính',
    platform: 'zaloOA',
    lastUpdated: '14/07/2024, 10:30',
    status: 'connected',
    syncPaused: false,
    connectedAt: '14/07/2024, 10:30',
    disconnectedAt: '',
    disconnectedAtUnix: null,
  },
  {
    id: 'c-4',
    name: 'NuverxAI - Robot - TikTok',
    displayName: 'TikTok Shop CSKH',
    platform: 'tiktok',
    lastUpdated: '14/07/2024, 10:24',
    status: 'connected',
    syncPaused: false,
    connectedAt: '14/07/2024, 10:24',
    disconnectedAt: '',
    disconnectedAtUnix: null,
  },
  {
    id: 'c-5',
    name: 'NuverxAI - Robot - Instagram',
    displayName: 'Instagram Robot',
    platform: 'instagram',
    lastUpdated: '10/07/2024, 15:10',
    status: 'disconnected',
    syncPaused: true,
    connectedAt: '10/07/2024, 15:10',
    disconnectedAt: '12/07/2024, 09:00',
    disconnectedAtUnix: new Date(2024, 6, 12, 9, 0, 0, 0).getTime(),
  },
  {
    id: 'c-6',
    name: 'NuverxAI - Robot AI - Shopee',
    displayName: 'Shopee CSKH',
    platform: 'shopee',
    lastUpdated: '27/06/2024, 14:10',
    status: 'error',
    syncPaused: false,
    connectedAt: '27/06/2024, 14:10',
    disconnectedAt: '28/06/2024, 11:25',
    disconnectedAtUnix: new Date(2024, 5, 28, 11, 25, 0, 0).getTime(),
  },
]

const PLATFORM_FILTERS = [
  { value: 'all', label: 'Tất cả nền tảng' },
  { value: 'social', label: 'Mạng xã hội' },
  { value: 'chat', label: 'Chat & cộng đồng' },
  { value: 'commerce', label: 'Thương mại điện tử' },
  { value: 'travel', label: 'Du lịch / OTA' },
  { value: 'direct', label: 'Liên hệ trực tiếp' },
] as const

type ChannelConnectedMessage = {
  type: 'CHANNEL_CONNECTED'
  platformId: PlatformId
  status: 'success' | 'error'
  connectedCount?: number
  connectedLabel?: 'trang' | 'shop' | 'tài khoản'
  message: string
}

export function ConnectChannelsPage() {
  const router = useRouter()
  const { getConnectedCount, getConnectedLabelType, setConnectedCount } = useChannels()
  const { toast } = useToast()
  const popupRef = useRef<Window | null>(null)
  const popupMonitorRef = useRef<number | null>(null)
  const activePlatformRef = useRef<PlatformId | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState<(typeof PLATFORM_FILTERS)[number]['value']>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createPlatformId, setCreatePlatformId] = useState<PlatformId>('facebook')
  const [temporaryConnectedCounts, setTemporaryConnectedCounts] = useState<Partial<Record<PlatformId, number>>>({})
  const [createdChannelName, setCreatedChannelName] = useState('Robot AI nhà NuverxAI')
  const [createdDisplayName, setCreatedDisplayName] = useState('')
  const [isSyncPaused, setIsSyncPaused] = useState(false)

  const stopPopupMonitor = useCallback(() => {
    if (popupMonitorRef.current !== null) {
      window.clearInterval(popupMonitorRef.current)
      popupMonitorRef.current = null
    }
  }, [])

  const toastRef = useRef(toast)
  const getConnectedCountRef = useRef(getConnectedCount)
  const setConnectedCountRef = useRef(setConnectedCount)
  const getConnectedLabelTypeRef = useRef(getConnectedLabelType)

  useEffect(() => {
    toastRef.current = toast
    getConnectedCountRef.current = getConnectedCount
    setConnectedCountRef.current = setConnectedCount
    getConnectedLabelTypeRef.current = getConnectedLabelType
  }, [toast, getConnectedCount, setConnectedCount, getConnectedLabelType])

  useEffect(() => {
    let lastStorageValue = sessionStorage.getItem(CONNECT_STORAGE_KEY) ?? ''

    const handleStorageChange = () => {
      const newValue = sessionStorage.getItem(CONNECT_STORAGE_KEY) ?? ''
      if (newValue !== lastStorageValue) {
        lastStorageValue = newValue
        setSearchQuery((prev) => prev + ' ')
        setTimeout(() => setSearchQuery((prev) => prev.trim()), 0)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const handleMessage = (event: MessageEvent<ChannelConnectedMessage>) => {
      if (event.origin !== window.location.origin) {
        return
      }

      const payload = event.data
      if (!payload || payload.type !== 'CHANNEL_CONNECTED') {
        return
      }

      stopPopupMonitor()
      popupRef.current = null
      activePlatformRef.current = null

      if (payload.status === 'success') {
        const persistedCount = getConnectedCountRef.current(payload.platformId)

        setCreatePlatformId(payload.platformId)
        setCreatedChannelName(`NuverxAI - ${getOriginalNameLabel(payload.platformId)}`)
        setCreatedDisplayName(getDefaultDisplayName(payload.platformId))
        setIsSyncPaused(false)
        setTemporaryConnectedCounts((prev) => ({
          ...prev,
          [payload.platformId]: persistedCount + 1,
        }))
        setIsCreateDialogOpen(true)
        toastRef.current({
          title: `Đã kết nối ${getPlatformName(payload.platformId)}`,
          description: 'Tài khoản đã đăng nhập thành công. Vui lòng thiết lập thông tin kênh.',
        })
        return
      }

      toastRef.current({
        title: `Không thể kết nối ${getPlatformName(payload.platformId)}`,
        description: payload.message,
      })
    }

    window.addEventListener('message', handleMessage)

    return () => {
      stopPopupMonitor()
      window.removeEventListener('message', handleMessage)
    }
  }, [stopPopupMonitor])

  const filteredGroups = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return CHANNEL_PLATFORM_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const matchesQuery =
          normalizedQuery.length === 0 || item.name.toLowerCase().includes(normalizedQuery)

        const matchesFilter =
          platformFilter === 'all' ||
          (platformFilter === 'social' && group.id === 'social-core') ||
          (platformFilter === 'chat' && group.id === 'chat-platforms') ||
          (platformFilter === 'commerce' && group.id === 'commerce') ||
          (platformFilter === 'travel' && group.id === 'travel') ||
          (platformFilter === 'direct' && group.id === 'direct')

        return matchesQuery && matchesFilter
      }),
    })).filter((group) => group.items.length > 0)
  }, [platformFilter, searchQuery])

  const handleOpenPlatformLogin = (platform: {
    id: string
    name: string
    connectedLabel: string
    accent: string
    textColor?: string
    logoSrc?: string
  }) => {
    const selectedPlatformId = platform.id as PlatformId
    const popupUrl =
      platform.id === 'shopee'
        ? new URL('/popup/shopee', window.location.origin)
        : platform.id === 'facebook'
          ? new URL('/popup/facebook', window.location.origin)
          : platform.id === 'instagram'
            ? new URL('/popup/instagram', window.location.origin)
            : new URL(`/channels/${platform.id}`, window.location.origin)

    setCreatePlatformId(selectedPlatformId)
    setCreatedChannelName(`NuverxAI - ${getOriginalNameLabel(selectedPlatformId)}`)
    setCreatedDisplayName(getDefaultDisplayName(selectedPlatformId))
    setIsSyncPaused(false)
    setTemporaryConnectedCounts((prev) => {
      if (!(selectedPlatformId in prev)) {
        return prev
      }

      const nextCounts = { ...prev }
      delete nextCounts[selectedPlatformId]
      return nextCounts
    })

    popupRef.current?.close()
    stopPopupMonitor()

    const popupFeatures =
      platform.id === 'shopee'
        ? 'popup=yes,width=520,height=720,left=380,top=70'
        : 'popup=yes,width=520,height=720,left=160,top=80'

    const nextPopup = window.open(
      popupUrl.toString(),
      `${platform.id}-login`,
      popupFeatures,
    )

    if (!nextPopup) {
      toast({
        title: 'Popup bị chặn',
        description: 'Vui lòng cho phép popup để tiếp tục kết nối kênh.',
      })
      return
    }

    popupRef.current = nextPopup
    activePlatformRef.current = selectedPlatformId

    popupMonitorRef.current = window.setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        stopPopupMonitor()
        popupRef.current = null

        if (activePlatformRef.current) {
          toast({
            title: `Đã đóng cửa sổ ${platform.name}`,
            description: 'Luồng kết nối đã bị hủy trước khi hoàn tất.',
          })
          activePlatformRef.current = null
        }
      }
    }, 500)
  }

  const handleCreateChannelSubmit = () => {
    const originalName = createdChannelName.trim()
    const displayName = createdDisplayName.trim()

    if (!originalName || !displayName) {
      toast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng nhập đầy đủ tên gốc và tên hiển thị.',
      })
      return
    }

    const { nextCount, createdChannelId } = persistCreatedDashboardChannel({
      platformId: createPlatformId,
      originalName,
      displayName,
      syncPaused: isSyncPaused,
    })

    setConnectedCount(
      createPlatformId,
      nextCount,
      getConnectedLabelType(createPlatformId),
    )
    setTemporaryConnectedCounts((prev) => {
      if (!(createPlatformId in prev)) {
        return prev
      }

      const nextCounts = { ...prev }
      delete nextCounts[createPlatformId]
      return nextCounts
    })
    setIsCreateDialogOpen(false)
    toast({
      title: 'Đã lưu kênh',
      description: isSyncPaused
        ? 'Kênh đã được lưu với trạng thái ngắt kết nối.'
        : 'Kênh đã được lưu với trạng thái đã kết nối.',
    })
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(NEW_CHANNEL_HIGHLIGHT_KEY, createdChannelId)
    }
    router.push('/channels')
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:px-6 md:py-4 lg:px-8 lg:py-4">
      <div className="mx-auto w-full max-w-[1200px]">
        <section className="rounded-[24px] border border-[#d6d7da] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-[454px] flex-1">
              <label htmlFor="connect-channels-search" className="sr-only">
                Tìm kiếm kênh
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#181819]" />
              <input
                id="connect-channels-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm kiếm kênh"
                className="h-10 w-full rounded-[14px] border border-[#e6e7e9] bg-white pl-11 pr-4 text-base text-[#181819] outline-none transition-colors placeholder:text-[#1818196b] focus:border-[#3f8cff]"
              />
            </div>

            <div className="relative w-full max-w-[160px]">
              <label htmlFor="connect-channels-filter" className="sr-only">
                Tất cả nền tảng
              </label>
              <select
                id="connect-channels-filter"
                value={platformFilter}
                onChange={(event) =>
                  setPlatformFilter(event.target.value as (typeof PLATFORM_FILTERS)[number]['value'])
                }
                className="h-10 w-full appearance-none rounded-[14px] border border-[#dedede] bg-white px-4 pr-10 text-sm text-[#181819] outline-none transition-colors focus:border-[#3f8cff]"
              >
                {PLATFORM_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#181819]" />
            </div>

            <Link
              id="connect-channels-back-link"
              href="/channels"
              className="ml-auto inline-flex h-10 items-center justify-center rounded-[14px] border border-[#e6e7e9] bg-white px-4 text-sm font-medium text-[#181819] transition-colors hover:border-[#3f8cff] hover:text-[#3f8cff]"
            >
              Quay lại
            </Link>
          </div>

          <div className="space-y-8">
            {filteredGroups.map((group) => (
              <section key={group.id} className="space-y-5">
                <h2 className="text-xl font-semibold text-[#181819]">{group.title}</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {group.items.map((platform) => {
                    const platformId = platform.id as PlatformId
                    const connectedCount =
                      temporaryConnectedCounts[platformId] ?? getConnectedCount(platformId)

                    return (
                      <button
                        key={platform.id}
                        id={`connect-channel-card-${platform.id}`}
                        type="button"
                        onClick={() => handleOpenPlatformLogin(platform)}
                        className="group flex min-h-[96px] flex-col items-center justify-center rounded-[14px] border border-[#eceef2] bg-white px-4 py-5 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#d5e3ff] hover:shadow-[0_14px_24px_rgba(63,140,255,0.12)]"
                      >
                        <span
                          className="mb-3 inline-flex h-[35px] w-[35px] items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white shadow-sm"
                          style={{
                            backgroundColor: platform.logoSrc ? '#ffffff' : platform.accent,
                            color: platform.textColor ? platform.textColor : '#ffffff',
                            boxShadow: platform.logoSrc
                              ? '0 0 0 1px rgba(15,23,42,0.06), 0 2px 8px rgba(15,23,42,0.08)'
                              : undefined,
                          }}
                        >
                          {platform.logoSrc ? (
                            <img
                              src={platform.logoSrc}
                              alt={`${platform.name} logo`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            platform.name.slice(0, 1)
                          )}
                        </span>
                        <span className="text-[13px] font-semibold text-[#000000]">{platform.name}</span>
                        <span className="mt-1 text-xs leading-[18px] text-[#595959]">
                          {connectedCount > 0
                            ? `Bạn đã kết nối ${connectedCount} ${getConnectedLabelType(
                                platform.id as PlatformId,
                              )}`
                            : 'Chưa kết nối'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>

      <Dialog
        modal={false}
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open)
          if (!open) {
            setTemporaryConnectedCounts((prev) => {
              if (!(createPlatformId in prev)) {
                return prev
              }

              const nextCounts = { ...prev }
              delete nextCounts[createPlatformId]
              return nextCounts
            })
          }
        }}
      >
        <DialogContent className="fixed left-1/2 top-1/2 w-[min(92vw,420px)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 gap-0 rounded-[24px] border border-[#eef2f7] bg-white px-0 py-0 shadow-[0_24px_54px_rgba(15,23,42,0.2)] [&>[data-slot=dialog-close]]:hidden">
          <div className="relative px-6 pb-6 pt-5">
            <button
              type="button"
              aria-label="Đóng popup tạo kênh"
              onClick={() => setIsCreateDialogOpen(false)}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#f3f6fb]"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <DialogTitle asChild>
              <h2 className="pr-10 text-[22px] font-extrabold uppercase tracking-[0.01em] text-[#1f2937]">
                THIẾT LẬP KÊNH
              </h2>
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-[14px] leading-[22px] text-[#4b5563]">
              Kết nối tài khoản thành công, vui lòng điền các thông tin
            </DialogDescription>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="create-channel-original-name"
                  className="mb-2 block text-[14px] font-semibold text-[#7b8698]"
                >
                  Tên gốc
                </label>
                <input
                  id="create-channel-original-name"
                  type="text"
                  value={createdChannelName}
                  readOnly
                  aria-readonly="true"
                  className="h-[46px] w-full cursor-not-allowed rounded-[14px] border border-[#d9e4f2] bg-[#f3f6fa] px-4 text-[14px] text-[#6b7280] shadow-[inset_0_1px_2px_rgba(15,23,42,0.04),0_0_0_1px_rgba(219,231,245,0.65)] outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="create-channel-display-name"
                  className="mb-2 block text-[14px] font-semibold text-[#7b8698]"
                >
                  Tên hiển thị
                </label>
                <input
                  id="create-channel-display-name"
                  type="text"
                  value={createdDisplayName}
                  onChange={(event) => setCreatedDisplayName(event.target.value)}
                  className="h-[46px] w-full rounded-[14px] border border-[#d9e4f2] bg-white px-4 text-[14px] text-[#374151] shadow-[inset_0_1px_2px_rgba(15,23,42,0.04),0_0_0_1px_rgba(219,231,245,0.65)] outline-none transition-colors focus:border-[#7fb1ff]"
                />
              </div>

              <div className="inline-flex h-[42px] items-center justify-between gap-4 rounded-[14px] bg-[#eceff3] px-4 text-[13px] font-semibold text-[#4b5563]">
                <span>Ngưng đồng bộ dữ liệu</span>
                <Switch
                  id="create-channel-sync-toggle"
                  checked={isSyncPaused}
                  onCheckedChange={setIsSyncPaused}
                  className="h-[22px] w-[40px] bg-[#9aa3af] data-[state=checked]:bg-[#3f8cff] [&>[data-slot=switch-thumb]]:size-[18px] [&>[data-slot=switch-thumb]]:data-[state=unchecked]:translate-x-[2px] [&>[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[20px]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                id="create-channel-submit-button"
                type="button"
                onClick={handleCreateChannelSubmit}
                className="inline-flex h-[40px] min-w-[132px] items-center justify-center rounded-[12px] bg-[#4a93ff] px-5 text-[14px] font-semibold text-white shadow-[0_10px_20px_rgba(63,140,255,0.28)] transition-colors hover:bg-[#3a84f3]"
              >
                Đồng bộ dữ liệu
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function getPlatformName(platformId: PlatformId) {
  for (const group of CHANNEL_PLATFORM_GROUPS) {
    const platform = group.items.find((item) => item.id === platformId)
    if (platform) {
      return platform.name
    }
  }

  return platformId
}

function hasValidOriginalChannelName(name: string) {
  const trimmedName = name.trim()

  return trimmedName === 'Robot AI nhà NuverxAI' || /^NuverxAI\s-\s.+$/u.test(trimmedName)
}

function getStoredDashboardChannels(): DashboardChannel[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.sessionStorage.getItem(DASHBOARD_STORAGE_KEY)
    if (!raw) {
      persistDashboardChannels(DEFAULT_DASHBOARD_CHANNELS)
      return [...DEFAULT_DASHBOARD_CHANNELS]
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    const validChannels = parsed.filter(
      (channel): channel is DashboardChannel =>
        isDashboardChannel(channel) && hasValidOriginalChannelName(channel.name),
    )

    if (validChannels.length !== parsed.length) {
      persistDashboardChannels(validChannels)
    }

    return validChannels.length > 0 ? validChannels : [...DEFAULT_DASHBOARD_CHANNELS]
  } catch {
    return []
  }
}

function persistDashboardChannels(channels: DashboardChannel[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(channels))
}

function isDashboardChannel(value: unknown): value is DashboardChannel {
  if (!value || typeof value !== 'object') {
    return false
  }

  const channel = value as Record<string, unknown>

  return (
    typeof channel.id === 'string' &&
    typeof channel.name === 'string' &&
    typeof channel.displayName === 'string' &&
    (channel.platform === 'shopee' ||
      channel.platform === 'facebook' ||
      channel.platform === 'zaloOA' ||
      channel.platform === 'tiktok' ||
      channel.platform === 'instagram') &&
    typeof channel.lastUpdated === 'string' &&
    (channel.status === 'connected' ||
      channel.status === 'disconnected' ||
      channel.status === 'error') &&
    typeof channel.syncPaused === 'boolean' &&
    typeof channel.connectedAt === 'string' &&
    typeof channel.disconnectedAt === 'string' &&
    (channel.disconnectedAtUnix === null || typeof channel.disconnectedAtUnix === 'number')
  )
}

function mapPlatformIdToDashboardPlatform(platformId: PlatformId): DashboardPlatformId | null {
  switch (platformId) {
    case 'facebook':
      return 'facebook'
    case 'instagram':
      return 'instagram'
    case 'tiktok':
      return 'tiktok'
    case 'shopee':
      return 'shopee'
    case 'zalo-oa':
      return 'zaloOA'
    default:
      return null
  }
}

function persistCreatedDashboardChannel({
  platformId,
  originalName,
  displayName,
  syncPaused,
}: {
  platformId: PlatformId
  originalName: string
  displayName: string
  syncPaused: boolean
}) {
  if (typeof window === 'undefined') {
    return { nextCount: 0, createdChannelId: '' }
  }

  const dashboardPlatformId = mapPlatformIdToDashboardPlatform(platformId)
  if (!dashboardPlatformId) {
    return { nextCount: 0, createdChannelId: '' }
  }

  const channels = getStoredDashboardChannels()
  const now = new Date()
  const timestamp = formatTimestamp(now)
  const isDisconnected = syncPaused
  const createdChannelId = `${dashboardPlatformId}-${Date.now()}-${channels.length + 1}`

  channels.push({
    id: createdChannelId,
    name: originalName,
    displayName,
    platform: dashboardPlatformId,
    lastUpdated: timestamp,
    status: isDisconnected ? 'disconnected' : 'connected',
    syncPaused: isDisconnected,
    connectedAt: timestamp,
    disconnectedAt: isDisconnected ? timestamp : '',
    disconnectedAtUnix: isDisconnected ? now.getTime() : null,
  })

  persistDashboardChannels(channels)

  return {
    nextCount: channels.filter(
      (channel) => channel.platform === dashboardPlatformId && channel.status === 'connected',
    ).length,
    createdChannelId,
  }
}

function getOriginalNameLabel(platformId: PlatformId) {
  switch (platformId) {
    case 'facebook':
      return 'Facebook'
    case 'instagram':
      return 'Instagram'
    case 'tiktok':
      return 'TikTok'
    case 'shopee':
      return 'Shopee'
    case 'zalo-oa':
      return 'Zalo OA'
    default:
      return getPlatformName(platformId)
  }
}

function getDefaultDisplayName(platformId: PlatformId) {
  switch (platformId) {
    case 'facebook':
      return 'Robot AI số mới'
    case 'instagram':
      return 'Instagram Robot'
    case 'tiktok':
      return 'TikTok Shop mới'
    case 'shopee':
      return 'Shopee Shop mới'
    case 'zalo-oa':
      return 'Zalo OA mới'
    default:
      return ''
  }
}

function formatTimestamp(date: Date) {
  const pad = (value: number) => value.toString().padStart(2, '0')

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}
