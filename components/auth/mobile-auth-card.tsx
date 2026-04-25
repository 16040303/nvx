'use client'

import { ReactNode } from 'react'
import { BackButton } from './back-button'

interface MobileAuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function MobileAuthCard({ title, subtitle, children }: MobileAuthCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          {title}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  )
}
