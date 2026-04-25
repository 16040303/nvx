export interface CampaignDetail {
  id: string
  title: string
  goal: string
  message: string
  format: string
  platform: string
  content: string
  createdAt: string
  scheduledAt: string
  createdBy: string
  tone: 'blue' | 'dark' | 'light'
  source?: 'manual' | 'generated'
  linkLabel?: string
}

export interface CampaignStatus {
  id: string
  title: string
  status: 'Đã duyệt/Lên lịch' | 'Nháp' | 'Đã đăng' | 'Đề xuất'
  scheduledAt?: string
  timeRemaining?: string
  progress?: number
  tone: 'blue' | 'dark' | 'light'
  type?: 'campaign' | 'ad'
}

function parseCampaignScheduledAt(value?: string): Date | null {
  if (!value) {
    return null
  }

  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})(?:,\s*(\d{2}):(\d{2}))?$/)

  if (!match) {
    return null
  }

  const [, day, month, year, hours = '00', minutes = '00'] = match
  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    0,
    0,
  )

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

function normalizeScheduledCampaignStatus(campaign: CampaignStatus): CampaignStatus {
  if (campaign.status !== 'Đã duyệt/Lên lịch') {
    return campaign
  }

  const scheduledDate = parseCampaignScheduledAt(campaign.scheduledAt)

  if (!scheduledDate || scheduledDate.getTime() > Date.now()) {
    return campaign
  }

  return {
    ...campaign,
    status: 'Đã đăng',
    timeRemaining: undefined,
    progress: 100,
  }
}

export const CAMPAIGN_DETAILS: Record<string, CampaignDetail> = {
  'idea-1': {
    id: 'idea-1',
    title: 'Ra mắt sản phẩm Robot AI-Care (Người cao tuổi)',
    goal: 'Thu hút sự chú ý của tệp khách hàng đang theo dõi trang',
    message: 'Giải pháp giúp con cái an tâm khi không ở cạnh cha mẹ',
    format: 'Bài đăng văn bản + 01 Hình ảnh sản phẩm + 1 video demo',
    platform: 'Bấm vào để chọn kênh',
    content: `Chào mọi người,

Sau một thời gian dài nghiên cứu phản hồi từ khách hàng, công ty nhận thấy rất nhiều anh chị đang tìm kiếm một thiết bị hỗ trợ cha mẹ lớn tuổi ở nhà nhưng lại sợ các cụ không biết sử dụng đồ công nghệ.

Hôm nay, chúng tôi chính thức giới thiệu dòng sản phẩm mới: Robot AI-Care - Phiên bản dành riêng cho người cao tuổi.

Điểm khác biệt lớn nhất của phiên bản này:

◆ Không chạm, không nút bấm phức tạp: Mọi thao tác đều dùng giọng nói tiếng Việt.
◆ Trợ lý sức khỏe: Tự động nhắc nhở giờ uống thuốc hằng ngày.
◆ Kết nối tức thì: Ra lệnh bằng giọng nói để gọi Video thẳng vào điện thoại con cháu.`,
    createdAt: '17/03/2026',
    scheduledAt: '22/03/2026, 09:00',
    createdBy: 'AI',
    tone: 'blue',
  },
  'idea-2': {
    id: 'idea-2',
    title: 'Lễ tân AI 5 Sao - Không bao giờ xin nghỉ phép',
    goal: 'Tăng nhận biết về dịch vụ lễ tân AI',
    message: 'Quảng cáo về tính năng tự động hóa lịch làm việc',
    format: 'Bài đăng văn bản + 1 video demo',
    platform: 'Bấm vào để chọn kênh',
    content: `Chào mọi người,

Giới thiệu Lễ tân AI 5 Sao - Trợ lý tiếp tân tự động 24/7.

Lợi ích chính:
◆ Không bao giờ xin nghỉ phép
◆ Trả lời nhanh chóng và chính xác
◆ Hỗ trợ đa ngôn ngữ`,
    createdAt: '16/03/2026',
    scheduledAt: '23/03/2026, 14:00',
    createdBy: 'AI',
    tone: 'dark',
  },
  'idea-3': {
    id: 'idea-3',
    title: 'Mua cho Ba Mẹ - Dùng dễ hơn cả TV',
    goal: 'Tăng doanh số bán sản phẩm cho nhân khẩu cao tuổi',
    message: 'Nhấn mạnh tính dễ sử dụng của sản phẩm',
    format: 'Bài đăng văn bản + 2 hình ảnh',
    platform: 'Bấm vào để chọn kênh',
    content: `Chào mọi người,

Sản phẩm Robot AI-Care được thiết kế đặc biệt cho người cao tuổi.

Đơn giản và dễ dùng:
◆ Giao diện trực quan
◆ Điều khiển bằng giọng nói
◆ Hỗ trợ 24/7`,
    createdAt: '18/03/2026',
    scheduledAt: '24/03/2026, 10:00',
    createdBy: 'AI',
    tone: 'light',
  },
  'idea-4': {
    id: 'idea-4',
    title: 'Cai nghiện iPad - Để Robot AI làm bạn cùng bé',
    goal: 'Ra mắt sản phẩm Robot AI-Care (Người cao tuổi)',
    message: 'Thu hút sự chú ý của tệp khách hàng đang theo dõi trang',
    format: 'Bài đăng văn bản + 01 Hình ảnh sản phẩm + 1 video demo',
    platform: 'Bấm vào để chọn kênh',
    content: `Chào mọi người,

Sau một thời gian dài nghiên cứu cần phải hỗ trợ cha mẹ lớn tuổi ở nhà nhưng lại sợ các cụ không biết sử dụng đồ công nghệ.

Hôm nay, chúng tôi chính thức giới thiệu đồng sản phẩm mới: Robot AI-Care - Phiên bản dành riêng cho người cao tuổi.

Điểm khác biệt lớn nhất của phiên bản này:

◆ Không chạm, không nút bấm phức tạp: Mọi trao tác đều dùng giọng nói tiếng Việt.
◆ Trợ lý sức khỏe: Từ dùng nhắc nhở giờ uống thuốc hàng ngày.
◆ Kết nối tức thi: Ra lệnh bằng giọng nói để gọi Video thẳng vào điện thoại`,
    createdAt: '17/03/2026',
    scheduledAt: '22/03/2026, 09:00',
    createdBy: 'AI',
    tone: 'blue',
  },
  'idea-5': {
    id: 'idea-5',
    title: 'Lễ tân AI 5 Sao - Không bao giờ xin nghỉ phép',
    goal: 'Tăng nhận biết về dịch vụ lễ tân AI',
    message: 'Quảng cáo về tính năng tự động hóa lịch làm việc',
    format: 'Bài đăng văn bản + 1 video demo',
    platform: 'Bấm vào để chọn kênh',
    content: `Chào mọi người,

Giới thiệu Lễ tân AI 5 Sao - Trợ lý tiếp tân tự động 24/7.

Lợi ích chính:
◆ Không bao giờ xin nghỉ phép
◆ Trả lời nhanh chóng và chính xác
◆ Hỗ trợ đa ngôn ngữ`,
    createdAt: '16/03/2026',
    scheduledAt: '23/03/2026, 14:00',
    createdBy: 'AI',
    tone: 'dark',
  },
  'idea-6': {
    id: 'idea-6',
    title: 'Mua cho Ba Mẹ - Dùng dễ hơn cả TV',
    goal: 'Tăng doanh số bán sản phẩm cho nhân khẩu cao tuổi',
    message: 'Nhấn mạnh tính dễ sử dụng của sản phẩm',
    format: 'Bài đăng văn bản + 2 hình ảnh',
    platform: 'Bấm vào để chọn kênh',
    content: `Chào mọi người,

Sản phẩm Robot AI-Care được thiết kế đặc biệt cho người cao tuổi.

Đơn giản và dễ dùng:
◆ Giao diện trực quan
◆ Điều khiển bằng giọng nói
◆ Hỗ trợ 24/7`,
    createdAt: '18/03/2026',
    scheduledAt: '24/03/2026, 10:00',
    createdBy: 'AI',
    tone: 'light',
  },
  'idea-7': {
    id: 'idea-7',
    title: 'Cai nghiện iPad - Để Robot AI làm bạn cùng bé',
    goal: 'Ra mắt sản phẩm Robot AI-Care (Người cao tuổi)',
    message: 'Thu hút sự chú ý của tệp khách hàng đang theo dõi trang',
    format: 'Bài đăng văn bản + 01 Hình ảnh sản phẩm + 1 video demo',
    platform: 'Bấm vào để chọn kênh',
    content: `Chào mọi người,

Sau một thời gian dài nghiên cứu cần phải hỗ trợ cha mẹ lớn tuổi ở nhà nhưng lại sợ các cụ không biết sử dụng đồ công nghệ.

Hôm nay, chúng tôi chính thức giới thiệu đồng sản phẩm mới: Robot AI-Care - Phiên bản dành riêng cho người cao tuổi.`,
    createdAt: '17/03/2026',
    scheduledAt: '22/03/2026, 09:00',
    createdBy: 'AI',
    tone: 'blue',
  },
  'idea-8': {
    id: 'idea-8',
    title: 'Lễ tân AI 5 Sao - Không bao giờ xin nghỉ phép',
    goal: 'Tăng nhận biết về dịch vụ lễ tân AI',
    message: 'Quảng cáo về tính năng tự động hóa lịch làm việc',
    format: 'Bài đăng văn bản + 1 video demo',
    platform: 'Bấm vào để chọn kênh',
    content: `Chào mọi người,

Giới thiệu Lễ tân AI 5 Sao - Trợ lý tiếp tân tự động 24/7.

Lợi ích chính:
◆ Không bao giờ xin nghỉ phép
◆ Trả lời nhanh chóng và chính xác
◆ Hỗ trợ đa ngôn ngữ`,
    createdAt: '16/03/2026',
    scheduledAt: '23/03/2026, 14:00',
    createdBy: 'AI',
    tone: 'dark',
  },
  'ad-idea-1': {
    id: 'ad-idea-1',
    title: 'Quảng cáo: Ra mắt sản phẩm Robot AI-Care (Người cao tuổi)',
    goal: 'Tăng lượt quan tâm cho chiến dịch Robot AI-Care',
    message: 'Robot AI-Care giúp con cái an tâm chăm sóc ba mẹ từ xa',
    format: 'Bài quảng cáo Facebook + hình ảnh chiến dịch',
    platform: 'Facebook, Zalo OA',
    content: `Ba mẹ ở nhà một mình nhưng con cái vẫn có thể an tâm hơn.

Robot AI-Care hỗ trợ nhắc lịch uống thuốc, gọi video nhanh và trò chuyện bằng tiếng Việt tự nhiên.

Đăng ký tư vấn hôm nay để xem demo chăm sóc người cao tuổi tại nhà.`,
    createdAt: '24/04/2026',
    scheduledAt: '26/04/2026, 09:00',
    createdBy: 'AI',
    tone: 'blue',
  },
  'ad-idea-3': {
    id: 'ad-idea-3',
    title: 'Quảng cáo: Mua cho Ba Mẹ - Dùng dễ hơn cả TV',
    goal: 'Thúc đẩy khách hàng mua Robot AI-Care cho ba mẹ',
    message: 'Dễ dùng, gần gũi và phù hợp với người lớn tuổi',
    format: 'Bài quảng cáo Zalo OA + hình ảnh minh họa',
    platform: 'Zalo OA, Facebook',
    content: `Một thiết bị công nghệ nhưng ba mẹ có thể dùng thật dễ dàng.

Robot AI-Care hỗ trợ điều khiển bằng giọng nói, nhắc lịch sinh hoạt và kết nối nhanh với con cháu.

Inbox để nhận tư vấn mẫu phù hợp cho gia đình bạn.`,
    createdAt: '24/04/2026',
    scheduledAt: '27/04/2026, 14:00',
    createdBy: 'AI',
    tone: 'light',
  },
  'ad-idea-4': {
    id: 'ad-idea-4',
    title: 'Quảng cáo: Cai nghiện iPad - Để Robot AI làm bạn cùng bé',
    goal: 'Thu hút phụ huynh quan tâm đến Robot AI đồng hành cùng trẻ',
    message: 'Tạo hoạt động tương tác lành mạnh thay vì phụ thuộc màn hình',
    format: 'Bài quảng cáo Facebook + hình ảnh social post',
    platform: 'Facebook, Instagram',
    content: `Bé cần một người bạn tương tác thay vì chỉ ngồi trước màn hình?

Robot AI có thể trò chuyện, gợi ý hoạt động học tập và đồng hành cùng bé theo cách vui vẻ hơn.

Đăng ký để xem kịch bản trải nghiệm dành cho gia đình có trẻ nhỏ.`,
    createdAt: '24/04/2026',
    scheduledAt: '24/04/2026, 10:00',
    createdBy: 'AI',
    tone: 'blue',
  },
  'ad-idea-7': {
    id: 'ad-idea-7',
    title: 'Quảng cáo: Robot AI-Care đồng hành cùng người cao tuổi',
    goal: 'Tăng chuyển đổi cho nhóm khách hàng chăm sóc người thân',
    message: 'Một người bạn công nghệ giúp ba mẹ an tâm hơn mỗi ngày',
    format: 'Bài quảng cáo Facebook + ảnh sản phẩm',
    platform: 'Facebook, Shopee',
    content: `Không phải lúc nào con cái cũng có thể ở cạnh ba mẹ.

Robot AI-Care hỗ trợ nhắc nhở, trò chuyện và kết nối nhanh để gia đình luôn gần nhau hơn.

Nhận tư vấn ngay để chọn gói triển khai phù hợp.`,
    createdAt: '24/04/2026',
    scheduledAt: '28/04/2026, 08:30',
    createdBy: 'AI',
    tone: 'blue',
  },
}

export const CAMPAIGN_STATUSES: CampaignStatus[] = [
  {
    id: 'idea-1',
    title: 'Ra mắt sản phẩm Robot AI-Care (Người cao tuổi)',
    status: 'Đã duyệt/Lên lịch',
    scheduledAt: '22/03/2026, 09:00',
    timeRemaining: '5 ngày 4 tiếng',
    tone: 'blue',
  },
  {
    id: 'idea-3',
    title: 'Mua cho Ba Mẹ - Dùng dễ hơn cả TV',
    status: 'Nháp',
    tone: 'light',
  },
  {
    id: 'idea-4',
    title: 'Cai nghiện iPad - Để Robot AI làm bạn cùng bé',
    status: 'Đã đăng',
    progress: 100,
    tone: 'blue',
  },
  {
    id: 'idea-7',
    title: 'Ra mắt sản phẩm Robot AI-Care (Người cao tuổi)',
    status: 'Đã duyệt/Lên lịch',
    scheduledAt: '22/03/2026, 09:00',
    timeRemaining: '5 ngày 4 tiếng',
    tone: 'blue',
  },
  {
    id: 'ad-idea-1',
    title: 'Quảng cáo: Ra mắt sản phẩm Robot AI-Care (Người cao tuổi)',
    status: 'Đã duyệt/Lên lịch',
    scheduledAt: '26/04/2026, 09:00',
    timeRemaining: '1 ngày 9 tiếng',
    tone: 'blue',
    type: 'ad',
  },
  {
    id: 'ad-idea-3',
    title: 'Quảng cáo: Mua cho Ba Mẹ - Dùng dễ hơn cả TV',
    status: 'Nháp',
    tone: 'light',
    type: 'ad',
  },
  {
    id: 'ad-idea-4',
    title: 'Quảng cáo: Cai nghiện iPad - Để Robot AI làm bạn cùng bé',
    status: 'Đã đăng',
    progress: 100,
    tone: 'blue',
    type: 'ad',
  },
  {
    id: 'ad-idea-7',
    title: 'Quảng cáo: Robot AI-Care đồng hành cùng người cao tuổi',
    status: 'Đã duyệt/Lên lịch',
    scheduledAt: '28/04/2026, 08:30',
    timeRemaining: '3 ngày 8 tiếng',
    tone: 'blue',
    type: 'ad',
  },
]

const CAMPAIGN_STORE_STORAGE_KEY = 'marketing:campaign-store'

// Session-based state for tracking archived campaigns
const archivedCampaigns = new Set<string>()
const deletedCampaigns = new Set<string>()

// Dynamic campaign store for user-created campaigns and edited sample records
const userCreatedCampaigns: CampaignDetail[] = []
const userCreatedStatuses: CampaignStatus[] = []
const editedCampaignIds = new Set<string>()
const editedStatusIds = new Set<string>()

let campaignIdCounter = 100 // Start from 100 to avoid conflicts with mock data
let hasHydratedCampaignStore = false

interface PersistedCampaignStore {
  userCreatedCampaigns: CampaignDetail[]
  userCreatedStatuses: CampaignStatus[]
  editedCampaigns?: CampaignDetail[]
  editedStatuses?: CampaignStatus[]
  archivedCampaignIds: string[]
  deletedCampaignIds: string[]
  campaignIdCounter: number
}

export interface CreateCampaignInput {
  title: string
  goal: string
  message: string
  format: string
  platform: string
  content: string
  scheduledAt: string
  status: 'Đã duyệt/Lên lịch' | 'Nháp'
  source?: 'manual' | 'generated'
  linkLabel?: string
  type?: 'campaign' | 'ad'
}

export interface UpdateCampaignInput {
  title: string
  goal: string
  message: string
  format: string
  platform: string
  content: string
  scheduledAt: string
  status?: CampaignStatus['status']
  linkLabel?: string
}

function canUseCampaignStorage() {
  return typeof window !== 'undefined' && !!window.sessionStorage
}

function persistCampaignStore() {
  if (!canUseCampaignStorage()) {
    return
  }

  const persistedStore: PersistedCampaignStore = {
    userCreatedCampaigns,
    userCreatedStatuses,
    editedCampaigns: [...editedCampaignIds]
      .map((campaignId) => CAMPAIGN_DETAILS[campaignId])
      .filter(Boolean),
    editedStatuses: CAMPAIGN_STATUSES.filter((campaign) => editedStatusIds.has(campaign.id)),
    archivedCampaignIds: [...archivedCampaigns],
    deletedCampaignIds: [...deletedCampaigns],
    campaignIdCounter,
  }

  window.sessionStorage.setItem(CAMPAIGN_STORE_STORAGE_KEY, JSON.stringify(persistedStore))
}

function hydrateCampaignStoreFromStorage() {
  if (hasHydratedCampaignStore) {
    return
  }

  hasHydratedCampaignStore = true

  if (!canUseCampaignStorage()) {
    return
  }

  const storedValue = window.sessionStorage.getItem(CAMPAIGN_STORE_STORAGE_KEY)

  if (!storedValue) {
    return
  }

  try {
    const parsedStore = JSON.parse(storedValue) as Partial<PersistedCampaignStore>
    const restoredCampaigns = Array.isArray(parsedStore.userCreatedCampaigns)
      ? parsedStore.userCreatedCampaigns
      : []
    const restoredStatuses = Array.isArray(parsedStore.userCreatedStatuses)
      ? parsedStore.userCreatedStatuses
      : []
    const restoredArchivedCampaignIds = Array.isArray(parsedStore.archivedCampaignIds)
      ? parsedStore.archivedCampaignIds
      : []
    const restoredDeletedCampaignIds = Array.isArray(parsedStore.deletedCampaignIds)
      ? parsedStore.deletedCampaignIds
      : []
    const restoredEditedCampaigns = Array.isArray(parsedStore.editedCampaigns)
      ? parsedStore.editedCampaigns
      : []
    const restoredEditedStatuses = Array.isArray(parsedStore.editedStatuses)
      ? parsedStore.editedStatuses
      : []

    deletedCampaigns.clear()
    restoredDeletedCampaignIds.forEach((campaignId) => {
      if (typeof campaignId === 'string') {
        deletedCampaigns.add(campaignId)
      }
    })

    userCreatedCampaigns.splice(
      0,
      userCreatedCampaigns.length,
      ...restoredCampaigns.filter(
        (campaign) => typeof campaign?.id === 'string' && !deletedCampaigns.has(campaign.id),
      ),
    )
    userCreatedStatuses.splice(
      0,
      userCreatedStatuses.length,
      ...restoredStatuses.filter(
        (campaign) => typeof campaign?.id === 'string' && !deletedCampaigns.has(campaign.id),
      ),
    )

    archivedCampaigns.clear()
    restoredArchivedCampaignIds.forEach((campaignId) => {
      if (typeof campaignId === 'string' && !deletedCampaigns.has(campaignId)) {
        archivedCampaigns.add(campaignId)
      }
    })

    const restoredCounter =
      typeof parsedStore.campaignIdCounter === 'number' && Number.isFinite(parsedStore.campaignIdCounter)
        ? Math.floor(parsedStore.campaignIdCounter)
        : 100 + restoredCampaigns.length

    campaignIdCounter = Math.max(100, restoredCounter)

    editedCampaignIds.clear()
    restoredEditedCampaigns.forEach((campaign) => {
      if (typeof campaign?.id === 'string' && !deletedCampaigns.has(campaign.id)) {
        CAMPAIGN_DETAILS[campaign.id] = campaign
        editedCampaignIds.add(campaign.id)
      }
    })

    editedStatusIds.clear()
    restoredEditedStatuses.forEach((campaign) => {
      if (typeof campaign?.id !== 'string' || deletedCampaigns.has(campaign.id)) {
        return
      }

      const targetIndex = CAMPAIGN_STATUSES.findIndex((status) => status.id === campaign.id)
      if (targetIndex !== -1) {
        CAMPAIGN_STATUSES[targetIndex] = campaign
        editedStatusIds.add(campaign.id)
      }
    })

    userCreatedCampaigns.forEach((campaign) => {
      CAMPAIGN_DETAILS[campaign.id] = campaign
    })

    deletedCampaigns.forEach((campaignId) => {
      delete CAMPAIGN_DETAILS[campaignId]
    })
  } catch {
    // Ignore invalid storage payloads and continue with in-memory defaults.
  }
}

function updateStatusCollectionEntry(
  campaignStatuses: CampaignStatus[],
  campaignId: string,
  nextStatus: CampaignStatus,
): boolean {
  const targetIndex = campaignStatuses.findIndex((campaign) => campaign.id === campaignId)

  if (targetIndex === -1) {
    return false
  }

  campaignStatuses[targetIndex] = {
    ...campaignStatuses[targetIndex],
    ...nextStatus,
  }

  return true
}

hydrateCampaignStoreFromStorage()

export function isCampaignDeleted(campaignId: string): boolean {
  hydrateCampaignStoreFromStorage()
  return deletedCampaigns.has(campaignId)
}

export function deleteCampaign(campaignId: string) {
  hydrateCampaignStoreFromStorage()

  deletedCampaigns.add(campaignId)
  archivedCampaigns.delete(campaignId)

  const userCampaignIndex = userCreatedCampaigns.findIndex((campaign) => campaign.id === campaignId)
  if (userCampaignIndex !== -1) {
    userCreatedCampaigns.splice(userCampaignIndex, 1)
  }

  const userStatusIndex = userCreatedStatuses.findIndex((campaign) => campaign.id === campaignId)
  if (userStatusIndex !== -1) {
    userCreatedStatuses.splice(userStatusIndex, 1)
  }

  delete CAMPAIGN_DETAILS[campaignId]

  persistCampaignStore()
}

export function archiveCampaign(campaignId: string) {
  hydrateCampaignStoreFromStorage()

  if (deletedCampaigns.has(campaignId)) {
    return
  }

  archivedCampaigns.add(campaignId)
  persistCampaignStore()
}

export function isArchived(campaignId: string): boolean {
  hydrateCampaignStoreFromStorage()
  return !deletedCampaigns.has(campaignId) && archivedCampaigns.has(campaignId)
}

export function getArchivedStatusForCampaigns(campaigns: CampaignStatus[]): CampaignStatus[] {
  hydrateCampaignStoreFromStorage()
  return campaigns
    .filter((campaign) => !deletedCampaigns.has(campaign.id))
    .map((campaign) =>
      isArchived(campaign.id)
        ? { ...campaign, status: 'Đề xuất' as const }
        : campaign,
    )
}

export function createCampaign(input: CreateCampaignInput): string {
  hydrateCampaignStoreFromStorage()

  let id = `campaign-${campaignIdCounter}`
  while (CAMPAIGN_DETAILS[id]) {
    campaignIdCounter += 1
    id = `campaign-${campaignIdCounter}`
  }
  campaignIdCounter += 1

  const now = new Date()
  const createdAt = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`

  // Create detail entry
  const newDetail: CampaignDetail = {
    id,
    title: input.title,
    goal: input.goal,
    message: input.message,
    format: input.format,
    platform: input.platform,
    content: input.content,
    createdAt,
    scheduledAt: input.scheduledAt,
    createdBy: input.source === 'generated' ? 'AI' : 'User',
    tone: 'blue',
    source: input.source || 'manual',
    linkLabel: input.linkLabel,
  }

  // Create status entry
  const newStatus: CampaignStatus = {
    id,
    title: input.title,
    status: input.status,
    scheduledAt: input.scheduledAt || undefined,
    timeRemaining: input.status === 'Đã duyệt/Lên lịch' ? 'Đang chờ' : undefined,
    tone: 'blue',
    type: input.type || 'campaign',
  }

  // Add to dynamic store at the beginning (newest first)
  userCreatedCampaigns.unshift(newDetail)
  userCreatedStatuses.unshift(newStatus)

  // Also add to the static store for detail page access
  CAMPAIGN_DETAILS[id] = newDetail

  persistCampaignStore()

  return id
}

export function updateCampaign(campaignId: string, input: UpdateCampaignInput) {
  hydrateCampaignStoreFromStorage()

  if (deletedCampaigns.has(campaignId)) {
    return
  }

  const existingCampaign = CAMPAIGN_DETAILS[campaignId]

  if (!existingCampaign) {
    return
  }

  const updatedDetail: CampaignDetail = {
    ...existingCampaign,
    title: input.title,
    goal: input.goal,
    message: input.message,
    format: input.format,
    platform: input.platform,
    content: input.content,
    scheduledAt: input.scheduledAt,
    linkLabel: input.linkLabel ?? existingCampaign.linkLabel,
  }

  CAMPAIGN_DETAILS[campaignId] = updatedDetail

  const userCampaignIndex = userCreatedCampaigns.findIndex((campaign) => campaign.id === campaignId)
  if (userCampaignIndex !== -1) {
    userCreatedCampaigns[userCampaignIndex] = updatedDetail
  } else {
    editedCampaignIds.add(campaignId)
  }

  const currentStatus = getCampaignStatusById(campaignId)
  const resolvedStatus = input.status || currentStatus?.status || 'Nháp'

  const updatedStatus = normalizeScheduledCampaignStatus({
    id: campaignId,
    title: input.title,
    status: resolvedStatus,
    scheduledAt: input.scheduledAt || undefined,
    timeRemaining:
      resolvedStatus === 'Đã duyệt/Lên lịch'
        ? currentStatus?.timeRemaining || 'Đang chờ'
        : undefined,
    progress:
      resolvedStatus === 'Đã đăng'
        ? currentStatus?.progress ?? 100
        : undefined,
    tone: updatedDetail.tone,
  })

  const isUpdatedInUserStatuses = updateStatusCollectionEntry(
    userCreatedStatuses,
    campaignId,
    updatedStatus,
  )

  if (isUpdatedInUserStatuses) {
    persistCampaignStore()
    return
  }

  const isUpdatedInCampaignStatuses = updateStatusCollectionEntry(
    CAMPAIGN_STATUSES,
    campaignId,
    updatedStatus,
  )

  if (isUpdatedInCampaignStatuses) {
    editedStatusIds.add(campaignId)
    persistCampaignStore()
    return
  }

  userCreatedStatuses.unshift(updatedStatus)
  persistCampaignStore()
}

export function getCampaignStatusById(campaignId: string): CampaignStatus | undefined {
  hydrateCampaignStoreFromStorage()

  if (deletedCampaigns.has(campaignId)) {
    return undefined
  }

  const matchedCampaign =
    userCreatedStatuses.find((campaign) => campaign.id === campaignId) ||
    CAMPAIGN_STATUSES.find((campaign) => campaign.id === campaignId && !deletedCampaigns.has(campaign.id))

  return matchedCampaign ? normalizeScheduledCampaignStatus(matchedCampaign) : undefined
}

export function getUserCreatedCampaigns(): CampaignDetail[] {
  hydrateCampaignStoreFromStorage()
  return userCreatedCampaigns.filter((campaign) => !deletedCampaigns.has(campaign.id))
}

export function getUserCreatedStatuses(): CampaignStatus[] {
  hydrateCampaignStoreFromStorage()
  return userCreatedStatuses
    .filter((campaign) => !deletedCampaigns.has(campaign.id))
    .map(normalizeScheduledCampaignStatus)
}

export function getAllCampaignStatuses(): CampaignStatus[] {
  hydrateCampaignStoreFromStorage()

  // Return user-created first, then original mock data
  return [...userCreatedStatuses, ...CAMPAIGN_STATUSES]
    .filter((campaign) => !deletedCampaigns.has(campaign.id))
    .map(normalizeScheduledCampaignStatus)
}

export function getCampaignStatusesByType(type: 'campaign' | 'ad'): CampaignStatus[] {
  return getAllCampaignStatuses().filter((campaign) => (campaign.type || 'campaign') === type)
}
