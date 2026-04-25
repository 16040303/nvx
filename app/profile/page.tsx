import type { Metadata } from 'next'
import { ProfileInfoPage } from './_components/profile-info-page'

export const metadata: Metadata = {
  title: 'NuverxAI | Hồ sơ cá nhân',
  description: 'Trang thông tin cá nhân trong hệ thống NuverxAI.',
}

export default function ProfilePage() {
  return <ProfileInfoPage />
}
