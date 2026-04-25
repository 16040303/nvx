'use client'

import { AuthHeader } from '@/components/auth/auth-header'
import { LoginForm } from '@/components/auth/login-form'
import { useLanguage } from '@/lib/language-context'
import { Phone } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a35] via-[#162e5b] to-[#1e3a7a]" />
      
      {/* Subtle diagonal highlight / glow near bottom right */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[70%] bg-[#3b82f6] opacity-20 blur-[120px] rounded-full pointer-events-none transform -rotate-12" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-[#1d4ed8] opacity-10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <AuthHeader />

      {/* Main content */}
      <div className="relative z-0 mt-[72px] min-h-[calc(100vh-72px)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-10">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold text-white lg:text-5xl">
              {t.hero.title}
            </h1>
            <p className="text-lg text-white/90 lg:text-xl">
              {t.hero.subtitle}
            </p>
            <p className="text-lg text-white/90 lg:text-xl">
              {t.hero.subtitle2}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left side - Hero content */}
            <div className="text-center lg:text-left">
              {/* Hero image with chat bubbles */}
              <div className="relative max-w-lg mx-auto lg:mx-0">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="/images/login-staff.webp"
                    alt="Customer support representative"
                    width={640}
                    height={640}
                    className="w-full h-auto object-cover"
                    priority
                  />

                  <Image
                    src="/images/login-message.png"
                    alt="Customer support message preview"
                    width={280}
                    height={234}
                    className="absolute right-5 top-1/4 w-[44%] max-w-[280px] rounded-2xl shadow-lg"
                    priority
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="mt-8 text-white/80 text-sm lg:text-base">
                <p>{t.hero.tagline}</p>
                <p>{t.hero.tagline2}</p>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex justify-center lg:justify-end">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>

      {/* Floating phone button */}
      <button className="fixed bottom-6 left-6 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-50">
        <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-30" />
        <Phone className="w-6 h-6 text-white relative z-10" />
      </button>
    </div>
  )
}
