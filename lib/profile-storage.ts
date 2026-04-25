export interface StoredProfile {
  fullName: string
  email: string
  password: string
  phone: string
  role: string
  birthDate: string
  gender: string
  address: string
  createdAt: string
  createdBy: string
  avatarDataUrl: string | null
}

export const PROFILE_STORAGE_KEY = 'nvx-user-profile'

export const DEFAULT_PROFILE: StoredProfile = {
  fullName: 'Phạm Thanh Thanh',
  email: 'thanh12@nuverxai.com',
  password: 'Thanh2004@!',
  phone: '0788654154',
  role: 'Quản lý Marketing',
  birthDate: '01/02/2004',
  gender: 'Nữ',
  address: '1195 Ngô Quyền, Phường An Hải, Thành phố Đà Nẵng',
  createdAt: '12/03/2026',
  createdBy: 'Quản trị viên',
  avatarDataUrl: null,
}

function canUseStorage() {
  return typeof window !== 'undefined' && !!window.sessionStorage
}

function isStoredProfile(value: unknown): value is StoredProfile {
  if (!value || typeof value !== 'object') return false
  const profile = value as Record<string, unknown>

  return (
    typeof profile.fullName === 'string' &&
    typeof profile.email === 'string' &&
    typeof profile.password === 'string' &&
    typeof profile.phone === 'string' &&
    typeof profile.role === 'string' &&
    typeof profile.birthDate === 'string' &&
    typeof profile.gender === 'string' &&
    typeof profile.address === 'string' &&
    typeof profile.createdAt === 'string' &&
    typeof profile.createdBy === 'string' &&
    (typeof profile.avatarDataUrl === 'string' || profile.avatarDataUrl === null)
  )
}

export function getStoredProfile(): StoredProfile {
  if (!canUseStorage()) return DEFAULT_PROFILE

  try {
    const raw = window.sessionStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE

    const parsed: unknown = JSON.parse(raw)
    return isStoredProfile(parsed) ? parsed : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export function persistStoredProfile(profile: StoredProfile) {
  if (!canUseStorage()) return
  window.sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}
