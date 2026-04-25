'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_PROFILE,
  getStoredProfile,
  persistStoredProfile,
  type StoredProfile,
} from '@/lib/profile-storage'

interface ProfileContextValue {
  profile: StoredProfile
  updateProfile: (nextProfile: StoredProfile) => void
}

// Context lưu thông tin hồ sơ người dùng để các màn hình dùng chung.
const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

// Provider khôi phục hồ sơ đã lưu và cung cấp hàm cập nhật hồ sơ.
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StoredProfile>(DEFAULT_PROFILE)

  // Đọc hồ sơ từ nơi lưu tạm sau khi app chạy trên trình duyệt.
  useEffect(() => {
    setProfile(getStoredProfile())
  }, [])

  // Gom dữ liệu hồ sơ và hàm cập nhật để truyền xuống các component con.
  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      updateProfile: (nextProfile) => {
        setProfile(nextProfile)
        persistStoredProfile(nextProfile)
      },
    }),
    [profile],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

// Hook giúp component đọc và cập nhật hồ sơ người dùng.
export function useProfile() {
  const context = useContext(ProfileContext)

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }

  return context
}
