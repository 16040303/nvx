'use client'

import { useMemo, useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { StatsCard } from './stats-card'
import { DashboardStatsSection } from './dashboard-stats-section'
import { DashboardCard } from './dashboard-card'
import { DashboardInsightBox } from './dashboard-insight-box'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Users, UserPlus, RotateCcw, MessageCircle, ChevronDown } from 'lucide-react'
import type { DashboardTimeRange } from './dashboard-header'
import { DASHBOARD_RANGE_DATA, DASHBOARD_TIME_RANGE_LABELS } from '@/lib/dashboard-range-data'

interface CustomerTabProps {
  timeRange: DashboardTimeRange
}

export function CustomerTab({ timeRange }: CustomerTabProps) {
  const { t } = useLanguage()
  const {
    totals,
    interactionData,
    customerLabels,
    conversationLabels,
    channelData,
    retentionData,
    insight,
    insightLink,
  } = DASHBOARD_RANGE_DATA[timeRange].customer
  const timeRangeLabel = DASHBOARD_TIME_RANGE_LABELS[timeRange]
  const [selectedCustomerLabel, setSelectedCustomerLabel] = useState<string>('all')
  const [selectedConversationLabel, setSelectedConversationLabel] = useState<string>('all')

  const filteredCustomerLabels = useMemo(
    () =>
      selectedCustomerLabel === 'all'
        ? customerLabels
        : customerLabels.filter((item) => item.name === selectedCustomerLabel),
    [customerLabels, selectedCustomerLabel]
  )

  const filteredConversationLabels = useMemo(
    () =>
      selectedConversationLabel === 'all'
        ? conversationLabels
        : conversationLabels.filter((item) => item.name === selectedConversationLabel),
    [conversationLabels, selectedConversationLabel]
  )

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <DashboardStatsSection title={t.dashboard.generalStats}>
        <StatsCard
          value={totals.totalCustomers.value}
          label={`${t.dashboard.customer.totalCustomers} · ${timeRangeLabel}`}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          value={totals.newCustomers.value}
          label={`${t.dashboard.customer.newCustomers} · ${timeRangeLabel}`}
          valueColor="text-blue-600"
          icon={<UserPlus className="w-6 h-6" />}
        />
        <StatsCard
          value={totals.returningCustomers.value}
          label={`${t.dashboard.customer.returningCustomers} · ${timeRangeLabel}`}
          icon={<RotateCcw className="w-6 h-6" />}
        />
        <StatsCard
          value={totals.interactingCustomers.value}
          label={`${t.dashboard.customer.interactingCustomers} · ${timeRangeLabel}`}
          valueColor="text-blue-600"
          icon={<MessageCircle className="w-6 h-6" />}
        />
      </DashboardStatsSection>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Bar Chart - Customer Interactions Over Time */}
        <DashboardCard>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            {t.dashboard.customer.customerInteractions}
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600">{t.dashboard.customer.customerInteraction}</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interactionData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  domain={[0, 500]}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <div className="col-span-2 rounded-[36px] border border-[#3b82f6] bg-white px-7 py-6 shadow-[0_18px_40px_rgba(59,130,246,0.12)]">
          <div className="grid grid-cols-2 gap-5 items-stretch">
            {/* Horizontal Bar Charts - Top 5 Labels */}
            <div className="flex flex-col">
              <h3 className="mb-4 text-[22px] font-bold leading-none text-[#1f2937]">
                {t.dashboard.customer.top5Labels}
              </h3>
              <div className="mb-4.5 flex items-center gap-4.5">
                <div className="flex items-center gap-2">
                  <div className="h-[6px] w-[28px] rounded-full bg-[#1d4ed8]" />
                  <span className="text-[12px] font-medium text-[#1f2937]">
                    {t.dashboard.customer.customerLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-[6px] w-[28px] rounded-full bg-[#2563eb]" />
                  <span className="text-[12px] font-medium text-[#1f2937]">
                    {t.dashboard.customer.conversationLabel}
                  </span>
                </div>
              </div>
              <div className="flex-1 rounded-[24px] border border-[#9ec5ff] bg-white px-6 py-5.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <div className="space-y-3">
                  {filteredCustomerLabels.map((item) => (
                    <div key={item.name} className="flex items-center gap-3.5">
                      <span className="w-[90px] flex-shrink-0 text-[15px] font-semibold leading-none text-[#7b8aa3]">
                        {item.name}
                      </span>
                      <div className="h-[24px] flex-1 rounded-full bg-transparent">
                        <div
                          className="h-full rounded-[9px] bg-[linear-gradient(90deg,#31c4ec_0%,#4181f4_100%)] shadow-[0_5px_12px_rgba(59,130,246,0.16)]"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-col">
              <h3 className="mb-4 text-center text-[22px] font-bold leading-none text-[#1f2937]">
                {t.dashboard.customer.advancedFilter}
              </h3>
              <div className="mb-4 flex gap-2.5 px-1.5">
                <div className="relative flex-1">
                  <select
                    value={selectedCustomerLabel}
                    onChange={(event) => setSelectedCustomerLabel(event.target.value)}
                    className="h-[44px] w-full appearance-none rounded-[17px] border border-[#3b82f6] bg-white px-4 pr-10 text-[14px] font-medium text-[#334155] outline-none shadow-[0_5px_12px_rgba(59,130,246,0.1)] transition-colors focus:border-[#2563eb]"
                  >
                    <option value="all">{t.dashboard.customer.customerLabel}</option>
                    {customerLabels.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1f2937]" />
                </div>
                <div className="relative flex-1">
                  <select
                    value={selectedConversationLabel}
                    onChange={(event) => setSelectedConversationLabel(event.target.value)}
                    className="h-[44px] w-full appearance-none rounded-[17px] border border-[#3b82f6] bg-white px-4 pr-10 text-[14px] font-medium text-[#334155] outline-none shadow-[0_5px_12px_rgba(59,130,246,0.1)] transition-colors focus:border-[#2563eb]"
                  >
                    <option value="all">{t.dashboard.customer.conversationLabel}</option>
                    {conversationLabels.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1f2937]" />
                </div>
              </div>
              <div className="flex-1 rounded-[24px] border border-[#9ec5ff] bg-white px-6 py-5.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <div className="space-y-3">
                  {filteredConversationLabels.map((item) => {
                    const isActive = selectedConversationLabel === item.name

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() =>
                          setSelectedConversationLabel((current) =>
                            current === item.name ? 'all' : item.name
                          )
                        }
                        className={`flex w-full items-center gap-3.5 rounded-[14px] px-0 py-0 text-left transition-all ${
                          isActive ? 'scale-[1.01]' : 'hover:opacity-90'
                        }`}
                      >
                        <span className="w-[138px] flex-shrink-0 text-[15px] font-semibold leading-none text-[#7b8aa3]">
                          {item.name}
                        </span>
                        <div className="h-[24px] flex-1 rounded-full bg-transparent">
                          <div
                            className="h-full rounded-[9px] bg-[linear-gradient(90deg,#8b3dff_0%,#ff6b6b_100%)] shadow-[0_5px_12px_rgba(249,115,22,0.16)]"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Customers by Channel */}
        <DashboardCard>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            {t.dashboard.customer.customersByChannel}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {channelData.map((channel) => (
              <div key={channel.name} className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: channel.color }}
                >
                  {channel.icon}
                </div>
                <span className="text-lg font-semibold text-gray-900">{channel.value}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Retention Rate Pie Chart */}
        <DashboardCard>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            {t.dashboard.customer.retentionRate}
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={retentionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {retentionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-xs text-gray-600">{t.dashboard.customer.returningCustomers}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-400" />
                <span className="text-xs text-gray-600">{t.dashboard.customer.newCustomers}</span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Insight Box */}
      <DashboardInsightBox title={t.dashboard.cskh.insight}>
        <p className="text-sm text-gray-600 mt-2">{insight}</p>
        <p className="text-sm text-blue-600 mt-1">{insightLink}</p>
      </DashboardInsightBox>
    </div>
  )
}
