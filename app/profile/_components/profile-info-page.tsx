'use client'

import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, CalendarDays, Camera, Loader2, UserRound } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/lib/profile-context'
import type { StoredProfile } from '@/lib/profile-storage'

function EditableField({
  label,
  value,
  onChange,
  required = false,
  icon,
  trailing,
  readOnly = false,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  icon?: ReactNode
  trailing?: ReactNode
  readOnly?: boolean
  type?: 'text' | 'email' | 'password'
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[#5f6f86]">
        {label}
        {required && <span className="text-[#ff5b3d]"> *</span>}
      </span>
      <div className="flex h-[30px] items-center gap-2 rounded-[4px] border border-[#e6ebf4] bg-[#fbfcfe] px-3 text-[14px] text-[#2b3445] focus-within:border-[#8cb4ff] focus-within:bg-white">
        {icon ? <span className="text-[#202938]">{icon}</span> : null}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
          aria-readonly={readOnly}
          className="h-full flex-1 border-none bg-transparent outline-none placeholder:text-[#b0bac8] read-only:cursor-not-allowed"
        />
        {trailing ? <span className="ml-auto text-[#9aa6b8]">{trailing}</span> : null}
      </div>
    </label>
  )
}

function EditableSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[#5f6f86]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[30px] rounded-[4px] border border-[#e6ebf4] bg-[#fbfcfe] px-3 text-[14px] text-[#2b3445] outline-none focus:border-[#8cb4ff] focus:bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function ProfileInfoPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { profile, updateProfile } = useProfile()
  const [draftProfile, setDraftProfile] = useState<StoredProfile>(profile)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setDraftProfile(profile)
  }, [profile])

  const hasChanges = useMemo(
    () => JSON.stringify(draftProfile) !== JSON.stringify(profile),
    [draftProfile, profile],
  )

  const setField = <K extends keyof StoredProfile>(field: K, value: StoredProfile[K]) => {
    setDraftProfile((current) => ({ ...current, [field]: value }))
  }

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        setField('avatarDataUrl', result)
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleSave = () => {
    setIsSaving(true)
    updateProfile(draftProfile)
    window.setTimeout(() => {
      setIsSaving(false)
    }, 350)
  }

  return (
    <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,#f8fbff_0%,#eef5ff_48%,#edf4fc_100%)] px-6 py-4">
      <div className="mx-auto flex w-full max-w-[1260px] justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-bl-[14px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[4px] border border-[#d8e5ff] bg-white px-4 py-2 text-[15px] font-semibold text-[#4b86ff] shadow-[0_10px_24px_rgba(76,141,253,0.14)] transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <div className="mx-auto mt-2 w-full max-w-[1260px] rounded-[22px] bg-[linear-gradient(180deg,#edf4ff_0%,#dfeafb_100%)] px-8 py-6 shadow-[0_14px_40px_rgba(149,177,219,0.18)]">
        <div className="grid w-full grid-cols-[190px_minmax(0,1fr)] items-stretch gap-10 px-4">
          <div className="flex h-full w-full flex-col items-center rounded-[8px] bg-white px-5 py-7 shadow-[0_8px_22px_rgba(159,184,224,0.12)]">
            <div className="relative flex h-[122px] w-[122px] items-center justify-center text-white">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#b8bbc7]">
                {draftProfile.avatarDataUrl ? (
                  <Image
                    src={draftProfile.avatarDataUrl}
                    alt={draftProfile.fullName}
                    fill
                    sizes="122px"
                    className="object-cover"
                  />
                ) : (
                  <UserRound className="h-[68px] w-[68px] stroke-[1.6]" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-[6px] right-[-6px] z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#cbd8ee] bg-white text-[#6e7f97] shadow-sm"
                aria-label="Đổi ảnh đại diện"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <p className="mt-5 text-center text-[16px] font-semibold leading-[1.3] text-[#252b35]">
              {draftProfile.fullName}
            </p>
          </div>

          <section className="w-full overflow-hidden rounded-[8px] bg-white shadow-[0_10px_24px_rgba(159,184,224,0.14)]">
            <div className="bg-[linear-gradient(90deg,#4d92ff_0%,#3f7ff0_100%)] px-7 py-[12px] text-white">
              <h1 className="text-[18px] font-semibold leading-none">Thông tin chung</h1>
            </div>

            <div className="space-y-[14px] px-7 py-[16px]">
              <EditableField
                label="Họ và tên"
                value={draftProfile.fullName}
                onChange={(value) => setField('fullName', value)}
                required
                icon={<UserRound className="h-4 w-4 stroke-[2]" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  label="Email"
                  type="email"
                  value={draftProfile.email}
                  onChange={(value) => setField('email', value)}
                />
                <EditableField
                  label="Mật khẩu"
                  type="password"
                  value={draftProfile.password}
                  onChange={(value) => setField('password', value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  label="Số điện thoại"
                  value={draftProfile.phone}
                  onChange={(value) => setField('phone', value)}
                />
                <EditableField
                  label="Vai Trò"
                  value={draftProfile.role}
                  onChange={() => undefined}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  label="Ngày sinh"
                  value={draftProfile.birthDate}
                  onChange={(value) => setField('birthDate', value)}
                  trailing={<CalendarDays className="h-4 w-4" />}
                />
                <EditableSelect
                  label="Giới tính"
                  value={draftProfile.gender}
                  onChange={(value) => setField('gender', value)}
                  options={['Nữ', 'Nam', 'Khác']}
                />
              </div>

              <EditableField
                label="Địa chỉ"
                value={draftProfile.address}
                onChange={(value) => setField('address', value)}
              />

              <div className="flex justify-end pt-[12px]">
                {hasChanges ? (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex min-w-[112px] items-center justify-center gap-2 rounded-[6px] bg-[#4b86ff] px-5 py-[8px] text-[14px] font-semibold leading-none text-white shadow-[0_8px_18px_rgba(75,134,255,0.22)] transition-colors hover:bg-[#3f7ff0] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {isSaving ? 'Đang lưu' : 'Cập nhật'}
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
