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

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StoredProfile>(DEFAULT_PROFILE)

  useEffect(() => {
    setProfile(getStoredProfile())
  }, [])

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

export function useProfile() {
  const context = useContext(ProfileContext)

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }

  return context
}
