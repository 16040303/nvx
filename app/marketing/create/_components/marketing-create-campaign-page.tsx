'use client'

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, ImagePlus, Sparkles, CheckCircle2, X } from 'lucide-react'
import { createCampaign } from '@/lib/campaign-data'
import {
  setCampaignCoverMedia,
  type CampaignCoverMedia,
} from '@/lib/campaign-media-storage'
import { toast } from '@/hooks/use-toast'

interface FormData {
  title: string
  goal: string
  message: string
  format: string
  platform: string
  content: string
  scheduledAt: string
  mediaPrompt: string
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

interface MarketingCreateCampaignPageProps {
  mode?: 'campaign' | 'ad'
}

export function MarketingCreateCampaignPage({ mode = 'campaign' }: MarketingCreateCampaignPageProps) {
  const router = useRouter()
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
  const [uploadedMediaList, setUploadedMediaList] = useState<UploadedMedia[]>([])
  const [channelOptions, setChannelOptions] = useState<StoredChannelOption[]>([])
  const [isChannelMenuOpen, setIsChannelMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const channelMenuRef = useRef<HTMLDivElement | null>(null)
  const draftCampaignIdRef = useRef(`draft-${Date.now()}`)

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

  const selectedChannelNames = useMemo(
    () =>
      formData.platform
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [formData.platform],
  )

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleToggleChannel = (channelName: string) => {
    const nextSelectedNames = selectedChannelNames.includes(channelName)
      ? selectedChannelNames.filter((item) => item !== channelName)
      : [...selectedChannelNames, channelName]

    handleInputChange('platform', nextSelectedNames.join(', '))
  }

  const isAdsMode = mode === 'ad'
  const detailLabel = isAdsMode ? 'quảng cáo' : 'chiến dịch'
  const defaultTitle = isAdsMode ? 'Quảng cáo mới' : 'Chiến dịch mới'
  const backRoute = isAdsMode ? '/marketing/ads' : '/marketing'

  const handleSave = (status: 'Đã duyệt/Lên lịch' | 'Nháp') => {
    const newCampaignId = createCampaign({
      title: formData.title || defaultTitle,
      goal: formData.goal,
      message: formData.message,
      format: formData.format,
      platform: formData.platform || 'Bấm vào để chọn kênh',
      content: formData.content,
      scheduledAt: formData.scheduledAt,
      status,
      type: mode,
    })

    if (uploadedMediaList.length > 0) {
      setCampaignCoverMedia(newCampaignId, uploadedMediaList[0])
    }

    const isDraft = status === 'Nháp'

    toast({
      duration: 2600,
      className: isDraft
        ? 'border border-[#fde68a] bg-white shadow-[0_14px_30px_rgba(217,119,6,0.2)] rounded-xl px-4 py-3'
        : 'border border-[#bfdbfe] bg-white shadow-[0_14px_30px_rgba(37,99,235,0.18)] rounded-xl px-4 py-3',
      title: (
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              isDraft ? 'bg-[#fef3c7] text-[#b45309]' : 'bg-[#dbeafe] text-[#2563eb]'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span className={`text-sm font-semibold ${isDraft ? 'text-[#78350f]' : 'text-[#1e3a8a]'}`}>
            {isDraft ? `Đã lưu nháp ${detailLabel}` : `Đã lưu và duyệt ${detailLabel}`}
          </span>
        </div>
      ),
      description: isDraft
        ? `${isAdsMode ? 'Quảng cáo' : 'Chiến dịch'} đã được lưu với trạng thái Nháp.`
        : `${isAdsMode ? 'Quảng cáo' : 'Chiến dịch'} đã được lưu với trạng thái Đã duyệt/Lên lịch.`,
    })

    router.push(backRoute)
  }

  const handleBack = () => {
    router.back()
  }

  const handleUploadClick = () => {
    if (isUploading) {
      return
    }

    fileInputRef.current?.click()
  }

  const handleRemoveUploadedMedia = (mediaIndex: number) => {
    setUploadedMediaList((previousList) => previousList.filter((_, index) => index !== mediaIndex))
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])

    if (selectedFiles.length === 0) {
      return
    }

    const validFiles: File[] = []
    let validationError = ''

    selectedFiles.forEach((selectedFile) => {
      if (selectedFile.size > MAX_UPLOAD_BYTES) {
        if (!validationError) {
          validationError = 'Có tệp vượt quá 10MB. Vui lòng kiểm tra lại.'
        }
        return
      }

      const isSupportedType =
        selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')

      if (!isSupportedType) {
        if (!validationError) {
          validationError = 'Chỉ hỗ trợ tải lên tệp hình ảnh hoặc video.'
        }
        return
      }

      validFiles.push(selectedFile)
    })

    if (validFiles.length === 0) {
      setUploadError(validationError || 'Không có tệp hợp lệ để tải lên.')
      event.target.value = ''
      return
    }

    try {
      setIsUploading(true)
      setUploadError('')

      const uploadedBatch: UploadedMedia[] = []
      let uploadErrorMessage = ''

      for (const selectedFile of validFiles) {
        try {
          const uploadPayload = new FormData()
          uploadPayload.append('file', selectedFile)
          uploadPayload.append('campaignId', draftCampaignIdRef.current)

          const response = await fetch('/api/marketing/upload', {
            method: 'POST',
            body: uploadPayload,
          })

          const responseData = await response.json()

          if (!response.ok) {
            throw new Error(responseData?.error || 'Không thể tải hình ảnh lên.')
          }

          uploadedBatch.push({
            fileUrl: responseData.fileUrl,
            fileName: responseData.fileName,
            fileType: responseData.fileType,
            fileSize: responseData.fileSize,
          })
        } catch (error) {
          if (!uploadErrorMessage) {
            uploadErrorMessage =
              error instanceof Error ? error.message : 'Không thể tải hình ảnh lên.'
          }
        }
      }

      if (uploadedBatch.length > 0) {
        setUploadedMediaList((previousList) => [...previousList, ...uploadedBatch])
      }

      if (validationError || uploadErrorMessage) {
        setUploadError(validationError || uploadErrorMessage)
      }
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-5 pt-2">
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - Campaign Info */}
        <div className="col-span-2 space-y-6 pt-3">
          <div className="min-h-[620px] overflow-visible rounded-2xl border border-[#e6ebf3] bg-white shadow-[0_2px_10px_rgba(31,41,55,0.05)]">
            {/* Blue Header */}
            <div className="flex h-12 items-center bg-[#3d82eb] px-6">
              <h2 className="text-xl font-semibold text-white">Thông tin chung</h2>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 px-6 py-6 pb-8">
              {/* Campaign Name */}
              <div className="flex gap-8 items-start">
                <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">
                  {isAdsMode ? 'Tên chiến dịch' : 'Tên chiến dịch'} <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="h-10 w-full rounded-[10px] border border-[#d1d5db] bg-white px-4 text-sm text-[#201926] placeholder-[#9ca3af] shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed]"
                  />
                </div>
              </div>

              {!isAdsMode && (
                <>
                  {/* Goal */}
                  <div className="flex gap-8 items-start">
                    <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">Mục tiêu</label>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.goal}
                        onChange={(e) => handleInputChange('goal', e.target.value)}
                        className="h-10 w-full rounded-[10px] border border-[#d1d5db] bg-white px-4 text-sm text-[#201926] placeholder-[#9ca3af] shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed]"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex gap-8 items-start">
                    <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">Thông điệp</label>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="h-10 w-full rounded-[10px] border border-[#d1d5db] bg-white px-4 text-sm text-[#201926] placeholder-[#9ca3af] shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed]"
                      />
                    </div>
                  </div>

                  {/* Format */}
                  <div className="flex gap-8 items-start">
                    <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">Hình thức</label>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.format}
                        onChange={(e) => handleInputChange('format', e.target.value)}
                        className="h-10 w-full rounded-[10px] border border-[#d1d5db] bg-white px-4 text-sm text-[#201926] placeholder-[#9ca3af] shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Platform */}
              <div className="flex gap-8 items-start">
                <label className="w-40 pt-3 text-sm font-semibold text-[#1f2937] flex-shrink-0">
                  Nền tảng đăng <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="w-full max-w-[220px]">
                  <div ref={channelMenuRef} className="relative">
                    <button
                      id="marketing-channel-select"
                      type="button"
                      onClick={() => setIsChannelMenuOpen((current) => !current)}
                      className="flex min-h-10 w-full items-center justify-between rounded-[10px] border border-[#d1d5db] bg-[#f8fafc] px-3 py-2 text-sm text-[#4b5563] transition-colors focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed]"
                    >
                      <span className={selectedChannelNames.length > 0 ? 'truncate text-[#4b5563]' : 'truncate text-[#6b7280]'}>
                        {formData.platform || PLATFORM_PLACEHOLDER}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 flex-shrink-0 text-[#6b7280] transition-transform ${
                          isChannelMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isChannelMenuOpen && (
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1f2937]">
                  Nội dung {isAdsMode ? 'quảng cáo' : 'chiến dịch'} <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Hãy viết nội dung gì đó..."
                  className="min-h-[190px] w-full resize-none rounded-[10px] border border-transparent bg-transparent px-0 py-2 text-sm text-[#201926] placeholder-[#9ca3af] focus:border-transparent focus:outline-none focus:ring-0"
                  rows={8}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Actions */}
        <div className="col-span-1 w-[360px] max-w-full space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-semibold leading-none text-[#1f2937]">Tải hình ảnh/video</h3>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-[#e6eefc] bg-white px-3.5 text-[14px] font-semibold text-[#3b82f6] shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-colors hover:bg-[#f8fbff]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </button>
          </div>

          <div className="rounded-xl bg-gradient-to-b from-[#6ca8ff] via-[#7395ee] to-[#7569d7] p-2 shadow-[0_10px_24px_rgba(76,81,191,0.3)]">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
              className={`w-full rounded-[10px] p-2 transition ${
                isUploading ? 'cursor-wait opacity-90' : 'cursor-pointer'
              }`}
            >
              <div className="flex h-[344px] w-full items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-[#7f95df] bg-white/8">
                <div className="flex flex-col items-center text-center text-white">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] border-4 border-white/70 bg-white/10">
                    <ImagePlus className="h-10 w-10" strokeWidth={2.2} />
                  </div>
                  <p className="text-xl font-medium leading-tight">Hình ảnh/Video</p>
                  <p className="mt-1 text-sm text-white/80">không quá 10MB</p>
                  <p className="mt-1 text-[11px] font-medium text-white/75">Có thể chọn nhiều tệp</p>
                  {isUploading && <p className="mt-2 text-xs font-medium">Đang tải lên...</p>}
                </div>
              </div>
            </button>

            {uploadedMediaList.length > 0 && (
              <div className="mt-3 rounded-lg border border-white/45 bg-white/18 p-2.5">
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                  {uploadedMediaList.map((uploadedMedia, index) => (
                    <div
                      key={`${uploadedMedia.fileUrl}-${index}`}
                      className="relative h-[58px] w-[58px] flex-shrink-0 overflow-hidden rounded-md border border-[#dbeafe] bg-white shadow-[0_3px_8px_rgba(30,64,175,0.22)]"
                    >
                      {uploadedMedia.fileType.startsWith('image/') ? (
                        <img
                          src={uploadedMedia.fileUrl}
                          alt={uploadedMedia.fileName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <video
                          src={uploadedMedia.fileUrl}
                          muted
                          playsInline
                          className="h-full w-full bg-black object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveUploadedMedia(index)}
                        className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[#ef4444] text-white shadow-[0_2px_5px_rgba(185,28,28,0.45)] transition hover:bg-[#dc2626]"
                        aria-label="Xóa tệp đã tải"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center gap-1.5">
              <div className="relative inline-flex h-8 min-w-[68px] items-center justify-center rounded-full bg-gradient-to-b from-[#3f90ff] to-[#2559da] px-3.5 text-sm font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_4px_10px_rgba(37,99,235,0.38)]">
                <span className="leading-none">Aa</span>
                <Sparkles className="absolute right-2 top-1 h-3 w-3 text-white/95" />
              </div>
              <input
                type="text"
                value={formData.mediaPrompt}
                onChange={(e) => handleInputChange('mediaPrompt', e.target.value)}
                placeholder="Mô tả hình ảnh hay video..."
                className="h-8 flex-1 rounded-full border border-[#ccdafd] bg-white/95 px-3 text-xs text-[#1f2937] placeholder-[#9ca3af] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed]"
              />
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1 rounded-full bg-[#2f6fed] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#245cd0]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>+Tạo</span>
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          {uploadError && <p className="text-xs font-medium text-[#dc2626]">{uploadError}</p>}

          {/* Scheduled Time */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1f2937] block">
              Thời gian đăng <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.scheduledAt}
              onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
              placeholder="dd/mm/yyyy, 00:00"
              className="h-10 w-[160px] rounded-[10px] border border-[#d1d5db] bg-white px-4 text-sm text-[#201926] placeholder-[#9ca3af] shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[#2f6fed] focus:outline-none focus:ring-1 focus:ring-[#2f6fed]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => handleSave('Nháp')}
              className="rounded-lg border border-[#d1d5db] bg-[#f3f4f6] px-4 py-2 text-sm font-semibold text-[#4b5563] shadow-sm transition-colors hover:bg-[#e5e7eb]"
            >
              Lưu nháp
            </button>
            <button
              onClick={() => handleSave('Đã duyệt/Lên lịch')}
              className="rounded-lg bg-[#3b82f6] px-6 py-2 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(59,130,246,0.35)] transition-colors hover:bg-[#2f6fed]"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
