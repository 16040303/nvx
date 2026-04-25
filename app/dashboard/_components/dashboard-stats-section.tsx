'use client'

import { ReactNode } from 'react'

interface DashboardStatsSectionProps {
  title: string
  children: ReactNode
}

export function DashboardStatsSection({
  title,
  children,
}: DashboardStatsSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-4 gap-4">{children}</div>
    </div>
  )
}
