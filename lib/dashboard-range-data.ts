import type { DashboardTimeRange } from '@/app/dashboard/_components/dashboard-header'

type SummaryMetric = {
  value: string
  delta?: string
}

type CSKHConversationPoint = {
  week: string
  ai: number
  agent: number
}

type ResponseTimePoint = {
  range: string
  value: number
}

type CustomerInteractionPoint = {
  week: string
  value: number
}

type LabelPoint = {
  name: string
  value: number
  color: string
}

type ChannelPoint = {
  name: string
  icon: string
  value: number
  color: string
}

type MarketingPerformancePoint = {
  week: string
  campaign: number
  ads: number
}

type PeakHourPoint = {
  label: string
  value: number
}

export interface DashboardRangeDataset {
  cskh: {
    totals: {
      totalConversations: SummaryMetric
      avgResponseTime: SummaryMetric
      resolutionRate: SummaryMetric
      aiHandled: SummaryMetric
    }
    conversationData: CSKHConversationPoint[]
    pieData: LabelPoint[]
    responseTimeData: ResponseTimePoint[]
    insight: string
  }
  customer: {
    totals: {
      totalCustomers: SummaryMetric
      newCustomers: SummaryMetric
      returningCustomers: SummaryMetric
      interactingCustomers: SummaryMetric
    }
    interactionData: CustomerInteractionPoint[]
    customerLabels: LabelPoint[]
    conversationLabels: LabelPoint[]
    channelData: ChannelPoint[]
    retentionData: LabelPoint[]
    insight: string
    insightLink: string
  }
  marketing: {
    totals: {
      activeCampaigns: SummaryMetric
      totalAds: SummaryMetric
      totalInteractions: SummaryMetric
      conversionRate: SummaryMetric
    }
    marketingPerformanceData: MarketingPerformancePoint[]
    channelEffectivenessData: LabelPoint[]
    peakHoursData: PeakHourPoint[]
    bestCampaign: {
      name: string
      interactions: string
    }
    bestAd: {
      name: string
      interactions: string
    }
    insight: string
  }
}

export const DASHBOARD_TIME_RANGE_LABELS: Record<DashboardTimeRange, string> = {
  '1_week': '1 tuần',
  '2_weeks': '2 tuần',
  '3_months': '3 tháng',
  '6_months': '6 tháng',
}

export const DASHBOARD_RANGE_DATA: Record<DashboardTimeRange, DashboardRangeDataset> = {
  '1_week': {
    cskh: {
      totals: {
        totalConversations: { value: '642' },
        avgResponseTime: { value: '52s' },
        resolutionRate: { value: '88%' },
        aiHandled: { value: '64%' },
      },
      conversationData: [
        { week: 'T2', ai: 82, agent: 76 },
        { week: 'T3', ai: 88, agent: 80 },
        { week: 'T4', ai: 94, agent: 84 },
        { week: 'T5', ai: 91, agent: 86 },
        { week: 'T6', ai: 98, agent: 89 },
        { week: 'T7', ai: 102, agent: 92 },
        { week: 'CN', ai: 96, agent: 90 },
      ],
      pieData: [
        { name: 'AI xử lý', value: 64, color: '#3B82F6' },
        { name: 'Nhân viên xử lý', value: 36, color: '#22C55E' },
      ],
      responseTimeData: [
        { range: '0 - 10 giây', value: 82 },
        { range: '10 - 30 giây', value: 61 },
        { range: '30 - 60 giây', value: 34 },
        { range: 'Hơn 60 giây', value: 11 },
      ],
      insight: 'Trong 1 tuần gần nhất, AI đang xử lý phần lớn hội thoại ban đầu và giữ thời gian phản hồi ở mức ổn định nhất.',
    },
    customer: {
      totals: {
        totalCustomers: { value: '524' },
        newCustomers: { value: '96' },
        returningCustomers: { value: '148' },
        interactingCustomers: { value: '205' },
      },
      interactionData: [
        { week: 'T2', value: 110 },
        { week: 'T3', value: 136 },
        { week: 'T4', value: 172 },
        { week: 'T5', value: 184 },
        { week: 'T6', value: 196 },
        { week: 'T7', value: 208 },
        { week: 'CN', value: 154 },
      ],
      customerLabels: [
        { name: 'VIP', value: 72, color: '#3B82F6' },
        { name: 'Tiềm năng', value: 66, color: '#3B82F6' },
        { name: 'Mới', value: 58, color: '#3B82F6' },
        { name: 'Trung thành', value: 44, color: '#3B82F6' },
        { name: 'Sỉ', value: 18, color: '#3B82F6' },
      ],
      conversationLabels: [
        { name: 'Tư vấn', value: 88, color: '#F97316' },
        { name: 'Trao đổi công việc', value: 64, color: '#F97316' },
        { name: 'Hỗ trợ', value: 57, color: '#F97316' },
        { name: 'Bảo hành', value: 32, color: '#22C55E' },
        { name: 'Khiếu nại', value: 12, color: '#EF4444' },
      ],
      channelData: [
        { name: 'Facebook', icon: 'f', value: 142, color: '#1877F2' },
        { name: 'TikTok', icon: '♪', value: 118, color: '#000000' },
        { name: 'Zalo', icon: 'Z', value: 96, color: '#0068FF' },
        { name: 'Shopee', icon: 'S', value: 52, color: '#EE4D2D' },
      ],
      retentionData: [
        { name: 'Khách hàng quay lại', value: 61, color: '#60A5FA' },
        { name: 'Khách hàng mới', value: 39, color: '#FB7185' },
      ],
      insight: 'Khách hàng quay lại vẫn chiếm ưu thế trong tuần này, đặc biệt ở Facebook và Zalo.',
      insightLink: 'Xem chi tiết hành vi khách hàng trong 1 tuần',
    },
    marketing: {
      totals: {
        activeCampaigns: { value: '8' },
        totalAds: { value: '24' },
        totalInteractions: { value: '2,340' },
        conversionRate: { value: '13.8%' },
      },
      marketingPerformanceData: [
        { week: 'T2', campaign: 86, ads: 64 },
        { week: 'T3', campaign: 94, ads: 68 },
        { week: 'T4', campaign: 110, ads: 76 },
        { week: 'T5', campaign: 124, ads: 82 },
        { week: 'T6', campaign: 136, ads: 91 },
        { week: 'T7', campaign: 142, ads: 104 },
        { week: 'CN', campaign: 118, ads: 88 },
      ],
      channelEffectivenessData: [
        { name: 'Facebook', value: 78, color: '#1877F2' },
        { name: 'TikTok', value: 69, color: '#000000' },
        { name: 'Zalo OA', value: 56, color: '#0068FF' },
        { name: 'Shopee', value: 42, color: '#EE4D2D' },
        { name: 'other', value: 29, color: '#94A3B8' },
      ],
      peakHoursData: [
        { label: '09:00 - 11:00', value: 168 },
        { label: '11:00 - 13:00', value: 156 },
        { label: '19:00 - 21:00', value: 182 },
        { label: '21:00 - 23:00', value: 126 },
      ],
      bestCampaign: { name: 'Flash Sale tuần này', interactions: '1,280' },
      bestAd: { name: 'Video demo trợ lý AI', interactions: '940' },
      insight: 'Trong 1 tuần, nhóm chiến dịch ngắn ngày cho tỷ lệ chuyển đổi tốt hơn các chiến dịch kéo dài.',
    },
  },
  '2_weeks': {
    cskh: {
      totals: {
        totalConversations: { value: '1,284' },
        avgResponseTime: { value: '58s' },
        resolutionRate: { value: '87%' },
        aiHandled: { value: '63%' },
      },
      conversationData: [
        { week: 'Tuần 1', ai: 115, agent: 105 },
        { week: 'Tuần 2', ai: 120, agent: 118 },
      ],
      pieData: [
        { name: 'AI xử lý', value: 63, color: '#3B82F6' },
        { name: 'Nhân viên xử lý', value: 37, color: '#22C55E' },
      ],
      responseTimeData: [
        { range: '0 - 10 giây', value: 80 },
        { range: '10 - 30 giây', value: 60 },
        { range: '30 - 60 giây', value: 41 },
        { range: 'Hơn 60 giây', value: 14 },
      ],
      insight: 'Ở mốc 2 tuần, lưu lượng hội thoại tăng đều và nhóm AI vẫn là lực xử lý chính ở đầu funnel.',
    },
    customer: {
      totals: {
        totalCustomers: { value: '812' },
        newCustomers: { value: '164' },
        returningCustomers: { value: '236' },
        interactingCustomers: { value: '318' },
      },
      interactionData: [
        { week: 'Tuần 1', value: 220 },
        { week: 'Tuần 2', value: 280 },
      ],
      customerLabels: [
        { name: 'VIP', value: 78, color: '#3B82F6' },
        { name: 'Tiềm năng', value: 73, color: '#3B82F6' },
        { name: 'Mới', value: 61, color: '#3B82F6' },
        { name: 'Trung thành', value: 48, color: '#3B82F6' },
        { name: 'Sỉ', value: 20, color: '#3B82F6' },
      ],
      conversationLabels: [
        { name: 'Tư vấn', value: 92, color: '#F97316' },
        { name: 'Trao đổi công việc', value: 72, color: '#F97316' },
        { name: 'Hỗ trợ', value: 60, color: '#F97316' },
        { name: 'Bảo hành', value: 40, color: '#22C55E' },
        { name: 'Khiếu nại', value: 13, color: '#EF4444' },
      ],
      channelData: [
        { name: 'Facebook', icon: 'f', value: 244, color: '#1877F2' },
        { name: 'TikTok', icon: '♪', value: 202, color: '#000000' },
        { name: 'Zalo', icon: 'Z', value: 148, color: '#0068FF' },
        { name: 'Shopee', icon: 'S', value: 74, color: '#EE4D2D' },
      ],
      retentionData: [
        { name: 'Khách hàng quay lại', value: 63, color: '#60A5FA' },
        { name: 'Khách hàng mới', value: 37, color: '#FB7185' },
      ],
      insight: 'Sau 2 tuần, nhóm khách hàng quay lại tăng trưởng tốt nhất ở tệp VIP và khách hàng tiềm năng.',
      insightLink: 'Xem chi tiết hành vi khách hàng trong 2 tuần',
    },
    marketing: {
      totals: {
        activeCampaigns: { value: '12' },
        totalAds: { value: '40' },
        totalInteractions: { value: '4,980' },
        conversionRate: { value: '15.1%' },
      },
      marketingPerformanceData: [
        { week: 'Tuần 1', campaign: 180, ads: 120 },
        { week: 'Tuần 2', campaign: 220, ads: 145 },
      ],
      channelEffectivenessData: [
        { name: 'Facebook', value: 81, color: '#1877F2' },
        { name: 'TikTok', value: 72, color: '#000000' },
        { name: 'Zalo OA', value: 58, color: '#0068FF' },
        { name: 'Shopee', value: 45, color: '#EE4D2D' },
        { name: 'other', value: 31, color: '#94A3B8' },
      ],
      peakHoursData: [
        { label: '09:00 - 11:00', value: 240 },
        { label: '11:00 - 13:00', value: 210 },
        { label: '19:00 - 21:00', value: 264 },
        { label: '21:00 - 23:00', value: 188 },
      ],
      bestCampaign: { name: 'Back to School 2026', interactions: '2,460' },
      bestAd: { name: 'Video demo trợ lý AI', interactions: '1,820' },
      insight: 'Ở mốc 2 tuần, Facebook và TikTok đang là 2 kênh tạo ra biên độ tăng trưởng tốt nhất cho chiến dịch.',
    },
  },
  '3_months': {
    cskh: {
      totals: {
        totalConversations: { value: '7,860' },
        avgResponseTime: { value: '1m12s' },
        resolutionRate: { value: '86%' },
        aiHandled: { value: '62%' },
      },
      conversationData: [
        { week: 'Th1', ai: 420, agent: 386 },
        { week: 'Th2', ai: 468, agent: 431 },
        { week: 'Th3', ai: 512, agent: 458 },
      ],
      pieData: [
        { name: 'AI xử lý', value: 62, color: '#3B82F6' },
        { name: 'Nhân viên xử lý', value: 38, color: '#22C55E' },
      ],
      responseTimeData: [
        { range: '0 - 10 giây', value: 74 },
        { range: '10 - 30 giây', value: 58 },
        { range: '30 - 60 giây', value: 43 },
        { range: 'Hơn 60 giây', value: 18 },
      ],
      insight: 'Trong 3 tháng, hiệu suất CSKH giữ ổn định dù tổng lượng hội thoại tăng mạnh theo tháng.',
    },
    customer: {
      totals: {
        totalCustomers: { value: '3,420' },
        newCustomers: { value: '648' },
        returningCustomers: { value: '1,086' },
        interactingCustomers: { value: '1,240' },
      },
      interactionData: [
        { week: 'Th1', value: 420 },
        { week: 'Th2', value: 480 },
        { week: 'Th3', value: 562 },
      ],
      customerLabels: [
        { name: 'VIP', value: 84, color: '#3B82F6' },
        { name: 'Tiềm năng', value: 79, color: '#3B82F6' },
        { name: 'Mới', value: 68, color: '#3B82F6' },
        { name: 'Trung thành', value: 59, color: '#3B82F6' },
        { name: 'Sỉ', value: 24, color: '#3B82F6' },
      ],
      conversationLabels: [
        { name: 'Tư vấn', value: 95, color: '#F97316' },
        { name: 'Trao đổi công việc', value: 80, color: '#F97316' },
        { name: 'Hỗ trợ', value: 65, color: '#F97316' },
        { name: 'Bảo hành', value: 45, color: '#22C55E' },
        { name: 'Khiếu nại', value: 15, color: '#EF4444' },
      ],
      channelData: [
        { name: 'Facebook', icon: 'f', value: 520, color: '#1877F2' },
        { name: 'TikTok', icon: '♪', value: 426, color: '#000000' },
        { name: 'Zalo', icon: 'Z', value: 264, color: '#0068FF' },
        { name: 'Shopee', icon: 'S', value: 120, color: '#EE4D2D' },
      ],
      retentionData: [
        { name: 'Khách hàng quay lại', value: 65, color: '#60A5FA' },
        { name: 'Khách hàng mới', value: 35, color: '#FB7185' },
      ],
      insight: 'Trong 3 tháng, nhóm khách hàng quay lại đóng góp chính vào tăng trưởng tương tác bền vững.',
      insightLink: 'Xem chi tiết hành vi khách hàng trong 3 tháng',
    },
    marketing: {
      totals: {
        activeCampaigns: { value: '28' },
        totalAds: { value: '96' },
        totalInteractions: { value: '12,450' },
        conversionRate: { value: '18.7%' },
      },
      marketingPerformanceData: [
        { week: 'Th1', campaign: 420, ads: 320 },
        { week: 'Th2', campaign: 498, ads: 386 },
        { week: 'Th3', campaign: 560, ads: 428 },
      ],
      channelEffectivenessData: [
        { name: 'Facebook', value: 84, color: '#1877F2' },
        { name: 'TikTok', value: 76, color: '#000000' },
        { name: 'Zalo OA', value: 62, color: '#0068FF' },
        { name: 'Shopee', value: 49, color: '#EE4D2D' },
        { name: 'other', value: 37, color: '#94A3B8' },
      ],
      peakHoursData: [
        { label: '09:00 - 11:00', value: 420 },
        { label: '11:00 - 13:00', value: 380 },
        { label: '19:00 - 21:00', value: 335 },
        { label: '21:00 - 23:00', value: 260 },
      ],
      bestCampaign: { name: 'Back to School 2026', interactions: '4,980' },
      bestAd: { name: 'Video demo trợ lý AI', interactions: '3,740' },
      insight: 'Ở mốc 3 tháng, nhóm chiến dịch theo mùa vụ mang lại tăng trưởng tương tác cao và ổn định nhất.',
    },
  },
  '6_months': {
    cskh: {
      totals: {
        totalConversations: { value: '15,420' },
        avgResponseTime: { value: '1m26s' },
        resolutionRate: { value: '84%' },
        aiHandled: { value: '60%' },
      },
      conversationData: [
        { week: 'T1', ai: 680, agent: 640 },
        { week: 'T2', ai: 724, agent: 688 },
        { week: 'T3', ai: 786, agent: 742 },
        { week: 'T4', ai: 842, agent: 801 },
        { week: 'T5', ai: 895, agent: 860 },
        { week: 'T6', ai: 926, agent: 884 },
      ],
      pieData: [
        { name: 'AI xử lý', value: 60, color: '#3B82F6' },
        { name: 'Nhân viên xử lý', value: 40, color: '#22C55E' },
      ],
      responseTimeData: [
        { range: '0 - 10 giây', value: 68 },
        { range: '10 - 30 giây', value: 54 },
        { range: '30 - 60 giây', value: 46 },
        { range: 'Hơn 60 giây', value: 24 },
      ],
      insight: 'Trong 6 tháng, áp lực hội thoại tăng mạnh và tỷ trọng xử lý thủ công cũng tăng theo các kỳ cao điểm.',
    },
    customer: {
      totals: {
        totalCustomers: { value: '6,940' },
        newCustomers: { value: '1,248' },
        returningCustomers: { value: '2,420' },
        interactingCustomers: { value: '2,836' },
      },
      interactionData: [
        { week: 'T1', value: 780 },
        { week: 'T2', value: 865 },
        { week: 'T3', value: 918 },
        { week: 'T4', value: 996 },
        { week: 'T5', value: 1040 },
        { week: 'T6', value: 1118 },
      ],
      customerLabels: [
        { name: 'VIP', value: 88, color: '#3B82F6' },
        { name: 'Tiềm năng', value: 82, color: '#3B82F6' },
        { name: 'Mới', value: 74, color: '#3B82F6' },
        { name: 'Trung thành', value: 63, color: '#3B82F6' },
        { name: 'Sỉ', value: 28, color: '#3B82F6' },
      ],
      conversationLabels: [
        { name: 'Tư vấn', value: 98, color: '#F97316' },
        { name: 'Trao đổi công việc', value: 84, color: '#F97316' },
        { name: 'Hỗ trợ', value: 71, color: '#F97316' },
        { name: 'Bảo hành', value: 52, color: '#22C55E' },
        { name: 'Khiếu nại', value: 18, color: '#EF4444' },
      ],
      channelData: [
        { name: 'Facebook', icon: 'f', value: 1060, color: '#1877F2' },
        { name: 'TikTok', icon: '♪', value: 824, color: '#000000' },
        { name: 'Zalo', icon: 'Z', value: 612, color: '#0068FF' },
        { name: 'Shopee', icon: 'S', value: 260, color: '#EE4D2D' },
      ],
      retentionData: [
        { name: 'Khách hàng quay lại', value: 68, color: '#60A5FA' },
        { name: 'Khách hàng mới', value: 32, color: '#FB7185' },
      ],
      insight: 'Trong 6 tháng, tệp khách hàng trung thành và VIP tăng mạnh, cho thấy khả năng giữ chân được cải thiện rõ rệt.',
      insightLink: 'Xem chi tiết hành vi khách hàng trong 6 tháng',
    },
    marketing: {
      totals: {
        activeCampaigns: { value: '54' },
        totalAds: { value: '188' },
        totalInteractions: { value: '28,760' },
        conversionRate: { value: '21.4%' },
      },
      marketingPerformanceData: [
        { week: 'T1', campaign: 760, ads: 540 },
        { week: 'T2', campaign: 812, ads: 596 },
        { week: 'T3', campaign: 904, ads: 648 },
        { week: 'T4', campaign: 968, ads: 702 },
        { week: 'T5', campaign: 1042, ads: 776 },
        { week: 'T6', campaign: 1124, ads: 840 },
      ],
      channelEffectivenessData: [
        { name: 'Facebook', value: 86, color: '#1877F2' },
        { name: 'TikTok', value: 79, color: '#000000' },
        { name: 'Zalo OA', value: 67, color: '#0068FF' },
        { name: 'Shopee', value: 54, color: '#EE4D2D' },
        { name: 'other', value: 40, color: '#94A3B8' },
      ],
      peakHoursData: [
        { label: '09:00 - 11:00', value: 640 },
        { label: '11:00 - 13:00', value: 592 },
        { label: '19:00 - 21:00', value: 548 },
        { label: '21:00 - 23:00', value: 396 },
      ],
      bestCampaign: { name: 'Mega Growth H1', interactions: '10,280' },
      bestAd: { name: 'Series video AI onboarding', interactions: '7,960' },
      insight: 'Trong 6 tháng, các chiến dịch dài hơi đang đem lại hiệu quả chuyển đổi tích lũy vượt trội hơn chiến dịch ngắn hạn.',
    },
  },
}
