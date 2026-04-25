'use client'

import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/lib/profile-context'
import { useToast } from '@/hooks/use-toast'

type PasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword'

function PasswordInput({
  id,
  label,
  value,
  placeholder,
  required = false,
  onChange,
}: {
  id: string
  label: string
  value: string
  placeholder: string
  required?: boolean
  onChange: (value: string) => void
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-[#5f6f86]">
        {label}
        {required ? <span className="text-[#ff6a3d]">*</span> : null}
      </span>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          className="h-[40px] w-full rounded-[8px] border border-[#d8dce7] bg-white px-4 pr-11 text-[14px] text-[#2b3445] outline-none transition-colors placeholder:text-[#8a93a3] focus:border-[#4b86ff]"
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 text-[#9aa3b2] transition-colors hover:text-[#5f6f86]"
          aria-label={isVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
      </div>
    </label>
  )
}

export function ChangePasswordPage() {
  const router = useRouter()
  const { profile, updateProfile } = useProfile()
  const { toast } = useToast()
  const [passwords, setPasswords] = useState<Record<PasswordField, string>>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const setPasswordField = (field: PasswordField, value: string) => {
    setMessage('')
    setPasswords((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setMessage('Vui lòng nhập đầy đủ thông tin mật khẩu.')
      return
    }

    if (passwords.currentPassword !== profile.password) {
      setMessage('Mật khẩu hiện tại không đúng.')
      return
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.')
      return
    }

    setIsSaving(true)
    updateProfile({ ...profile, password: passwords.newPassword })
    window.setTimeout(() => {
      setIsSaving(false)
      setMessage('Đổi mật khẩu thành công.')
      toast({
        title: 'Cập nhật thành công!',
        hideClose: true,
        className:
          'w-[280px] max-w-[calc(100vw-32px)] rounded-[18px] border-2 border-[#2f80ff] bg-white px-5 py-3 text-[#4b86ff] shadow-[0_10px_24px_rgba(47,128,255,0.16)] [&_[data-slot=toast-title]]:text-[18px] [&_[data-slot=toast-title]]:font-extrabold [&_[data-slot=toast-title]]:leading-none',
      })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
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

      <div className="mx-auto mt-2 flex min-h-[460px] w-full max-w-[900px] items-center justify-center rounded-[18px] bg-[#e8f1ff] px-8 py-10 shadow-[0_14px_40px_rgba(149,177,219,0.16)]">
        <section className="w-full max-w-[600px] overflow-hidden rounded-[6px] bg-white shadow-[0_10px_24px_rgba(159,184,224,0.14)]">
          <div className="bg-[#428bff] px-7 py-3 text-white">
            <h1 className="text-[16px] font-semibold leading-none">Đổi mật khẩu</h1>
          </div>

          <div className="space-y-6 px-8 py-6">
            <PasswordInput
              id="current-password"
              label="Mật khẩu hiện tại"
              value={passwords.currentPassword}
              placeholder="Nhập mật khẩu hiện tại"
              required
              onChange={(value) => setPasswordField('currentPassword', value)}
            />
            <PasswordInput
              id="new-password"
              label="Mật khẩu mới"
              value={passwords.newPassword}
              placeholder="Nhập mật khẩu mới"
              required
              onChange={(value) => setPasswordField('newPassword', value)}
            />
            <PasswordInput
              id="confirm-password"
              label="Xác nhận mật khẩu mới"
              value={passwords.confirmPassword}
              placeholder="Nhập lại mật khẩu mới"
              required
              onChange={(value) => setPasswordField('confirmPassword', value)}
            />

            {message ? <p className="text-[13px] font-medium text-[#4b86ff]">{message}</p> : null}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="inline-flex min-w-[82px] items-center justify-center gap-2 rounded-[6px] bg-[#4b86ff] px-4 py-[8px] text-[13px] font-semibold leading-none text-white shadow-[0_8px_18px_rgba(75,134,255,0.22)] transition-colors hover:bg-[#3f7ff0] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Cập nhật
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
