'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import {
  CampaignStatus,
  CAMPAIGN_DETAILS,
  getArchivedStatusForCampaigns,
  getCampaignStatusesByType,
} from '@/lib/campaign-data'
import {
  saveStatusListState,
  restoreStatusListState,
  restoreScrollPosition,
  saveLastRoute,
} from '@/lib/route-state'
import {
  getAllCampaignCoverMedia,
  type CampaignCoverMedia,
} from '@/lib/campaign-media-storage'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'Đã duyệt/Lên lịch': { bg: '#d1fae5', text: '#047857' },
  'Nháp': { bg: '#fef3c7', text: '#92400e' },
  'Đã đăng': { bg: '#bfdbfe', text: '#1e40af' },
  'Đề xuất': { bg: '#e9d5ff', text: '#6b21a8' },
}

const CARD_THUMBNAIL_CLASS: Record<string, string> = {
  blue: 'bg-gradient-to-br from-[#9db4cd] via-[#b9cde3] to-[#d6e4f2]',
  dark: 'bg-gradient-to-br from-[#3a3840] to-[#2c2a35]',
  light: 'bg-gradient-to-br from-[#f5f5f7] to-[#e8e8eb]',
}

interface MarketingStatusPageProps {
  mode?: 'campaign' | 'ad'
}

export function MarketingStatusPage({ mode = 'campaign' }: MarketingStatusPageProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái')
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const statusMenuRef = useRef<HTMLDivElement | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignStatus[]>([])
  const [campaignCoverMediaMap, setCampaignCoverMediaMap] = useState<
    Record<string, CampaignCoverMedia>
  >({})

  // Restore state on mount
  useEffect(() => {
    // Apply archived status on mount and whenever we return to this page
    setCampaigns(getArchivedStatusForCampaigns(getCampaignStatusesByType(mode)))

    const savedState = restoreStatusListState()
    if (savedState) {
      setStatusFilter(savedState.statusFilter)
      // Restore scroll after a frame to ensure DOM is ready
      restoreScrollPosition(savedState.scrollY)
    }

    setCampaignCoverMediaMap(getAllCampaignCoverMedia())
    saveLastRoute(mode === 'ad' ? '/marketing/ads/status' : '/marketing/status')
  }, [mode])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleBackToMarketing = () => {
    saveStatusListState(statusFilter)
    router.push(mode === 'ad' ? '/marketing/ads' : '/marketing')
  }

  const handleViewDetail = () => {
    saveStatusListState(statusFilter)
  }

  const filteredCampaigns = useMemo(() => {
    if (statusFilter === 'Tất cả trạng thái') {
      return campaigns
    }
    return campaigns.filter((campaign) => campaign.status === statusFilter)
  }, [statusFilter, campaigns])

  const statusOptions = [
    'Tất cả trạng thái',
    'Đã duyệt/Lên lịch',
    'Nháp',
    'Đã đăng',
    'Đề xuất',
  ]

  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-col space-y-7 pt-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="pt-2 text-3xl font-bold leading-none text-[#1f2937]">Theo dõi trạng thái</h1>
        <button
          onClick={handleBackToMarketing}
          className="flex h-10 items-center gap-2 rounded-full border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#2f6fed] transition-colors hover:bg-[#f3f4f6]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </button>
      </div>

      <div ref={statusMenuRef} className="relative w-[188px]">
        <button
          type="button"
          onClick={() => setIsStatusMenuOpen((current) => !current)}
          className="flex h-12 w-full items-center justify-between rounded-xl border border-[#d1d5db] bg-white px-4 pr-10 text-left text-sm font-medium text-[#111827] outline-none transition-colors hover:border-[#c4cbd5] focus:border-[#2f6fed]"
        >
          <span className="block truncate">{statusFilter}</span>
        </button>
        <ChevronDown
          className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4b5563] transition-transform duration-200 ${
            isStatusMenuOpen ? 'rotate-180' : ''
          }`}
        />

        {isStatusMenuOpen && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-[14px] border border-[#d7def0] bg-white py-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.14)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setStatusFilter(option)
                  setIsStatusMenuOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#f3f7ff] ${
                  option === statusFilter ? 'font-semibold text-[#2f6fed]' : 'font-medium text-[#111827]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="rounded-xl bg-white px-6 py-12 text-center text-sm text-[#6b7280]">
            Không có chiến dịch nào
          </div>
        ) : (
          filteredCampaigns.map((campaign) => {
            const colors = STATUS_COLORS[campaign.status]
            const displayTitle =
              mode === 'ad'
                ? CAMPAIGN_DETAILS[campaign.id]?.content.trim().split('\n')[0] || campaign.title
                : campaign.title

            return (
              <Link
                key={`${campaign.id}-${campaign.status}`}
                href={mode === 'ad' ? `/marketing/ads/${campaign.id}` : `/marketing/${campaign.id}`}
                onClick={handleViewDetail}
                className="block rounded-xl border-2 border-[#dbeafe] bg-white px-4 py-4 transition-all cursor-pointer hover:border-[#bfdbfe] hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    {campaignCoverMediaMap[campaign.id]?.fileType.startsWith('image/') ? (
                      <img
                        src={campaignCoverMediaMap[campaign.id].fileUrl}
                        alt={campaignCoverMediaMap[campaign.id].fileName}
                        className="h-full w-full object-cover"
                      />
                    ) : campaignCoverMediaMap[campaign.id]?.fileType.startsWith('video/') ? (
                      <video
                        src={campaignCoverMediaMap[campaign.id].fileUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full bg-black object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full w-full ${CARD_THUMBNAIL_CLASS[campaign.tone]}`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-[#1f2937]">{displayTitle}</h3>

                    {/* Metadata */}
                    <div className="space-y-1 text-sm text-[#6b7280]">
                      {campaign.scheduledAt && (
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                          <span>Thời gian đăng: {campaign.scheduledAt}</span>
                          {campaign.timeRemaining && (
                            <span>Thời gian còn lại: {campaign.timeRemaining}</span>
                          )}
                        </div>
                      )}
                      {campaign.status === 'Đã đăng' && (
                        <div className="space-y-2">
                          <p>{campaign.status}</p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {campaign.progress !== undefined && (
                      <div className="flex items-center gap-3 pt-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e5e7eb]">
                          <div
                            className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa]"
                            style={{ width: `${campaign.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#1f2937]">
                          {campaign.progress}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div
                    className="flex min-w-[138px] flex-shrink-0 items-center justify-center rounded-lg px-4 py-2 text-center text-sm font-semibold"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {campaign.status}
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
