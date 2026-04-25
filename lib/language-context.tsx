'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Language, translations, TranslationKeys } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
}

// Context lưu ngôn ngữ hiện tại và bộ text tương ứng.
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Provider cho phép toàn app đổi giữa các ngôn ngữ đang hỗ trợ.
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi')

  // Chọn bộ text theo ngôn ngữ hiện tại.
  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook giúp component đọc ngôn ngữ hiện tại và text cần hiển thị.
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
