'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardSubHeader, type DashboardTimeRange } from './_components/dashboard-header'
import { CSKHTab } from './_components/cskh-tab'
import { CustomerTab } from './_components/customer-tab'
import { MarketingTab } from './_components/marketing-tab'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const activeTab = (searchParams.get('tab') as 'cskh' | 'customer' | 'marketing') ?? 'cskh'
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('1_week')

  return (
    <main className="flex-1 overflow-y-auto p-4 md:px-6 md:py-4 lg:px-8 lg:py-4">
      <div className="mx-auto w-full max-w-[1200px]">
        <DashboardSubHeader userName="Thảo" timeRange={timeRange} onTimeRangeChange={setTimeRange} />

        {activeTab === 'cskh' && <CSKHTab timeRange={timeRange} />}
        {activeTab === 'customer' && <CustomerTab timeRange={timeRange} />}
        {activeTab === 'marketing' && <MarketingTab timeRange={timeRange} />}
      </div>
    </main>
  )
}
