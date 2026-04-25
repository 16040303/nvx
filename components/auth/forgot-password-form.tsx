'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { MobileAuthCard } from './mobile-auth-card'
import { AuthButton } from './auth-button'

export function ForgotPasswordForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const { setEmail } = useAuth()
  const [emailInput, setEmailInput] = useState('')

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidEmail) {
      setEmail(emailInput)
      router.push('/verify-otp')
    }
  }

  return (
    <MobileAuthCard
      title={t.forgotPassword.title}
      subtitle={t.forgotPassword.subtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t.forgotPassword.emailLabel}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder={t.forgotPassword.emailPlaceholder}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <AuthButton disabled={!isValidEmail}>
          {t.forgotPassword.submitButton}
        </AuthButton>
      </form>
    </MobileAuthCard>
  )
}
