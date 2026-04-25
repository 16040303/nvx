import type { Metadata } from 'next'
import { MarketingCampaignPage } from './_components/marketing-campaign-page'
import { MarketingShell } from '@/components/marketing/marketing-shell'

export const metadata: Metadata = {
  title: 'NuverxAI | Marketing Campaigns',
  description: 'Marketing campaign workspace for generating content, managing campaign execution, and tracking engagement.',
}

export default function MarketingPage() {
  return <MarketingShell><MarketingCampaignPage /></MarketingShell>
}
