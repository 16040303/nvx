import type { Metadata } from 'next'
import { MarketingCreateCampaignPage } from '../../create/_components/marketing-create-campaign-page'
import { MarketingShell } from '@/components/marketing/marketing-shell'

export const metadata: Metadata = {
  title: 'NuverxAI | Create Ad',
  description: 'Create and schedule a new marketing ad.',
}

export default function MarketingAdsCreatePage() {
  return (
    <MarketingShell>
      <MarketingCreateCampaignPage mode="ad" />
    </MarketingShell>
  )
}
