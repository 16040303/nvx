'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { PasswordInput } from './password-input'
import { AuthButton } from './auth-button'
import { OtpInput } from './otp-input'
import { ArrowLeft } from 'lucide-react'

type View = 'login' | 'forgot-password' | 'check-email' | 'reset-password'

export function LoginForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const { email: contextEmail, setEmail: setContextEmail } = useAuth()

  const [view, setView] = useState<View>('login')

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [password, setPassword] = useState('')

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('')

  // Check email (OTP) state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', ''])

  // Reset password state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isResetSuccess, setIsResetSuccess] = useState(false)

  // Overall success states
  const [isLoginSuccess, setIsLoginSuccess] = useState(false)

  // === Login Handlers ===
  const isValidLoginEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)
  const isLoginFormValid = isValidLoginEmail && password.length > 0

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoginFormValid) {
      setIsLoginSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
  }

  // === Forgot Password Handlers ===
  const isValidForgotEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidForgotEmail) {
      setContextEmail(forgotEmail)
      setView('check-email')
    }
  }

  // === Check Email (OTP) Handlers ===
  const isOtpComplete = otp.every((digit) => digit !== '')

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isOtpComplete) {
      setNewPassword('')
      setConfirmPassword('')
      setView('reset-password')
    }
  }

  const handleResend = () => {
    setOtp(['', '', '', '', ''])
  }

  // === Reset Password Handlers ===
  const isResetFormValid =
    newPassword.length >= 6 && newPassword === confirmPassword

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isResetFormValid) {
      setIsResetSuccess(true)
      setTimeout(() => {
        setView('login')
        setForgotEmail('')
        setOtp(['', '', '', '', ''])
        setNewPassword('')
        setConfirmPassword('')
        setIsResetSuccess(false)
      }, 2500)
    }
  }

  // === Renders ===
  const renderLogin = () => (
    <>
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-2">
        {t.login.title}
      </h1>
      <p className="text-sm text-gray-500 text-center mb-8">
        {t.login.subtitle}
      </p>

      <form onSubmit={handleLoginSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t.login.emailLabel}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder={t.login.emailPlaceholder}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            {t.login.passwordLabel}
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.login.passwordPlaceholder}
          />
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => setView('forgot-password')}
            className="text-sm font-medium text-[#FF6B35] hover:text-[#e55a2a] transition-colors"
          >
            {t.login.forgotPassword}
          </button>
        </div>

        <AuthButton disabled={!isLoginFormValid || isLoginSuccess}>
          {t.login.submitButton}
        </AuthButton>
      </form>
    </>
  )

  const renderForgotPassword = () => (
    <>
      <div className="mb-6">
        <button
          onClick={() => setView('login')}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <h1 className="text-2xl font-bold text-blue-600 mb-2">
        {t.forgotPassword.title}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {t.forgotPassword.subtitle}
      </p>

      <form onSubmit={handleForgotSubmit} className="space-y-6">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
            {t.forgotPassword.emailLabel}
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder={t.forgotPassword.emailPlaceholder}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <AuthButton disabled={!isValidForgotEmail}>
          {t.forgotPassword.submitButton}
        </AuthButton>
      </form>
    </>
  )

  const renderCheckEmail = () => {
    const displayEmail = forgotEmail || contextEmail || 'thao20@nuverxai.com'

    return (
      <>
        <div className="mb-6">
          <button
            onClick={() => setView('forgot-password')}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          {t.verifyOtp.title}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {t.verifyOtp.subtitle} {displayEmail}
        </p>

        <form onSubmit={handleOtpSubmit} className="space-y-6">
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
      </>
    )
  }

  const renderResetPassword = () => (
    <>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => {
            if (!isResetSuccess) setView('check-email')
          }}
          disabled={isResetSuccess}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {isResetSuccess && (
          <div className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm">
            Tạo mật khẩu thành công!
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-blue-600 mb-2">
        {t.resetPassword.title}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {t.resetPassword.subtitle}
      </p>

      <form onSubmit={handleResetSubmit} className="space-y-5">
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
            {t.resetPassword.newPasswordLabel}
          </label>
          <PasswordInput
            id="new-password"
            name="new-password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t.resetPassword.newPasswordPlaceholder}
            disabled={isResetSuccess}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            {t.resetPassword.confirmPasswordLabel}
          </label>
          <PasswordInput
            id="confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t.resetPassword.confirmPasswordPlaceholder}
            disabled={isResetSuccess}
          />
          {confirmPassword.length > 0 && newPassword !== confirmPassword && (
            <p className="mt-1.5 text-xs text-red-500">Mật khẩu không khớp</p>
          )}
        </div>

        <AuthButton disabled={!isResetFormValid || isResetSuccess}>
          {t.resetPassword.submitButton}
        </AuthButton>
      </form>
    </>
  )

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
        {view === 'login' && renderLogin()}
        {view === 'forgot-password' && renderForgotPassword()}
        {view === 'check-email' && renderCheckEmail()}
        {view === 'reset-password' && renderResetPassword()}
      </div>

      <div
        className={`transition-all duration-500 ease-in-out ${
          isLoginSuccess
            ? 'opacity-100 translate-y-0'
            : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <div className="rounded-full bg-blue-500 px-8 py-2.5 text-lg font-medium text-white shadow-md">
          Đăng nhập thành công!
        </div>
      </div>
    </div>
  )
}
