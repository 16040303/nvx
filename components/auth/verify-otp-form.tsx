'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { MobileAuthCard } from './mobile-auth-card'
import { OtpInput } from './otp-input'
import { AuthButton } from './auth-button'

export function VerifyOtpForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const { email } = useAuth()
  const [otp, setOtp] = useState<string[]>(['', '', '', '', ''])

  const isOtpComplete = otp.every((digit) => digit !== '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isOtpComplete) {
      console.log('OTP submitted:', otp.join(''))
      router.push('/reset-password')
    }
  }

  const handleResend = () => {
    console.log('Resend OTP requested')
    setOtp(['', '', '', '', ''])
  }

  const displayEmail = email || 'thao20@nuverxai.com'

  return (
    <MobileAuthCard
      title={t.verifyOtp.title}
      subtitle={`${t.verifyOtp.subtitle} ${displayEmail}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <OtpInput value={otp} onChange={setOtp} length={5} />

        <AuthButton disabled={!isOtpComplete}>
          {t.verifyOtp.submitButton}
        </AuthButton>

        <p className="text-center text-sm text-gray-500">
          {t.verifyOtp.resendText}{' '}
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 font-medium hover:text-blue-700 underline transition-colors"
          >
            {t.verifyOtp.resendLink}
          </button>
        </p>
      </form>
    </MobileAuthCard>
  )
}
