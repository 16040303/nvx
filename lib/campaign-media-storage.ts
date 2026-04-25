export interface CampaignCoverMedia {
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}

const CAMPAIGN_MEDIA_STORAGE_KEY = 'marketing:campaign-cover-media'

type CampaignCoverMediaMap = Record<string, CampaignCoverMedia>

function canUseStorage() {
  return typeof window !== 'undefined' && !!window.sessionStorage
}

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

function writeCampaignCoverMediaMap(mediaMap: CampaignCoverMediaMap) {
  if (!canUseStorage()) {
    return
  }

  window.sessionStorage.setItem(CAMPAIGN_MEDIA_STORAGE_KEY, JSON.stringify(mediaMap))
}

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

export function getCampaignCoverMedia(campaignId: string): CampaignCoverMedia | null {
  const mediaMap = readCampaignCoverMediaMap()
  return mediaMap[campaignId] || DEFAULT_CAMPAIGN_COVER_MEDIA[campaignId] || null
}

export function getAllCampaignCoverMedia(): CampaignCoverMediaMap {
  return {
    ...DEFAULT_CAMPAIGN_COVER_MEDIA,
    ...readCampaignCoverMediaMap(),
  }
}

export function setCampaignCoverMedia(campaignId: string, media: CampaignCoverMedia) {
  const mediaMap = readCampaignCoverMediaMap()
  mediaMap[campaignId] = media
  writeCampaignCoverMediaMap(mediaMap)
}

export function removeCampaignCoverMedia(campaignId: string) {
  const mediaMap = readCampaignCoverMediaMap()

  if (!(campaignId in mediaMap)) {
    return
  }

  delete mediaMap[campaignId]
  writeCampaignCoverMediaMap(mediaMap)
}
