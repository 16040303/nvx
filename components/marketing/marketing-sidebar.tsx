'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useProfile } from '@/lib/profile-context'
import { BarChart3, MessageCircle, Users, PieChart, Radio, User, Settings, LogOut } from 'lucide-react'

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Báo cáo', icon: BarChart3, href: '/dashboard' },
  { id: 'conversations', label: 'Hội thoại', icon: MessageCircle, href: '/conversations' },
  { id: 'customers', label: 'Khách hàng', icon: Users, href: '/customers' },
  { id: 'marketing', label: 'Tiếp thị', icon: PieChart, href: '/marketing' },
  { id: 'channels', label: 'Kênh giao tiếp', icon: Radio, href: '/channels' },
  { id: 'users', label: 'Người dùng', icon: User, href: '/users' },
  { id: 'settings', label: 'Cài đặt cấu hình', icon: Settings, href: '/settings' },
] as const

function isMenuItemActive(pathname: string, href: string) {
  if (href === '/marketing') {
    return pathname === '/marketing' || pathname.startsWith('/marketing/')
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function MarketingSidebar() {
  const pathname = usePathname()
  const { profile } = useProfile()

  return (
    <aside className="fixed left-6 top-6 bottom-6 z-40 w-64 flex flex-col rounded-3xl bg-white shadow-lg">
      {/* Logo area */}
      <div className="flex flex-col items-center gap-2 border-b border-[#e5e7eb] px-6 py-8">
        <Image
          src="/images/logo.jpg"
          alt="NuverxAI Logo"
          width={64}
          height={64}
          className="rounded-2xl object-cover"
          priority
        />
        <span className="text-[18px] font-semibold text-[#ff4733]">NuverxAI</span>
      </div>

      {/* Menu items */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = isMenuItemActive(pathname, item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              id={`marketing-sidebar-${item.id}`}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-all ${
                isActive
                  ? 'bg-[#dbeafe] text-[#2f6fed]'
                  : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111111]'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
              <span>{item.label}</span>
              {isActive && <div className="absolute right-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-[#2f6fed]" />}
            </Link>
          )
        })}
      </nav>

      {/* User card */}
      <div className="border-t border-[#e5e7eb] px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-[#f9fafb] px-4 py-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#dbeafe]">
            {profile.avatarDataUrl ? (
              <Image
                src={profile.avatarDataUrl}
                alt={profile.fullName}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#2f6fed]">
                <User className="h-4 w-4" strokeWidth={1.8} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#1f2937]">{profile.fullName}</p>
            <p className="truncate text-[12px] text-[#6b7280]">{profile.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button className="mt-4 w-full flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#111111]">
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
