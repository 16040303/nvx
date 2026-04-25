'use client'

import { useLanguage } from '@/lib/language-context'
import { StatsCard } from './stats-card'
import { DashboardStatsSection } from './dashboard-stats-section'
import { DashboardCard } from './dashboard-card'
import { DashboardInsightBox } from './dashboard-insight-box'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Megaphone, ScrollText, MessageCircleMore, BadgePercent } from 'lucide-react'
import type { DashboardTimeRange } from './dashboard-header'
import { DASHBOARD_RANGE_DATA, DASHBOARD_TIME_RANGE_LABELS } from '@/lib/dashboard-range-data'

interface MarketingTabProps {
  timeRange: DashboardTimeRange
}

export function MarketingTab({ timeRange }: MarketingTabProps) {
  const { t } = useLanguage()
  const {
    totals,
    marketingPerformanceData,
    channelEffectivenessData,
    peakHoursData,
    bestCampaign,
    bestAd,
    insight,
  } = DASHBOARD_RANGE_DATA[timeRange].marketing
  const timeRangeLabel = DASHBOARD_TIME_RANGE_LABELS[timeRange]

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <DashboardStatsSection title={t.dashboard.generalStats}>
        <StatsCard
          value={totals.activeCampaigns.value}
          label={`${t.dashboard.marketing.activeCampaigns} · ${timeRangeLabel}`}
          icon={<Megaphone className="w-6 h-6" />}
        />
        <StatsCard
          value={totals.totalAds.value}
          label={`${t.dashboard.marketing.totalAds} · ${timeRangeLabel}`}
          valueColor="text-blue-600"
          icon={<ScrollText className="w-6 h-6" />}
        />
        <StatsCard
          value={totals.totalInteractions.value}
          label={`${t.dashboard.marketing.totalInteractions} · ${timeRangeLabel}`}
          icon={<MessageCircleMore className="w-6 h-6" />}
        />
        <StatsCard
          value={totals.conversionRate.value}
          label={`${t.dashboard.marketing.conversionRate} · ${timeRangeLabel}`}
          valueColor="text-blue-600"
          icon={<BadgePercent className="w-6 h-6" />}
        />
      </DashboardStatsSection>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Line Chart - Marketing Performance */}
        <DashboardCard className="col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-gray-900">
              {t.dashboard.marketing.marketingPerformance}
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">{t.dashboard.marketing.campaign}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">{t.dashboard.marketing.ads}</span>
              </div>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketingPerformanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} />
                <Line
                  type="monotone"
                  dataKey="campaign"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="ads"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={{ fill: '#22C55E', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Channel Effectiveness */}
          <DashboardCard>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t.dashboard.marketing.channelEffectiveness}
            </h3>
            <div className="space-y-3">
              {channelEffectivenessData.map((channel) => (
                <div key={channel.name} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-gray-600 flex-shrink-0">
                    {channel.name === 'other' ? t.dashboard.marketing.other : channel.name}
                  </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${channel.value}%`, backgroundColor: channel.color }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-gray-600">{channel.value}%</span>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Peak Hours + Best Performers */}
          <DashboardCard>
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t.dashboard.marketing.peakHours}</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                <p className="text-xs text-gray-600">{t.dashboard.marketing.bestCampaign}</p>
                <p className="text-sm font-semibold text-gray-900">{bestCampaign.name}</p>
                <p className="text-xs text-blue-600">
                  {t.dashboard.marketing.has} {bestCampaign.interactions} {t.dashboard.marketing.interactions}
                </p>
              </div>

              <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2">
                <p className="text-xs text-gray-600">{t.dashboard.marketing.bestAd}</p>
                <p className="text-sm font-semibold text-gray-900">{bestAd.name}</p>
                <p className="text-xs text-green-600">
                  {t.dashboard.marketing.has} {bestAd.interactions} {t.dashboard.marketing.interactions}
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Insight Box */}
      <DashboardInsightBox title={t.dashboard.cskh.insight}>
        <p className="text-sm text-gray-600 mt-2">{insight}</p>
      </DashboardInsightBox>
    </div>
  )
}
