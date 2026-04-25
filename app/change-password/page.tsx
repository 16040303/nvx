import type { Metadata } from 'next'
import { ChangePasswordPage } from './_components/change-password-page'

export const metadata: Metadata = {
  title: 'NuverxAI | Đổi mật khẩu',
  description: 'Trang đổi mật khẩu nội bộ trong hệ thống NuverxAI.',
}

export default function ChangePasswordRoute() {
  return <ChangePasswordPage />
}
