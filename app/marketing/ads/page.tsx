import type { Metadata } from 'next'
import { MarketingCampaignPage } from '../_components/marketing-campaign-page'
import { MarketingShell } from '@/components/marketing/marketing-shell'

export const metadata: Metadata = {
  title: 'NuverxAI | Marketing Ads',
  description: 'Marketing advertising workspace with the same interface as the campaign page.',
}

export default function MarketingAdsPage() {
  return (
    <MarketingShell>
      <MarketingCampaignPage showCampaignListButton />
    </MarketingShell>
  )
}
