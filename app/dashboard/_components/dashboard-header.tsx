'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { ChevronDown, Download, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

import { AppHeader } from '@/components/app-shell/header'

interface DashboardHeaderProps {
  activeTab: 'cskh' | 'customer' | 'marketing'
  onTabChange: (tab: 'cskh' | 'customer' | 'marketing') => void
}

export function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
  const { t } = useLanguage()

  const tabs = [
    { id: 'cskh' as const, label: t.dashboard.tabs.cskh },
    { id: 'customer' as const, label: t.dashboard.tabs.customer },
    { id: 'marketing' as const, label: t.dashboard.tabs.marketing },
  ]

  const tabContent = (
    <>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative flex h-[56px] items-center border-b-[3px] px-[2px] text-[16px] font-semibold transition-colors ${
            activeTab === tab.id
              ? 'border-[#4c8dfd] text-[#2f71f3]'
              : 'border-transparent text-[#2a2f38] hover:text-[#2f71f3]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </>
  )

  return <AppHeader centerContent={tabContent} />
}

interface DashboardSubHeaderProps {
  userName: string
  timeRange: DashboardTimeRange
  onTimeRangeChange: (value: DashboardTimeRange) => void
}

export type DashboardTimeRange = '1_week' | '2_weeks' | '3_months' | '6_months'

const DASHBOARD_TIME_RANGE_OPTIONS: Array<{ value: DashboardTimeRange; label: string }> = [
  { value: '1_week', label: '1 tuần' },
  { value: '2_weeks', label: '2 tuần' },
  { value: '3_months', label: '3 tháng' },
  { value: '6_months', label: '6 tháng' },
]

export function DashboardSubHeader({
  userName,
  timeRange,
  onTimeRangeChange,
}: DashboardSubHeaderProps) {
  const { t } = useLanguage()
  const exportToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeFilterRef = useRef<HTMLDivElement | null>(null)
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false)

  useEffect(() => {
    return () => {
      if (exportToastTimerRef.current) {
        clearTimeout(exportToastTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeFilterRef.current && !timeFilterRef.current.contains(event.target as Node)) {
        setIsTimeMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleExportFile = () => {
    if (exportToastTimerRef.current) {
      clearTimeout(exportToastTimerRef.current)
    }

    const exportingToast = toast({
      duration: 4000,
      hideClose: true,
      className:
        'fixed left-1/2 top-1/2 z-[120] flex w-[220px] -translate-x-1/2 -translate-y-1/2 justify-center rounded-2xl border border-blue-200 bg-white px-6 py-5 text-center shadow-[0_12px_30px_rgba(37,99,235,0.16)] data-[state=closed]:!animate-none',
      description: (
        <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
            <Download className="h-5 w-5" />
          </div>
          <span className="text-center text-base font-semibold text-blue-600">
            Đang xuất báo cáo (PDF)
          </span>
        </div>
      ),
    })

    exportToastTimerRef.current = setTimeout(() => {
      exportingToast.dismiss()
      toast({
        duration: 2200,
        hideClose: true,
        className:
          'fixed left-1/2 top-1/2 z-[120] flex w-[220px] -translate-x-1/2 -translate-y-1/2 justify-center rounded-2xl border border-blue-200 bg-white px-6 py-5 text-center shadow-[0_12px_30px_rgba(37,99,235,0.16)] data-[state=closed]:!animate-none',
        description: (
          <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-300 text-blue-600">
              <Check className="h-5 w-5" />
            </div>
            <span className="text-2xl font-semibold text-blue-600">Hoàn tất</span>
          </div>
        ),
      })
    }, 1400)
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900 italic">
          {t.dashboard.greeting} {userName}!
        </h1>
        <span className="px-3 py-1 text-sm font-medium text-orange-500 bg-orange-50 rounded-full border border-orange-200">
          {t.dashboard.viewOnly}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div ref={timeFilterRef} className="relative w-[148px]">
          <button
            id="dashboard-time-filter-button"
            type="button"
            onClick={() => setIsTimeMenuOpen((current) => !current)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            aria-haspopup="menu"
            aria-expanded={isTimeMenuOpen}
          >
            {t.dashboard.timeFilter}
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${isTimeMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isTimeMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
              {DASHBOARD_TIME_RANGE_OPTIONS.map((option) => {
                const isActive = option.value === timeRange

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onTimeRangeChange(option.value)
                      setIsTimeMenuOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#edf4ff] text-[#2f71f3]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <button
          id="dashboard-export-button"
          onClick={handleExportFile}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          {t.dashboard.exportFile}
        </button>
      </div>
    </div>
  )
}
