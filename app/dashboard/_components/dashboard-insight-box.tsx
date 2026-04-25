'use client'

import { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

interface DashboardInsightBoxProps {
  title: string
  children: ReactNode
}

export function DashboardInsightBox({
  title,
  children,
}: DashboardInsightBoxProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-medium">{title}</span>
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </div>
      </div>
      {children}
    </div>
  )
}
