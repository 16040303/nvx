'use client'

import { useState } from 'react'
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Users, Clock, TrendingUp, Bot } from 'lucide-react'
import type { DashboardTimeRange } from './dashboard-header'
import { DASHBOARD_RANGE_DATA, DASHBOARD_TIME_RANGE_LABELS } from '@/lib/dashboard-range-data'

interface CSKHTabProps {
  timeRange: DashboardTimeRange
}

export function CSKHTab({ timeRange }: CSKHTabProps) {
  const { t } = useLanguage()
  const { totals, conversationData, pieData, responseTimeData, insight } = DASHBOARD_RANGE_DATA[timeRange].cskh
  const timeRangeLabel = DASHBOARD_TIME_RANGE_LABELS[timeRange]
  const [showAiProcessed, setShowAiProcessed] = useState(true)
  const [showAgentProcessed, setShowAgentProcessed] = useState(true)

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <DashboardStatsSection title={t.dashboard.generalStats}>
        <StatsCard
          value={totals.totalConversations.value}
          label={`${t.dashboard.cskh.totalConversations} · ${timeRangeLabel}`}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          value={totals.avgResponseTime.value}
          label={`${t.dashboard.cskh.avgResponseTime} · ${timeRangeLabel}`}
          valueColor="text-blue-600"
          icon={<Clock className="w-6 h-6" />}
        />
        <StatsCard
          value={totals.resolutionRate.value}
          label={`${t.dashboard.cskh.resolutionRate} · ${timeRangeLabel}`}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <StatsCard
          value={totals.aiHandled.value}
          label={`${t.dashboard.cskh.aiHandled} · ${timeRangeLabel}`}
          valueColor="text-blue-600"
          icon={<Bot className="w-6 h-6" />}
        />
      </DashboardStatsSection>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Line Chart - Conversations Over Time */}
        <DashboardCard className="col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-gray-900">
              {t.dashboard.cskh.conversationsOverTime}
            </h3>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowAiProcessed((current) => !current)}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <span>{t.dashboard.cskh.aiProcessed}</span>
                <span
                  className={`relative h-5 w-10 rounded-full transition-colors ${
                    showAiProcessed ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      showAiProcessed ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowAgentProcessed((current) => !current)}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <span>{t.dashboard.cskh.agentProcessed}</span>
                <span
                  className={`relative h-5 w-10 rounded-full transition-colors ${
                    showAgentProcessed ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      showAgentProcessed ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversationData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  domain={[100, 180]}
                />
                <Line
                  type="monotone"
                  dataKey="ai"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, opacity: showAiProcessed ? 1 : 0 }}
                  activeDot={showAiProcessed ? undefined : false}
                  name={t.dashboard.cskh.aiProcessed}
                  opacity={showAiProcessed ? 1 : 0}
                  isAnimationActive
                  animationDuration={650}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="agent"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={{ fill: '#22C55E', strokeWidth: 2, opacity: showAgentProcessed ? 1 : 0 }}
                  activeDot={showAgentProcessed ? undefined : false}
                  name={t.dashboard.cskh.agentProcessed}
                  opacity={showAgentProcessed ? 1 : 0}
                  isAnimationActive
                  animationDuration={650}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            {showAiProcessed && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">{t.dashboard.cskh.aiProcessed}</span>
              </div>
            )}
            {showAgentProcessed && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">{t.dashboard.cskh.agentProcessed}</span>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pie Chart - AI vs Agent Ratio */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t.dashboard.cskh.aiVsAgentRatio}
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-600">{t.dashboard.cskh.aiProcessed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">{t.dashboard.cskh.agentProcessed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Distribution */}
          <DashboardCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                {t.dashboard.cskh.responseTimeDistribution}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-0.5 bg-blue-500" />
                <span>{t.dashboard.cskh.conversation}</span>
              </div>
            </div>
            <div className="space-y-3">
              {responseTimeData.map((item) => (
                <div key={item.range} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24 flex-shrink-0">{item.range}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
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
