'use client'

import { NuverxLogo } from './nuverx-logo'
import { useLanguage } from '@/lib/language-context'
import { Globe } from 'lucide-react'

export function AuthHeader() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-white border-b border-[#e5e7eb] shadow-sm px-6 lg:px-12 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <NuverxLogo />

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t.nav.home}
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t.nav.solutions}
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t.nav.products}
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t.nav.industries}
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t.nav.about}
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 uppercase">
              {language}
            </span>
          </button>

          {/* Contact button */}
          <button className="hidden lg:block px-6 py-2.5 bg-[#FF6B35] text-white text-sm font-semibold rounded-full hover:bg-[#e55a2a] transition-colors">
            {t.nav.contact}
          </button>
        </div>
      </div>
    </header>
  )
}
