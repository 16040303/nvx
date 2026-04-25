'use client'

import { ReactNode } from 'react'
import { MarketingContentTransition } from './marketing-content-transition'

interface MarketingShellProps {
  children: ReactNode
  activeTab?: 'campaigns' | 'ads'
}

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:px-6 md:py-4 lg:px-8 lg:py-4">
      <div className="mx-auto w-full max-w-[1200px]">
        <MarketingContentTransition>{children}</MarketingContentTransition>
      </div>
    </main>
  )
}
