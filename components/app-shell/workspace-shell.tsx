'use client'

import { ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AppHeader } from '@/components/app-shell/header'
import { Sidebar } from '@/components/app-shell/sidebar'
import { useLanguage } from '@/lib/language-context'

interface WorkspaceShellProps {
  children: ReactNode
}

function isWorkspaceRoute(pathname: string) {
  return (
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/marketing' ||
    pathname.startsWith('/marketing/') ||
    pathname === '/channels' ||
    pathname.startsWith('/channels/') ||
    pathname === '/users' ||
    pathname.startsWith('/users/') ||
    pathname === '/profile' ||
    pathname.startsWith('/profile/') ||
    pathname === '/change-password' ||
    pathname.startsWith('/change-password/')
  )
}

function isLoginPopupRoute(pathname: string) {
  return pathname.startsWith('/channels/login/')
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()

  if (isLoginPopupRoute(pathname)) {
    return <>{children}</>
  }

  if (!isWorkspaceRoute(pathname)) {
    return <>{children}</>
  }

  let centerContent: ReactNode = null

  if (pathname === '/dashboard') {
    const activeTab = searchParams.get('tab') ?? 'cskh'
    const tabs = [
      { id: 'cskh', label: t.dashboard.tabs.cskh },
      { id: 'customer', label: t.dashboard.tabs.customer },
      { id: 'marketing', label: t.dashboard.tabs.marketing },
    ]

    centerContent = (
      <>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/dashboard?tab=${tab.id}`)}
            className={`relative flex h-[56px] items-center border-b-[3px] px-[2px] text-[16px] font-semibold transition-[color,border-color] duration-200 ease-out ${
              activeTab === tab.id
                ? 'border-[#4c8dfd] text-[#2f71f3]'
                : 'border-transparent text-[#2a2f38] hover:text-[#2f71f3]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </>
    )
  } else if (pathname.startsWith('/marketing')) {
    const marketingTabClassName =
      'relative flex h-[56px] w-[140px] items-center justify-center border-b-[3px] px-[2px] text-[16px] font-semibold transition-[color,border-color] duration-200 ease-out'
    const isAdsTab = pathname === '/marketing/ads' || pathname.startsWith('/marketing/ads/')

    centerContent = (
      <>
        <button
          type="button"
          onClick={() => router.push('/marketing')}
          className={`${marketingTabClassName} ${
            isAdsTab
              ? 'border-transparent text-[#2a2f38] hover:text-[#2f71f3]'
              : 'border-[#4c8dfd] text-[#2f71f3]'
          }`}
        >
          Chiến dịch
        </button>
        <button
          type="button"
          onClick={() => router.push('/marketing/ads')}
          className={`${marketingTabClassName} ${
            isAdsTab
              ? 'border-[#4c8dfd] text-[#2f71f3]'
              : 'border-transparent text-[#2a2f38] hover:text-[#2f71f3]'
          }`}
        >
          Quảng cáo
        </button>
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f9fd]">
      <AppHeader centerContent={centerContent} />
      <div className="flex h-[calc(100vh-56px)] flex-1 overflow-hidden">
        <Sidebar />
        {children}
      </div>
    </div>
  )
}
