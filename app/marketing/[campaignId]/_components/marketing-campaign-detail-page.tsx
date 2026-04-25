'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Archive, ThumbsUp, Sparkles, CheckCircle2 } from 'lucide-react'
import {
  CAMPAIGN_DETAILS,
  CampaignDetail,
  CampaignStatus,
  archiveCampaign,
  deleteCampaign,
  getCampaignStatusById,
  getUserCreatedCampaigns,
  isArchived,
  updateCampaign,
} from '@/lib/campaign-data'
import { ConfirmActionModal } from '@/components/marketing/confirm-action-modal'
import { getLastRoute } from '@/lib/route-state'
import {
  getCampaignCoverMedia,
  removeCampaignCoverMedia,
  setCampaignCoverMedia,
  type CampaignCoverMedia,
} from '@/lib/campaign-media-storage'
import { toast } from '@/hooks/use-toast'

const CARD_THUMBNAIL_GRADIENT: Record<string, string> = {
  blue: 'bg-gradient-to-br from-[#667d99] via-[#8fa3c4] to-[#b4c8e1]',
  dark: 'bg-gradient-to-br from-[#3a3840] to-[#2c2a35]',
  light: 'bg-gradient-to-br from-[#f5f5f7] to-[#e8e8eb]',
}

interface FormData extends Omit<CampaignDetail, 'createdAt' | 'createdBy' | 'tone' | 'id'> {
  mediaPrompt?: string
}

interface MarketingCampaignDetailPageProps {
  campaignId: string
}

type UploadedMedia = CampaignCoverMedia

type StoredChannelPlatform = 'shopee' | 'facebook' | 'zaloOA' | 'tiktok' | 'instagram'

interface StoredChannelOption {
  id: string
  name: string
  displayName: string
  platform: StoredChannelPlatform
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const CHANNELS_STORAGE_KEY = 'nvx-dashboard-channels'
const PLATFORM_PLACEHOLDER = 'Bấm vào để chọn kênh'

function isStoredChannelOption(value: unknown): value is StoredChannelOption {
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
      channel.platform === 'instagram')
  )
}

function getStoredChannelOptions(): StoredChannelOption[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.sessionStorage.getItem(CHANNELS_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue: unknown = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter(isStoredChannelOption)
  } catch {
    return []
  }
}

function getChannelBadgeLabel(platform: StoredChannelPlatform) {
  switch (platform) {
    case 'facebook':
      return 'M'
    case 'zaloOA':
      return 'Z'
    case 'tiktok':
      return '♪'
    case 'instagram':
      return 'I'
    case 'shopee':
      return 'S'
    default:
      return '?'
  }
}

function getChannelBadgeClassName(platform: StoredChannelPlatform) {
  switch (platform) {
    case 'facebook':
      return 'bg-[#6366f1]'
    case 'zaloOA':
      return 'bg-[#2563eb]'
    case 'tiktok':
      return 'bg-[#0f172a]'
    case 'instagram':
      return 'bg-[#db2777]'
    case 'shopee':
      return 'bg-[#f97316]'
    default:
      return 'bg-[#6b7280]'
  }
}




export function MarketingCampaignDetailPage({ campaignId }: MarketingCampaignDetailPageProps) {
  const router = useRouter()
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [confirmType, setConfirmType] = useState<'delete' | 'archive' | 'remove-post' | null>(null)
  const [status, setStatus] = useState<CampaignStatus['status']>('Nháp')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    goal: '',
    message: '',
    format: '',
    platform: '',
    content: '',
    scheduledAt: '',
    mediaPrompt: '',
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(null)
  const [channelOptions, setChannelOptions] = useState<StoredChannelOption[]>([])
  const [isChannelMenuOpen, setIsChannelMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const channelMenuRef = useRef<HTMLDivElement | null>(null)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) {
      return
    }

    const resolvedCampaign =
      getUserCreatedCampaigns().find((item) => item.id === campaignId) || CAMPAIGN_DETAILS[campaignId] || null

    setCampaign(resolvedCampaign)

    if (resolvedCampaign) {
      setFormData({
        title: resolvedCampaign.title,
        goal: resolvedCampaign.goal,
        message: resolvedCampaign.message,
        format: resolvedCampaign.format,
        platform: resolvedCampaign.platform,
        content: resolvedCampaign.content,
        scheduledAt: resolvedCampaign.scheduledAt,
        mediaPrompt: '',
      })
    }

    if (isArchived(campaignId)) {
      setStatus('Đề xuất')
      return
    }

    setStatus(getCampaignStatusById(campaignId)?.status || 'Nháp')
  }, [campaignId, hasMounted])

  useEffect(() => {
    const savedMedia = getCampaignCoverMedia(campaignId)

    if (savedMedia) {
      setUploadedMedia(savedMedia)
    }
  }, [campaignId])

  useEffect(() => {
    setChannelOptions(getStoredChannelOptions())
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (channelMenuRef.current && !channelMenuRef.current.contains(event.target as Node)) {
        setIsChannelMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleBackNavigation = () => {
    const lastRoute = getLastRoute()

    if (lastRoute === '/marketing' || lastRoute === '/marketing/status') {
      router.back()
    } else {
      router.push('/marketing')
    }
  }

  if (!hasMounted) {
    return <div className="space-y-6" />
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="mb-4 text-2xl font-semibold text-[#1f2937]">Không tìm thấy chiến dịch</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg bg-[#2f6fed] px-6 py-3 font-medium text-white transition-colors hover:bg-[#1d4fd7]"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>
    )
  }

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const selectedChannelNames = formData.platform
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const handleToggleChannel = (channelName: string) => {
    const nextSelectedNames = selectedChannelNames.includes(channelName)
      ? selectedChannelNames.filter((item) => item !== channelName)
      : [...selectedChannelNames, channelName]

    handleInputChange('platform', nextSelectedNames.join(', '))
  }


  const persistCampaign = (nextStatus?: CampaignStatus['status']) => {
    updateCampaign(campaignId, {
      title: formData.title,
      goal: formData.goal,
      message: formData.message,
      format: formData.format,
      platform: formData.platform,
      content: formData.content,
      scheduledAt: formData.scheduledAt,
      status: nextStatus,
    })

    const updatedStatus = getCampaignStatusById(campaignId)?.status
    setStatus(updatedStatus || nextStatus || status)
  }

  const handleSave = () => {
    persistCampaign(status)
    setIsEditing(false)
    toast({
      duration: 2600,
      className:
        'border border-[#bbf7d0] bg-white shadow-[0_14px_30px_rgba(16,185,129,0.18)] rounded-xl px-4 py-3',
      title: (
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[#14532d]">Đã lưu thay đổi</span>
        </div>
      ),
      description: 'Thông tin chiến dịch đã được cập nhật.',
    })
  }

  const handleApprove = () => {
    persistCampaign('Đã duyệt/Lên lịch')
    setIsEditing(false)
    toast({
      duration: 2600,
      className:
        'border border-[#bfdbfe] bg-white shadow-[0_14px_30px_rgba(37,99,235,0.18)] rounded-xl px-4 py-3',
      title: (
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dbeafe] text-[#2563eb]">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[#1e3a8a]">Đã duyệt chiến dịch</span>
        </div>
      ),
      description: 'Chiến dịch đã chuyển sang trạng thái Đã duyệt/Lên lịch.',
    })
  }

  const handleDeleteConfirm = () => {
    deleteCampaign(campaignId)
    removeCampaignCoverMedia(campaignId)
    setConfirmType(null)

    toast({
      duration: 2600,
      className:
        'border border-[#fecaca] bg-white shadow-[0_14px_30px_rgba(220,38,38,0.16)] rounded-xl px-4 py-3',
      title: (
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fee2e2] text-[#dc2626]">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[#991b1b]">Đã xóa chiến dịch</span>
        </div>
      ),
      description: 'Chiến dịch đã được xóa khỏi danh sách.',
    })

    handleBackNavigation()
  }

  const handleArchiveConfirm = () => {
    archiveCampaign(campaignId)
    setStatus('Đề xuất')
    setConfirmType(null)

    toast({
      duration: 2600,
      className:
        'border border-[#fde68a] bg-white shadow-[0_14px_30px_rgba(217,119,6,0.2)] rounded-xl px-4 py-3',
      title: (
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fef3c7] text-[#b45309]">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[#78350f]">Đã lưu trữ chiến dịch</span>
        </div>
      ),
      description: 'Chiến dịch đã được chuyển sang trạng thái Đề xuất.',
    })

    router.push('/marketing')
  }

  const handleRemovePostConfirm = () => {
    persistCampaign('Đề xuất')
    setConfirmType(null)

    toast({
      duration: 2600,
      className:
        'border border-[#fde68a] bg-white shadow-[0_14px_30px_rgba(217,119,6,0.2)] rounded-xl px-4 py-3',
      title: (
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fef3c7] text-[#b45309]">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[#78350f]">Đã gỡ bài viết</span>
        </div>
      ),
      description: 'Chiến dịch đã được chuyển sang trạng thái Đề xuất.',
    })

    router.push('/marketing/status')
  }

  const handleUploadClick = () => {
    if (!isEditing) {
      toast({
        duration: 2200,
        className:
          'border border-[#fde68a] bg-white shadow-[0_14px_30px_rgba(217,119,6,0.2)] rounded-xl px-4 py-3',
        title: 'Chưa bật chế độ cập nhật',
        description: 'Vui lòng bấm Cập nhật trước khi sửa hình ảnh hoặc video.',
      })
      return
    }

    if (isUploading) {
      return
    }

    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) {
      event.target.value = ''
      return
    }

    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (selectedFile.size > MAX_UPLOAD_BYTES) {
      setUploadError('Dung lượng tệp vượt quá 10MB.')
      event.target.value = ''
      return
    }

    const isSupportedType =
      selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')

    if (!isSupportedType) {
      setUploadError('Chỉ hỗ trợ tệp hình ảnh hoặc video.')
      event.target.value = ''
      return
    }

    try {
      setIsUploading(true)
      setUploadError('')

      const uploadPayload = new FormData()
      uploadPayload.append('file', selectedFile)
      uploadPayload.append('campaignId', campaignId)

      const response = await fetch('/api/marketing/upload', {
        method: 'POST',
        body: uploadPayload,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData?.error || 'Không thể tải tệp lên.')
      }

      const nextUploadedMedia: UploadedMedia = {
        fileUrl: responseData.fileUrl,
        fileName: responseData.fileName,
        fileType: responseData.fileType,
        fileSize: responseData.fileSize,
      }

      setUploadedMedia(nextUploadedMedia)
      setCampaignCoverMedia(campaignId, nextUploadedMedia)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Không thể tải tệp lên.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const displayData = {
    title: formData.title,
    goal: formData.goal,
    message: formData.message,
    format: formData.format,
    platform: formData.platform,
    content: formData.content,
    scheduledAt: formData.scheduledAt,
  }

  return (
    <div className="space-y-6 pt-5 pr-4">
      {/* Modal */}
      <ConfirmActionModal
        isOpen={confirmType !== null}
        type={confirmType || 'delete'}
        onConfirm={
          confirmType === 'delete'
            ? handleDeleteConfirm
            : confirmType === 'remove-post'
              ? handleRemovePostConfirm
              : handleArchiveConfirm
        }
        onCancel={() => setConfirmType(null)}
      />


      {/* Back button */}
      <button
        onClick={handleBackNavigation}
        className="flex items-center gap-2 text-sm font-semibold text-[#2f6fed] transition-colors hover:text-[#1d4fd7]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Quay lại</span>
      </button>

      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - Campaign Info */}
        <div className="col-span-2 space-y-6">
          <div className="min-h-[700px] overflow-visible rounded-2xl bg-white shadow-sm">
            {/* Blue Header */}
            <div className="h-14 bg-[#2f6fed] flex items-center px-8">
              <h2 className="text-xl font-semibold text-white">Thông tin chung</h2>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 px-8 py-8 pb-10">
              {/* Campaign Name */}
              <div className="flex gap-8 items-start">
                <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">
                  Tên chiến dịch <span className="text-red-500 ml-1">*</span>
                </label>
                  <input
                    type="text"
                    value={displayData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    readOnly={!isEditing}
                    className={`h-10 w-full rounded-[10px] border px-4 text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed] ${
                      isEditing
                        ? 'border-[#d1d5db] bg-white text-[#201926] placeholder-[#9ca3af]'
                        : 'border-[#e5e7eb] bg-[#f9fafb] text-[#201926]'
                    }`}
                  />
              </div>

              {/* Goal */}
              <div className="flex gap-8 items-start">
                <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">Mục tiêu</label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={displayData.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    readOnly={!isEditing}
                    className={`h-10 w-full rounded-[10px] border px-4 text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed] ${
                      isEditing
                        ? 'border-[#d1d5db] bg-white text-[#201926] placeholder-[#9ca3af]'
                        : 'border-[#e5e7eb] bg-[#f9fafb] text-[#201926]'
                    }`}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex gap-8 items-start">
                <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">Thông điệp</label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={displayData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    readOnly={!isEditing}
                    className={`h-10 w-full rounded-[10px] border px-4 text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed] ${
                      isEditing
                        ? 'border-[#d1d5db] bg-white text-[#201926] placeholder-[#9ca3af]'
                        : 'border-[#e5e7eb] bg-[#f9fafb] text-[#201926]'
                    }`}
                  />
                </div>
              </div>

              {/* Format */}
              <div className="flex gap-8 items-start">
                <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">Hình thức</label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={displayData.format}
                    onChange={(e) => handleInputChange('format', e.target.value)}
                    readOnly={!isEditing}
                    className={`h-10 w-full rounded-[10px] border px-4 text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed] ${
                      isEditing
                        ? 'border-[#d1d5db] bg-white text-[#201926] placeholder-[#9ca3af]'
                        : 'border-[#e5e7eb] bg-[#f9fafb] text-[#201926]'
                    }`}
                  />
                </div>
              </div>

              {/* Platform */}
              <div className="flex gap-8 items-start">
                <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">
                  Nền tảng đăng <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="w-full max-w-[220px]">
                  <div ref={channelMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isEditing) {
                          return
                        }

                        setIsChannelMenuOpen((current) => !current)
                      }}
                      className={`flex min-h-10 w-full items-center justify-between rounded-[10px] border px-3 py-2 text-left text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:outline-none ${
                        isEditing
                          ? 'border-[#d1d5db] bg-[#f8fafc] text-[#4b5563] hover:border-[#2f6fed] focus:border-[#2f6fed] focus:ring-1 focus:ring-[#2f6fed]'
                          : 'border-[#e5e7eb] bg-[#f9fafb] text-[#9ca3af]'
                      }`}
                    >
                      <span className="block truncate">
                        {displayData.platform || PLATFORM_PLACEHOLDER}
                      </span>
                      <span
                        className={`ml-2 shrink-0 transition-transform ${
                          isChannelMenuOpen ? 'rotate-180' : ''
                        }`}
                      >
                        ▾
                      </span>
                    </button>

                    {isEditing && isChannelMenuOpen && (
                      <div className="absolute left-0 top-[calc(100%+10px)] z-20 w-[420px] max-w-[calc(100vw-96px)] rounded-[18px] border border-[#d7def0] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(15,23,42,0.14)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
                        <h3 className="text-[18px] font-semibold text-[#30323a]">Hỗ trợ đăng nhiều kênh</h3>

                        <div className="mt-4 max-h-[280px] space-y-3 overflow-y-auto pr-1">
                          {channelOptions.map((channel) => {
                            const isSelected = selectedChannelNames.includes(channel.name)

                            return (
                              <button
                                key={channel.id}
                                type="button"
                                onClick={() => handleToggleChannel(channel.name)}
                                className="flex w-full items-center gap-3 text-left"
                              >
                                <span
                                  className={`flex h-8 w-8 items-center justify-center rounded-[6px] border-2 transition-colors ${
                                    isSelected ? 'border-[#2563eb] bg-[#2563eb]' : 'border-[#111111] bg-white'
                                  }`}
                                >
                                  {isSelected && <span className="h-3 w-3 rounded-[2px] bg-white" />}
                                </span>
                                <span className="flex flex-1 items-center gap-3 rounded-[18px] bg-white px-5 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
                                  <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getChannelBadgeClassName(channel.platform)}`}
                                  >
                                    {getChannelBadgeLabel(channel.platform)}
                                  </span>
                                  <span className="text-[16px] font-medium text-[#111827]">{channel.name}</span>
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Campaign Content */}
              <div className="flex gap-8 items-start">
                <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">
                  Nội dung chiến dịch <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex-1">
                  <textarea
                    value={displayData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    readOnly={!isEditing}
                    rows={10}
                    className={`min-h-[240px] w-full resize-none rounded-[10px] border px-4 py-3 text-sm leading-relaxed shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed] ${
                      isEditing
                        ? 'border-[#d1d5db] bg-white text-[#201926] placeholder-[#9ca3af]'
                        : 'border-[#e5e7eb] bg-[#f9fafb] text-[#201926]'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Actions */}
        <div className="w-[360px] max-w-full space-y-6">
          {/* Title */}
          <h3 className="text-lg font-semibold text-[#1f2937]">Tải hình ảnh/video</h3>

          {/* Main Preview Card */}
          <div className="h-56 overflow-hidden rounded-2xl shadow-sm">
            {uploadedMedia?.fileType.startsWith('image/') ? (
              <img
                src={uploadedMedia.fileUrl}
                alt={uploadedMedia.fileName}
                className="h-full w-full object-cover"
              />
            ) : uploadedMedia?.fileType.startsWith('video/') ? (
              <video
                src={uploadedMedia.fileUrl}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full bg-black object-cover"
              />
            ) : (
              <div className={`h-full w-full ${CARD_THUMBNAIL_GRADIENT[campaign.tone]}`} />
            )}
          </div>

          {/* Media Row */}
          <div className="flex gap-3">
            {/* Demo Card */}
            <div className="relative flex-1 overflow-hidden rounded-lg border border-[#9bb8ff] bg-[#1d4fd7] shadow-sm">
              {uploadedMedia ? (
                uploadedMedia.fileType.startsWith('image/') ? (
                  <img
                    src={uploadedMedia.fileUrl}
                    alt={uploadedMedia.fileName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={uploadedMedia.fileUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full bg-black object-cover"
                  />
                )
              ) : (
                <div className="h-full min-h-[94px] w-full bg-[#1d4fd7]" />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b2f92]/25 via-transparent to-[#0b2f92]/35" />

              <div className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-[#163fbd]/90 px-2 py-1 text-white shadow-[0_4px_10px_rgba(4,25,92,0.35)]">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="text-[11px] font-semibold leading-none">Demo: Robot AI</p>
              </div>
            </div>

            {/* Upload Placeholder */}
            <div className="flex-1 space-y-1.5">
              <input
                id={`campaign-upload-input-${campaignId}`}
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                id={`campaign-upload-trigger-${campaignId}`}
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                className={`w-full overflow-hidden rounded-[16px] border-2 border-dashed border-[#c7954b] bg-gradient-to-b from-[#79a9ff] to-[#5f79c9] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all ${
                  isUploading
                    ? 'cursor-not-allowed opacity-80'
                    : 'hover:from-[#83b1ff] hover:to-[#6885d4]'
                }`}
              >
                <div className="flex min-h-[108px] flex-col items-center justify-center text-center">
                  <div className="relative mb-2.5 h-11 w-11">
                    <span className="absolute left-0 top-1 h-7 w-7 rounded-[9px] border-2 border-white/80 bg-white/10" />
                    <span className="absolute bottom-0 right-0 h-7 w-7 rounded-[9px] border-2 border-white/90 bg-white/15" />
                    <span className="absolute -right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[13px] font-bold leading-none text-[#5f7ecf] shadow-sm">
                      +
                    </span>
                  </div>
                  <p className="text-sm font-semibold leading-tight text-white/95">
                    {isUploading ? 'Đang tải lên...' : 'Hình ảnh/Video'}
                  </p>
                  <p className="text-sm leading-tight text-white/90">
                    {isUploading ? 'Vui lòng chờ trong giây lát' : 'không quá 10MB'}
                  </p>
                </div>
              </button>
              {uploadError && <p className="text-[11px] font-medium text-[#dc2626]">{uploadError}</p>}
            </div>
          </div>

          {/* AI Media Prompt Row */}
          <div
            className={`mt-1 flex items-center gap-1.5 rounded-[12px] border border-[#d1d5db] bg-white px-3 py-2 shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] ${
              isEditing ? '' : 'invisible pointer-events-none'
            }`}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2f6fed]">
              <span className="text-xs font-bold text-white">A3</span>
            </div>
            <input
              type="text"
              value={formData.mediaPrompt || ''}
              onChange={(e) => handleInputChange('mediaPrompt' as keyof FormData, e.target.value)}
              placeholder="Mô tả hình ảnh hay video..."
              className="h-8 flex-1 rounded-full border border-[#ccdafd] bg-white px-3 text-xs text-[#1f2937] placeholder-[#9ca3af] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed]"
            />
            <button className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#7c3aed] transition-colors hover:bg-[#6d28d9]">
              <Sparkles className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Scheduled Time */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1f2937] block">
              Thời gian đăng <span className="text-red-500 ml-1">*</span>
            </label>
              <input
                type="text"
                value={displayData.scheduledAt}
                onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                placeholder="DD/MM/YYYY, HH:mm"
                inputMode="numeric"
                readOnly={!isEditing}
                className={`h-10 w-full rounded-[10px] border px-4 text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed] ${
                  isEditing
                    ? 'border-[#d1d5db] bg-white text-[#201926] placeholder-[#9ca3af]'
                    : 'border-[#e5e7eb] bg-white font-medium text-[#201926]'
                }`}
              />
              <p className="text-xs text-[#9ca3af]">Định dạng bắt buộc: DD/MM/YYYY, HH:mm. Ví dụ: 25/04/2026, 09:30</p>
          </div>

          {/* Metadata */}
          <div className="space-y-1 text-xs text-[#9ca3af]">
            <p>
              {status === 'Đã đăng' ? 'Thời gian tạo:' : 'Thời gian tạo:'} {campaign.createdAt}
            </p>
            <p>{status === 'Đã đăng' ? 'Tạo bởi:' : 'Tạo bởi:'} {campaign.createdBy}</p>
            <p>{status === 'Đã đăng' ? 'Duyệt bởi: Thanh Thanh' : `Trạng thái: ${status}`}</p>
          </div>

          {/* Action Buttons */}
          {isEditing ? (
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2f6fed] px-4 py-3 font-semibold text-white text-sm transition-colors hover:bg-[#1d4fd7]"
            >
              Cập nhật
            </button>
          ) : status === 'Đã đăng' ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmType('remove-post')}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#fee2e2] px-4 py-3 font-semibold text-[#ef4444] text-sm transition-colors hover:bg-[#fecaca]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Gỡ bài</span>
              </button>
              <button
                type="button"
                onClick={handleBackNavigation}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#e8f0ff] px-4 py-3 font-semibold text-[#2f6fed] text-sm transition-colors hover:bg-[#dbe8ff]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#d1fae5] px-4 py-3 font-semibold text-[#047857] text-sm transition-colors hover:bg-[#a7f3d0]"
              >
                <Edit className="w-4 h-4" />
                <span>Sửa</span>
              </button>
              <button
                onClick={() => setConfirmType('delete')}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#fee2e2] px-4 py-3 font-semibold text-[#dc2626] text-sm transition-colors hover:bg-[#fecaca]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa</span>
              </button>
              <button
                onClick={() => setConfirmType('archive')}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#e5e7eb] px-4 py-3 font-semibold text-[#6b7280] text-sm transition-colors hover:bg-[#d1d5db]"
              >
                <Archive className="w-4 h-4" />
                <span>Lưu trữ</span>
              </button>
              <button
                onClick={handleApprove}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#2f6fed] px-4 py-3 font-semibold text-white text-sm transition-colors hover:bg-[#1d4fd7]"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Duyệt</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
