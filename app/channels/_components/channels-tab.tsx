'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TimestampChip } from '@/components/data-list/timestamp-chip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/lib/language-context'
import { Calendar, ChevronDown, Plus, Search } from 'lucide-react'
import { DatePickerModal } from '@/components/data-list/date-picker-modal'

type ChannelStatus = 'connected' | 'disconnected' | 'error'
type ChannelFilter = 'all' | 'shopee' | 'facebook' | 'zaloOA' | 'tiktok' | 'instagram'

interface CommunicationChannel {
  id: string
  name: string
  displayName: string
  platform: Exclude<ChannelFilter, 'all'>
  lastUpdated: string
  status: ChannelStatus
  syncPaused: boolean
  connectedAt: string
  disconnectedAt: string
  disconnectedAtUnix: number | null
}

const INITIAL_CHANNELS: CommunicationChannel[] = [
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

const AVATAR_GRADIENT = 'from-[#3f8cff] to-[#1976f5]'
const CHANNELS_STORAGE_KEY = 'nvx-dashboard-channels'
const NEW_CHANNEL_HIGHLIGHT_KEY = 'nvx-new-channel-highlight-id'

function hasValidOriginalChannelName(name: string) {
  const trimmedName = name.trim()

  return trimmedName === 'Robot AI nhà NuverxAI' || /^NuverxAI\s-\s.+$/u.test(trimmedName)
}

function mergeMissingInitialChannels(channels: CommunicationChannel[]) {
  const existingIds = new Set(channels.map((channel) => channel.id))
  const missingInitialChannels = INITIAL_CHANNELS.filter((channel) => !existingIds.has(channel.id))

  return missingInitialChannels.length > 0 ? [...missingInitialChannels, ...channels] : channels
}

function isStoredChannel(value: unknown): value is CommunicationChannel {
  if (!value || typeof value !== 'object') {
    return false
  }

  const channel = value as Record<string, unknown>

  const hasValidDisconnectedAtUnix =
    !('disconnectedAtUnix' in channel) ||
    channel.disconnectedAtUnix === null ||
    typeof channel.disconnectedAtUnix === 'number'

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
    hasValidDisconnectedAtUnix
  )
}

function getStoredChannels(): CommunicationChannel[] {
  if (typeof window === 'undefined') {
    return INITIAL_CHANNELS
  }

  try {
    const storedChannels = window.sessionStorage.getItem(CHANNELS_STORAGE_KEY)

    if (!storedChannels) {
      return INITIAL_CHANNELS
    }

    const parsedChannels: unknown = JSON.parse(storedChannels)

    if (!Array.isArray(parsedChannels)) {
      return INITIAL_CHANNELS
    }

    const validChannels = parsedChannels.filter(
      (channel): channel is CommunicationChannel =>
        isStoredChannel(channel) && hasValidOriginalChannelName(channel.name),
    )

    const nextChannels = mergeMissingInitialChannels(validChannels)

    if (nextChannels.length !== parsedChannels.length) {
      persistChannelsToStorage(nextChannels)
    }

    return nextChannels
  } catch {
    return INITIAL_CHANNELS
  }
}

function persistChannelsToStorage(nextChannels: CommunicationChannel[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(nextChannels))
}

function formatTimestamp(date: Date) {
  const pad = (value: number) => value.toString().padStart(2, '0')

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

function parseTimestamp(value: string) {
  const matchedValue = value.match(/^(\d{2})\/(\d{2})\/(\d{4}),\s(\d{2}):(\d{2})$/)

  if (!matchedValue) {
    return null
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

  return Number.isNaN(parsedTime) ? null : parsedTime
}

function formatElapsedDuration(milliseconds: number) {
  const safeTotalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const hours = Math.floor(safeTotalSeconds / 3600)
  const minutes = Math.floor((safeTotalSeconds % 3600) / 60)
  const seconds = safeTotalSeconds % 60

  const pad = (value: number) => value.toString().padStart(2, '0')

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}


export function ChannelsTab() {
  const { t } = useLanguage()
  const router = useRouter()
  const [channels, setChannels] = useState<CommunicationChannel[]>(INITIAL_CHANNELS)
  const [searchQuery, setSearchQuery] = useState('')
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all')
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState<Date | null>(null)
  const [editedDisplayName, setEditedDisplayName] = useState('')
  const [editedSyncPaused, setEditedSyncPaused] = useState(false)
  const [disconnectedTimelineTick, setDisconnectedTimelineTick] = useState(0)
  const [highlightedChannelId, setHighlightedChannelId] = useState<string | null>(null)

  useEffect(() => {
    setChannels(getStoredChannels())

    if (typeof window === 'undefined') {
      return
    }

    const nextHighlightedChannelId = window.sessionStorage.getItem(NEW_CHANNEL_HIGHLIGHT_KEY)
    if (!nextHighlightedChannelId) {
      return
    }

    setHighlightedChannelId(nextHighlightedChannelId)

    const timeoutId = window.setTimeout(() => {
      setHighlightedChannelId((currentId) =>
        currentId === nextHighlightedChannelId ? null : currentId,
      )
      window.sessionStorage.removeItem(NEW_CHANNEL_HIGHLIGHT_KEY)
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  const filterOptions = useMemo(
    () => [
      { value: 'all' as const, label: t.dashboard.channels.filters.all },
      { value: 'shopee' as const, label: t.dashboard.channels.filters.shopee },
      { value: 'facebook' as const, label: t.dashboard.channels.filters.facebook },
      { value: 'zaloOA' as const, label: t.dashboard.channels.filters.zaloOA },
      { value: 'tiktok' as const, label: t.dashboard.channels.filters.tiktok },
      { value: 'instagram' as const, label: t.dashboard.channels.filters.instagram },
    ],
    [t],
  )

  const statusLabels = useMemo<Record<ChannelStatus, string>>(
    () => ({
      connected: t.dashboard.channels.statuses.connected,
      disconnected: t.dashboard.channels.statuses.disconnected,
      error: t.dashboard.channels.statuses.error,
    }),
    [t],
  )

  const selectedChannel = useMemo(
    () => channels.find((channel) => channel.id === activeChannelId) ?? null,
    [channels, activeChannelId],
  )

  useEffect(() => {
    if (!selectedChannel || selectedChannel.status !== 'disconnected' || !selectedChannel.syncPaused) {
      return
    }

    const disconnectedStartTime =
      selectedChannel.disconnectedAtUnix ?? parseTimestamp(selectedChannel.disconnectedAt)

    if (!disconnectedStartTime) {
      return
    }

    const timerId = window.setInterval(() => {
      setDisconnectedTimelineTick((currentTick) => currentTick + 1)
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [
    selectedChannel?.id,
    selectedChannel?.status,
    selectedChannel?.syncPaused,
    selectedChannel?.disconnectedAt,
    selectedChannel?.disconnectedAtUnix,
  ])

  const disconnectedTimelineValue = useMemo(() => {
    if (!selectedChannel) {
      return ''
    }

    if (selectedChannel.status !== 'disconnected' || !selectedChannel.syncPaused) {
      return selectedChannel.disconnectedAt
    }

    const disconnectedStartTime =
      selectedChannel.disconnectedAtUnix ?? parseTimestamp(selectedChannel.disconnectedAt)

    if (!disconnectedStartTime) {
      return selectedChannel.disconnectedAt
    }

    return formatElapsedDuration(Date.now() - disconnectedStartTime)
  }, [selectedChannel, disconnectedTimelineTick])

  const filteredChannels = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase()

    return [...channels]
      .filter((channel) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          channel.name.toLocaleLowerCase().includes(normalizedQuery) ||
          channel.displayName.toLocaleLowerCase().includes(normalizedQuery)
        const matchesFilter = channelFilter === 'all' || channel.platform === channelFilter

        let matchesDate = true
        if (dateFilter) {
          const match = channel.lastUpdated.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
          if (match) {
            matchesDate =
              Number(match[1]) === dateFilter.getDate() &&
              Number(match[2]) - 1 === dateFilter.getMonth() &&
              Number(match[3]) === dateFilter.getFullYear()
          } else {
            matchesDate = false
          }
        }

        return matchesQuery && matchesFilter && matchesDate
      })
      .sort((firstChannel, secondChannel) => {
        const firstTime = parseTimestamp(firstChannel.lastUpdated) ?? 0
        const secondTime = parseTimestamp(secondChannel.lastUpdated) ?? 0
        return secondTime - firstTime
      })
  }, [channels, searchQuery, channelFilter, dateFilter])

  const handleOpenChannelSettings = (channel: CommunicationChannel) => {
    setActiveChannelId(channel.id)
    setEditedDisplayName(channel.displayName)
    setEditedSyncPaused(channel.syncPaused)
  }

  const handleCloseChannelSettings = () => {
    setActiveChannelId(null)
  }

  const handleUpdateChannelSettings = () => {
    if (!selectedChannel) {
      return
    }

    const nextDisplayName = editedDisplayName.trim()
    const now = new Date()
    const nowTimestamp = now.getTime()
    const nextUpdatedAt = formatTimestamp(now)

    setChannels((currentChannels) => {
      const nextChannels = currentChannels.map((channel) => {
        if (channel.id !== selectedChannel.id) {
          return channel
        }

        const isNewlyDisconnected = !channel.syncPaused && editedSyncPaused
        const isReconnected = channel.syncPaused && !editedSyncPaused
        const nextDisconnectedAt = editedSyncPaused
          ? isNewlyDisconnected
            ? nextUpdatedAt
            : channel.disconnectedAt || nextUpdatedAt
          : ''
        const nextDisconnectedAtUnix = editedSyncPaused
          ? isNewlyDisconnected
            ? nowTimestamp
            : channel.disconnectedAtUnix ?? parseTimestamp(channel.disconnectedAt) ?? nowTimestamp
          : null
        const nextStatus: ChannelStatus = editedSyncPaused
          ? 'disconnected'
          : isReconnected
            ? 'connected'
            : channel.status

        return {
          ...channel,
          displayName: nextDisplayName.length > 0 ? nextDisplayName : channel.displayName,
          syncPaused: editedSyncPaused,
          status: nextStatus,
          connectedAt: isReconnected ? nextUpdatedAt : channel.connectedAt,
          disconnectedAt: nextDisconnectedAt,
          disconnectedAtUnix: nextDisconnectedAtUnix,
          lastUpdated: nextUpdatedAt,
        }
      })

      persistChannelsToStorage(nextChannels)

      return nextChannels
    })

    setActiveChannelId(null)
  }

  const handleAddChannel = () => {
    router.push('/channels/connect')
  }

  const statusClasses: Record<ChannelStatus, string> = {
    connected: 'bg-[#3980ea] text-white',
    disconnected: 'bg-[#e0e5e8] text-[#888888]',
    error: 'bg-[#fa070780] text-black',
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:px-6 md:py-4 lg:px-8 lg:py-4">
      <div className="mx-auto w-full max-w-[1200px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#181819]">{t.dashboard.channels.title}</h1>
            <p className="mt-1 text-sm text-[#6b7280]">{t.dashboard.channels.subtitle}</p>
          </div>
        </header>

        <section className="rounded-[24px] border border-[#d6d7da] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-[370px] flex-1">
            <label htmlFor="channels-search-input" className="sr-only">
              {t.dashboard.channels.searchPlaceholder}
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0a6]" />
            <input
              id="channels-search-input"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t.dashboard.channels.searchPlaceholder}
              className="h-10 w-full rounded-[12px] border border-[#d8dadd] bg-white pl-10 pr-4 text-sm text-[#181819] outline-none transition-colors placeholder:text-[#9aa0a6] focus:border-[#3f8cff]"
            />
          </div>

          <div className="relative w-full max-w-[150px]">
            <label htmlFor="channels-filter-select" className="sr-only">
              {t.dashboard.channels.filterLabel}
            </label>
            <select
              id="channels-filter-select"
              value={channelFilter}
              onChange={(event) => setChannelFilter(event.target.value as ChannelFilter)}
              className="h-10 w-full appearance-none rounded-[12px] border border-[#d8dadd] bg-white px-4 pr-10 text-sm text-[#181819] outline-none transition-colors focus:border-[#3f8cff]"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0a6]" />
          </div>

          <div className="flex items-center gap-2">
            <button
              id="channels-time-filter-button"
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#9aa0a6] transition-colors hover:text-[#6b7280]"
              aria-label={t.dashboard.timeFilter}
              onClick={() => setIsCalendarOpen(true)}
            >
              <Calendar className="h-7 w-7" />
            </button>

            {dateFilter ? (
              <button
                id="channels-reset-date-filter"
                type="button"
                onClick={() => setDateFilter(null)}
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#dbe6f5] bg-[#f8fbff] px-3 text-sm font-medium text-[#5b6b82] transition-colors hover:border-[#bfd4f7] hover:bg-[#eef5ff] hover:text-[#34558b]"
              >
                Đặt lại
              </button>
            ) : null}
          </div>

          <button
            id="channels-add-button"
            type="button"
            onClick={handleAddChannel}
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#3f8cff] text-white transition-all hover:brightness-95"
            aria-label={t.dashboard.channels.addChannel}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] table-fixed border-separate border-spacing-y-4">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[34%]" />
              <col className="w-[24%]" />
              <col className="w-[24%]" />
            </colgroup>
            <thead>
              <tr>
                <th className="px-4 text-center text-base font-medium text-[#181819]">
                  {t.dashboard.channels.columns.avatar}
                </th>
                <th className="px-4 text-center text-base font-medium text-[#181819]">
                  {t.dashboard.channels.columns.displayName}
                </th>
                <th className="px-4 text-center text-base font-medium text-[#181819]">
                  {t.dashboard.channels.columns.time}
                </th>
                <th className="px-4 text-center text-base font-medium text-[#181819]">
                  {t.dashboard.channels.columns.status}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredChannels.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="rounded-[16px] bg-[#f8fafc] px-4 py-10 text-center text-sm text-[#6b7280]"
                  >
                    {t.dashboard.channels.emptyState}
                  </td>
                </tr>
              ) : (
                filteredChannels.map((channel) => {
                  const isHighlighted = channel.id === highlightedChannelId

                  return (
                    <tr
                      key={channel.id}
                      id={`channels-row-${channel.id}`}
                      className={`cursor-pointer bg-[#f4f9fd] transition-all duration-1000 ease-out hover:bg-[#eaf3fb] ${
                        isHighlighted
                          ? 'animate-pulse drop-shadow-[0_0_18px_rgba(63,140,255,0.28)]'
                          : ''
                      }`}
                      onClick={() => handleOpenChannelSettings(channel)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          handleOpenChannelSettings(channel)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                    <td
                      className={`rounded-l-[24px] px-4 py-0 align-middle transition-all duration-1000 ease-out ${
                        isHighlighted
                          ? 'border-y border-l border-[#76a9ff] bg-[#fafdff] shadow-[inset_1px_0_0_rgba(255,255,255,0.85)]'
                          : ''
                      }`}
                    >
                      <div className="flex h-[56px] items-center justify-center">
                        <div
                          className={`relative inline-flex h-[41px] w-[42px] items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_GRADIENT} text-xs font-semibold text-white`}
                        >
                          {channel.displayName.slice(0, 1).toUpperCase()}
                        </div>
                      </div>
                    </td>

                    <td
                      className={`px-4 py-0 align-middle text-sm text-[#181819] transition-all duration-1000 ease-out ${
                        isHighlighted
                          ? 'border-y border-[#76a9ff] bg-[#fafdff]'
                          : ''
                      }`}
                    >
                      <div className="flex h-[56px] items-center justify-center text-center">
                        {channel.displayName}
                      </div>
                    </td>

                    <td
                      className={`px-4 py-0 align-middle transition-all duration-1000 ease-out ${
                        isHighlighted
                          ? 'border-y border-[#76a9ff] bg-[#fafdff]'
                          : ''
                      }`}
                    >
                      <div className="flex h-[56px] items-center justify-center">
                        <TimestampChip value={channel.lastUpdated} />
                      </div>
                    </td>

                    <td
                      className={`rounded-r-[24px] px-4 py-0 align-middle transition-all duration-1000 ease-out ${
                        isHighlighted
                          ? 'border-y border-r border-[#76a9ff] bg-[#fafdff] shadow-[inset_-1px_0_0_rgba(255,255,255,0.85)]'
                          : ''
                      }`}
                    >
                      <div className="flex h-[56px] items-center justify-center">
                        <span
                          id={`channels-status-${channel.id}`}
                          className={`inline-flex min-h-[31px] min-w-[98px] cursor-default select-none items-center justify-center rounded-[14px] px-3 text-xs font-medium ${statusClasses[channel.status]}`}
                          aria-label={`${t.dashboard.channels.columns.status}: ${statusLabels[channel.status]}`}
                        >
                          {statusLabels[channel.status]}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <DatePickerModal
        open={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={dateFilter}
        onConfirm={(date) => setDateFilter(date)}
      />

      <Dialog
        modal={false}
        open={activeChannelId !== null}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseChannelSettings()
          }
        }}
      >
        <DialogContent
          className="fixed left-1/2 top-1/2 w-[min(92vw,402px)] max-w-[402px] -translate-x-1/2 -translate-y-1/2 gap-0 rounded-[22px] border border-[#d7dce3] bg-[linear-gradient(180deg,#f7f8fa_0%,#eef2f6_100%)] px-[26px] pb-[18px] pt-[20px] shadow-[0_24px_70px_rgba(15,23,42,0.24)] data-[state=open]:duration-300 data-[state=closed]:duration-200 data-[state=open]:ease-out data-[state=closed]:ease-in data-[state=open]:zoom-in-[98%] data-[state=closed]:zoom-out-[98%] [&>[data-slot=dialog-close]]:right-[22px] [&>[data-slot=dialog-close]]:top-[18px] [&>[data-slot=dialog-close]]:rounded-none [&>[data-slot=dialog-close]]:bg-transparent [&>[data-slot=dialog-close]]:p-1 [&>[data-slot=dialog-close]]:text-[#111827] [&>[data-slot=dialog-close]]:opacity-100 [&>[data-slot=dialog-close]]:transition-colors [&>[data-slot=dialog-close]]:hover:text-[#3f8cff] [&>[data-slot=dialog-close]>svg]:size-6"
        >
          {selectedChannel && (
            <div className="flex flex-col">
              <DialogHeader className="gap-1.5 p-0 pr-9 text-left">
                <DialogTitle className="text-[20px] font-extrabold uppercase tracking-[0.02em] text-[#111827]">
                  {t.dashboard.channels.settingsPanel.title}
                </DialogTitle>
                <DialogDescription className="text-base font-medium text-[#1f2937]">
                  {t.dashboard.channels.settingsPanel.connectedMessage}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor={`channels-settings-original-name-${selectedChannel.id}`}
                    className="block text-base font-semibold text-[#7c8795]"
                  >
                    {t.dashboard.channels.settingsPanel.originalName}
                  </label>
                  <input
                    id={`channels-settings-original-name-${selectedChannel.id}`}
                    type="text"
                    value={selectedChannel.name}
                    readOnly
                    className="h-[46px] w-full rounded-[14px] border border-[#c6d2e3] bg-[#f1f3f5] px-4 text-base text-[#5f6671] shadow-[0_4px_10px_rgba(63,140,255,0.12)] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`channels-settings-display-name-${selectedChannel.id}`}
                    className="block text-base font-semibold text-[#7c8795]"
                  >
                    {t.dashboard.channels.settingsPanel.displayName}
                  </label>
                  <input
                    id={`channels-settings-display-name-${selectedChannel.id}`}
                    type="text"
                    value={editedDisplayName}
                    onChange={(event) => setEditedDisplayName(event.target.value)}
                    className="h-[46px] w-full rounded-[14px] border border-[#c6d2e3] bg-white px-4 text-base text-[#111827] shadow-[0_6px_12px_rgba(63,140,255,0.16)] outline-none transition-colors focus:border-[#3f8cff]"
                  />
                </div>

                <div className="inline-flex h-[50px] items-center justify-between gap-3 rounded-[16px] bg-[#e8eef5] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] transition-colors duration-200">
                  <span className="text-[15px] font-semibold tracking-[0.01em] text-[#1e2a39]">
                    {t.dashboard.channels.settingsPanel.pauseSync}
                  </span>
                  <Switch
                    id={`channels-settings-sync-toggle-${selectedChannel.id}`}
                    checked={editedSyncPaused}
                    onCheckedChange={setEditedSyncPaused}
                    aria-label={t.dashboard.channels.settingsPanel.pauseSync}
                    className="h-[28px] w-[50px] border-none bg-[#7a8391] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] transition-colors duration-300 ease-out data-[state=checked]:bg-[#3f8cff] data-[state=unchecked]:bg-[#7a8391] [&>[data-slot=switch-thumb]]:size-[22px] [&>[data-slot=switch-thumb]]:bg-[#f8fafc] [&>[data-slot=switch-thumb]]:shadow-[0_2px_7px_rgba(15,23,42,0.32)] [&>[data-slot=switch-thumb]]:transition-transform [&>[data-slot=switch-thumb]]:duration-300 [&>[data-slot=switch-thumb]]:ease-out [&>[data-slot=switch-thumb]]:data-[state=unchecked]:translate-x-[2px] [&>[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[26px]"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-medium text-[#1f2937]">
                      {t.dashboard.channels.settingsPanel.connectedAt}:
                    </span>
                    <span className="rounded-full bg-[#e8ecef] px-3.5 py-1 text-base font-medium text-[#4b5563]">
                      {selectedChannel.connectedAt}
                    </span>
                  </div>
                  <div className="text-base text-[#a1a7b1]">
                    {t.dashboard.channels.settingsPanel.disconnectedAt}: {disconnectedTimelineValue || '--'}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  id={`channels-settings-update-button-${selectedChannel.id}`}
                  type="button"
                  onClick={handleUpdateChannelSettings}
                  className="inline-flex h-[40px] min-w-[102px] items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#4f9bff_0%,#327dff_100%)] px-5 text-base font-semibold text-white shadow-[0_10px_20px_rgba(63,140,255,0.34)] transition-[filter,box-shadow,transform] duration-[250ms] ease-out hover:shadow-[0_14px_26px_rgba(63,140,255,0.42)] hover:brightness-[1.03] active:scale-[0.99]"
                >
                  {t.dashboard.channels.settingsPanel.update}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </main>
  )
}
