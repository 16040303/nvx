'use client'

import { ReactNode } from 'react'

interface DashboardCardProps {
  children: ReactNode
  className?: string
}

export function DashboardCard({ children, className = '' }: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-100 ${className}`}>
      {children}
    </div>
  )
}
