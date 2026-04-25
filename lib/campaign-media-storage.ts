export interface CampaignCoverMedia {
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}

// Khóa lưu ảnh đại diện chiến dịch trong sessionStorage.
const CAMPAIGN_MEDIA_STORAGE_KEY = 'marketing:campaign-cover-media'

type CampaignCoverMediaMap = Record<string, CampaignCoverMedia>

// Kiểm tra có thể dùng sessionStorage trên trình duyệt hay không.
function canUseStorage() {
  return typeof window !== 'undefined' && !!window.sessionStorage
}

// Đọc danh sách ảnh đại diện chiến dịch đã lưu tạm.
function readCampaignCoverMediaMap(): CampaignCoverMediaMap {
  if (!canUseStorage()) {
    return {}
  }

  const storedValue = window.sessionStorage.getItem(CAMPAIGN_MEDIA_STORAGE_KEY)

  if (!storedValue) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(storedValue)

    if (!parsedValue || typeof parsedValue !== 'object') {
      return {}
    }

    return parsedValue as CampaignCoverMediaMap
  } catch {
    return {}
  }
}

// Ghi lại danh sách ảnh đại diện chiến dịch vào nơi lưu tạm.
function writeCampaignCoverMediaMap(mediaMap: CampaignCoverMediaMap) {
  if (!canUseStorage()) {
    return
  }

  window.sessionStorage.setItem(CAMPAIGN_MEDIA_STORAGE_KEY, JSON.stringify(mediaMap))
}

// Ảnh đại diện mặc định cho các chiến dịch mẫu.
const DEFAULT_CAMPAIGN_COVER_MEDIA: CampaignCoverMediaMap = {
  'idea-1': {
    fileUrl: '/images/campaign-samples/campaign-ad-1.webp',
    fileName: 'CHIẾN DỊCH_QUẢNG CÁO_ảnh 1.webp',
    fileType: 'image/webp',
    fileSize: 401294,
  },
  'idea-3': {
    fileUrl: '/images/campaign-samples/campaign-ad-2.png',
    fileName: 'CHIẾN DỊCH_QUẢNG CÁO_ảnh 2.png',
    fileType: 'image/png',
    fileSize: 242546,
  },
  'idea-4': {
    fileUrl: '/images/campaign-samples/campaign-view.jpg',
    fileName: 'CHIẾN DỊCH_SAU KHI THÊM Ý TƯỞNG + XEM CHIẾN DỊCH.jpg',
    fileType: 'image/jpeg',
    fileSize: 396929,
  },
  'idea-7': {
    fileUrl: '/images/campaign-samples/campaign-ad-3.webp',
    fileName: 'CHIẾN DỊCH_QUẢNG CÁO_ảnh 3.webp',
    fileType: 'image/webp',
    fileSize: 70862,
  },
  'ad-idea-1': {
    fileUrl: '/images/campaign-samples/campaign-ad-1.webp',
    fileName: 'CHIẾN DỊCH_QUẢNG CÁO_ảnh 1.webp',
    fileType: 'image/webp',
    fileSize: 401294,
  },
  'ad-idea-3': {
    fileUrl: '/images/campaign-samples/campaign-ad-2.png',
    fileName: 'CHIẾN DỊCH_QUẢNG CÁO_ảnh 2.png',
    fileType: 'image/png',
    fileSize: 242546,
  },
  'ad-idea-4': {
    fileUrl: '/images/campaign-samples/campaign-view.jpg',
    fileName: 'CHIẾN DỊCH_SAU KHI THÊM Ý TƯỞNG + XEM CHIẾN DỊCH.jpg',
    fileType: 'image/jpeg',
    fileSize: 396929,
  },
  'ad-idea-7': {
    fileUrl: '/images/campaign-samples/campaign-ad-3.webp',
    fileName: 'CHIẾN DỊCH_QUẢNG CÁO_ảnh 3.webp',
    fileType: 'image/webp',
    fileSize: 70862,
  },
}

// Lấy ảnh đại diện của một chiến dịch, ưu tiên ảnh người dùng đã chọn.
export function getCampaignCoverMedia(campaignId: string): CampaignCoverMedia | null {
  const mediaMap = readCampaignCoverMediaMap()
  return mediaMap[campaignId] || DEFAULT_CAMPAIGN_COVER_MEDIA[campaignId] || null
}

// Lấy toàn bộ ảnh đại diện, gồm ảnh mặc định và ảnh đã lưu tạm.
export function getAllCampaignCoverMedia(): CampaignCoverMediaMap {
  return {
    ...DEFAULT_CAMPAIGN_COVER_MEDIA,
    ...readCampaignCoverMediaMap(),
  }
}

// Lưu ảnh đại diện mới cho một chiến dịch.
export function setCampaignCoverMedia(campaignId: string, media: CampaignCoverMedia) {
  const mediaMap = readCampaignCoverMediaMap()
  mediaMap[campaignId] = media
  writeCampaignCoverMediaMap(mediaMap)
}

// Xóa ảnh đại diện đã lưu tạm của một chiến dịch.
export function removeCampaignCoverMedia(campaignId: string) {
  const mediaMap = readCampaignCoverMediaMap()

  if (!(campaignId in mediaMap)) {
    return
  }

  delete mediaMap[campaignId]
  writeCampaignCoverMediaMap(mediaMap)
}
