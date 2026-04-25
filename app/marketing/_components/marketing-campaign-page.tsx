'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type TransitionEvent,
} from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  Plus,
  Sparkles,
  ChevronRight,
  Link2,
  Paperclip,
  PencilLine,
  X,
  List,
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import {
  saveCampaignListState,
  restoreCampaignListState,
  restoreScrollPosition,
  saveLastRoute,
} from '@/lib/route-state'
import {
  getAllCampaignCoverMedia,
  type CampaignCoverMedia,
} from '@/lib/campaign-media-storage'
import {
  createCampaign,
  CAMPAIGN_DETAILS,
  CAMPAIGN_STATUSES,
  getUserCreatedCampaigns,
  isCampaignDeleted,
} from '@/lib/campaign-data'

interface CampaignIdeaItem {
  id: string
  title: string
  imageSrc: string
  imageAlt: string
  isUserCreated?: boolean
  linkLabel?: string
}

// Các chiến dịch mẫu hiển thị sẵn khi chưa có nội dung do người dùng tạo.
const CAMPAIGN_IDEAS: CampaignIdeaItem[] = [
  {
    id: 'idea-1',
    title: 'Ra mắt sản phẩm Robot AI-Care (Người cao tuổi)',
    imageSrc: '/images/campaign-thumb-child-robot.svg',
    imageAlt: 'Người dùng trải nghiệm Robot AI-Care',
  },
  {
    id: 'idea-3',
    title: 'Mua cho Ba Mẹ - Dùng dễ hơn cả TV',
    imageSrc: '/images/campaign-thumb-elderly-product.svg',
    imageAlt: 'Người lớn tuổi dùng thiết bị AI thân thiện',
  },
  {
    id: 'idea-4',
    title: 'Cai nghiện iPad - Để Robot AI làm bạn cùng bé',
    imageSrc: '/images/campaign-thumb-child-robot.svg',
    imageAlt: 'Robot AI làm bạn cùng bé',
  },
  {
    id: 'idea-7',
    title: 'Ra mắt sản phẩm Robot AI-Care (Người cao tuổi)',
    imageSrc: '/images/campaign-thumb-elderly-product.svg',
    imageAlt: 'Robot AI-Care hỗ trợ người cao tuổi',
  },
]

// Nội dung mẫu để tạo nhanh bản nháp chiến dịch.
const GENERATED_GOALS = [
  'Tăng nhận diện chiến dịch trên các kênh truyền thông',
  'Thu hút khách hàng tiềm năng quan tâm đến sản phẩm',
  'Khuyến khích người xem để lại tương tác và tin nhắn',
]

const GENERATED_MESSAGES = [
  'Nhấn mạnh lợi ích nổi bật và lời kêu gọi hành động rõ ràng',
  'Truyền tải thông điệp gần gũi, dễ nhớ và có tính chia sẻ',
  'Tạo cảm giác cấp bách nhẹ để tăng tỷ lệ phản hồi',
]

const GENERATED_FORMATS = [
  'Bài đăng văn bản + 1 hình ảnh minh họa',
  'Bài đăng ngắn kèm visual dạng social post',
  'Bài đăng giới thiệu sản phẩm + CTA bình luận/inbox',
]

const GENERATED_CONTENT_OPENERS = [
  'Bạn đang tìm một cách mới để tiếp cận khách hàng hiệu quả hơn?',
  'Đây là thời điểm phù hợp để biến ý tưởng thành một chiến dịch nổi bật.',
  'Nếu bạn muốn nội dung thu hút ngay từ những dòng đầu tiên, mẫu bài này là một gợi ý phù hợp.',
]

const GENERATED_CONTENT_BENEFITS = [
  'Làm nổi bật giá trị chính chỉ trong vài giây đầu tiên.',
  'Tăng khả năng giữ chân người xem bằng thông điệp ngắn gọn, rõ ràng.',
  'Giúp khách hàng dễ hiểu, dễ nhớ và dễ hành động hơn.',
]

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function buildGeneratedCampaignContent(ideaTitle: string) {
  return `${pickRandom(GENERATED_CONTENT_OPENERS)}

${ideaTitle}

Điểm nhấn nội dung:
◆ ${pickRandom(GENERATED_CONTENT_BENEFITS)}
◆ Tập trung vào nhu cầu thực tế của khách hàng mục tiêu.
◆ Kết thúc bằng lời kêu gọi hành động như bình luận, nhắn tin hoặc đăng ký tư vấn.

Gợi ý CTA:
Inbox ngay để nhận tư vấn chi tiết và kịch bản triển khai phù hợp.`
}

interface MarketingCampaignPageProps {
  showCampaignListButton?: boolean
}

export function MarketingCampaignPage({ showCampaignListButton = false }: MarketingCampaignPageProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

  // Quản lý nội dung người dùng nhập để AI sinh bài.
  const [ideaQuery, setIdeaQuery] = useState('')
  const [postQuantity, setPostQuantity] = useState('')
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false)

  // Giữ carousel di chuyển mượt và không trượt quá danh sách.
  const carouselViewportRef = useRef<HTMLDivElement | null>(null)
  const carouselTrackRef = useRef<HTMLDivElement | null>(null)
  const transitionTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const generateStatusTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const isAnimatingRef = useRef(false)
  const targetIndexRef = useRef(0)
  const [cardOffsets, setCardOffsets] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)

  // Quản lý danh sách chiến dịch và media hiển thị trên các card.
  const [campaignCoverMediaMap, setCampaignCoverMediaMap] = useState<
    Record<string, CampaignCoverMedia>
  >({})
  const [campaignIdeas, setCampaignIdeas] = useState<CampaignIdeaItem[]>(CAMPAIGN_IDEAS)

  // Quản lý link và file đính kèm trong thanh nhập ý tưởng.
  const [copiedLinkValue, setCopiedLinkValue] = useState('')
  const [isCopiedLinkVisible, setIsCopiedLinkVisible] = useState(false)
  const [isCampaignListVisible, setIsCampaignListVisible] = useState(false)
  const [uploadedToolbarFileName, setUploadedToolbarFileName] = useState('')
  const toolbarFileInputRef = useRef<HTMLInputElement | null>(null)
  const campaignListRef = useRef<HTMLDivElement | null>(null)

  // Dọn timeout để tránh trạng thái chờ hoặc animation bị treo.
  const clearTransitionTimeout = useCallback(() => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current)
      transitionTimeoutRef.current = null
    }
  }, [])

  const clearGenerateStatusTimeout = useCallback(() => {
    if (generateStatusTimeoutRef.current !== null) {
      window.clearTimeout(generateStatusTimeoutRef.current)
      generateStatusTimeoutRef.current = null
    }
  }, [])

  const scheduleTransitionSettle = useCallback(() => {
    clearTransitionTimeout()
    transitionTimeoutRef.current = window.setTimeout(() => {
      transitionTimeoutRef.current = null
      isAnimatingRef.current = false
    }, 560)
  }, [clearTransitionTimeout])

  // Đo vị trí card để nút mũi tên cuộn đúng khoảng cách.
  const measureCarousel = useCallback(() => {
    const viewport = carouselViewportRef.current
    const track = carouselTrackRef.current

    clearTransitionTimeout()
    isAnimatingRef.current = false

    if (!viewport || !track) {
      setCardOffsets([])
      setCurrentIndex(0)
      setMaxIndex(0)
      targetIndexRef.current = 0
      return
    }

    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-carousel-card="true"]'))
    const nextOffsets = cards.map((card) => card.offsetLeft)

    const maxTranslateX = Math.max(track.scrollWidth - viewport.clientWidth, 0)

    let nextMaxIndex = 0
    nextOffsets.forEach((offset, index) => {
      if (offset <= maxTranslateX + 1) {
        nextMaxIndex = index
      }
    })

    const clampedIndex = Math.max(0, Math.min(targetIndexRef.current, nextMaxIndex))
    targetIndexRef.current = clampedIndex

    setCardOffsets(nextOffsets)
    setMaxIndex(nextMaxIndex)
    setCurrentIndex(clampedIndex)
  }, [clearTransitionTimeout])

  // Khôi phục dữ liệu nhập cũ và danh sách chiến dịch khi quay lại trang.
  useEffect(() => {
    const savedState = restoreCampaignListState()
    if (savedState) {
      setIdeaQuery(savedState.ideaQuery)
      setPostQuantity(savedState.postQuantity)
      // Đợi giao diện sẵn sàng rồi mới khôi phục vị trí cuộn.
      restoreScrollPosition(savedState.scrollY)
    }

    const generatedIdeas: CampaignIdeaItem[] = getUserCreatedCampaigns()
      .filter((campaign) => campaign.source === 'generated')
      .map((campaign) => ({
        id: campaign.id,
        title: campaign.title,
        imageSrc: '/images/campaign-thumb-elderly-product.svg',
        imageAlt: campaign.title,
        isUserCreated: true,
        linkLabel: campaign.linkLabel,
      }))

    const availableBaseIdeas = (showCampaignListButton
      ? CAMPAIGN_STATUSES.filter((campaign) => campaign.type === 'ad')
          .filter((campaign) => !isCampaignDeleted(campaign.id))
          .map((campaign) => {
            const adContent = CAMPAIGN_DETAILS[campaign.id]?.content.trim().split('\n')[0]

            return {
              id: campaign.id,
              title: adContent || campaign.title,
              imageSrc: '/images/campaign-thumb-elderly-product.svg',
              imageAlt: campaign.title,
            }
          })
      : CAMPAIGN_IDEAS.filter((idea) => !isCampaignDeleted(idea.id)))

    setCampaignIdeas([...generatedIdeas, ...availableBaseIdeas])
    setCampaignCoverMediaMap(getAllCampaignCoverMedia())
    saveLastRoute(showCampaignListButton ? '/marketing/ads' : '/marketing')
  }, [showCampaignListButton])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        campaignListRef.current &&
        !campaignListRef.current.contains(event.target as Node)
      ) {
        setIsCampaignListVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Lưu dữ liệu đang nhập trước khi chuyển sang màn khác.
  const handleNavigateToStatus = () => {
    saveCampaignListState(ideaQuery, postQuantity)
    const statusBasePath = pathname.startsWith('/marketing/ads') ? '/marketing/ads/status' : '/marketing/status'
    router.push(statusBasePath)
  }

  const handleNavigateToCreate = () => {
    saveCampaignListState(ideaQuery, postQuantity)
    const createBasePath = pathname.startsWith('/marketing/ads') ? '/marketing/ads/create' : '/marketing/create'
    router.push(createBasePath)
  }

  const handleViewDetail = (campaignId: string) => {
    saveCampaignListState(ideaQuery, postQuantity)
    const detailBasePath = pathname.startsWith('/marketing/ads') ? '/marketing/ads' : '/marketing'
    router.push(`${detailBasePath}/${campaignId}`)
  }

  // Tạo bản nháp sau khi người dùng nhập đủ ý tưởng và số lượng.
  const handleGeneratePosts = () => {
    const normalizedIdea = ideaQuery.trim()
    const hasIdea = normalizedIdea.length > 0
    const hasQuantity = postQuantity.trim().length > 0

    if (!hasIdea || !hasQuantity) {
      setIsGeneratingPosts(false)
      clearGenerateStatusTimeout()
      return
    }

    setIsGeneratingPosts(true)
    clearGenerateStatusTimeout()
    generateStatusTimeoutRef.current = window.setTimeout(() => {
      const generatedCampaignId = createCampaign({
        title: normalizedIdea,
        goal: pickRandom(GENERATED_GOALS),
        message: pickRandom(GENERATED_MESSAGES),
        format: pickRandom(GENERATED_FORMATS),
        platform: 'Bấm vào để chọn kênh',
        content: buildGeneratedCampaignContent(normalizedIdea),
        scheduledAt: '',
        status: 'Nháp',
        source: 'generated',
        linkLabel: copiedLinkValue.trim() || undefined,
        type: pathname.startsWith('/marketing/ads') ? 'ad' : 'campaign',
      })

      const generatedPreview = pickRandom(CAMPAIGN_IDEAS)

      setCampaignIdeas((currentIdeas) => [
        {
          id: generatedCampaignId,
          title: normalizedIdea,
          imageSrc: generatedPreview.imageSrc,
          imageAlt: normalizedIdea,
          isUserCreated: true,
          linkLabel: copiedLinkValue.trim() || undefined,
        },
        ...currentIdeas,
      ])

      generateStatusTimeoutRef.current = null
      setIsGeneratingPosts(false)
      setIdeaQuery('')
      setPostQuantity('')
      setCopiedLinkValue('')
      setIsCopiedLinkVisible(false)
      setCurrentIndex(0)
      targetIndexRef.current = 0
    }, 3200)
  }

  const filteredIdeas = campaignIdeas

  useEffect(() => {
    measureCarousel()
  }, [measureCarousel, filteredIdeas.length])

  useEffect(() => {
    const handleResize = () => {
      measureCarousel()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [measureCarousel])

  useEffect(() => {
    return () => {
      clearTransitionTimeout()
      clearGenerateStatusTimeout()
      isAnimatingRef.current = false
    }
  }, [clearTransitionTimeout, clearGenerateStatusTimeout])

  // Điều khiển nút cuộn trái/phải của carousel.
  const moveCarouselBy = useCallback(
    (direction: 'prev' | 'next') => {
      if (cardOffsets.length === 0) {
        return
      }

      const step = direction === 'next' ? 1 : -1
      const nextIndex = Math.max(0, Math.min(targetIndexRef.current + step, maxIndex))

      if (nextIndex === targetIndexRef.current) {
        return
      }

      targetIndexRef.current = nextIndex
      isAnimatingRef.current = true
      setCurrentIndex(nextIndex)
      scheduleTransitionSettle()
    },
    [cardOffsets.length, maxIndex, scheduleTransitionSettle],
  )

  const handleTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== 'transform') {
        return
      }

      isAnimatingRef.current = false
      clearTransitionTimeout()
    },
    [clearTransitionTimeout],
  )

  const handleScrollLeft = () => {
    moveCarouselBy('prev')
  }

  const handleScrollRight = () => {
    moveCarouselBy('next')
  }

  const canScrollLeft = currentIndex > 0
  const canScrollRight = currentIndex < maxIndex
  const currentTranslateX = cardOffsets[currentIndex] ?? 0

  // Xử lý các thao tác trên thanh nhập ý tưởng.
  const handleToolbarLinkClick = useCallback(() => {
    setCopiedLinkValue('')
    setIsCopiedLinkVisible(true)
  }, [])

  const handleCloseCopiedLink = useCallback(() => {
    setIsCopiedLinkVisible(false)
  }, [])

  const handleToolbarCampaignListClick = useCallback(() => {
    setIsCopiedLinkVisible(true)
    setIsCampaignListVisible((currentValue) => !currentValue)
  }, [])

  const handleSelectCampaignLink = useCallback((campaignTitle: string) => {
    setCopiedLinkValue(campaignTitle)
    setIsCopiedLinkVisible(true)
    setIsCampaignListVisible(false)
  }, [])

  const handleToolbarFileClick = useCallback(() => {
    toolbarFileInputRef.current?.click()
  }, [])

  const handleToolbarFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      setUploadedToolbarFileName(selectedFile?.name ?? '')
      event.target.value = ''
    },
    [],
  )

  return (
    <div className="space-y-7 pb-2">
      {/* Tiêu đề chính */}
      <section className="mx-auto max-w-[720px] pt-1 text-center">
        <h1 className="text-balance text-[40px] font-bold leading-[1.08] tracking-[-0.03em] text-[#2f6fed] md:text-[46px]">
          AI hỗ trợ tạo bài viết từ dữ liệu
        </h1>
        <div className="mt-1 flex items-end justify-center gap-2">
          <p className="text-[40px] font-bold leading-[1.02] tracking-[-0.03em] text-[#2f6fed] md:text-[46px]">
            hệ thống
          </p>
          <span className="mb-1 inline-flex items-center justify-center rounded-full bg-white/80 p-1.5 text-[#2f6fed] shadow-[0_6px_16px_rgba(47,111,237,0.18)]">
            <PencilLine className="h-5 w-5" strokeWidth={2.1} />
          </span>
        </div>
      </section>

      {/* Thanh nhập ý tưởng để AI sinh bài */}
      <section className="mx-auto w-full max-w-[920px]">
        <div className="rounded-[22px] border border-[#95bdfa] bg-gradient-to-b from-[#d8e8ff] to-[#cde1ff] p-[6px] shadow-[0_10px_24px_rgba(47,111,237,0.22)]">
          <div className="flex flex-wrap items-center gap-2 rounded-[18px] border border-white/70 bg-[#d4e6ff] px-2 py-2">
            <div className="flex h-[42px] min-w-[280px] flex-1 items-center gap-3 rounded-[14px] border border-[#a7c6f8] bg-white px-3.5">
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#2f6fed] px-2 text-[12px] font-semibold text-white shadow-[0_4px_10px_rgba(47,111,237,0.35)]">
                A+
              </span>
              <input
                type="text"
                value={ideaQuery}
                onChange={(event) => setIdeaQuery(event.target.value)}
                placeholder="Nhập ý tưởng để AI đề xuất"
                className="flex-1 bg-transparent text-[14px] text-[#1f2937] outline-none placeholder:text-[#b7bfce]"
              />
            </div>

            <input
              type="text"
              inputMode="numeric"
              value={postQuantity}
              onChange={(event) => setPostQuantity(event.target.value)}
              placeholder="Nhập số lượng"
              className="h-[42px] w-[122px] rounded-[12px] border border-[#a7c6f8] bg-white px-3 text-[14px] text-[#1f2937] outline-none placeholder:text-[#b7bfce]"
            />

            <div
              ref={campaignListRef}
              className="relative flex h-[42px] items-center gap-[2px] rounded-[14px] border border-[#76a7f9] bg-white px-1.5 shadow-[0_3px_10px_rgba(47,111,237,0.14)]"
            >
              <button
                type="button"
                onClick={handleToolbarLinkClick}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] text-[#2f6fed] transition-colors hover:bg-[#eef4ff]"
              >
                <Link2 className="h-4.5 w-4.5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={handleToolbarFileClick}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] text-[#2f6fed] transition-colors hover:bg-[#eef4ff]"
              >
                <Paperclip className="h-4.5 w-4.5" strokeWidth={2} />
              </button>
              {showCampaignListButton && (
                <button
                  type="button"
                  onClick={handleToolbarCampaignListClick}
                  className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] transition-colors ${
                    isCampaignListVisible
                      ? 'bg-[#eef4ff] text-[#2f6fed]'
                      : 'text-[#2f6fed] hover:bg-[#eef4ff]'
                  }`}
                >
                  <List className="h-4.5 w-4.5" strokeWidth={2} />
                </button>
              )}

              <input
                ref={toolbarFileInputRef}
                type="file"
                className="hidden"
                onChange={handleToolbarFileChange}
              />

              {isCampaignListVisible && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-[420px] max-w-[calc(100vw-40px)] rounded-[22px] border border-[#d7e7ff] bg-white p-4 shadow-[0_18px_34px_rgba(47,111,237,0.2)]">
                  <p className="text-[16px] font-semibold text-[#1f2937]">Liên kết chiến dịch</p>
                  <div className="mt-3 max-h-[154px] space-y-2.5 overflow-y-auto pr-1">
                    {campaignIdeas.map((campaign) => (
                      <button
                        key={campaign.id}
                        type="button"
                        onClick={() => handleSelectCampaignLink(campaign.title)}
                        className="flex w-full items-center gap-3 rounded-full border border-[#3f82ff] bg-[#eef5ff] px-4 py-2.5 text-left transition-colors hover:bg-[#e1eeff]"
                      >
                        <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#325fe0] shadow-[0_5px_12px_rgba(50,95,224,0.14)]">
                          <Link2 className="h-4.5 w-4.5" strokeWidth={2.2} />
                        </span>
                        <span className="truncate text-[14px] font-medium text-[#1f2937] underline underline-offset-4">
                          {campaign.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleGeneratePosts}
              className="flex h-[42px] items-center justify-center gap-2 rounded-[14px] border border-[#79a7ff] bg-gradient-to-b from-[#4d8dff] to-[#2f6fed] px-4.5 text-[18px] font-semibold text-white shadow-[0_10px_20px_rgba(47,111,237,0.34)] transition-all hover:from-[#5a97ff] hover:to-[#356ff2]"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span className="text-[17px]">Sinh bài</span>
            </button>
          </div>

          {isCopiedLinkVisible && (
            <div className="mt-2 flex items-center gap-2 rounded-[16px] border-2 border-dashed border-[#6ea2ff] bg-white px-3 py-2 shadow-[0_6px_16px_rgba(47,111,237,0.14)]">
              <input
                type="text"
                value={copiedLinkValue}
                onChange={(event) => setCopiedLinkValue(event.target.value)}
                placeholder="Dán liên kết vào đây..."
                className="flex-1 bg-transparent text-[15px] font-medium text-[#4d84f7] outline-none placeholder:text-[#9bb7f8]"
              />
              <button
                type="button"
                onClick={handleCloseCopiedLink}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#1f2937] transition-colors hover:bg-[#f3f4f6]"
              >
                <X className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </div>
          )}

          {uploadedToolbarFileName && (
            <div className="mt-2 inline-flex max-w-full items-center">
              <div className="group inline-flex max-w-full items-center gap-2 rounded-full border border-[#9ac0ff] bg-white px-3 py-1.5 text-[13px] font-medium text-[#2f6fed] shadow-[0_4px_12px_rgba(47,111,237,0.12)]">
                <Paperclip className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
                <span className="truncate">{uploadedToolbarFileName}</span>
                <button
                  type="button"
                  onClick={() => setUploadedToolbarFileName('')}
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[#5b6475] opacity-0 transition-opacity hover:bg-[#eef4ff] hover:text-[#1f2937] group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trạng thái tạm thời khi hệ thống đang tạo bản nháp */}
      {isGeneratingPosts && (
        <div className="-mt-1 flex justify-center px-1">
          <div className="inline-flex items-center gap-2 text-[20px] font-medium leading-none text-[#2f6fed]">
            <span>AI đang tạo</span>
            <Sparkles className="h-4.5 w-4.5 text-[#2f6fed]" strokeWidth={2.2} />
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-[#2f6fed]" />
              <span className="h-2.5 w-2.5 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-[#2f6fed] [animation-delay:150ms]" />
              <span className="h-2.5 w-2.5 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-[#2f6fed] [animation-delay:300ms]" />
            </span>
          </div>
        </div>
      )}

      {/* Nút tạo chiến dịch mới và xem trạng thái tạo bài */}
      <section className="flex items-center gap-3 px-1">
        <p className="text-[24px] font-semibold leading-none text-[#2f6fed]">AI gợi ý bài viết</p>
        <button
          type="button"
          onClick={handleNavigateToCreate}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2f6fed] text-white shadow-[0_8px_16px_rgba(47,111,237,0.28)] transition-colors hover:bg-[#245cd0]"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2.2} />
        </button>
        <button
          onClick={handleNavigateToStatus}
          className="flex h-[48px] items-center justify-center gap-3 rounded-full border border-[#5a87f4] bg-gradient-to-r from-[#4348c7] via-[#3c66db] to-[#2f82f5] px-6 text-[16px] font-semibold text-white shadow-[0_10px_20px_rgba(49,97,224,0.32)] transition-all hover:brightness-105"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-[9px] border-2 border-white/90 bg-white/10">
            <svg viewBox="0 0 20 20" className="h-[14px] w-[14px]" fill="none" aria-hidden="true">
              <line x1="4.2" y1="5.2" x2="15.8" y2="5.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
              <rect x="4.2" y="8.5" width="2.2" height="2.2" rx="0.55" fill="currentColor" />
              <line x1="8.3" y1="9.6" x2="15.3" y2="9.6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
              <rect x="4.2" y="12.2" width="2.2" height="2.2" rx="0.55" fill="currentColor" />
              <line x1="8.3" y1="13.3" x2="15.3" y2="13.3" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
            </svg>
          </span>
          <span className="leading-none">Theo dõi trạng thái</span>
        </button>
      </section>

      {/* Danh sách chiến dịch gợi ý có thể cuộn ngang */}
      <section className="relative">
        {filteredIdeas.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center text-sm text-[#6b7280]">
            {t.dashboard.marketingCampaign.emptyState}
          </div>
        ) : (
          <div ref={carouselViewportRef} className="overflow-hidden pb-3">
            <div
              ref={carouselTrackRef}
              onTransitionEnd={handleTrackTransitionEnd}
              className="flex min-w-max gap-4 will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translate3d(-${currentTranslateX}px, 0, 0)` }}
            >
              {filteredIdeas.map((idea) => {
                const coverMedia = campaignCoverMediaMap[idea.id]

                return (
                  <article
                    key={idea.id}
                    data-carousel-card="true"
                    className="w-[264px] flex-shrink-0 rounded-[16px] border border-[#e7edf8] bg-white p-3 shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.1)]"
                  >
                    <div className="relative h-[120px] overflow-hidden rounded-[12px] bg-[#edf3fb]">
                      {coverMedia?.fileType.startsWith('image/') ? (
                        <img
                          src={coverMedia.fileUrl}
                          alt={coverMedia.fileName}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : coverMedia?.fileType.startsWith('video/') ? (
                        <video
                          src={coverMedia.fileUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="h-full w-full bg-black object-cover object-center"
                        />
                      ) : (
                        <Image
                          src={idea.imageSrc}
                          alt={idea.imageAlt}
                          fill
                          sizes="290px"
                          className="object-cover object-center"
                        />
                      )}
                    </div>

                    <div className="pt-3">
                      <h3 className="line-clamp-2 min-h-[40px] text-[14px] font-semibold leading-[1.34] text-[#23344c]">
                        {idea.title}
                      </h3>

                      {showCampaignListButton && (
                        <div className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-[#2f6fed]">
                          <Link2 className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
                          <span className="truncate">{idea.linkLabel?.trim() || 'Không có'}</span>
                        </div>
                      )}

                      <p
                        className={`mt-3 text-[11px] font-medium tracking-[0.01em] ${
                          idea.isUserCreated ? 'text-[#ef4444]' : 'text-[#7e8ca5]'
                        }`}
                      >
                        {idea.isUserCreated ? 'Đề xuất mới' : 'Đề xuất'}
                      </p>

                      <button
                        onClick={() => handleViewDetail(idea.id)}
                        className="mt-2.5 h-[36px] w-full rounded-[9px] bg-[#d7e6ff] text-[13px] font-semibold text-[#2a57bd] transition-colors hover:bg-[#c8dcff]"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {filteredIdeas.length > 0 && canScrollLeft && (
          <button
            type="button"
            id="marketing-campaign-carousel-prev"
            onClick={handleScrollLeft}
            aria-label="Xem thẻ chiến dịch trước"
            className="absolute -left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce6f8] bg-white text-[#1f2937] shadow-md transition-colors hover:bg-[#f3f4f6]"
          >
            <ChevronRight className="h-5 w-5 rotate-180" strokeWidth={2} />
          </button>
        )}

        {filteredIdeas.length > 0 && canScrollRight && (
          <button
            type="button"
            id="marketing-campaign-carousel-next"
            onClick={handleScrollRight}
            aria-label="Xem thẻ chiến dịch tiếp theo"
            className="absolute -right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce6f8] bg-white text-[#1f2937] shadow-md transition-colors hover:bg-[#f3f4f6]"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        )}
      </section>
    </div>
  )
}
