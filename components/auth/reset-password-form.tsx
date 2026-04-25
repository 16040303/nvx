'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { MobileAuthCard } from './mobile-auth-card'
import { PasswordInput } from './password-input'
import { AuthButton } from './auth-button'
import { CheckCircle } from 'lucide-react'

export function ResetPasswordForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const isPasswordValid = newPassword.length >= 6
  const doPasswordsMatch = newPassword === confirmPassword
  const isFormValid = isPasswordValid && doPasswordsMatch && confirmPassword.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      console.log('Password reset submitted:', { newPassword })
      setIsSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t.resetPassword.successMessage}
          </h2>
          <p className="text-sm text-gray-500">
            Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <MobileAuthCard
      title={t.resetPassword.title}
      subtitle={t.resetPassword.subtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t.resetPassword.newPasswordLabel}
          </label>
          <PasswordInput
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t.resetPassword.newPasswordPlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t.resetPassword.confirmPasswordLabel}
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t.resetPassword.confirmPasswordPlaceholder}
          />
        </div>

        <AuthButton disabled={!isFormValid}>
          {t.resetPassword.submitButton}
        </AuthButton>
      </form>
    </MobileAuthCard>
  )
}
