'use client'

import { useLanguage } from '@/lib/language-context'
import { useProfile } from '@/lib/profile-context'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutGrid,
  MessageCircle,
  Users,
  Megaphone,
  Share2,
  User,
  Settings,
  LogOut,
} from 'lucide-react'

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`group relative flex h-[52px] w-full items-center gap-3 rounded-[13px] px-[16px] text-left text-[16px] font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:translate-x-[2px] ${
      active
        ? 'bg-[#e9f2ff] text-[#3f86ff] shadow-[inset_0_0_0_1px_rgba(63,134,255,0.03)]'
        : 'text-[#9aa3b2] hover:bg-[#f5f8fc] hover:text-[#5a6472]'
    }`}
  >
    <span className="flex h-[19px] w-[19px] flex-shrink-0 items-center justify-center [&>svg]:h-[19px] [&>svg]:w-[19px] [&>svg]:stroke-[1.9]">
      {icon}
    </span>
    <span className="truncate">{label}</span>
    {active && <span className="absolute right-0 top-1/2 h-[36px] w-[4px] -translate-y-1/2 rounded-full bg-[#4f90ff]" />}
  </button>
)

export function Sidebar() {
  const { t } = useLanguage()
  const { profile } = useProfile()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { icon: <LayoutGrid />, label: t.dashboard.sidebar.reports, path: '/dashboard' },
    { icon: <MessageCircle />, label: t.dashboard.sidebar.conversations, path: '/conversations' },
    { icon: <Users />, label: t.dashboard.sidebar.customers, path: '/customers' },
    { icon: <Megaphone />, label: t.dashboard.sidebar.marketing, path: '/marketing' },
    { icon: <Share2 />, label: t.dashboard.sidebar.channels, path: '/channels' },
    { icon: <User />, label: t.dashboard.sidebar.users, path: '/users' },
    { icon: <Settings />, label: t.dashboard.sidebar.settings, path: '/settings' },
  ]

  const isItemActive = (itemPath: string) =>
    pathname === itemPath || pathname.startsWith(`${itemPath}/`)

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <aside className="h-[calc(100vh-56px)] w-[300px] flex-shrink-0 px-[18px] pb-[10px] pt-[10px]">
      <div className="flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e8edf5] bg-white shadow-[0_1px_0_rgba(15,23,42,0.03),0_12px_30px_rgba(174,190,214,0.16)]">
        <div className="flex flex-col items-center justify-center gap-2 border-b border-[#e8edf5] px-5 py-[18px] text-center">
          <div className="flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full">
            <Image
              src="/images/logo.jpg"
              alt="NuverxAI Logo"
              width={42}
              height={42}
              className="h-full w-full rounded-full object-cover"
              priority
            />
          </div>
          <span className="text-[15px] font-bold leading-none text-[#ff5b3d]">NuverxAI</span>
        </div>

        <nav className="flex-1 space-y-[5px] px-[14px] py-[16px]">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={isItemActive(item.path)}
              onClick={() => router.push(item.path)}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-[#eef2f7] px-[16px] pb-[20px] pt-[18px]">
          <div className="flex items-center gap-3 rounded-[12px] bg-[#f4f7fb] px-[14px] py-[12px]">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#d8e5ff]">
              {profile.avatarDataUrl ? (
                <Image
                  src={profile.avatarDataUrl}
                  alt={profile.fullName}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#4b86ff]">
                  <User className="h-4 w-4 stroke-[2]" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[#8b95a5]">{profile.fullName}</p>
              <p className="truncate text-[12px] leading-[1.35] text-[#9ea7b4]">{profile.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-[18px] flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-[10px] text-[15px] font-medium text-[#7c8594] transition-[background-color,color,transform] duration-200 ease-out hover:bg-[#f5f8fc] hover:text-[#5a6472] hover:translate-y-[-1px]"
          >
            <LogOut className="h-4 w-4 stroke-[1.9]" />
            <span>{t.dashboard.sidebar.logout}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
