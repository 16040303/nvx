import type { Metadata } from 'next'
import { UserManagementPage } from './_components/user-management-page'

export const metadata: Metadata = {
  title: 'NuverxAI | User Management',
  description: 'User management dashboard for monitoring and controlling internal account status.',
}

export default function UsersPage() {
  return <UserManagementPage />
}
