'use client'

import { Bell, KeyRound, User } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/lib/profile-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppHeaderProps {
  centerContent?: ReactNode
}

const NuverxLogo = () => (
  <div className="flex items-center gap-[10px]">
    <Image
      src="/assets/logo.jpg"
      alt="NuverxAI Logo"
      width={30}
      height={30}
      className="rounded-[2px] object-cover"
      priority
    />
    <span className="text-[17px] font-bold tracking-[-0.01em] text-[#23262f]">
      NuverxAI <span className="font-semibold text-[#23262f]">_ CX Hub & Marketing</span>
    </span>
  </div>
)

export function AppHeader({ centerContent }: AppHeaderProps) {
  const router = useRouter()
  const { profile } = useProfile()

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7edf5] bg-white/98 backdrop-blur-sm">
      <div className="flex h-[56px] items-center justify-between gap-5 px-[18px]">
        <div className="min-w-0 flex-shrink-0">
          <NuverxLogo />
        </div>

        <div className="flex flex-1 items-center justify-center">
          {centerContent && <div className="flex h-full items-end gap-[38px]">{centerContent}</div>}
        </div>

        <div className="flex flex-shrink-0 items-center gap-[10px]">
          <button
            type="button"
            aria-label="Thông báo"
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6f7a8b] transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-[#f4f7fb] hover:text-[#2b3340] hover:-translate-y-[1px]"
          >
            <Bell className="h-[16px] w-[16px]" strokeWidth={1.8} />
            <span className="absolute left-[5px] top-[5px] h-[5px] w-[5px] rounded-full bg-[#ff5b3d]" />
          </button>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Tài khoản"
                className="relative inline-flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full bg-[#5c9dff] text-white shadow-[0_8px_20px_rgba(92,157,255,0.24)] transition-[transform,box-shadow,filter] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_12px_24px_rgba(92,157,255,0.28)]"
              >
                {profile.avatarDataUrl ? (
                  <Image
                    src={profile.avatarDataUrl}
                    alt={profile.fullName}
                    fill
                    sizes="30px"
                    className="object-cover"
                  />
                ) : (
                  <User className="h-[15px] w-[15px]" strokeWidth={2.1} />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="min-w-[180px] rounded-[14px] border-[#e1e7f0] bg-white p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.16)]"
            >
              <DropdownMenuItem
                id="account-profile-menu-item"
                onClick={() => router.push('/profile')}
                className="cursor-pointer rounded-[10px] px-3 py-2 text-sm font-medium text-[#253044] focus:bg-[#f3f7ff] focus:text-[#2563eb]"
              >
                <User className="h-4 w-4 text-[#6b7280]" />
                Thông tin cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem
                id="account-change-password-menu-item"
                onClick={() => router.push('/change-password')}
                className="cursor-pointer rounded-[10px] px-3 py-2 text-sm font-medium text-[#253044] focus:bg-[#f3f7ff] focus:text-[#2563eb]"
              >
                <KeyRound className="h-4 w-4 text-[#6b7280]" />
                Đổi mật khẩu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
